"use server"

import { auth } from "@/lib/auth"
import { completeOnboarding } from "@/services/users"

interface CompleteOnboardingInput {
  telephone: string
  specialty?: string
}

export async function completeOnboardingAction(
  input: CompleteOnboardingInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "UNAUTHORIZED" }
    if (!input.telephone || input.telephone.length < 8)
      return { success: false, error: "INVALID_PHONE" }

    await completeOnboarding(session.user.id, {
      telephone: input.telephone,
      specialty: input.specialty,
    })

    return { success: true }
  } catch {
    return { success: false, error: "UNKNOWN_ERROR" }
  }
}
