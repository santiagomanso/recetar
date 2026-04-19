import { NextRequest, NextResponse } from "next/server";
import { getPaymentById } from "@/services/mercadopago";
import { getDeliveryWithDoctor, updateDeliveryStatus } from "@/services/deliveries";
import { getSignedUrl } from "@/services/storage";
import { sendPrescription } from "@/services/whatsapp";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // MP envía distintos tipos de notificaciones — solo nos interesan los pagos
  if (body.type !== "payment" || !body.data?.id) {
    return NextResponse.json({ ok: true });
  }

  const paymentId = String(body.data.id);

  try {
    // 1. Buscar la delivery usando external_reference
    // Para obtener el external_reference necesitamos buscar el pago.
    // Usamos el access token del médico — pero primero necesitamos saber quién es el médico.
    // MP incluye el topic en el query param cuando hace el POST al webhook.
    // Buscamos por el paymentId en la DB si ya lo tenemos, o buscamos con credenciales de app.

    // Alternativa robusta: MP envía merchant_order o preference_id en algunos casos.
    // Para pagos via Checkout Pro, el external_reference está en el pago.
    // Usamos nuestras credenciales de app para fetchear el pago primero.
    const appToken = await getAppToken();
    const payment = await getPaymentById(paymentId, appToken);

    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true });
    }

    const deliveryId = payment.external_reference;
    if (!deliveryId) {
      return NextResponse.json({ ok: true });
    }

    // 2. Buscar la delivery con el médico
    const delivery = await getDeliveryWithDoctor(deliveryId);
    if (!delivery || delivery.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ ok: true });
    }

    // 3. Marcar como PAID
    await updateDeliveryStatus(delivery.id, "PAID", {
      mpPaymentId: paymentId,
      paidAt: new Date(),
    });

    // 4. Generar URL firmada del PDF (válida 1 hora)
    const pdfUrl = await getSignedUrl(delivery.pdfKey, 60 * 60);

    // 5. Enviar receta por WhatsApp
    await sendPrescription(
      delivery.patientPhone,
      delivery.doctor.name,
      pdfUrl
    );

    // 6. Marcar como SENT
    await updateDeliveryStatus(delivery.id, "SENT", { sentAt: new Date() });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[MP Webhook] Error:", error);
    // Devolvemos 200 igual para que MP no reintente indefinidamente
    return NextResponse.json({ ok: true });
  }
}

async function getAppToken(): Promise<string> {
  const res = await fetch("https://api.mercadopago.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.MP_CLIENT_ID,
      client_secret: process.env.MP_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) throw new Error("No se pudo obtener app token de MP");
  const json = await res.json();
  return json.access_token;
}
