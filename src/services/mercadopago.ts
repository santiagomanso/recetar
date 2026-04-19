export async function getPaymentById(
  paymentId: string,
  accessToken: string,
): Promise<{ status: string; external_reference: string; id: string }> {
  const res = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error obteniendo pago MP: ${err}`);
  }

  return res.json();
}

export async function createPreference(data: {
  doctorAccessToken: string;
  patientPhone: string;
  amount: number;
  deliveryId: string;
  doctorName: string;
}): Promise<{ preferenceId: string; initPoint: string }> {
  const webhookUrl = `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago`;

  const body = {
    items: [
      {
        title: "Receta médica digital",
        quantity: 1,
        unit_price: data.amount,
        currency_id: "ARS",
        picture_url:
          "https://rfrourjyxelbojxhlupl.supabase.co/storage/v1/object/sign/recetar/assets/Steto.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MGUwMDdkZS0xODBiLTQ1NTktODVjYS02Y2E3NWFmNDUxMzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWNldGFyL2Fzc2V0cy9TdGV0by5wbmciLCJpYXQiOjE3NzY2MjgzNTIsImV4cCI6MTc3NzIzMzE1Mn0.tm8NWfHuMVSgBAZvWctm6y7tdgdZ0gZuZQOLY4jI5RM",
      },
    ],
    external_reference: data.deliveryId,
    notification_url: webhookUrl,
    statement_descriptor: data.doctorName,
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.doctorAccessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error creando preferencia MP: ${err}`);
  }

  const json = await res.json();
  return { preferenceId: json.id, initPoint: json.init_point };
}
