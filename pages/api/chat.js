// pages/api/chat.js

export default async function handler(req, res) {
  // ===== Health check =====
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/chat",
      hasKey: Boolean(process.env.OPENAI_API_KEY),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("🔥 POST /api/chat hit");

    const { message } = req.body || {};
    console.log("📨 Incoming message:", message);

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message payload" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: message,
        }),
      }
    );

    const data = await openaiResponse.json();
    console.log("🧠 OpenAI raw response:", data);

    if (!openaiResponse.ok) {
      return res.status(500).json({
        error: "OpenAI request failed",
        details: data,
      });
    }

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "No response text returned";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("💥 API crash:", err);
    return res.status(500).json({
      error: "Server crash",
      message: err.message,
    });
  }
}