"use client"

import { createContext, useContext, useEffect, useCallback, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
})

export function useTheme() {
  return useContext(ThemeContext)
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const isDark = theme === "dark" || (theme === "system" && getSystemTheme() === "dark")
  root.classList.toggle("dark", isDark)
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null
      if (stored && ["light", "dark", "system"].includes(stored)) {
        setThemeState(stored)
      }
    } catch {}
  }, [])

  useEffect(() => {
    applyTheme(theme)
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyTheme("system")
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    try { localStorage.setItem("theme", newTheme) } catch {}
    applyTheme(newTheme)
  }, [])

  const resolvedTheme: "light" | "dark" = theme === "system" ? getSystemTheme() : theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
