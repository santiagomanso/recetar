"use server";

import { auth } from "@/lib/auth";
import { getUserById } from "@/services/users";
import { uploadPDF } from "@/services/storage";
import { createPreference } from "@/services/mercadopago";
import { createDelivery, updateDeliveryPreferenceId } from "@/services/deliveries";
import { sendPaymentLink } from "@/services/whatsapp";

export type SendRecetaState =
  | { success: true; deliveryId: string }
  | { success: false; error: string };

export async function sendRecetaAction(
  formData: FormData
): Promise<SendRecetaState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autenticado" };

  const user = await getUserById(session.user.id);
  if (!user) return { success: false, error: "Usuario no encontrado" };
  if (!user.mpAccessToken)
    return { success: false, error: "No tenés MercadoPago conectado" };
  if (!user.telephone)
    return { success: false, error: "Completá el onboarding primero" };

  const pdfFile = formData.get("pdf") as File | null;
  const patientPhone = formData.get("patientPhone") as string | null;
  const amountRaw = formData.get("amount") as string | null;

  if (!pdfFile || pdfFile.size === 0)
    return { success: false, error: "Seleccioná un PDF" };
  if (!patientPhone || patientPhone.length < 10)
    return { success: false, error: "Teléfono inválido" };
  if (!amountRaw || isNaN(Number(amountRaw)) || Number(amountRaw) <= 0)
    return { success: false, error: "Monto inválido" };

  const amount = Number(amountRaw);
  const doctorName = user.name;

  // 1. Subir PDF a Supabase
  const { key: pdfKey, url: pdfUrl } = await uploadPDF(pdfFile, user.id);

  // 2. Crear registro Delivery en DB (sin preferenceId todavía)
  const delivery = await createDelivery({
    doctorId: user.id,
    pdfKey,
    pdfUrl,
    pdfName: pdfFile.name,
    patientPhone: `54${patientPhone}`,
    amount,
  });

  // 3. Crear preferencia MP usando el deliveryId real como external_reference
  const { preferenceId, initPoint } = await createPreference({
    doctorAccessToken: user.mpAccessToken,
    patientPhone,
    amount,
    deliveryId: delivery.id,
    doctorName,
  });

  // 4. Actualizar el Delivery con el preferenceId
  await updateDeliveryPreferenceId(delivery.id, preferenceId);

  // 5. Enviar link de pago por WhatsApp
  await sendPaymentLink(
    `54${patientPhone}`,
    doctorName,
    amount,
    initPoint
  );

  return { success: true, deliveryId: delivery.id };
}
