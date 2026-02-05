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
      // Common shapes: { type: "output_text", text: "..." }
      if (typeof block?.text === "string") parts.push(block.text);
      // Sometimes nested: { type: "...", text: { value: "..." } }
      else if (typeof block?.text?.value === "string") parts.push(block.text.value);
    }
  }

  return parts.join("\n").trim();
}

export default async function handler(req, res) {
  // Health check (safe in browser)
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/chat",
      hasKey: Boolean(process.env.OPENAI_API_KEY),
    });
  }

  // POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Safely parse body
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

    // Call OpenAI Responses API (correct input format)
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [{ type: "input_text", text: message }],
          },
        ],
      }),
    });

    // If OpenAI returns an error, surface it clearly
    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.log("❌ OpenAI error status:", openaiResponse.status);
      console.log("❌ OpenAI error body:", errText);
      return res.status(502).json({
        error: "OpenAI API error",
        status: openaiResponse.status,
        details: errText,
      });
    }

    const data = await openaiResponse.json();
    console.log("✅ OpenAI response:", JSON.stringify(data, null, 2));

    const reply = extractOutputText(data) || "No response text returned.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.log("🔥 Server exception:", err);
    return res.status(500).json({
      error: "Server error",
      details: err?.message || String(err),
    });
  }
}