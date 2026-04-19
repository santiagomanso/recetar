"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { registerAction } from "@/app/(auth)/register/_actions/register"

const registerSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .email("El correo no es válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
    specialty: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_TAKEN: "Este correo ya está registrado.",
  PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres.",
  UNKNOWN_ERROR: "Ocurrió un error. Intentá de nuevo.",
}

export function useRegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null)

    const result = await registerAction(data)

    if (result.success) {
      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (loginResult?.ok) {
        router.push("/onboarding")
        router.refresh()
      } else {
        // Account created but auto-login failed — send to login
        router.push("/login")
      }
    } else {
      const errorKey = result.error ?? "UNKNOWN_ERROR"
      setServerError(ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.UNKNOWN_ERROR)
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
