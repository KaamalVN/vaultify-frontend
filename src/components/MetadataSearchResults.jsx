"use client"

import { X } from "lucide-react"

export default function MetadataSearchResults({ results, isSearching, onClose, onApply }) {
  return (
    <div className="w-96 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Search Results</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>

      {isSearching ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-cyan-500 rounded-full border-t-transparent"></div>
        </div>
      ) : results && results.length > 0 ? (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors"
            >
              <div className="flex gap-4">
                {result.coverUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={result.coverUrl || "/placeholder.svg"}
                      alt="Cover Preview"
                      className="w-24 h-24 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=96&width=96"
                        e.target.onerror = null
                      }}
                    />
                  </div>
                )}
                <div className="flex-grow space-y-2">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Title:</span>
                    <p className="font-medium">{result.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Artist:</span>
                    <p className="font-medium">{result.artist}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Album:</span>
                    <p className="font-medium">{result.album}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Genre:</span>
                    <p className="font-medium">{result.genre}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Source:</span>
                    <p className="font-medium">{result.source}</p>
                  </div>
                  <button
                    onClick={() => onApply(result)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-md hover:from-cyan-600 hover:to-purple-700 transition-colors dark:neon-glow"
                  >
                    Apply this result
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No results found
        </div>
      )}
    </div>
  )
} 