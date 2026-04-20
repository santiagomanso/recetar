"use client"

import { useState } from "react"
import { toast } from "sonner"
import { updatePerfilAction } from "@/app/configuracion/_actions/update-perfil"

export function usePerfilForm(initial: {
  specialty?: string | null
  email: string
  telephone?: string | null
}) {
  const [specialty, setSpecialty] = useState(initial.specialty ?? "")
  const [email, setEmail] = useState(initial.email)
  const [telephone, setTelephone] = useState(initial.telephone ?? "")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSave() {
    if (!email.trim()) {
      toast.error("El email es obligatorio")
      return
    }
    setIsLoading(true)
    const result = await updatePerfilAction({
      specialty: specialty || undefined,
      email,
      telephone: telephone || undefined,
    })
    setIsLoading(false)
    if (result.success) {
      toast.success("Perfil actualizado")
    } else {
      toast.error(result.error)
    }
  }

  return { specialty, setSpecialty, email, setEmail, telephone, setTelephone, isLoading, handleSave }
}
