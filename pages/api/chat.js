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
  // ===== Health check (browser-safe) =====
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/chat",
      hasKey: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    });
  }

  // ===== POST only =====
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Safely parse body (Next can give object OR string)
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

    const message = body?.message;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Missing message" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not set in Vercel env vars" });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: message,
      }),
    });

    // IMPORTANT: capture text FIRST so we can show real errors
    const rawText = await openaiRes.text();
    let data = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      data = { raw: rawText };
    }

    // If OpenAI returns error, pass it through verbatim
    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({
        error: "OpenAI error",
        status: openaiRes.status,
        details: data,
      });
    }

    const reply = extractOutputText(data) || "No reply text returned";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      error: "Server exception",
      details: String(err?.message || err),
    });
  }
}