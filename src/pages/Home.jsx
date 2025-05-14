"use client"

import { useState, useEffect, useCallback } from "react"
import { usePlayer } from "../contexts/PlayerContext"
import { usePlaylists } from "../contexts/PlaylistContext"
import SongCard from "../components/SongCard"
import PlaylistCard from "../components/PlaylistCard"
import { Music, RefreshCw } from "lucide-react"
import { endpoints } from "../utils/api"

export default function Home() {
  const [audioList, setAudioList] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastFetched, setLastFetched] = useState(0)
  const { playSong } = usePlayer()
  const { playlists, addToRecentlyPlayed } = usePlaylists()

  // Fetch audio URLs with caching
  const fetchAudio = useCallback(async (force = false) => {
    try {
      // Check if we have cached data and it's less than 5 minutes old
      const now = Date.now()
      const cachedData = localStorage.getItem("vaultify_songs_cache")
      const cachedTime = Number.parseInt(localStorage.getItem("vaultify_songs_cache_time") || "0")

      // Use cache if available and not forcing refresh and less than 5 minutes old
      if (cachedData && !force && now - cachedTime < 5 * 60 * 1000) {
        setAudioList(JSON.parse(cachedData))
        setLastFetched(cachedTime)
        setLoading(false)
        return
      }

      setLoading(true)
      const response = await fetch(endpoints.audioUrls)
      const data = await response.json()

      // Cache the data
      localStorage.setItem("vaultify_songs_cache", JSON.stringify(data))
      localStorage.setItem("vaultify_songs_cache_time", now.toString())

      setAudioList(data)
      setLastFetched(now)
    } catch (err) {
      console.error("Failed to fetch audio:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchAudio()
  }, [fetchAudio])

  const handlePlayAll = () => {
    if (audioList.length > 0) {
      const song = audioList[0]
      playSong(song)
      addToRecentlyPlayed(song)
    }
  }

  const handleRefresh = () => {
    fetchAudio(true) // Force refresh
  }

  // Format the last fetched time
  const formatLastFetched = () => {
    if (!lastFetched) return ""

    const minutes = Math.floor((Date.now() - lastFetched) / 60000)
    if (minutes < 1) return "just now"
    if (minutes === 1) return "1 minute ago"
    return `${minutes} minutes ago`
  }

  // Get recently played songs
  const recentlyPlayed = playlists.find((p) => p.id === "recently-played")?.songs || []

  // Get featured playlists (excluding system playlists)
  const userPlaylists = playlists.filter((p) => !p.isAuto && p.id !== "recently-played" && p.id !== "favorites")

  // Get auto-generated playlists
  const genrePlaylists = playlists.filter((p) => p.isAuto && p.id.startsWith("genre-"))
  const artistPlaylists = playlists.filter((p) => p.isAuto && p.id.startsWith("artist-"))
  const albumPlaylists = playlists.filter((p) => p.isAuto && p.id.startsWith("album-"))

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Home</h1>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={handleRefresh}
            className="flex items-center hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
          >
            <RefreshCw size={14} className="mr-1" />
            Refresh
          </button>
          {lastFetched > 0 && <span className="ml-2">Updated {formatLastFetched()}</span>}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <>
          {/* Featured Section */}
          <section className="mb-10">
            <div className="relative h-64 rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-gray-800">
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900"></div>
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <h2 className="text-black dark:text-white text-3xl font-bold mb-4">Your Music Collection</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-lg">
                  {audioList.length} songs in your private vault. Enjoy your personal music collection.
                </p>
                <button
                  onClick={handlePlayAll}
                  className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-300 inline-flex items-center"
                >
                  <Music className="mr-2" size={18} />
                  Play All
                </button>
              </div>
            </div>
          </section>

          {/* Recently Played */}
          {recentlyPlayed.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4 dark:neon-text">Recently Played</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentlyPlayed.slice(0, 6).map((song, index) => (
                  <SongCard key={index} song={song} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* User Playlists */}
          {userPlaylists.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4 dark:neon-text">Your Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {userPlaylists.map((playlist, index) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Genre Playlists */}
          {genrePlaylists.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4 dark:neon-text">Genres</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genrePlaylists.map((playlist, index) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Artist Playlists */}
          {artistPlaylists.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4 dark:neon-text">Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {artistPlaylists.map((playlist, index) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Album Playlists */}
          {albumPlaylists.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4 dark:neon-text">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {albumPlaylists.map((playlist, index) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
