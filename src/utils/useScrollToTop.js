"use client"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function useScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const mainContent = document.querySelector("main")
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        behavior: "instant",
      })
    }
  }, [pathname])
}
