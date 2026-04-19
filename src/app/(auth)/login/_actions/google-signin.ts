"use server"

import { signIn } from "@/lib/auth"

export async function googleSignInAction() {
  // NextAuth handles the redirect to Google and back.
  // Middleware will route to /onboarding or /dashboard based on onboardingCompleted.
  await signIn("google", { redirectTo: "/dashboard" })
}
