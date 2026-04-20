import { Suspense } from "react"
import { ConfigData } from "./_components/config-data"
import { DashboardSkeleton } from "@/app/dashboard/_components/dashboard-skeleton"

export default function ConfiguracionPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ConfigData />
    </Suspense>
  )
}
