"use client"

import { createContext, useCallback, useContext, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { HistorialSkeleton } from "@/app/dashboard/_components/historial-skeleton"

interface RefreshCtx {
  markSending: () => void
  refresh: () => void
  isSending: boolean
  isPending: boolean
}

const Context = createContext<RefreshCtx>({
  markSending: () => {},
  refresh: () => {},
  isSending: false,
  isPending: false,
})

export function DashboardRefreshProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSending, setIsSending] = useState(false)

  // Called immediately when the doctor clicks "Enviar" — before server action completes
  const markSending = useCallback(() => setIsSending(true), [])

  // Called after server action succeeds — triggers router refresh
  const refresh = useCallback(() => {
    setIsSending(false)
    startTransition(() => { router.refresh() })
  }, [router])

  // Refresh when doctor comes back to the tab.
  // The webhook calls revalidatePath("/dashboard"), so the cache is already stale.
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        startTransition(() => { router.refresh() })
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [router])

  return (
    <Context.Provider value={{ markSending, refresh, isSending, isPending }}>
      {children}
    </Context.Provider>
  )
}

export function useDashboardRefresh() {
  return useContext(Context)
}

export function HistorialSection({
  children,
  hasDeliveries,
}: {
  children: React.ReactNode
  hasDeliveries: boolean
}) {
  const { isSending, isPending } = useDashboardRefresh()

  const showSkeleton = isSending || isPending

  // Hide the empty state for the entire send+refresh cycle.
  // If there are existing recetas, keep them visible and just prepend the skeleton.
  const hideChildren = !hasDeliveries && (isSending || isPending)

  return (
    <div className="space-y-3">
      {showSkeleton && <HistorialSkeleton />}
      {!hideChildren && children}
    </div>
  )
}
