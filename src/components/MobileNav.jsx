import { Link, useLocation } from "react-router-dom"
import { Home, Library, ListMusic, Upload, Settings } from "lucide-react"

export default function MobileNav() {
  const location = useLocation()

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
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-30 transition-colors duration-300">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-3 flex-1 ${
              isActive(item.path) ? "text-cyan-500 dark:text-cyan-400 neon-text" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
