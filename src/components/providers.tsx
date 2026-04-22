"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthHintSetter } from "@/components/auth-hint-setter"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system">
      <SessionProvider>
        <AuthHintSetter />
        {children}
      </SessionProvider>
    </ThemeProvider>
  )
}
