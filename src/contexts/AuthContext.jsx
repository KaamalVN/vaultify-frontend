"use client"

import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("vaultify_auth") === "true"
  })

  const login = (username, password) => {
    // Simple fixed authentication
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true)
      localStorage.setItem("vaultify_auth", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("vaultify_auth")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}
