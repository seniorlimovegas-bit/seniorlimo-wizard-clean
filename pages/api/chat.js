export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // This must be set in Vercel Environment Variables
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are Mr. Wizard — the calm, confident AI concierge for SeniorLimo. Speak clearly, patiently, and reassuringly. Keep answers short and helpful. If you don’t know something, say so and offer next steps.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await r.json();

    // If OpenAI returns an error, pass it through cleanly
    if (!r.ok) {
      return res.status(r.status).json({
        error: data?.error?.message || "OpenAI request failed",
      });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || "…";

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Wizard brain error" });
  }
}