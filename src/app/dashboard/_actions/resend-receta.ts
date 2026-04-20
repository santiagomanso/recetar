"use server"

import { auth } from "@/lib/auth"
import { getUserById } from "@/services/users"
import { getDeliveryById } from "@/services/deliveries"
import { sendPaymentLink } from "@/services/whatsapp"

export async function resendRecetaAction(
  deliveryId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: "No autenticado" }

    const [user, delivery] = await Promise.all([
      getUserById(session.user.id),
      getDeliveryById(deliveryId),
    ])

    if (!user) return { success: false, error: "Usuario no encontrado" }
    if (!delivery) return { success: false, error: "Receta no encontrada" }
    if (delivery.doctorId !== user.id) return { success: false, error: "Sin permiso" }
    if (!delivery.mpPreferenceId) return { success: false, error: "Sin link de pago generado" }
    if (!user.mpAccessToken) return { success: false, error: "MercadoPago no conectado" }

    const initPoint = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${delivery.mpPreferenceId}`

    await sendPaymentLink(
      delivery.patientPhone,
      user.name,
      Number(delivery.amount),
      initPoint
    )

    return { success: true }
  } catch {
    return { success: false, error: "Error al reenviar el link" }
  }
}
