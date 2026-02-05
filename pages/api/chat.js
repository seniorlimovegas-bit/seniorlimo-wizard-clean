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
  // Health check
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
    // Safely parse body (covers weird cases where body arrives as a string)
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};

    const message = body.message;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Invalid message payload" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    // ✅ Use the safest Responses API input format (structured)
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

    const data = await openaiResponse.json().catch(() => ({}));

    // ✅ If OpenAI returns an error, send it back to the UI so we can see it
    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json({
        error: "OpenAI error",
        status: openaiResponse.status,
        details: data,
      });
    }

    const reply = extractOutputText(data) || "No response";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      error: "Server exception",
      message: err?.message || String(err),
    });
  }
}