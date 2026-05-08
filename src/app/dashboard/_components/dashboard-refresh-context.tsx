"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition } from "react"
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
  const routerRef = useRef(router)
  routerRef.current = router  // always up-to-date without being a dep

  const [isPending, startTransition] = useTransition()
  const [isSending, setIsSending] = useState(false)

  // Called immediately when the doctor clicks "Enviar" — before server action completes
  const markSending = useCallback(() => setIsSending(true), [])

  // Called after server action succeeds — triggers router refresh.
  // Uses routerRef so this function stays stable even if router identity changes.
  const refresh = useCallback(() => {
    setIsSending(false)
    startTransition(() => { routerRef.current.refresh() })
  }, [])

  // Mirror isPending into a ref so the visibilitychange closure (registered once)
  // always sees the current value without being in its dependency array.
  const isPendingRef = useRef(false)
  isPendingRef.current = isPending

  // Refresh when doctor comes back to the tab. Guard against re-entrant calls:
  // if a transition is already pending, skip until it finishes.
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible" && !isPendingRef.current) {
        startTransition(() => { routerRef.current.refresh() })
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

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
