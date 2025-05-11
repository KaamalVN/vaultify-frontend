"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Play, Music } from "lucide-react"

export default function PlaylistCard({ playlist, index }) {
  // Get cover art from the playlist or the first song in the playlist, or use a default
  const coverArt = playlist.coverUrl || playlist.songs[0]?.coverUrl || "/placeholder.svg?height=200&width=200"

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/playlists/${playlist.id}`} className="block">
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden aspect-square shadow-sm group-hover:shadow-md transition-all duration-300">
          {playlist.songs.length > 0 || playlist.coverUrl ? (
            <img src={coverArt || "/placeholder.svg"} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              <Music size={48} className="text-gray-400 dark:text-gray-600" />
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-cyan-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 dark:neon-glow">
              <Play size={20} className="text-black dark:text-gray-900 ml-1" />
            </div>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="font-medium truncate">{playlist.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
