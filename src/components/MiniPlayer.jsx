"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePlayer } from "../contexts/PlayerContext"
import { useTheme } from "../contexts/ThemeContext"
import { Play, Pause } from "lucide-react"

export default function MiniPlayer() {
  const { currentSong, isPlaying, togglePlay, toggleFullPlayer, currentTime, duration } = usePlayer()
  const { themeStyle, themeColor } = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [touchStart, setTouchStart] = useState(null)
  const [touchMove, setTouchMove] = useState(null)
  const playerRef = useRef(null)

  // Check if we're on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!currentSong) return null

  // Calculate progress percentage
  const progress = duration ? (currentTime / duration) * 100 : 0

  // Mobile swipe handling
  const handleTouchStart = (e) => {
    if (!isMobile) return
    const touchY = e.touches[0].clientY
    setTouchStart(touchY)
  }

  const handleTouchMove = (e) => {
    if (!isMobile || !touchStart) return
    const touchY = e.touches[0].clientY
    setTouchMove(touchY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchMove) return

    const diff = touchMove - touchStart

    // If swiping up more than 50px, open the full player
    if (diff < -50) {
      toggleFullPlayer()
    }

    setTouchStart(null)
    setTouchMove(null)
  }

  // Determine container class based on theme style
  const getContainerClass = () => {
    switch (themeStyle) {
      case "cartoon":
        return "cartoon-card animate-bounce-slow"
      default:
        return "border border-gray-200 dark:border-gray-800"
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

  return (
    <motion.div
      className="fixed bottom-20 right-6 md:bottom-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg cursor-pointer group ${themeStyle === "cartoon" ? "shadow-xl" : ""}`}
        onClick={toggleFullPlayer}
        onDoubleClick={togglePlay}
      >
        {/* Album art */}
        <div
          className={`w-full h-full rounded-full overflow-hidden ${themeStyle !== "cartoon" ? "border border-gray-200 dark:border-gray-800" : ""}`}
        >
          <div className={getImageClass()}>
            <img
              src={currentSong.coverUrl || "/placeholder.svg?height=200&width=200"}
              alt={currentSong.fileName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Progress ring */}
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={themeStyle === "cartoon" ? "rgba(251, 207, 232, 0.5)" : "rgba(0, 0, 0, 0.1)"}
            strokeWidth={themeStyle === "cartoon" ? "6" : "3"}
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={
              themeStyle === "default"
                ? `var(--color-${themeColor}-500)`
                : themeStyle === "cartoon"
                  ? "#f472b6"
                  : "black"
            }
            strokeWidth={themeStyle === "cartoon" ? "6" : "3"}
            strokeDasharray="302"
            strokeDashoffset={302 - (302 * progress) / 100}
            strokeLinecap="round"
            className={themeStyle === "cartoon" ? "" : "dark:stroke-white"}
          />
        </svg>

        {/* Play/Pause button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all duration-300">
          <button
            className={`w-10 h-10 flex items-center justify-center ${
              themeStyle === "cartoon"
                ? "bg-yellow-400 text-black"
                : themeStyle === "default"
                  ? `bg-${themeColor}-500 text-white`
                  : "bg-white dark:bg-black text-black dark:text-white"
            } rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              themeStyle !== "cartoon" ? "border border-gray-200 dark:border-gray-800" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation()
              togglePlay()
            }}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
        </div>

        {/* Swipe indicator for mobile */}
        {isMobile && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Swipe up
          </div>
        )}
      </div>
    </motion.div>
  )
}
