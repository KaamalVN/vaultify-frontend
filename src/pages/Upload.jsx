"use client"

import { useState, useRef, useEffect } from "react"
import { UploadIcon, Link, File, Archive, X, Edit3 } from "lucide-react"
import UploadProgress from "../components/UploadProgress"
import MetadataForm from "../components/MetadataForm"
import { endpoints } from '../utils/api'

export default function Upload() {
  const [uploadMethod, setUploadMethod] = useState("file")
  const [files, setFiles] = useState([])
  const [url, setUrl] = useState("")
  const [progress, setProgress] = useState({})
  const [errors, setErrors] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const [metadataQueue, setMetadataQueue] = useState([])
  const [currentMetadataSong, setCurrentMetadataSong] = useState(null)
  const [uploadedSongs, setUploadedSongs] = useState([])
  const [uploadComplete, setUploadComplete] = useState(false)

  const fileInputRef = useRef(null)

  // Process metadata queue
  useEffect(() => {
    if (metadataQueue.length > 0 && !currentMetadataSong) {
      setCurrentMetadataSong(metadataQueue[0])
    }
  }, [metadataQueue, currentMetadataSong])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(droppedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadMethod === "file" && files.length === 0) {
      alert("Please select files to upload")
      return
    }

    if (uploadMethod === "url" && !url) {
      alert("Please enter a URL")
      return
    }

    setIsUploading(true)
    setProgress({})
    setErrors({})
    setMetadataQueue([])
    setUploadedSongs([])
    setUploadComplete(false)

    try {
      if (uploadMethod === "file") {
        await uploadFiles(files)
      } else if (uploadMethod === "url") {
        await uploadFromUrl(url)
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
      setUploadComplete(true)
    }
  }

  const uploadFiles = async (filesToUpload) => {
    const uploadPromises = filesToUpload.map(async (file) => {
      try {
        const formData = new FormData()
        formData.append("file", file)

        // Create a promise that resolves when the upload is complete
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()

          // Track upload progress
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100
              setProgress((prev) => ({
                ...prev,
                [file.name]: percentComplete,
              }))
            }
          })

          // Handle response
          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText)

              // Add to uploaded songs
              const songData = {
                fileName: file.name,
                signedUrl: response.signedUrl,
                title: response.title || file.name.split(".").slice(0, -1).join("."),
                artist: response.artist || "",
                album: response.album || "",
                genre: response.genre || "",
                coverUrl: response.coverUrl || "",
              }

              setUploadedSongs((prev) => [...prev, songData])

              // Add to metadata queue
              setMetadataQueue((prev) => [...prev, songData])

              resolve(songData)
            } else {
              setErrors((prev) => ({
                ...prev,
                [file.name]: "Upload failed",
              }))
              reject(new Error("Upload failed"))
            }
          }

          xhr.onerror = () => {
            setErrors((prev) => ({
              ...prev,
              [file.name]: "Network error",
            }))
            reject(new Error("Network error"))
          }

          // Send the request
          xhr.open("POST", endpoints.upload)
          xhr.send(formData)
        })
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          [file.name]: error.message,
        }))
        return null
      }
    })

    // Wait for all uploads to complete
    await Promise.all(uploadPromises)
  }

  const uploadFromUrl = async (fileUrl) => {
    try {
      const fileName = fileUrl.split("/").pop() || "downloaded-file"

      // Set initial progress
      setProgress((prev) => ({
        ...prev,
        [fileName]: 0,
      }))

      const response = await fetch(endpoints.uploadFromUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: fileUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload from URL")
      }

      const data = await response.json()

      // Set complete progress
      setProgress((prev) => ({
        ...prev,
        [fileName]: 100,
      }))

      // Add to uploaded songs
      const songData = {
        fileName,
        signedUrl: data.signedUrl,
        title: data.title || fileName.split(".").slice(0, -1).join("."),
        artist: data.artist || "",
        album: data.album || "",
        genre: data.genre || "",
        coverUrl: data.coverUrl || "",
      }

      setUploadedSongs((prev) => [...prev, songData])

      // Add to metadata queue
      setMetadataQueue((prev) => [...prev, songData])
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [url]: error.message,
      }))
    }
  }

  const handleSaveMetadata = async (updatedSong) => {
    try {
      // Send metadata to backend
      const response = await fetch(endpoints.updateMetadata, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSong),
      })

      if (!response.ok) {
        throw new Error("Failed to update metadata")
      }

      // Update uploaded songs list
      setUploadedSongs((prev) => prev.map((song) => (song.fileName === updatedSong.fileName ? updatedSong : song)))

      // Remove from queue and move to next song
      setMetadataQueue((prev) => prev.filter((song) => song.fileName !== updatedSong.fileName))
      setCurrentMetadataSong(null)
    } catch (error) {
      console.error("Failed to save metadata:", error)
      alert("Failed to save metadata. Please try again.")
    }
  }

  const handleSkipMetadata = () => {
    // Remove current song from queue and move to next
    if (currentMetadataSong) {
      setMetadataQueue((prev) => prev.filter((song) => song.fileName !== currentMetadataSong.fileName))
      setCurrentMetadataSong(null)
    }
  }

  const handleEditAllLater = () => {
    // Clear the metadata queue
    setMetadataQueue([])
    setCurrentMetadataSong(null)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Upload Music</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Add music to your private collection</p>
      </div>

      {currentMetadataSong ? (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Edit Song Metadata ({metadataQueue.length} remaining)</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleSkipMetadata}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Skip
              </button>
              <button
                onClick={handleEditAllLater}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Edit All Later
              </button>
            </div>
          </div>
          <MetadataForm song={currentMetadataSong} onSave={handleSaveMetadata} onCancel={handleEditAllLater} />
        </div>
      ) : (
        <>
          {/* Upload Methods Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`py-2 px-4 font-medium ${
                  uploadMethod === "file"
                    ? "border-b-2 border-cyan-500 text-cyan-500 dark:neon-text"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setUploadMethod("file")}
              >
                Upload Files
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  uploadMethod === "url"
                    ? "border-b-2 border-cyan-500 text-cyan-500 dark:neon-text"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setUploadMethod("url")}
              >
                From URL
              </button>
            </div>
          </div>

          {/* Upload Form */}
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-md mb-8">
            {uploadMethod === "file" ? (
              <>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors"
                  onClick={() => fileInputRef.current.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept="audio/*,.zip,.rar,.7z"
                  />
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop files here, or click to select files
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Supports audio files, ZIP, RAR, and 7z archives
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-2 rounded"
                        >
                          <div className="flex items-center">
                            {file.name.match(/\.(zip|rar|7z)$/i) ? (
                              <Archive size={16} className="mr-2 text-gray-500" />
                            ) : (
                              <File size={16} className="mr-2 text-gray-500" />
                            )}
                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                          </div>
                          <button onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-500">
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">URL to Audio File or Archive</label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/music.mp3"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Enter a direct link to an audio file or archive (.zip, .rar, .7z)
                </p>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                  isUploading
                    ? "bg-cyan-400/70 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 dark:neon-glow"
                } transition-colors`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && files.length > 0 && <UploadProgress files={files} progress={progress} errors={errors} />}

          {isUploading && uploadMethod === "url" && (
            <UploadProgress
              files={[{ name: url.split("/").pop() || "file-from-url" }]}
              progress={progress}
              errors={errors}
            />
          )}

          {/* Upload Complete Summary */}
          {uploadComplete && uploadedSongs.length > 0 && !isUploading && (
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-md mb-8">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={20} />
                Upload Complete
              </h2>
              <p className="mb-4">
                {uploadedSongs.length} {uploadedSongs.length === 1 ? "song" : "songs"} uploaded successfully.
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {uploadedSongs.map((song, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded overflow-hidden mr-2">
                        <img
                          src={song.coverUrl || "/placeholder.svg?height=32&width=32"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <div className="font-medium text-sm">{song.title}</div>
                        <div className="text-xs text-gray-500">{song.artist || "Unknown Artist"}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentMetadataSong(song)
                      }}
                      className="p-1 text-gray-500 hover:text-cyan-500 transition-colors"
                      title="Edit Metadata"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setFiles([])
                    setUrl("")
                    setUploadedSongs([])
                    setUploadComplete(false)
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Upload More
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

import { CheckCircle } from "lucide-react"
