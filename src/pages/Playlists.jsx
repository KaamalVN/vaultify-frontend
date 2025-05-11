"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { usePlaylists } from "../contexts/PlaylistContext"
import PlaylistCard from "../components/PlaylistCard"
import { Plus, Music } from "lucide-react"

export default function Playlists() {
  const { playlists, createPlaylist } = usePlaylists()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")

  // Filter out system playlists
  const userPlaylists = playlists.filter((p) => p.id !== "recently-played")

  const handleCreatePlaylist = (e) => {
    e.preventDefault()
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim())
      setNewPlaylistName("")
      setShowCreateForm(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Playlists</h1>

        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
        >
          <Plus className="mr-2" size={18} />
          New Playlist
        </button>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <motion.div
          className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-medium mb-4">Create New Playlist</h2>
          <form onSubmit={handleCreatePlaylist}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Playlist Name</label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Playlists Grid */}
      {userPlaylists.length === 0 ? (
        <div className="text-center py-12">
          <Music size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No playlists yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first playlist to organize your music</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
          >
            <Plus className="mr-2" size={18} />
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {userPlaylists.map((playlist, index) => (
            <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
