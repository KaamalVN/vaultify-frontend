"use client"

import { Link, useLocation } from "react-router-dom"
import { Home, Library, ListMusic, Upload, Settings } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"

export default function MobileNav() {
  const location = useLocation()
  const { themeStyle } = useTheme()

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

  // Determine nav container class based on theme style
  const getNavContainerClass = () => {
    switch (themeStyle) {
      case "default":
        return "bg-white dark:bg-black border-t-2 border-black dark:border-white"
      case "cartoon":
        return "bg-white dark:bg-gray-900 border-t-2 border-pink-200 dark:border-gray-700 rounded-t-3xl"
      case "monochrome":
      default:
        return "bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800"
    }
  }

  // Determine active item class based on theme style
  const getActiveClass = (isActivePath) => {
    switch (themeStyle) {
      case "default":
        return isActivePath ? "text-black dark:text-white font-bold" : "text-gray-500 dark:text-gray-400"
      case "cartoon":
        return isActivePath ? "text-yellow-500 dark:text-yellow-400 font-bold" : "text-gray-500 dark:text-gray-400"
      case "monochrome":
      default:
        return isActivePath ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
    }
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${getNavContainerClass()} z-30 transition-colors duration-300`}>
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-3 flex-1 ${getActiveClass(isActive(item.path))}`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
