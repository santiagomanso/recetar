"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { resendRecetaAction } from "@/app/dashboard/_actions/resend-receta"

export function ResendButton({ deliveryId }: { deliveryId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleResend() {
    setLoading(true)
    const result = await resendRecetaAction(deliveryId)
    setLoading(false)
    if (result.success) {
      toast.success("Link reenviado por WhatsApp")
    } else {
      toast.error(result.error)
    }
  }

  return (
    <button
      onClick={handleResend}
      disabled={loading}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
      type="button"
    >
      <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
      Enviar de nuevo
    </button>
  )
}
