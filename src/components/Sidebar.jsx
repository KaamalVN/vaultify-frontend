"use client"

import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { Home, Library, ListMusic, Upload, LogOut, Sun, Moon, Settings } from "lucide-react"

export default function Sidebar() {
  const location = useLocation()
  const { darkMode, toggleTheme, themeStyle, themeColor } = useTheme()
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

  // Determine sidebar class based on theme style
  const getSidebarClass = () => {
    switch (themeStyle) {
      case "default":
        return "bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 shadow-lg"
      case "cartoon":
        return "bg-white dark:bg-gray-900 border-r-2 border-pink-200 dark:border-gray-700 rounded-r-3xl"
      case "monochrome":
      default:
        return "bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800"
    }
  }

  // Determine nav item class based on theme style
  const getNavItemClass = (isActivePath) => {
    switch (themeStyle) {
      case "default":
        return isActivePath
          ? `bg-${themeColor}-500 text-white dark:text-white font-medium shadow-md hover:bg-${themeColor}-600 rounded-lg`
          : `text-gray-700 dark:text-gray-300 hover:bg-${themeColor}-50 dark:hover:bg-${themeColor}-900/10 rounded-lg`
      case "cartoon":
        return isActivePath
          ? "bg-yellow-400 text-black font-medium rounded-full"
          : "text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-gray-800 rounded-full"
      case "monochrome":
      default:
        return isActivePath
          ? "bg-black text-white dark:bg-white dark:text-black font-medium"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
    }
  }

  return (
    <div className={`w-64 h-full ${getSidebarClass()} flex flex-col transition-colors duration-300`}>
      {/* Logo */}
      <div className="p-6">
        <h1 className={`text-2xl font-bold ${themeStyle === "cartoon" ? "font-bubblegum" : ""}`}>Vaultify</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Your private music vault</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 transition-all duration-200 ${getNavItemClass(isActive(item.path))}`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className={`p-4 ${
          themeStyle === "default"
            ? "border-t border-gray-200 dark:border-gray-800"
            : themeStyle === "cartoon"
              ? "border-t-2 border-pink-200 dark:border-gray-700"
              : "border-t border-gray-200 dark:border-gray-800"
        }`}
      >
        <button
          onClick={toggleTheme}
          className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 ${
            themeStyle === "default"
              ? `text-gray-700 dark:text-gray-300 hover:bg-${themeColor}-50 dark:hover:bg-${themeColor}-900/10`
              : themeStyle === "cartoon"
                ? "hover:bg-pink-100 dark:hover:bg-gray-800 rounded-full"
                : "hover:bg-gray-100 dark:hover:bg-gray-900"
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className="ml-3">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button
          onClick={logout}
          className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 ${
            themeStyle === "default"
              ? `text-gray-700 dark:text-gray-300 hover:bg-${themeColor}-50 dark:hover:bg-${themeColor}-900/10`
              : themeStyle === "cartoon"
                ? "hover:bg-pink-100 dark:hover:bg-gray-800 rounded-full"
                : "hover:bg-gray-100 dark:hover:bg-gray-900"
          } mt-2`}
        >
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  )
}
