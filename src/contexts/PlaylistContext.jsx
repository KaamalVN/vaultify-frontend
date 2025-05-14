"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { endpoints } from "../utils/api"

const PlaylistContext = createContext()

export const usePlaylists = () => useContext(PlaylistContext)

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(() => {
    const savedPlaylists = localStorage.getItem("vaultify_playlists")
    return savedPlaylists
      ? JSON.parse(savedPlaylists)
      : [
          { id: "favorites", name: "Favorites", songs: [] },
          { id: "recently-played", name: "Recently Played", songs: [] },
        ]
  })

  const [allSongs, setAllSongs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all songs for auto-playlists
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(endpoints.audioUrls)
        const data = await response.json()
        setAllSongs(data)

        // Generate auto playlists
        generateAutoPlaylists(data)
      } catch (err) {
        console.error("Failed to fetch songs for playlists:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSongs()

    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchSongs, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vaultify_playlists", JSON.stringify(playlists))
  }, [playlists])

  // Fetch cover image for a playlist
  const fetchCoverImage = async (type, name) => {
    try {
      // For auto-generated playlists, use the first song's cover
      return null // We'll handle this in generateAutoPlaylists
    } catch (error) {
      console.error("Error fetching cover image:", error)
      return null
    }
  }

  // Generate auto playlists based on metadata
  const generateAutoPlaylists = async (songs) => {
    // Create a copy of existing playlists, filtering out auto-generated ones
    const userPlaylists = playlists.filter((p) => !p.isAuto && p.id !== "favorites" && p.id !== "recently-played")
    const systemPlaylists = playlists.filter((p) => p.id === "favorites" || p.id === "recently-played")

    // Store existing auto playlist covers
    const existingCovers = {}
    playlists.forEach((playlist) => {
      if (playlist.isAuto && playlist.coverUrl) {
        existingCovers[playlist.id] = playlist.coverUrl
      }
    })

    // Group by genres
    const genreGroups = {}
    songs.forEach((song) => {
      if (song.genre && song.genre.trim()) {
        const genre = song.genre.trim()
        if (!genreGroups[genre]) {
          genreGroups[genre] = []
        }
        genreGroups[genre].push(song)
      }
    })

    // Create genre playlists
    const genrePlaylists = await Promise.all(
      Object.entries(genreGroups)
        .filter(([_, songs]) => songs.length >= 2)
        .map(async ([genre, songs]) => {
          const playlistId = `genre-${genre.toLowerCase().replace(/\s+/g, "-")}`
          // Preserve existing cover or use first song's cover
          const coverUrl = existingCovers[playlistId] || songs[0]?.coverUrl || null
          return {
            id: playlistId,
            name: `Genre: ${genre}`,
            songs,
            isAuto: true,
            coverUrl,
          }
        }),
    )

    // Group by artists
    const artistGroups = {}
    const artistOccurrences = {}

    songs.forEach((song) => {
      if (song.artist && song.artist.trim()) {
        // Split artists by comma and trim each
        const artists = song.artist.split(",").map((a) => a.trim())

        // Count occurrences of each artist
        artists.forEach((artist) => {
          artistOccurrences[artist] = (artistOccurrences[artist] || 0) + 1
        })

        // Add song to primary artist's group (first artist)
        const primaryArtist = artists[0]
        if (!artistGroups[primaryArtist]) {
          artistGroups[primaryArtist] = []
        }
        artistGroups[primaryArtist].push(song)
      }
    })

    // Create artist playlists
    const artistPlaylists = await Promise.all(
      Object.entries(artistGroups)
        .filter(([artist, songs]) => songs.length >= 2 || artistOccurrences[artist] >= 5)
        .map(async ([artist, songs]) => {
          const playlistId = `artist-${artist.toLowerCase().replace(/\s+/g, "-")}`
          // Preserve existing cover or use first song's cover
          const coverUrl = existingCovers[playlistId] || songs[0]?.coverUrl || null
          return {
            id: playlistId,
            name: `Artist: ${artist}`,
            songs,
            isAuto: true,
            coverUrl,
          }
        }),
    )

    // Group by albums
    const albumGroups = {}
    songs.forEach((song) => {
      if (song.album && song.album.trim()) {
        const album = song.album.trim()
        if (!albumGroups[album]) {
          albumGroups[album] = []
        }
        albumGroups[album].push(song)
      }
    })

    // Create album playlists
    const albumPlaylists = await Promise.all(
      Object.entries(albumGroups)
        .filter(([_, songs]) => songs.length >= 2)
        .map(async ([album, songs]) => {
          const playlistId = `album-${album.toLowerCase().replace(/\s+/g, "-")}`
          // Preserve existing cover or use first song's cover
          const coverUrl = existingCovers[playlistId] || songs[0]?.coverUrl || null
          return {
            id: playlistId,
            name: `Album: ${album}`,
            songs,
            isAuto: true,
            coverUrl,
          }
        }),
    )

    // Combine all playlists
    const newPlaylists = [
      ...systemPlaylists,
      ...userPlaylists,
      ...genrePlaylists,
      ...artistPlaylists,
      ...albumPlaylists,
    ]
    setPlaylists(newPlaylists)

    // Update server with new playlists
    try {
      await Promise.all(
        newPlaylists.map(async (playlist) => {
          if (playlist.isAuto) {
            await fetch(endpoints.updatePlaylistMetadata, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: playlist.id,
                name: playlist.name,
                coverUrl: playlist.coverUrl,
                isAuto: true,
              }),
            })
          }
        }),
      )
    } catch (error) {
      console.error("Failed to update server with playlists:", error)
    }
  }

  const createPlaylist = async (name, type = "playlist") => {
    const id = `${type}-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
    const newPlaylist = {
      id,
      name,
      songs: [],
      isAuto: false,
      type: type,
    }

    // Update server
    try {
      await fetch(endpoints.updatePlaylistMetadata, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          type,
          isAuto: false,
        }),
      })
    } catch (error) {
      console.error("Failed to create playlist on server:", error)
    }

    setPlaylists([...playlists, newPlaylist])
    return id
  }

  const deletePlaylist = (id) => {
    // Don't allow deleting default playlists or auto-generated playlists
    if (id === "favorites" || id === "recently-played" || playlists.find((p) => p.id === id)?.isAuto) return

    setPlaylists(playlists.filter((playlist) => playlist.id !== id))
  }

  const renamePlaylist = (id, newName) => {
    // Don't allow renaming auto-generated playlists
    if (playlists.find((p) => p.id === id)?.isAuto) return

    setPlaylists(playlists.map((playlist) => (playlist.id === id ? { ...playlist, name: newName } : playlist)))
  }

  const addToPlaylist = (playlistId, song) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          // Check if song already exists in playlist
          if (!playlist.songs.some((s) => s.fileName === song.fileName)) {
            return { ...playlist, songs: [...playlist.songs, song] }
          }
        }
        return playlist
      }),
    )
  }

  const removeFromPlaylist = (playlistId, songFileName) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            songs: playlist.songs.filter((song) => song.fileName !== songFileName),
          }
        }
        return playlist
      }),
    )
  }

  const addToRecentlyPlayed = (song) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === "recently-played") {
          // Remove the song if it already exists to avoid duplicates
          const filteredSongs = playlist.songs.filter((s) => s.fileName !== song.fileName)
          // Add the song to the beginning of the array
          return {
            ...playlist,
            songs: [song, ...filteredSongs].slice(0, 20), // Keep only the 20 most recent
          }
        }
        return playlist
      }),
    )
  }

  const toggleFavorite = (song) => {
    const isFavorite = playlists.find((p) => p.id === "favorites").songs.some((s) => s.fileName === song.fileName)

    if (isFavorite) {
      removeFromPlaylist("favorites", song.fileName)
    } else {
      addToPlaylist("favorites", song)
    }

    return !isFavorite
  }

  const isFavorite = (songFileName) => {
    return playlists.find((p) => p.id === "favorites").songs.some((s) => s.fileName === songFileName)
  }

  const reorderPlaylistSongs = (playlistId, startIndex, endIndex) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          const result = Array.from(playlist.songs)
          const [removed] = result.splice(startIndex, 1)
          result.splice(endIndex, 0, removed)

          return { ...playlist, songs: result }
        }
        return playlist
      }),
    )
  }

  const updatePlaylistCover = async (playlistId, coverUrl) => {
    try {
      // Update server
      await fetch(endpoints.updatePlaylistMetadata, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: playlistId,
          coverUrl,
        }),
      })

      // Update local state
      setPlaylists(playlists.map((playlist) => (playlist.id === playlistId ? { ...playlist, coverUrl } : playlist)))

      return coverUrl
    } catch (error) {
      console.error("Failed to update playlist cover:", error)
      throw error
    }
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        isLoading,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        addToRecentlyPlayed,
        toggleFavorite,
        isFavorite,
        reorderPlaylistSongs,
        generateAutoPlaylists,
        updatePlaylistCover,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}
