// pages/api/chat.js

export default async function handler(req, res) {
  // QUICK HEALTH CHECK (temporary)
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/chat",
      hasKey: Boolean(process.env.OPENAI_API_KEY),
    });
  }

  // Allow POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ... keep your existing POST code below ...
}