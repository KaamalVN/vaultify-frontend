"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { Sun, LogOut, Database, Info } from "lucide-react"

export default function Settings() {
  const { darkMode, toggleTheme, themeColor, setThemeColor } = useTheme()
  const { logout } = useAuth()
  const [cacheCleared, setCacheCleared] = useState(false)

  const colorOptions = [
    { name: "Cyan", value: "cyan" },
    { name: "Purple", value: "purple" },
    { name: "Emerald", value: "emerald" },
    { name: "Rose", value: "rose" },
    { name: "Amber", value: "amber" },
    { name: "Blue", value: "blue" },
  ]

  const handleClearCache = () => {
    // Clear localStorage cache (except auth and theme)
    const authStatus = localStorage.getItem("vaultify_auth")
    const themeStatus = localStorage.getItem("theme")
    const themeColorStatus = localStorage.getItem("theme_color")

    localStorage.clear()

    localStorage.setItem("vaultify_auth", authStatus)
    localStorage.setItem("theme", themeStatus)
    localStorage.setItem("theme_color", themeColorStatus)

    setCacheCleared(true)
    setTimeout(() => setCacheCleared(false), 3000)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Customize your Vaultify experience</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Sun className="mr-2" size={20} />
            Appearance
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
              </div>

              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                style={{
                  backgroundColor: darkMode ? `var(--color-${themeColor}-400)` : "#e5e7eb",
                  boxShadow: darkMode ? `0 0 5px var(--color-${themeColor}-400)` : "none",
                }}
              >
                <span
                  className={`${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
                <span className="sr-only">Toggle Theme</span>
              </button>
            </div>

            <div>
              <h3 className="font-medium mb-2">Accent Color</h3>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setThemeColor(color.value)}
                    className={`h-10 rounded-md flex items-center justify-center transition-all ${
                      themeColor === color.value
                        ? `ring-2 ring-${color.value}-500 dark:ring-${color.value}-400`
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    style={{
                      backgroundColor: `var(--color-${color.value}-500)`,
                      opacity: themeColor === color.value ? 1 : 0.7,
                    }}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Select an accent color for the app interface
              </p>
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Database className="mr-2" size={20} />
            Data Management
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Clear Cache</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reset local data and playlists</p>
              </div>

              <button
                onClick={handleClearCache}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  cacheCleared
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {cacheCleared ? "Cleared!" : "Clear Cache"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Info className="mr-2" size={20} />
            About
          </h2>

          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Vaultify</span> - Your private music streaming app
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</p>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={logout}
            className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  )
}
