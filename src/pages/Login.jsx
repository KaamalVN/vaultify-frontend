"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Music, Lock } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()
  const { themeStyle } = useTheme()

  // Disable scrolling on login page
  useEffect(() => {
    document.body.classList.add("no-scroll")
    return () => {
      document.body.classList.remove("no-scroll")
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    const success = login(username, password)

    if (success) {
      navigate("/")
    } else {
      setError("Invalid username or password")
    }
  }

  // Determine container class based on theme style
  const getContainerClass = () => {
    switch (themeStyle) {
      case "default":
        return "bg-gray-50 dark:bg-gray-900"
      case "cartoon":
        return "bg-pink-50 dark:bg-gray-800"
      case "monochrome":
      default:
        return "bg-white dark:bg-black"
    }
  }

  // Determine card class based on theme style
  const getCardClass = () => {
    switch (themeStyle) {
      case "default":
        return "neo-card"
      case "cartoon":
        return "cartoon-card"
      case "monochrome":
      default:
        return "bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800"
    }
  }

  // Determine button class based on theme style
  const getButtonClass = () => {
    switch (themeStyle) {
      case "default":
        return "neo-button"
      case "cartoon":
        return "cartoon-button"
      case "monochrome":
      default:
        return "bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-gray-100"
    }
  }

  // Determine input class based on theme style
  const getInputClass = () => {
    switch (themeStyle) {
      case "default":
        return "neo-input"
      case "cartoon":
        return "cartoon-input"
      case "monochrome":
      default:
        return "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
    }
  }

  return (
    <div className={`min-h-screen ${getContainerClass()} flex items-center justify-center p-6`}>
      <motion.div
        className={`${getCardClass()} overflow-hidden max-w-md w-full`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                themeStyle === "cartoon" ? "bg-yellow-400" : "bg-black dark:bg-white"
              } mb-4`}
            >
              <Music className={`h-8 w-8 ${themeStyle === "cartoon" ? "text-black" : "text-white dark:text-black"}`} />
            </div>
            <h1 className={`text-2xl font-bold ${themeStyle === "cartoon" ? "font-bubblegum" : ""}`}>Vaultify</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Your private music vault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className={`${
                  themeStyle === "cartoon" ? "bg-red-100 dark:bg-red-900/20" : "bg-red-50 dark:bg-red-900/20"
                } text-red-500 p-3 rounded-lg text-sm`}
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-2 ${getInputClass()} text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 ${getInputClass()} text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all`}
                required
              />
            </div>

            <div>
              <button type="submit" className={`w-full py-2 px-4 ${getButtonClass()} transition-all duration-300`}>
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center">
              <Lock size={14} className="mr-1" />
              <span>Default login: admin / password</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
