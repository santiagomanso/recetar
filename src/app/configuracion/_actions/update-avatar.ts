"use server"

import { auth } from "@/lib/auth"
import { uploadAvatar } from "@/services/storage"
import { updateUserImage } from "@/services/users"

export async function updateAvatarAction(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "No autenticado" }

    const file = formData.get("avatar")
    if (!(file instanceof Blob) || file.size === 0) {
      return { success: false, error: "Archivo inválido" }
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "La imagen no puede superar 5MB" }
    }

    const url = await uploadAvatar(file, session.user.id)
    await updateUserImage(session.user.id, url)
    return { success: true, url }
  } catch (err) {
    console.error("[updateAvatarAction]", err)
    return { success: false, error: err instanceof Error ? err.message : "Error subiendo la imagen" }
  }
}
