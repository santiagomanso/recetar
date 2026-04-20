import { NextRequest, NextResponse } from "next/server";
import { getPaymentById } from "@/services/mercadopago";
import { getDeliveryWithDoctor, updateDeliveryStatus } from "@/services/deliveries";
import { getUserByMpUserId } from "@/services/users";
import { getSignedUrl } from "@/services/storage";
import { sendPrescription } from "@/services/whatsapp";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // MP envía distintos tipos de notificaciones — solo nos interesan los pagos
  if (body.type !== "payment" || !body.data?.id) {
    return NextResponse.json({ ok: true });
  }

  const paymentId = String(body.data.id);
  // MP incluye el mpUserId del vendedor en el webhook
  const mpUserId = body.user_id ? String(body.user_id) : null;

  try {
    // 1. Buscar el médico por mpUserId para usar su access token
    let accessToken: string;

    if (mpUserId) {
      const doctor = await getUserByMpUserId(mpUserId);
      if (!doctor?.mpAccessToken) {
        console.error("[MP Webhook] No se encontró médico con mpUserId:", mpUserId);
        return NextResponse.json({ ok: true });
      }
      accessToken = doctor.mpAccessToken;
    } else {
      // Fallback: app token (puede no funcionar para marketplace)
      accessToken = await getAppToken();
    }

    // 2. Obtener el pago con el access token del médico
    const payment = await getPaymentById(paymentId, accessToken);

    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true });
    }

    const deliveryId = payment.external_reference;
    if (!deliveryId) {
      console.error("[MP Webhook] Pago sin external_reference:", paymentId);
      return NextResponse.json({ ok: true });
    }

    // 3. Buscar la delivery con el médico
    const delivery = await getDeliveryWithDoctor(deliveryId);
    if (!delivery || delivery.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ ok: true });
    }

    // 4. Marcar como PAID
    await updateDeliveryStatus(delivery.id, "PAID", {
      mpPaymentId: paymentId,
      paidAt: new Date(),
    });

    // 5. Generar URL firmada del PDF (válida 1 hora)
    const pdfUrl = await getSignedUrl(delivery.pdfKey, 60 * 60);

    // 6. Enviar receta por WhatsApp
    await sendPrescription(
      delivery.patientPhone,
      delivery.doctor.name,
      pdfUrl
    );

    // 7. Marcar como SENT
    await updateDeliveryStatus(delivery.id, "SENT", { sentAt: new Date() });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[MP Webhook] Error:", error);
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
