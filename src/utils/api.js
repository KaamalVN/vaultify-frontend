// API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// API endpoints
export const endpoints = {
  upload: `${API_URL}/upload`,
  uploadFromUrl: `${API_URL}/upload-from-url`,
  audioUrls: `${API_URL}/audio-urls`,
  updateMetadata: `${API_URL}/update-metadata`,
  fetchMetadata: `${API_URL}/fetch-metadata`,
  updatePlaylistMetadata: `${API_URL}/update-playlist-metadata`,
  playlistMetadata: (id) => `${API_URL}/playlist-metadata/${id}`,
  allMetadata: `${API_URL}/all-metadata`,
} 