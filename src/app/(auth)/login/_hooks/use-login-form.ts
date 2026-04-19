"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { loginAction } from "@/app/(auth)/login/_actions/login"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("El correo no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

const INLINE_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "El correo o la contraseña son incorrectos.",
  ACCOUNT_REJECTED: "Tu cuenta fue rechazada. Contactá al administrador.",
  UNKNOWN_ERROR: "Ocurrió un error. Intentá de nuevo.",
}

export function useLoginForm(urlError?: string) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null)

    try {
      const result = await loginAction(data.email, data.password)

      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        const errorKey = result.error ?? "UNKNOWN_ERROR"
        setServerError(
          INLINE_ERROR_MESSAGES[errorKey] ?? INLINE_ERROR_MESSAGES.UNKNOWN_ERROR
        )
      }
    } catch {
      setServerError(INLINE_ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    serverError,
  }
}
