"use client"

import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { Home, Library, ListMusic, Upload, LogOut, Sun, Moon, Settings } from "lucide-react"

export default function Sidebar() {
  const location = useLocation()
  const { darkMode, toggleTheme } = useTheme()
  const { logout } = useAuth()

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Home" },
    { path: "/library", icon: <Library size={20} />, label: "Library" },
    { path: "/playlists", icon: <ListMusic size={20} />, label: "Playlists" },
    { path: "/upload", icon: <Upload size={20} />, label: "Upload" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ]

  return (
    <div className="w-64 h-full bg-white/80 dark:bg-gray-800/50 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent dark:neon-text">
          Vaultify
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Your private music vault</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-gray-100 dark:bg-gray-700/50 text-cyan-500 dark:text-cyan-400 dark:neon-text"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className="flex items-center px-4 py-3 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className="ml-3">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center px-4 py-3 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors mt-2"
        >
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  )
}
