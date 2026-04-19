"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { AuthHintSetter } from "@/components/auth-hint-setter"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthHintSetter />
      {children}
    </SessionProvider>
  )
}
