"use client"

import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import { Play, Music } from "lucide-react"
import { useNavigationState } from "../utils/useNavigationState"
import { usePlayer } from "../contexts/PlayerContext"
import { useTheme } from "../contexts/ThemeContext"
import { useState, useEffect } from "react"

export default function PlaylistCard({ playlist, index }) {
  const { navigateWithState } = useNavigationState()
  const location = useLocation()
  const { playSong, addToQueue, clearQueue } = usePlayer()
  const { themeStyle, themeColor } = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Get cover art from the playlist or the first song in the playlist, or use a default
  const coverArt = playlist.coverUrl || playlist.songs[0]?.coverUrl || "/placeholder.svg?height=200&width=200"

  const handleClick = (e) => {
    e.preventDefault()
    navigateWithState(`/playlists/${playlist.id}`, location.pathname)
  }

  const handlePlayAll = (e) => {
    e.stopPropagation()
    if (playlist.songs.length > 0) {
      console.log("Total songs in playlist:", playlist.songs.length)

      // Clear existing queue first
      clearQueue()

      // Play the first song
      const firstSong = playlist.songs[0]
      console.log("Playing first song:", firstSong.title || firstSong.fileName)
      playSong(firstSong)

      // Add remaining songs to queue
      const songsToQueue = playlist.songs.slice(1)
      console.log("Songs to add to queue:", songsToQueue.length)

      // Add each song individually
      songsToQueue.forEach((song, index) => {
        console.log("Adding to queue:", song.title || song.fileName, "at index:", index)
        addToQueue(song)
      })
    }
  }

  // Determine card class based on theme style
  const getCardClass = () => {
    switch (themeStyle) {
      case "default":
        return "default-card"
      case "cartoon":
        return "cartoon-card"
      case "monochrome":
      default:
        return "bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800"
    }
  }

  // Determine image class based on theme style
  const getImageClass = () => {
    switch (themeStyle) {
      case "monochrome":
        return "monochrome-image"
      case "cartoon":
        return "cartoon-filter"
      default:
        return ""
    }
  }

  // Determine play button class based on theme style
  const getPlayButtonClass = () => {
    switch (themeStyle) {
      case "default":
        return `bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white`
      case "cartoon":
        return "cartoon-button"
      case "monochrome":
      default:
        return "bg-black dark:bg-white text-white dark:text-black"
    }
  }

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div onClick={handleClick} className="cursor-pointer">
        <div
          className={`${getCardClass()} overflow-hidden aspect-square shadow-sm group-hover:shadow-md transition-all duration-300 relative`}
        >
          {playlist.songs.length > 0 || playlist.coverUrl ? (
            <div className={getImageClass()}>
              <img src={coverArt || "/placeholder.svg"} alt={playlist.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <Music size={48} className="text-gray-400 dark:text-gray-600" />
            </div>
          )}

          {/* Play button overlay - Only show on desktop */}
          {!isMobile && (
            <div
              onClick={handlePlayAll}
              className={`absolute bottom-2 right-2 w-10 h-10 rounded-full ${getPlayButtonClass()} flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md`}
            >
              <Play size={20} className="text-white dark:text-black ml-1" />
            </div>
          )}
        </div>

        <div className="mt-2">
          <h3 className="font-medium truncate">{playlist.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
