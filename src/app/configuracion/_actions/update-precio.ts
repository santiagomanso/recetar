"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { upsertDefaultAmount } from "@/services/users"

export async function updatePrecioAction(
  amount: number
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "No autenticado" }
    if (isNaN(amount) || amount < 0) return { success: false, error: "Monto inválido" }
    await upsertDefaultAmount(session.user.id, amount)
    revalidatePath("/dashboard")
    return { success: true }
  } catch {
    return { success: false, error: "Error al guardar el precio" }
  }
}
