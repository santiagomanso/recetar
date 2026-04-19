import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserById } from "@/services/users"
import { OnboardingWizard } from "@/app/onboarding/_components/onboarding-wizard"

export async function OnboardingData() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await getUserById(session.user.id)
  if (!user) redirect("/login")

  return <OnboardingWizard hasSpecialty={!!user.specialty} email={user.email} />
}
