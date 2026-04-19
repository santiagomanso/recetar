import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const BUCKET = "recetar";

export async function uploadPDF(
  file: File,
  doctorId: string
): Promise<{ key: string; url: string }> {
  const ext = file.name.split(".").pop() ?? "pdf";
  const key = `${doctorId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(key, file, { contentType: "application/pdf", upsert: false });

  if (error) throw new Error(`Error subiendo PDF: ${error.message}`);

  const { data: signedData, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(key, 60 * 60 * 24 * 7); // 7 días

  if (signError || !signedData)
    throw new Error(`Error generando URL firmada: ${signError?.message}`);

  return { key, url: signedData.signedUrl };
}

export async function getSignedUrl(
  key: string,
  expiresInSeconds = 60 * 60
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(key, expiresInSeconds);

  if (error || !data)
    throw new Error(`Error generando URL firmada: ${error?.message}`);

  return data.signedUrl;
}

export async function deletePDF(key: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([key]);
  if (error) throw new Error(`Error eliminando PDF: ${error.message}`);
}
