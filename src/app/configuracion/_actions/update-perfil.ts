"use server"

import { auth } from "@/lib/auth"
import { updateUserProfile } from "@/services/users"

export async function updatePerfilAction(data: {
  specialty?: string
  email: string
  telephone?: string
}): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "No autenticado" }
    await updateUserProfile(session.user.id, data)
    return { success: true }
  } catch {
    return { success: false, error: "Error al guardar el perfil" }
  }
}
