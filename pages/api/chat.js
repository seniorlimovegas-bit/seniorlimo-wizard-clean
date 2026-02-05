// pages/api/chat.js

function extractOutputText(data) {
  // Best-case: Responses API provides output_text
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  // Fallback: walk output blocks
  const out = data?.output;
  if (!Array.isArray(out)) return "";

  const parts = [];
  for (const item of out) {
    const content = item?.content;
    if (!Array.isArray(content)) continue;

    for (const block of content) {
      if (typeof block?.text === "string") parts.push(block.text);
      else if (typeof block?.text?.value === "string") parts.push(block.text.value);
    }
  }

  return parts.join("\n").trim();
}

export default async function handler(req, res) {
  // Health check (browser-safe)
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/chat",
      hasKey: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    });
  }

  // POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY in environment" });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        input: [
          {
            role: "system",
            content:
              "You are Mr. Wizard, a calm, friendly AI-powered concierge for SeniorLimo. Keep replies helpful, short, and clear.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await openaiRes.json();

    // If OpenAI returned an error, return it cleanly
    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({
        error: "OpenAI request failed",
        details: data,
      });
    }

    const reply = extractOutputText(data) || "No reply";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      error: "Server exception",
      details: err?.message || String(err),
    });
  }
}