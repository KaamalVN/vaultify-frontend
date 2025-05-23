"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { ThemeProvider, useTheme } from "./contexts/ThemeContext"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { PlayerProvider } from "./contexts/PlayerContext"
import { PlaylistProvider } from "./contexts/PlaylistContext"
import { useScrollToTop } from "./utils/useScrollToTop"
import Sidebar from "./components/Sidebar"
import MobileNav from "./components/MobileNav"
import Home from "./pages/Home"
import Library from "./pages/Library"
import Playlists from "./pages/Playlists"
import PlaylistDetail from "./pages/PlaylistDetail"
import Upload from "./pages/Upload"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import MiniPlayer from "./components/MiniPlayer"
import FullPlayer from "./components/FullPlayer"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Update the MainApp component to include themeStyle
function MainApp() {
  const { isAuthenticated } = useAuth()
  const { themeStyle } = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Add scroll to top behavior
  useScrollToTop()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isAuthenticated) {
    return <Login />
  }

  // Determine background class based on theme style
  const getBackgroundClass = () => {
    switch (themeStyle) {
      case "cartoon":
        return "bg-pink-50 dark:bg-gray-800"
      default:
        return "bg-gray-50 dark:bg-gray-900"
    }
  }

  return (
    <div
      className={`flex h-screen ${getBackgroundClass()} text-gray-900 dark:text-white transition-colors duration-300 ${themeStyle === "monochrome" ? "theme-monochrome" : ""}`}
    >
      {!isMobile && <Sidebar />}

      <main className="flex-1 overflow-auto pb-24 md:pb-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:id" element={<PlaylistDetail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {isMobile && <MobileNav />}
      <MiniPlayer />
      <FullPlayer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <PlayerProvider>
            <PlaylistProvider>
              <AnimatePresence>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="*"
                    element={
                      <ProtectedRoute>
                        <MainApp />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </PlaylistProvider>
          </PlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}
