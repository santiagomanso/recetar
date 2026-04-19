import { Suspense } from "react"
import { OnboardingData } from "@/app/onboarding/_components/onboarding-data"

export const dynamic = "force-dynamic"

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <OnboardingData />
    </Suspense>
  )
}

function OnboardingSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="h-[540px] w-full max-w-[440px] animate-pulse rounded-2xl border border-border bg-card" />
    </div>
  )
}
