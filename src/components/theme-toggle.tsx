"use client"

import { useTheme } from "@/components/theme-provider"
import { Monitor, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type Mode = "system" | "light" | "dark"

const options: { value: Mode; icon: React.ElementType }[] = [
  { value: "system", icon: Monitor },
  { value: "light",  icon: Sun },
  { value: "dark",   icon: Moon },
]

/** Desktop: pill con 3 botones (system · light · dark) */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-muted p-1">
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={value}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
            mounted && theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  )
}

/** Mobile sheet: botón de una línea que alterna dark/light */
export function ThemeToggleMobile() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-full"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {isDark ? "Modo claro" : "Modo oscuro"}
    </button>
  )
}
