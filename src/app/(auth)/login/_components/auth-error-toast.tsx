"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

const TOAST_MESSAGES: Record<string, string> = {
  AccessDenied:
    "Este correo está vinculado a una cuenta con contraseña. Iniciá sesión con tu correo y contraseña.",
}

export function AuthErrorToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const error = searchParams.get("error")
    if (!error) return

    const message = TOAST_MESSAGES[error]
    if (message) {
      toast.error(message, { duration: 6000 })
      // Remove ?error= from URL so the toast doesn't reappear on refresh
      router.replace("/login", { scroll: false })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
