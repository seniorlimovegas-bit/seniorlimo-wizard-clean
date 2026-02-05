// pages/api/chat.js

export default async function handler(req, res) {
  // ---- Health check (browser-safe) ----
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/chat",
      hasKey: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    });
  }

  // ---- POST only ----
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message" });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        input: message,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({
        error: "OpenAI request failed",
        details: data,
      });
    }

    // ---- Extract text safely ----
    let reply = "";

    if (typeof data.output_text === "string") {
      reply = data.output_text;
    } else if (Array.isArray(data.output)) {
      for (const item of data.output) {
        if (Array.isArray(item.content)) {
          for (const block of item.content) {
            if (typeof block.text === "string") {
              reply += block.text;
            }
          }
        }
      }
    }

    return res.status(200).json({
      reply: reply || "No reply",
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server exception",
      message: err?.message || String(err),
    });
  }
}