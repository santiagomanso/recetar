"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function PopupCallbackPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (status === "authenticated") {
      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_SUCCESS" },
          window.location.origin
        )
        window.close()
      } else {
        // Fallback: not in popup, redirect normally
        router.replace("/dashboard")
      }
    }

    if (status === "unauthenticated") {
      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_ERROR" },
          window.location.origin
        )
        window.close()
      } else {
        router.replace("/login?error=AccessDenied")
      }
    }
  }, [status, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  )
}
