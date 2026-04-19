import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserById } from "@/services/users"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await getUserById(session.user.id)
  if (!user) redirect("/login")
  if (user.onboardingCompleted) redirect("/dashboard")

  return <>{children}</>
}
