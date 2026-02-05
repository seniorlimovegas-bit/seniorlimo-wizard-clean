// pages/api/chat.js

export default async function handler(req, res) {
  // Allow POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You are Mr. Wizard — the calm, confident AI concierge for SeniorLimo. Speak clearly, warmly, and in short helpful responses. If asked about SeniorLimo or Gold Deals, explain simply and invite a follow-up question.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    // If OpenAI returns an error, pass it back clearly
    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({
        error: "OpenAI request failed",
        status: response.status,
        details: errText,
      });
    }

    const data = await response.json();

    // Safest extraction for Responses API text output
    const reply =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.output_text ||
      "Mr. Wizard is awake, but I didn’t catch that. Please try again.";

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err?.message || String(err),
    });
  }
}