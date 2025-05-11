"use client"

import { useState } from "react"
import { usePlaylists } from "../contexts/PlaylistContext"
import { X, Plus, Check, Music } from "lucide-react"

export default function PlaylistSelector({ song, onClose }) {
  const { playlists, addToPlaylist, createPlaylist } = usePlaylists()
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedPlaylists, setSelectedPlaylists] = useState({})

  const handleAddToPlaylist = (playlistId) => {
    addToPlaylist(playlistId, song)
    setSelectedPlaylists((prev) => ({
      ...prev,
      [playlistId]: true,
    }))
  }

  const handleCreatePlaylist = (e) => {
    e.preventDefault()
    if (newPlaylistName.trim()) {
      const playlistId = createPlaylist(newPlaylistName.trim())
      addToPlaylist(playlistId, song)
      setSelectedPlaylists((prev) => ({
        ...prev,
        [playlistId]: true,
      }))
      setNewPlaylistName("")
      setShowCreateForm(false)
    }
  }

  // Filter out system playlists that shouldn't be shown
  const userPlaylists = playlists.filter((p) => !p.isAuto)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium">Add to Playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Create new playlist button */}
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center w-full p-3 mb-4 text-cyan-500 dark:text-cyan-400 border border-dashed border-cyan-500 dark:border-cyan-400 rounded-md hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Create New Playlist
            </button>
          ) : (
            <form onSubmit={handleCreatePlaylist} className="mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white/80 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-cyan-500 text-white rounded-r-md hover:bg-cyan-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* Playlist list */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {userPlaylists.length === 0 ? (
              <div className="text-center py-8">
                <Music size={40} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No playlists yet</p>
              </div>
            ) : (
              userPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                    selectedPlaylists[playlist.id]
                      ? "bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-500 dark:border-cyan-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
                  }`}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                      {playlist.songs.length > 0 && playlist.songs[0].coverUrl ? (
                        <img
                          src={playlist.songs[0].coverUrl || "/placeholder.svg"}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Music size={20} className="text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{playlist.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                      </p>
                    </div>
                  </div>

                  {selectedPlaylists[playlist.id] && <Check size={18} className="text-cyan-500 dark:text-cyan-400" />}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
