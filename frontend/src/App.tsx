import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS Ayarları (Frontend'in erişebilmesi için)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Frontend'den gelen veri: { text: "...", source: "ui" }
  const { text, source } = req.body || {};

  if (!text) {
    return res.status(400).json({ error: "Missing text field" });
  }

  try {
    // N8N Cloud Webhook URL'ini Environment Variable'dan alıyoruz
    const n8nUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nUrl) {
      throw new Error("N8N_WEBHOOK_URL is not defined in Vercel Environment Variables");
    }

    // n8n Cloud'a isteği iletiyoruz
    const n8nResponse = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        source: source || "ui"
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      throw new Error(`n8n Error: ${n8nResponse.status} - ${errorText}`);
    }

    // n8n'den dönen cevabı al (Success, Category, Severity vs.)
    const data = await n8nResponse.json();

    // Frontend'e cevabı dön
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("Workflow Error:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    });
  }
}