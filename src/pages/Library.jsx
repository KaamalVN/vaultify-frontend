"use client"

import { useState, useEffect, useCallback } from "react"
import { usePlayer } from "../contexts/PlayerContext"
import { usePlaylists } from "../contexts/PlaylistContext"
import SongCard from "../components/SongCard"
import { Search, Music, List, Grid, RefreshCw } from "lucide-react"
import { endpoints } from '../utils/api'

export default function Library() {
  const [audioList, setAudioList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [lastFetched, setLastFetched] = useState(0)
  const { playSong } = usePlayer()
  const { addToRecentlyPlayed } = usePlaylists()

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

  // Filter songs based on search term
  const filteredSongs = audioList.filter((song) => {
    const searchString = searchTerm.toLowerCase()
    const fileName = song.fileName.toLowerCase()
    const title = (song.title || "").toLowerCase()
    const artist = (song.artist || "").toLowerCase()
    const album = (song.album || "").toLowerCase()
    const genre = (song.genre || "").toLowerCase()

    return (
      fileName.includes(searchString) ||
      title.includes(searchString) ||
      artist.includes(searchString) ||
      album.includes(searchString) ||
      genre.includes(searchString)
    )
  })

  const handlePlayAll = () => {
    if (filteredSongs.length > 0) {
      const song = filteredSongs[0]
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Library</h1>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          {/* View toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-l-md ${
                viewMode === "grid" ? "bg-cyan-500 text-white dark:neon-glow" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-r-md ${
                viewMode === "list" ? "bg-cyan-500 text-white dark:neon-glow" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
            title="Refresh library"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Last updated info */}
      {lastFetched > 0 && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">Updated {formatLastFetched()}</div>
      )}

      {/* Play All Button */}
      {filteredSongs.length > 0 && (
        <div className="mb-6">
          <button
            onClick={handlePlayAll}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-md font-medium hover:from-cyan-600 hover:to-purple-700 transition-colors inline-flex items-center dark:neon-glow"
          >
            <Music className="mr-2" size={18} />
            Play All
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <>
          {filteredSongs.length === 0 ? (
            <div className="text-center py-12 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg">
              <Music size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No songs found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "Try a different search term" : "Upload some music to get started"}
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
              {filteredSongs.map((song, index) => (
                <SongCard key={index} song={song} index={index} showIndex={viewMode === "list"} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
