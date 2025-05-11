"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Music, Lock } from "lucide-react"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black dark:from-black dark:to-gray-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 to-transparent opacity-30"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full filter blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <motion.div
        className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden max-w-md w-full border border-white/20 dark:border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 mb-4 neon-glow">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent neon-text">
              Vaultify
            </h1>
            <p className="text-gray-300 mt-1">Your private music vault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm backdrop-blur-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-gray-700/50 rounded-md text-white backdrop-blur-sm focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-gray-700/50 rounded-md text-white backdrop-blur-sm focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-md font-medium hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 neon-glow"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
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
