import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { title, severity, source, message } = req.body || {};

  if (!title || !severity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("INCIDENT RECEIVED:", {
    title,
    severity,
    source,
    message,
  });

  return res.status(200).json({ status: "ok" });
}