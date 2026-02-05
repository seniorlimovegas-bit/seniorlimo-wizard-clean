// pages/api/chat.js

export default async function handler(req, res) {
  // Allow POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
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
              "You are Mr. Wizard — the calm, confident AI concierge for SeniorLimo. Speak clearly, warmly, and helpfully. Short, friendly answers unless more detail is requested.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    // SAFEST possible reply extraction (covers all known formats)
    let reply =
      data?.output_text ||
      data?.output?.[0]?.content?.[0]?.text ||
      data?.output?.[0]?.content?.find(c => c.type === "output_text")?.text ||
      "Mr. Wizard is listening, but needs a moment. Please try again.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      reply: "Mr. Wizard encountered a brief issue. Please try again.",
    });
  }
}