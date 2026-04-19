"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function AuthHintSetter() {
  const { data: session } = useSession()

  useEffect(() => {
    const provider = session?.user?.lastAuthProvider
    if (provider === "credentials" || provider === "google") {
      document.cookie = `auth_hint=${provider}; max-age=${365 * 24 * 60 * 60}; path=/; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`
    }
  }, [session?.user?.lastAuthProvider])

  return null
}
