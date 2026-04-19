"use server"

import { cookies } from "next/headers"
import { signIn } from "@/lib/auth"
import { getUserByEmail, updateLastAuthProvider } from "@/services/users"
import { verifyPassword } from "@/services/auth"

interface LoginResult {
  success: boolean
  error?: string
}

export async function loginAction(
  email: string,
  password: string
): Promise<LoginResult> {
  const user = await getUserByEmail(email)
  if (!user) return { success: false, error: "INVALID_CREDENTIALS" }

  // Google-registered users have no password — cannot use credentials login
  if (!user.password) return { success: false, error: "INVALID_CREDENTIALS" }

  const valid = await verifyPassword(password, user.password)
  if (!valid) return { success: false, error: "INVALID_CREDENTIALS" }

  // PENDING users can now log in (restriction is at action level, not login)
  if (user.status === "REJECTED")
    return { success: false, error: "ACCOUNT_REJECTED" }

  try {
    await signIn("credentials", { email, password, redirect: false })

    // Track last auth method — drives "último usado" badge on login page
    await updateLastAuthProvider(user.id, "credentials")

    const cookieStore = await cookies()
    cookieStore.set("auth_hint", "credentials", {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return { success: true }
  } catch {
    return { success: false, error: "INVALID_CREDENTIALS" }
  }
}
