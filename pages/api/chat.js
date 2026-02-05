// pages/api/chat.js

export default async function handler(req, res) {
  // --- Health check (browser-safe) ---
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/chat",
      hasKey: Boolean(process.env.OPENAI_API_KEY),
    });
  }

  // --- POST only ---
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Next.js usually parses JSON automatically if Content-Type is application/json
    // But this keeps it safe if anything comes in as a string.
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    const message = body.message;

    // Validate input
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Invalid message payload" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    // Call OpenAI Responses API
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message,
      }),
    });

    // If OpenAI returned an error, forward the real details to the browser
    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text(); // raw body for debugging
      console.error("OpenAI error status:", openaiResponse.status, errText);
      return res.status(openaiResponse.status).json({
        error: "OpenAI request failed",
        details: errText,
      });
    }

    const data = await openaiResponse.json();

    // Robust reply extraction (covers common response shapes)
    const reply =
      data.output_text ||
      data?.output?.[0]?.content?.find((c) => c.type === "output_text")?.text ||
      data?.output?.[0]?.content?.[0]?.text ||
      "No response";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Server error",
      details: String(err?.message || err),
    });
  }
}