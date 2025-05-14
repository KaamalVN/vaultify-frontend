"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePlayer } from "../contexts/PlayerContext"
import { usePlaylists } from "../contexts/PlaylistContext"
import { useTheme } from "../contexts/ThemeContext"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
  ChevronDown,
  GripVertical,
} from "lucide-react"

export default function FullPlayer() {
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    isLooping,
    isShuffling,
    isFullPlayerVisible,
    togglePlay,
    toggleFullPlayer,
    seek,
    toggleLoop,
    toggleShuffle,
    playNext,
    playPrevious,
    formatTime,
    queue,
    reorderQueue,
  } = usePlayer()

  const { toggleFavorite, isFavorite } = usePlaylists()
  const { themeStyle, themeColor } = useTheme()
  const progressBarRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchMove, setTouchMove] = useState(null)
  const [showQueue, setShowQueue] = useState(false)
  const [draggedSong, setDraggedSong] = useState(null)
  const [seekerTouchActive, setSeekerTouchActive] = useState(false)

  const handleSeek = (clientX) => {
    if (!progressBarRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left
    const seekTime = (offsetX / rect.width) * duration

    if (seekTime >= 0 && seekTime <= duration) {
      seek(seekTime)
    }
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    handleSeek(e.clientX)
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleSeek(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSeekerTouchStart = (e) => {
    e.stopPropagation() // Prevent swipe down gesture
    setSeekerTouchActive(true)
    handleSeek(e.touches[0].clientX)
  }

  const handleSeekerTouchMove = (e) => {
    if (seekerTouchActive) {
      e.stopPropagation() // Prevent swipe down gesture
      handleSeek(e.touches[0].clientX)
    }
  }

  const handleSeekerTouchEnd = (e) => {
    e.stopPropagation() // Prevent swipe down gesture
    setSeekerTouchActive(false)
  }

  const handlePlayerTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handlePlayerTouchMove = (e) => {
    setTouchMove(e.touches[0].clientY)
  }

  const handlePlayerTouchEnd = () => {
    if (!touchStart || !touchMove) return

    const distance = touchMove - touchStart
    const isSwipingDown = distance > 50

    if (isSwipingDown) {
      toggleFullPlayer()
    }

    setTouchStart(null)
    setTouchMove(null)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const handleQueueToggle = () => {
    setShowQueue(!showQueue)
  }

  const handleDragStart = (song) => {
    setDraggedSong(song)
  }

  const handleDragOver = (e, targetSong) => {
    e.preventDefault()
    if (!draggedSong || draggedSong === targetSong) return

    const newQueue = [...queue]
    const draggedIndex = newQueue.findIndex((s) => s === draggedSong)
    const targetIndex = newQueue.findIndex((s) => s === targetSong)

    newQueue.splice(draggedIndex, 1)
    newQueue.splice(targetIndex, 0, draggedSong)

    reorderQueue(newQueue)
  }

  const handleDragEnd = () => {
    setDraggedSong(null)
  }

  // Determine container class based on theme style
  const getContainerClass = () => {
    switch (themeStyle) {
      case "cartoon":
        return "bg-pink-50 dark:bg-gray-800"
      default:
        return "bg-white dark:bg-black"
    }
  }

  // Determine button class based on theme style
  const getButtonClass = () => {
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

  // Determine progress bar class based on theme style
  const getProgressBarClass = () => {
    switch (themeStyle) {
      case "default":
        return "h-1 bg-gray-200 dark:bg-gray-800 rounded-full"
      case "cartoon":
        return "h-2 bg-pink-200 dark:bg-gray-700 rounded-full"
      case "monochrome":
      default:
        return "h-1 bg-gray-200 dark:bg-gray-800 rounded-full"
    }
  }

  // Determine progress indicator class based on theme style
  const getProgressIndicatorClass = () => {
    switch (themeStyle) {
      case "default":
        return `bg-${themeColor}-500`
      case "cartoon":
        return "bg-yellow-400"
      case "monochrome":
      default:
        return "bg-black dark:bg-white"
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

  if (!currentSong || !isFullPlayerVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-50 ${getContainerClass()} text-black dark:text-white flex flex-col`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onTouchStart={handlePlayerTouchStart}
        onTouchMove={handlePlayerTouchMove}
        onTouchEnd={handlePlayerTouchEnd}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 relative z-10">
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            onClick={toggleFullPlayer}
          >
            <ChevronDown size={24} />
          </button>
          <h2 className="text-lg font-semibold">{showQueue ? "Queue" : "Now Playing"}</h2>
          <div className="w-6"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Album Art and Controls Container - This will slide up when queue is shown */}
          <motion.div
            className="flex flex-col flex-1"
            animate={{
              y: showQueue ? "-30%" : 0,
              scale: showQueue ? 0.8 : 1,
              opacity: showQueue ? 0.3 : 1,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
              <div
                className={`w-64 h-64 md:w-72 md:h-72 rounded-lg overflow-hidden shadow-lg ${
                  themeStyle === "default"
                    ? "default-card"
                    : themeStyle === "cartoon"
                      ? ""
                      : "border border-gray-200 dark:border-gray-800"
                } ${showQueue ? "opacity-50" : ""}`}
              >
                <div className={getImageClass()}>
                  <img
                    src={currentSong.coverUrl || "/placeholder.svg?height=400&width=400"}
                    alt={currentSong.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Song Info and Controls */}
            <div className="px-8 pb-8 relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold truncate">
                    {currentSong.title || currentSong.fileName.split(".").slice(0, -1).join(".")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 truncate">{currentSong.artist || "Unknown Artist"}</p>
                  {currentSong.album && <p className="text-gray-500 text-sm truncate">{currentSong.album}</p>}
                </div>
                <button className="p-2" onClick={() => toggleFavorite(currentSong)}>
                  <Heart
                    size={24}
                    className={isFavorite(currentSong.fileName) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="pt-4">
                <div
                  ref={progressBarRef}
                  className={`${getProgressBarClass()} cursor-pointer`}
                  onClick={handleSeek}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleSeekerTouchStart}
                  onTouchMove={handleSeekerTouchMove}
                  onTouchEnd={handleSeekerTouchEnd}
                >
                  <div
                    className={`h-full ${getProgressIndicatorClass()} rounded-full relative`}
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div
                      className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 ${getProgressIndicatorClass()} rounded-full shadow-md`}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="py-6 flex items-center justify-between">
                <button
                  className={`p-2 ${isShuffling ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-600"}`}
                  onClick={toggleShuffle}
                >
                  <Shuffle size={20} />
                </button>

                <button className="p-2 text-black dark:text-white" onClick={playPrevious}>
                  <SkipBack size={24} />
                </button>

                <button
                  className={`w-16 h-16 rounded-full ${getButtonClass()} flex items-center justify-center shadow-md`}
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>

                <button className="p-2 text-black dark:text-white" onClick={playNext}>
                  <SkipForward size={24} />
                </button>

                <button
                  className={`p-2 ${isLooping ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-600"}`}
                  onClick={toggleLoop}
                >
                  <Repeat size={20} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Queue Button */}
          <div className="px-8 pb-4 flex items-center justify-between relative z-10">
            <button
              onClick={handleQueueToggle}
              className={`flex items-center text-sm transition-colors ${
                showQueue ? "text-black dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <ListMusic size={16} className="mr-1" />
              <span>{queue.length} in queue</span>
            </button>
          </div>

          {/* Queue List */}
          <motion.div
            className={`absolute inset-x-0 bottom-0 ${getContainerClass()} rounded-t-3xl overflow-hidden ${
              themeStyle === "cartoon"
                ? "border-t-2 border-gray-200 dark:border-gray-700"
                : "border-t border-gray-200 dark:border-gray-800"
            }`}
            initial={{ height: 0 }}
            animate={{
              height: showQueue ? "70%" : 0,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-6 h-full overflow-auto">
              {queue.map((song, index) => (
                <motion.div
                  key={song.fileName}
                  className={`flex items-center p-3 rounded-lg mb-2 ${
                    draggedSong === song ? "opacity-50" : ""
                  } hover:bg-gray-100 dark:hover:bg-gray-900 ${
                    themeStyle === "cartoon"
                      ? "bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-gray-700"
                      : ""
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(song)}
                  onDragOver={(e) => handleDragOver(e, song)}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 mr-3">
                    <div className={getImageClass()}>
                      <img
                        src={song.coverUrl || "/placeholder.svg?height=40&width=40"}
                        alt={song.fileName}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {song.title || song.fileName.split(".").slice(0, -1).join(".")}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {song.artist || "Unknown Artist"}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3 cursor-grab">
                    <GripVertical size={20} className="text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
