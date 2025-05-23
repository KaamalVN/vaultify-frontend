"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { LogOut, Database, Info, Check, Palette } from "lucide-react"

export default function Settings() {
  const { darkMode, toggleTheme, themeColor, setThemeColor, themeStyle, setThemeStyle } = useTheme()
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

  const themeStyleOptions = [
    {
      name: "Classic",
      value: "default",
      description: "Modern music player with accent colors",
    },
    {
      name: "Monochrome",
      value: "monochrome",
      description: "Black & white minimalist interface",
    },
    {
      name: "Cartoon",
      value: "cartoon",
      description: "Playful, colorful interface with rounded shapes",
    },
  ]

  const handleClearCache = () => {
    // Clear localStorage cache (except auth and theme)
    const authStatus = localStorage.getItem("vaultify_auth")
    const themeStatus = localStorage.getItem("theme")
    const themeColorStatus = localStorage.getItem("theme_color")
    const themeStyleStatus = localStorage.getItem("theme_style")

    localStorage.clear()

    localStorage.setItem("vaultify_auth", authStatus)
    localStorage.setItem("theme", themeStatus)
    localStorage.setItem("theme_color", themeColorStatus)
    localStorage.setItem("theme_style", themeStyleStatus)

    setCacheCleared(true)
    setTimeout(() => setCacheCleared(false), 3000)
  }

  // Determine card class based on theme style
  const getCardClass = () => {
    switch (themeStyle) {
      case "default":
        return "default-card p-6"
      case "cartoon":
        return "cartoon-card p-6"
      case "monochrome":
      default:
        return "sleek-card p-6"
    }
  }

  // Determine button class based on theme style
  const getButtonClass = (isPrimary = true) => {
    switch (themeStyle) {
      case "default":
        return isPrimary ? "default-button px-4 py-2" : "default-button-secondary px-4 py-2"
      case "cartoon":
        return "cartoon-button px-4 py-2"
      case "monochrome":
      default:
        return isPrimary
          ? "bg-black text-white dark:bg-white dark:text-black rounded-full px-4 py-2"
          : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-4 py-2"
    }
  }

  return (
    <div className={`p-6 max-w-3xl mx-auto ${themeStyle === "cartoon" ? "cartoon-text" : ""}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Customize your Vaultify experience</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <motion.div
          className={getCardClass()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-medium mb-6 flex items-center">
            <Palette className="mr-2" size={20} />
            Appearance
          </h2>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
              </div>

              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 ${
                  themeStyle === "cartoon" ? "focus:ring-yellow-400 dark:focus:ring-yellow-400" : ""
                }`}
                style={{
                  backgroundColor: darkMode
                    ? themeStyle === "cartoon"
                      ? "#f59e0b" // amber-500
                      : themeStyle === "default"
                        ? `var(--color-${themeColor}-500)`
                        : "#000000" // black
                    : "#e5e7eb", // gray-200
                  boxShadow: darkMode && themeStyle === "default" ? `0 0 5px var(--color-${themeColor}-400)` : "none",
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

            {/* Theme Style */}
            <div>
              <h3 className="font-medium mb-3">Interface Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {themeStyleOptions.map((style) => (
                  <div
                    key={style.value}
                    onClick={() => setThemeStyle(style.value)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all ${
                      themeStyle === style.value
                        ? themeStyle === "default"
                          ? "border-2 border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                          : themeStyle === "cartoon"
                            ? "border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                            : "border-2 border-black dark:border-white"
                        : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{style.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{style.description}</p>
                      </div>
                      {themeStyle === style.value && (
                        <div
                          className={
                            themeStyle === "default"
                              ? "bg-cyan-500 text-white rounded-full p-1"
                              : themeStyle === "cartoon"
                                ? "bg-yellow-400 text-black rounded-full p-1"
                                : "bg-black dark:bg-white text-white dark:text-black rounded-full p-1"
                          }
                        >
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Only show accent color for default theme */}
            {themeStyle === "default" && (
              <div>
                <h3 className="font-medium mb-3">Accent Color</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setThemeColor(color.value)}
                      className={`h-12 rounded-lg flex items-center justify-center transition-all ${
                        themeColor === color.value ? "ring-2 ring-black dark:ring-white shadow-md" : "hover:opacity-90"
                      }`}
                      style={{
                        backgroundColor: `var(--color-${color.value}-500)`,
                        opacity: themeColor === color.value ? 1 : 0.7,
                      }}
                    >
                      {themeColor === color.value && <Check className="text-white" size={18} />}
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Select an accent color for the app interface
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          className={getCardClass()}
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
                className={cacheCleared ? "px-4 py-2 bg-green-500 text-white rounded-md" : getButtonClass(false)}
              >
                {cacheCleared ? "Cleared!" : "Clear Cache"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          className={getCardClass()}
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
            className={
              themeStyle === "default"
                ? "w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors flex items-center justify-center"
                : themeStyle === "cartoon"
                  ? "cartoon-button w-full py-3 px-4 bg-red-400 hover:bg-red-500 text-white font-medium"
                  : "w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full font-medium transition-colors flex items-center justify-center"
            }
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  )
}
