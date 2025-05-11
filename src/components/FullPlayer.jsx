"use client"

import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePlayer } from "../contexts/PlayerContext"
import { usePlaylists } from "../contexts/PlaylistContext"
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, ListMusic, ChevronDown } from "lucide-react"

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
  } = usePlayer()

  const { toggleFavorite, isFavorite } = usePlaylists()
  const progressBarRef = useRef(null)

  if (!currentSong || !isFullPlayerVisible) return null

  const handleSeek = (e) => {
    if (!progressBarRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const seekTime = (offsetX / rect.width) * duration

    if (seekTime >= 0 && seekTime <= duration) {
      seek(seekTime)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 to-transparent opacity-30"></div>
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full filter blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-6 relative z-10">
          <button className="text-gray-400 hover:text-white transition-colors" onClick={toggleFullPlayer}>
            <ChevronDown size={24} />
          </button>
          <h2 className="text-lg font-semibold dark:neon-text">Now Playing</h2>
          <div className="w-6"></div> {/* Empty div for flex spacing */}
        </div>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <motion.div
            className="w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-2xl dark:neon-glow"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={currentSong.coverUrl || "/placeholder.svg?height=400&width=400"}
              alt={currentSong.fileName}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Song Info */}
        <div className="px-8 pt-4 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold truncate dark:neon-text">
                {currentSong.title || currentSong.fileName.split(".").slice(0, -1).join(".")}
              </h3>
              <p className="text-gray-400 truncate">{currentSong.artist || "Unknown Artist"}</p>
              {currentSong.album && <p className="text-gray-500 text-sm truncate">{currentSong.album}</p>}
            </div>
            <button className="p-2" onClick={() => toggleFavorite(currentSong)}>
              <Heart
                size={24}
                className={isFavorite(currentSong.fileName) ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 pt-4 relative z-10">
          <div ref={progressBarRef} className="h-2 bg-gray-700 rounded-full cursor-pointer" onClick={handleSeek}>
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-cyan-400 rounded-full shadow-md"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="px-8 py-6 flex items-center justify-between relative z-10">
          <button
            className={`p-2 ${isShuffling ? "text-cyan-400 dark:neon-text" : "text-gray-400"}`}
            onClick={toggleShuffle}
          >
            <Shuffle size={20} />
          </button>

          <button className="p-2 text-white" onClick={playPrevious}>
            <SkipBack size={24} />
          </button>

          <button
            className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white flex items-center justify-center dark:neon-glow"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>

          <button className="p-2 text-white" onClick={playNext}>
            <SkipForward size={24} />
          </button>

          <button
            className={`p-2 ${isLooping ? "text-cyan-400 dark:neon-text" : "text-gray-400"}`}
            onClick={toggleLoop}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Queue */}
        <div className="px-8 pb-8 flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <button className="flex items-center text-gray-400 text-sm">
              <ListMusic size={16} className="mr-1" />
              <span>{queue.length} in queue</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
