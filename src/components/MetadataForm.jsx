"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import MetadataSearchResults from "./MetadataSearchResults"

export default function MetadataForm({ song, onSave, onCancel }) {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [album, setAlbum] = useState("")
  const [genre, setGenre] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showResultsPanel, setShowResultsPanel] = useState(false)

  useEffect(() => {
    if (song) {
      setTitle(song.title || song.fileName.split(".").slice(0, -1).join("."))
      setArtist(song.artist || "")
      setAlbum(song.album || "")
      setGenre(song.genre || "")
      setCoverUrl(song.coverUrl || "")
    }
  }, [song])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...song,
      title,
      artist,
      album,
      genre,
      coverUrl,
    })
  }

  const handleAutoFetch = async () => {
    setIsSearching(true)
    setShowResultsPanel(true)
    setSearchResults([])

    try {
      // Call backend to fetch enhanced metadata
      const response = await fetch("http://localhost:3000/fetch-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: song.fileName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch metadata")
      }

      const data = await response.json()
      console.log('Received metadata:', data)

      // Set search results
      if (data.matches && Array.isArray(data.matches)) {
        setSearchResults(data.matches)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error fetching metadata:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const applySearchResult = (result) => {
    setTitle(result.title)
    setArtist(result.artist)
    setAlbum(result.album)
    setGenre(result.genre)
    setCoverUrl(result.coverUrl)
    setShowResultsPanel(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        {/* Auto-fetch metadata button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleAutoFetch}
            disabled={isSearching}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isSearching ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-cyan-500 rounded-full border-t-transparent mr-2"></div>
                Searching for metadata...
              </>
            ) : (
              <>
                <Search size={16} className="mr-2" />
                Auto-fetch metadata
              </>
            )}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Album</label>
          <input
            type="text"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Art URL</label>
          <input
            type="text"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
          />
        </div>

        {coverUrl && (
          <div className="mt-2">
            <img
              src={coverUrl || "/placeholder.svg"}
              alt="Cover Preview"
              className="w-32 h-32 object-cover rounded-md"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=128&width=128"
                e.target.onerror = null
              }}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-md hover:from-cyan-600 hover:to-purple-700 transition-colors dark:neon-glow"
          >
            Save Metadata
          </button>
        </div>
      </form>

      {/* Search Results Panel */}
      {showResultsPanel && (
        <MetadataSearchResults
          results={searchResults}
          isSearching={isSearching}
          onClose={() => setShowResultsPanel(false)}
          onApply={applySearchResult}
        />
      )}
    </div>
  )
}
