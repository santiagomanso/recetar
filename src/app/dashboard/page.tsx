import { Suspense } from "react"
import { DashboardData } from "./_components/dashboard-data"
import { DashboardSkeleton } from "./_components/dashboard-skeleton"

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  )
}
