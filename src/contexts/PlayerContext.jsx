"use client"

import { createContext, useContext, useState, useRef, useEffect } from "react"
import { endpoints } from "../utils/api"

const PlayerContext = createContext()

export const usePlayer = () => useContext(PlayerContext)

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isFullPlayerVisible, setIsFullPlayerVisible] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [queue, setQueue] = useState([])
  const [history, setHistory] = useState([])
  const [allSongs, setAllSongs] = useState([])

  const audioRef = useRef(new Audio())

  // Fetch all songs for album continuation
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Check if we have cached data
        const cachedData = localStorage.getItem("vaultify_songs_cache")

        if (cachedData) {
          setAllSongs(JSON.parse(cachedData))
        } else {
          const response = await fetch(endpoints.audioUrls)
          const data = await response.json()
          setAllSongs(data)
          localStorage.setItem("vaultify_songs_cache", JSON.stringify(data))
        }
      } catch (err) {
        console.error("Failed to fetch songs:", err)
      }
    }

    fetchSongs()
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0
        audio.play()
      } else if (queue.length > 0) {
        playNext()
      } else {
        // No more songs in queue, reset to paused state
        setIsPlaying(false)
        audio.currentTime = 0
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [isLooping, queue])

  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.signedUrl
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentSong])

  const playSong = (song) => {
    if (currentSong) {
      setHistory([...history, currentSong])
    }
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (!currentSong) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seek = (time) => {
    if (time >= 0 && time <= duration) {
      audioRef.current.currentTime = time
      // If we're at the end and seeking back, resume playback
      if (!isPlaying && time < duration) {
        togglePlay()
      }
    }
  }

  const toggleFullPlayer = () => {
    setIsFullPlayerVisible(!isFullPlayerVisible)
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping)
  }

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling)
  }

  const findSongsFromSameAlbum = (song) => {
    if (!song || !song.album || !allSongs.length) return []

    return allSongs.filter(
      (s) => s.album && s.album.toLowerCase() === song.album.toLowerCase() && s.fileName !== song.fileName,
    )
  }

  const playNext = () => {
    if (queue.length > 0) {
      // If there are songs in the queue, play the next one
      let nextSong
      if (isShuffling) {
        const randomIndex = Math.floor(Math.random() * queue.length)
        nextSong = queue[randomIndex]
        setQueue(queue.filter((_, i) => i !== randomIndex))
      } else {
        nextSong = queue[0]
        setQueue(queue.slice(1))
      }

      if (nextSong) {
        playSong(nextSong)
      } else {
        setIsPlaying(false)
      }
    } else if (currentSong) {
      // If no songs in queue, try to play a song from the same album
      const albumSongs = findSongsFromSameAlbum(currentSong)

      if (albumSongs.length > 0) {
        // Play a random song from the same album
        const randomSong = albumSongs[Math.floor(Math.random() * albumSongs.length)]
        playSong(randomSong)
      } else if (allSongs.length > 0) {
        // If no album songs, play a random song from all songs
        const randomSong = allSongs[Math.floor(Math.random() * allSongs.length)]
        playSong(randomSong)
      } else {
        setIsPlaying(false)
      }
    }
  }

  const playPrevious = () => {
    if (currentTime > 3) {
      // If current time is more than 3 seconds, restart the song
      audioRef.current.currentTime = 0
      return
    }

    if (history.length > 0) {
      // If there are songs in history, play the previous one
      const prevSong = history[history.length - 1]
      setHistory(history.slice(0, -1))

      if (currentSong) {
        setQueue([currentSong, ...queue])
      }

      setCurrentSong(prevSong)
      setIsPlaying(true)
    } else if (allSongs.length > 0) {
      // If no history, play a random song
      const randomSong = allSongs[Math.floor(Math.random() * allSongs.length)]
      playSong(randomSong)
    }
  }

  const addToQueue = (song) => {
    console.log("Adding to queue in context:", song.title || song.fileName)
    setQueue((prevQueue) => {
      console.log("Previous queue length:", prevQueue.length)
      const newQueue = [...prevQueue, song]
      console.log("New queue length:", newQueue.length)
      return newQueue
    })
  }

  const clearQueue = () => {
    console.log("Clearing queue")
    setQueue([])
  }

  const reorderQueue = (newQueue) => {
    console.log("Reordering queue, new length:", newQueue.length)
    setQueue(newQueue)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        duration,
        currentTime,
        volume,
        isFullPlayerVisible,
        isLooping,
        isShuffling,
        queue,
        playSong,
        togglePlay,
        seek,
        setVolume,
        toggleFullPlayer,
        toggleLoop,
        toggleShuffle,
        playNext,
        playPrevious,
        addToQueue,
        clearQueue,
        reorderQueue,
        formatTime,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
