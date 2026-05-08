"use client"

import { useState } from "react"
import { sendBatchRecetaAction } from "@/app/dashboard/_actions/send-batch-receta"

export type PdfSlot = {
  id: string
  file: File | null
}

type Estado = "idle" | "enviando" | "exito" | "error"

export function useMultiRecetaForm(initialMonto: number) {
  const [slots, setSlots] = useState<PdfSlot[]>([
    { id: crypto.randomUUID(), file: null },
  ])
  const [telefono, setTelefono] = useState("")
  const [monto, setMonto] = useState(String(initialMonto))
  const [estado, setEstado] = useState<Estado>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const telefonoDigits = telefono.replace(/\D/g, "")
  const pdfs = slots.map((s) => s.file).filter(Boolean) as File[]

  const canAddMore = slots.length < 5
  const puedeEnviar =
    pdfs.length > 0 && telefonoDigits.length >= 10 && estado === "idle"

  // Agrega un slot ya con el archivo — el botón "Agregar" abre el picker directamente
  const addSlotWithFile = (file: File) => {
    if (!canAddMore) return
    setSlots((prev) => [...prev, { id: crypto.randomUUID(), file }])
  }

  const removeSlot = (id: string) => {
    setSlots((prev) => {
      const next = prev.filter((s) => s.id !== id)
      return next.length === 0
        ? [{ id: crypto.randomUUID(), file: null }]
        : next
    })
  }

  const updateSlot = (id: string, file: File) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, file } : s)))
  }

  const handleEnviar = async () => {
    if (!puedeEnviar) return
    setEstado("enviando")
    setErrorMsg("")

    try {
      const formData = new FormData()
      pdfs.forEach((pdf) => formData.append("pdfs", pdf))
      formData.append("patientPhone", telefonoDigits)
      formData.append("amount", monto)

      const result = await sendBatchRecetaAction(formData)

      if (!result.success) {
        setErrorMsg(result.error)
        setEstado("error")
        return
      }

      setEstado("exito")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar")
      setEstado("error")
    }
  }

  const reset = () => {
    setSlots([{ id: crypto.randomUUID(), file: null }])
    setTelefono("")
    setMonto(String(initialMonto))
    setEstado("idle")
    setErrorMsg("")
  }

  return {
    slots,
    addSlotWithFile,
    removeSlot,
    updateSlot,
    telefono,
    setTelefono,
    monto,
    setMonto,
    estado,
    errorMsg,
    puedeEnviar,
    enProceso: estado === "enviando",
    canAddMore,
    pdfsLoaded: pdfs.length,
    handleEnviar,
    reset,
  }
}
