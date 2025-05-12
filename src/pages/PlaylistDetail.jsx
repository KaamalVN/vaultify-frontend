"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePlaylists } from "../contexts/PlaylistContext"
import { usePlayer } from "../contexts/PlayerContext"
import SongCard from "../components/SongCard"
import { Play, MoreHorizontal, Edit2, Trash2, Music, ArrowLeft, ImageIcon } from "lucide-react"

export default function PlaylistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { playlists, deletePlaylist, renamePlaylist, removeFromPlaylist, updatePlaylistCover } = usePlaylists()
  const { playSong } = usePlayer()

  const [showMenu, setShowMenu] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showCoverForm, setShowCoverForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const playlist = playlists.find((p) => p.id === id)

  useEffect(() => {
    if (playlist) {
      setNewName(playlist.name)
      setCoverUrl(playlist.coverUrl || "")
    }
  }, [playlist])

  if (!playlist) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Playlist not found</h3>
          <button onClick={() => navigate("/playlists")} className="text-cyan-600 hover:underline">
            Back to Playlists
          </button>
        </div>
      </div>
    )
  }

  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0])
    }
  }

  const handleRename = (e) => {
    e.preventDefault()
    if (newName.trim() && newName !== playlist.name) {
      renamePlaylist(id, newName.trim())
    }
    setShowEditForm(false)
  }

  const handleUpdateCover = async (e) => {
    e.preventDefault()
    if (coverUrl.trim()) {
      try {
        setIsUploading(true)
        await updatePlaylistCover(id, coverUrl.trim())
        setShowCoverForm(false)
      } catch (error) {
        console.error("Failed to update cover:", error)
        alert("Failed to update cover image. Please try again.")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      deletePlaylist(id)
      navigate("/playlists")
    }
  }

  // Get cover art from the playlist or the first song in the playlist, or use a default
  const coverArt = playlist.coverUrl || playlist.songs[0]?.coverUrl || "/placeholder.svg?height=200&width=200"

  const isSystemPlaylist = id === "favorites" || id === "recently-played"
  const isAutoPlaylist = playlist.isAuto

  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={() => navigate("/playlists")}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Playlists
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
        {/* Cover Art */}
        <div className="w-48 h-48 rounded-lg overflow-hidden shadow-md flex-shrink-0 relative group">
          {playlist.songs.length > 0 || playlist.coverUrl ? (
            <img src={coverArt || "/placeholder.svg"} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              <Music size={64} className="text-gray-400 dark:text-gray-600" />
            </div>
          )}

          {/* Edit cover overlay */}
          {!isSystemPlaylist && (
            <div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              onClick={() => setShowCoverForm(true)}
            >
              <div className="bg-white dark:bg-gray-800 rounded-full p-2">
                <ImageIcon size={24} className="text-gray-800 dark:text-gray-200" />
              </div>
            </div>
          )}
        </div>

        {/* Playlist Info */}
        <div className="flex-1">
          {showEditForm ? (
            <form onSubmit={handleRename} className="mb-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/50 text-gray-900 dark:text-white mb-2"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-3 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <h1 className="text-2xl font-bold mb-2">{playlist.name}</h1>
          )}

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
          </p>

          <div className="flex space-x-3">
            {playlist.songs.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="bg-cyan-500 text-white px-4 py-2 rounded-md font-medium hover:bg-cyan-600 transition-colors inline-flex items-center dark:neon-glow"
              >
                <Play className="mr-2" size={18} />
                Play All
              </button>
            )}

            {!isSystemPlaylist && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <MoreHorizontal size={18} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 py-1 border border-gray-200 dark:border-gray-700">
                    {!isAutoPlaylist && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setShowMenu(false)
                          setShowEditForm(true)
                        }}
                      >
                        <Edit2 size={16} className="mr-2" />
                        Rename
                      </button>
                    )}
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowMenu(false)
                        setShowCoverForm(true)
                      }}
                    >
                      <ImageIcon size={16} className="mr-2" />
                      Change Cover
                    </button>
                    {!isAutoPlaylist && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setShowMenu(false)
                          handleDelete()
                        }}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover URL Form */}
      {showCoverForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Change Cover Image</h2>
              <form onSubmit={handleUpdateCover}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                  />
                </div>

                {coverUrl && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Preview</p>
                    <div className="w-32 h-32 rounded overflow-hidden">
                      <img
                        src={coverUrl || "/placeholder.svg"}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=128&width=128"
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCoverForm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!coverUrl || isUploading}
                  >
                    {isUploading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Songs List */}
      {playlist.songs.length === 0 ? (
        <div className="text-center py-12 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-sm">
          <Music size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No songs in this playlist</h3>
          <p className="text-gray-500 dark:text-gray-400">Add songs from your library to this playlist</p>
        </div>
      ) : (
        <div className="space-y-2">
          {playlist.songs.map((song, index) => (
            <SongCard key={index} song={song} index={index} showIndex={true} playlistId={id} />
          ))}
        </div>
      )}
    </div>
  )
}
