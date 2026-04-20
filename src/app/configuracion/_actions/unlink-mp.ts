"use server"

import { auth } from "@/lib/auth"
import { unlinkMercadoPago } from "@/services/users"

export async function unlinkMpAction(): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "No autenticado" }
    await unlinkMercadoPago(session.user.id)
    return { success: true }
  } catch {
    return { success: false, error: "Error al desvincular MercadoPago" }
  }
}
