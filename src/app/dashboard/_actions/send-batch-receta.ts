"use server";

import { auth } from "@/lib/auth";
import { getUserById } from "@/services/users";
import { uploadPDF } from "@/services/storage";
import { createPreference } from "@/services/mercadopago";
import { createDelivery, updateDeliveryPreferenceId } from "@/services/deliveries";
import { sendPaymentLink } from "@/services/whatsapp";

export type SendBatchRecetaState =
  | { success: true }
  | { success: false; error: string };

export async function sendBatchRecetaAction(
  formData: FormData
): Promise<SendBatchRecetaState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autenticado" };

  const user = await getUserById(session.user.id);
  if (!user) return { success: false, error: "Usuario no encontrado" };
  if (!user.mpAccessToken)
    return { success: false, error: "No tenés MercadoPago conectado" };
  if (!user.telephone)
    return { success: false, error: "Completá el onboarding primero" };

  const pdfs = formData.getAll("pdfs") as File[];
  const patientPhone = formData.get("patientPhone") as string | null;
  const amountRaw = formData.get("amount") as string | null;

  const validPdfs = pdfs.filter((f) => f.size > 0);
  if (!validPdfs.length)
    return { success: false, error: "Seleccioná al menos un PDF" };
  if (!patientPhone || patientPhone.length < 10)
    return { success: false, error: "Teléfono inválido" };
  if (!amountRaw || isNaN(Number(amountRaw)) || Number(amountRaw) <= 0)
    return { success: false, error: "Monto inválido" };

  const amount = Number(amountRaw);

  // 1. Subir todos los PDFs en paralelo
  const uploaded = await Promise.all(
    validPdfs.map((pdf) => uploadPDF(pdf, user.id))
  );

  // 2. Crear un Delivery por cada PDF
  const deliveries = await Promise.all(
    uploaded.map((u, i) =>
      createDelivery({
        doctorId: user.id,
        pdfKey: u.key,
        pdfUrl: u.url,
        pdfName: validPdfs[i].name,
        patientPhone: `54${patientPhone}`,
        amount,
      })
    )
  );

  // 3. Crear UNA preferencia MP (external_reference = id del primer delivery)
  const { preferenceId, initPoint } = await createPreference({
    doctorAccessToken: user.mpAccessToken,
    patientPhone,
    amount,
    deliveryId: deliveries[0].id,
    doctorName: user.name,
  });

  // 4. Vincular TODOS los deliveries a la misma preferencia
  await Promise.all(
    deliveries.map((d) => updateDeliveryPreferenceId(d.id, preferenceId))
  );

  // 5. Enviar UN solo WhatsApp con el link de pago
  await sendPaymentLink(
    `54${patientPhone}`,
    user.name,
    amount,
    initPoint
  );

  return { success: true };
}
