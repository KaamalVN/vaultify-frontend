"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePlayer } from "../contexts/PlayerContext"
import { Play, Pause } from "lucide-react"

export default function MiniPlayer() {
  const { currentSong, isPlaying, togglePlay, toggleFullPlayer, currentTime, duration } = usePlayer()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
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
    playerRef.current = { y: touchY }
  }

  const handleTouchMove = (e) => {
    if (!isMobile || !playerRef.current) return

    const touchY = e.touches[0].clientY
    const diff = playerRef.current.y - touchY

    // If swiping up more than 50px, open the full player
    if (diff > 50) {
      toggleFullPlayer()
      playerRef.current = null
    }
  }

  const handleTouchEnd = () => {
    playerRef.current = null
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
        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg cursor-pointer group dark:neon-glow"
        onClick={toggleFullPlayer}
        onDoubleClick={togglePlay}
      >
        {/* Album art */}
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={currentSong.coverUrl || "/placeholder.svg?height=200&width=200"}
            alt={currentSong.fileName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Progress ring */}
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeDasharray="302"
            strokeDashoffset={302 - (302 * progress) / 100}
            strokeLinecap="round"
            className="dark:stroke-cyan-400"
          />
        </svg>

        {/* Play/Pause button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all duration-300">
          <button
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.stopPropagation()
              togglePlay()
            }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black dark:text-gray-900" />
            ) : (
              <Play className="w-5 h-5 text-black dark:text-gray-900 ml-1" />
            )}
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
