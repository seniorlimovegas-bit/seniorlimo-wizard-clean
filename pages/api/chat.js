 // pages/api/chat.js

export default async function handler(req, res) {
  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/chat",
      hasKey: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message" });
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        input: message,
      }),
    });

    const data = await r.json();

    // HARD ERROR FROM OPENAI → RETURN IT VERBATIM
    if (!r.ok) {
      return res.status(r.status).json({
        error: "OpenAI error",
        details: data,
      });
    }

    // Extract text safely
    let reply = "";

    if (typeof data.output_text === "string") {
      reply = data.output_text;
    } else if (Array.isArray(data.output)) {
      for (const item of data.output) {
        for (const block of item.content || []) {
          if (typeof block.text === "string") {
            reply += block.text + "\n";
          }
        }
      }
    }

    reply = reply.trim();

    if (!reply) {
      return res.status(500).json({
        error: "No text returned from OpenAI",
        raw: data,
      });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      error: "Server exception",
      message: err.message,
    });
  }
}