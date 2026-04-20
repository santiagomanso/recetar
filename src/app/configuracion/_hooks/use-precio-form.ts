"use client"

import { useState } from "react"
import { toast } from "sonner"
import { updatePrecioAction } from "@/app/configuracion/_actions/update-precio"

export function usePrecioForm(initial: number | null) {
  const [amount, setAmount] = useState(initial !== null ? String(initial) : "5000")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSave() {
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Ingresá un monto válido")
      return
    }
    setIsLoading(true)
    const result = await updatePrecioAction(parsed)
    setIsLoading(false)
    if (result.success) {
      toast.success("Precio actualizado")
    } else {
      toast.error(result.error)
    }
  }

  return { amount, setAmount, isLoading, handleSave }
}
