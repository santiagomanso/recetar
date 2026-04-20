"use client"

import { useState } from "react"
import { sendRecetaAction } from "@/app/dashboard/_actions/send-receta"

type Estado = "idle" | "enviando" | "exito" | "error"

export function useRecetaForm(initialMonto: number) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [telefono, setTelefono] = useState("")
  const [monto, setMonto] = useState(String(initialMonto))
  const [estado, setEstado] = useState<Estado>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const telefonoDigits = telefono.replace(/\D/g, "")
  const puedeEnviar = !!pdfFile && telefonoDigits.length >= 10 && estado === "idle"
  const enProceso = estado === "enviando"

  const handleEnviar = async () => {
    if (!pdfFile || !telefono) return

    setEstado("enviando")
    setErrorMsg("")

    const formData = new FormData()
    formData.append("pdf", pdfFile)
    formData.append("patientPhone", telefonoDigits)
    formData.append("amount", monto)

    const result = await sendRecetaAction(formData)

    if (result.success) {
      setEstado("exito")
    } else {
      setEstado("error")
      setErrorMsg(result.error)
    }
  }

  const reset = () => {
    setPdfFile(null)
    setTelefono("")
    setMonto(String(initialMonto))
    setEstado("idle")
    setErrorMsg("")
  }

  return {
    pdfFile,
    setPdfFile,
    telefono,
    setTelefono,
    monto,
    setMonto,
    estado,
    errorMsg,
    puedeEnviar,
    enProceso,
    handleEnviar,
    reset,
  }
}
