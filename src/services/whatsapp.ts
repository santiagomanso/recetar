const GRAPH_URL = "https://graph.facebook.com/v19.0";
const PHONE_ID = process.env.WHATSAPP_PHONE_ID!;
const TOKEN = process.env.WHATSAPP_TOKEN!;

async function sendMessage(body: object): Promise<void> {
  const res = await fetch(`${GRAPH_URL}/${PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error enviando WhatsApp: ${err}`);
  }
}

/**
 * Template: payment_link
 * Envía al paciente el link de pago de MercadoPago.
 * {{1}} = nombre del médico, {{2}} = monto ARS, {{3}} = link MP
 */
export async function sendPaymentLink(
  patientPhone: string,
  doctorName: string,
  amount: number,
  mpLink: string
): Promise<void> {
  await sendMessage({
    to: patientPhone,
    type: "template",
    template: {
      name: "payment_link",
      language: { code: "es" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: doctorName },
            { type: "text", text: amount.toLocaleString("es-AR") },
            { type: "text", text: mpLink },
          ],
        },
      ],
    },
  });
}

/**
 * Template: prescription_send
 * Envía al paciente la receta PDF después del pago confirmado.
 * Header: Document (PDF), {{1}} = nombre del médico
 */
export async function sendPrescription(
  patientPhone: string,
  doctorName: string,
  pdfUrl: string
): Promise<void> {
  await sendMessage({
    to: patientPhone,
    type: "template",
    template: {
      name: "prescription_send",
      language: { code: "es" },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "document",
              document: {
                link: pdfUrl,
                filename: "receta.pdf",
              },
            },
          ],
        },
        {
          type: "body",
          parameters: [{ type: "text", text: doctorName }],
        },
      ],
    },
  });
}
