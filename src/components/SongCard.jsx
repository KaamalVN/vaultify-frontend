"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { usePlayer } from "../contexts/PlayerContext"
import { usePlaylists } from "../contexts/PlaylistContext"
import { useTheme } from "../contexts/ThemeContext"
import { Play, Pause, MoreHorizontal, Heart, Plus, ListMusic, Edit3, Trash2 } from "lucide-react"
import PlaylistSelector from "./PlaylistSelector"
import MetadataForm from "./MetadataForm"
import { endpoints } from "../utils/api"

export default function SongCard({ song, index, showIndex = false, playlistId = null }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false)
  const [showMetadataEditor, setShowMetadataEditor] = useState(false)
  const menuRef = useRef(null)
  const { currentSong, isPlaying, playSong, togglePlay, addToQueue } = usePlayer()
  const { toggleFavorite, isFavorite, removeFromPlaylist } = usePlaylists()
  const { themeStyle, themeColor } = useTheme()

  const isCurrentSong = currentSong && currentSong.fileName === song.fileName
  const isCurrentlyPlaying = isCurrentSong && isPlaying

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMenu])

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay()
    } else {
      playSong(song)
    }
  }

  const toggleMenu = (e) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    toggleFavorite(song)
  }

  const handleAddToQueue = (e) => {
    e.stopPropagation()
    addToQueue(song)
    setShowMenu(false)
  }

  const handleOpenPlaylistSelector = (e) => {
    e.stopPropagation()
    setShowPlaylistSelector(true)
    setShowMenu(false)
  }

  const handleOpenMetadataEditor = (e) => {
    e.stopPropagation()
    setShowMetadataEditor(true)
    setShowMenu(false)
  }

  const handleDeleteSong = (e) => {
    e.stopPropagation()
    if (playlistId && window.confirm(`Remove "${song.title || song.fileName}" from this playlist?`)) {
      removeFromPlaylist(playlistId, song.fileName)
    }
    setShowMenu(false)
  }

  const handleSaveMetadata = async (updatedSong) => {
    try {
      // Send metadata to backend
      const response = await fetch(endpoints.updateMetadata, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSong),
      })

      if (!response.ok) {
        throw new Error("Failed to update metadata")
      }

      // Update the song with new metadata
      Object.assign(song, updatedSong)

      setShowMetadataEditor(false)
    } catch (error) {
      console.error("Failed to save metadata:", error)
      alert("Failed to save metadata. Please try again.")
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
        return "bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg"
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

  // Determine active indicator class based on theme style
  const getActiveIndicatorClass = () => {
    if (!isCurrentSong) return ""

    switch (themeStyle) {
      case "default":
        return `border-l-4 border-${themeColor}-500`
      case "cartoon":
        return "border-l-4 border-yellow-400"
      case "monochrome":
        return "border-l-4 border-black dark:border-white"
      default:
        return ""
    }
  }

  return (
    <>
      <motion.div
        className={`${getCardClass()} ${getActiveIndicatorClass()} p-4 cursor-pointer relative group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={handlePlay}
      >
        <div className="flex items-center">
          {/* Album Art */}
          <div
            className={`relative w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0 ${themeStyle === "cartoon" ? "" : "border border-gray-200 dark:border-gray-800"}`}
          >
            <div className={getImageClass()}>
              <img
                src={song.coverUrl || "/placeholder.svg?height=100&width=100"}
                alt={song.fileName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isCurrentlyPlaying ? (
                <Pause className="text-white" size={18} />
              ) : (
                <Play className="text-white ml-1" size={18} />
              )}
            </div>

            {/* Index Number */}
            {showIndex && (
              <div
                className={`absolute inset-0 flex items-center justify-center ${isCurrentSong ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"} group-hover:opacity-0 transition-opacity`}
              >
                {index + 1}
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium truncate ${isCurrentSong ? "text-black dark:text-white" : ""}`}>
              {song.title || song.fileName.split(".").slice(0, -1).join(".")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{song.artist || "Unknown Artist"}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center ml-2">
            <button
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              onClick={handleToggleFavorite}
            >
              <Heart size={18} className={isFavorite(song.fileName) ? "fill-red-500 text-red-500" : ""} />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                onClick={toggleMenu}
              >
                <MoreHorizontal size={18} />
              </button>

              {showMenu && (
                <div className={`absolute right-0 mt-2 w-48 ${getCardClass()} z-[9999] py-1`}>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                    onClick={handleAddToQueue}
                  >
                    <ListMusic size={16} className="mr-2" />
                    Add to Queue
                  </button>

                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                    onClick={handleOpenPlaylistSelector}
                  >
                    <Plus size={16} className="mr-2" />
                    Add to Playlist
                  </button>

                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                    onClick={handleOpenMetadataEditor}
                  >
                    <Edit3 size={16} className="mr-2" />
                    Edit Metadata
                  </button>

                  {playlistId && (
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-900"
                      onClick={handleDeleteSong}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remove from Playlist
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Playlist Selector Modal */}
      {showPlaylistSelector && <PlaylistSelector song={song} onClose={() => setShowPlaylistSelector(false)} />}

      {/* Metadata Editor Modal */}
      {showMetadataEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className={`${getCardClass()} max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Metadata</h2>
              <MetadataForm song={song} onSave={handleSaveMetadata} onCancel={() => setShowMetadataEditor(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
