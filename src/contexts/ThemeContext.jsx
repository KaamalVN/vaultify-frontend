"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  const [themeColor, setThemeColor] = useState(() => {
    const savedColor = localStorage.getItem("theme_color")
    return savedColor || "cyan"
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  useEffect(() => {
    // Set CSS variables for the selected color
    const root = document.documentElement

    // Define color palettes
    const colorPalettes = {
      cyan: {
        400: "#22d3ee",
        500: "#06b6d4",
        600: "#0891b2",
      },
      purple: {
        400: "#a78bfa",
        500: "#8b5cf6",
        600: "#7c3aed",
      },
      emerald: {
        400: "#34d399",
        500: "#10b981",
        600: "#059669",
      },
      rose: {
        400: "#fb7185",
        500: "#f43f5e",
        600: "#e11d48",
      },
      amber: {
        400: "#fbbf24",
        500: "#f59e0b",
        600: "#d97706",
      },
      blue: {
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
      },
    }

    const selectedPalette = colorPalettes[themeColor] || colorPalettes.cyan

    // Set CSS variables
    Object.entries(selectedPalette).forEach(([shade, value]) => {
      root.style.setProperty(`--color-${themeColor}-${shade}`, value)
    })

    // Update CSS for neon effects
    const style = document.createElement("style")
    style.textContent = `
      .dark .neon-text {
        color: var(--color-${themeColor}-400) !important;
        text-shadow: 0 0 5px var(--color-${themeColor}-400), 0 0 20px var(--color-${themeColor}-400) !important;
      }
      
      .dark .neon-border {
        border-color: var(--color-${themeColor}-400) !important;
        box-shadow: 0 0 5px var(--color-${themeColor}-400), inset 0 0 5px var(--color-${themeColor}-400) !important;
      }
      
      .dark .neon-glow {
        box-shadow: 0 0 10px var(--color-${themeColor}-400) !important;
      }
    `

    // Remove any previous style element
    const prevStyle = document.getElementById("theme-color-style")
    if (prevStyle) {
      prevStyle.remove()
    }

    // Add the new style element
    style.id = "theme-color-style"
    document.head.appendChild(style)

    // Save to localStorage
    localStorage.setItem("theme_color", themeColor)
  }, [themeColor])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  )
}
