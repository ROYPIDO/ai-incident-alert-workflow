import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Ayarları
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { text, source } = req.body || {};

  try {
    // Vercel Environment Variables'dan n8n URL'ini al
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) throw new Error("N8N_WEBHOOK_URL eksik!");

    // n8n'e isteği ilet
    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source: source || "ui" }),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("Hata:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}