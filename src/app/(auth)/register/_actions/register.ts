"use server"

import { createUser } from "@/services/users"
import { hashPassword } from "@/services/auth"
import type { RegisterInput } from "@/types/user"

interface RegisterResult {
  success: boolean
  error?: string
}

export async function registerAction(input: RegisterInput): Promise<RegisterResult> {
  try {
    if (!input.name?.trim()) return { success: false, error: "NAME_REQUIRED" }
    if (!input.email?.trim()) return { success: false, error: "EMAIL_REQUIRED" }
    if (!input.password || input.password.length < 8) return { success: false, error: "PASSWORD_TOO_SHORT" }

    const hashedPassword = await hashPassword(input.password)

    await createUser({
      ...input,
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
      password: hashedPassword,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return { success: false, error: "EMAIL_TAKEN" }
    }
    return { success: false, error: "UNKNOWN_ERROR" }
  }
}
