// pages/api/chat.js

export default async function handler(req, res) {
  // Allow POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    // Validate input
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Make sure the key exists in the server environment (NOT on the client)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY in environment variables",
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        // Put the “system” persona in instructions (cleanest for Responses API)
        instructions:
          "You are Mr. Wizard — the calm, confident AI concierge for SeniorLimo. Speak clearly, warmly, and patiently. Keep answers helpful and easy to understand.",
        input: message,
        max_output_tokens: 250,
      }),
    });

    // If OpenAI returns an error, pass it back clearly
    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", response.status, errText);
      return res.status(response.status).json({
        error: "OpenAI request failed",
        details: errText,
      });
    }

    const data = await response.json();

    // Best-effort extraction across response shapes
    const reply =
      data.output_text ||
      (Array.isArray(data.output) &&
        data.output
          .flatMap((item) => item?.content || [])
          .map((c) => c?.text)
          .filter(Boolean)
          .join("\n")) ||
      "Sorry — I didn’t get a response.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Server error",
      details: err?.message || String(err),
    });
  }
}