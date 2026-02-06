// pages/api/chat.js
import { MWAI_CONFIG } from "../mwai-config";

/**
 * Extract best-effort plain text from OpenAI Responses API response.
 * Handles both data.output_text and structured output blocks.
 */
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
      else if (typeof block?.content === "string") parts.push(block.content);
    }
  }

  return parts.join("\n").trim();
}

/**
 * Build a system prompt from MWAI_CONFIG.
 * This is the "template brain" — swap config, not code.
 */
function buildSystemPrompt(cfg) {
  const platformName = cfg?.platformName || "MWAI Concierge";
  const businessName = cfg?.businessName || "this business";
  const tagline = cfg?.tagline ? `Tagline: ${cfg.tagline}` : "";

  const lines = [];
  lines.push(`You are ${platformName}, an on-site AI concierge for ${businessName}.`);
  if (tagline) lines.push(tagline);
  lines.push("");
  lines.push("STYLE:");
  lines.push("- Calm, clear, practical. Senior-friendly where appropriate.");
  lines.push("- Be concise by default; expand only if asked.");
  lines.push("- Use facts, process, and real-world outcomes. Avoid ranting.");
  lines.push("");
  lines.push("GUARDRAILS:");
  lines.push("- Do not promise outcomes or guarantees.");
  lines.push("- Do not give legal/medical/financial advice; give general info and suggest consulting a professional when needed.");
  lines.push("- No competitor bashing. No inflammatory language.");
  lines.push("- If user asks something outside scope, say what you can do and offer a safe next step.");
  lines.push("");

  // Pillars (optional)
  if (cfg?.pillars && typeof cfg.pillars === "object") {
    lines.push("CORE PILLARS (use these themes in answers):");
    for (const key of Object.keys(cfg.pillars)) {
      const p = cfg.pillars[key];
      if (!p) continue;
      const title = p.title || key;
      const bullets = Array.isArray(p.bullets) ? p.bullets.join(" ") : "";
      lines.push(`- ${title}: ${bullets}`.trim());
    }
    lines.push("");
  }

  // Outcomes example (optional)
  if (Array.isArray(cfg?.outcomes) && cfg.outcomes.length > 0) {
    const ex = cfg.outcomes[0];
    if (ex?.issue || ex?.context || ex?.approach || ex?.result) {
      lines.push("TRANSPARENCY EXAMPLE (use only when relevant):");
      if (ex.issue) lines.push(`Issue: ${ex.issue}`);
      if (ex.context) lines.push(`Context: ${ex.context}`);
      if (ex.approach) lines.push(`Approach: ${ex.approach}`);
      if (ex.result) lines.push(`Result: ${ex.result}`);
      lines.push("");
    }
  }

  // MWAI method Q&A (optional)
  if (cfg?.mwaiMethodQnA?.question && cfg?.mwaiMethodQnA?.answer) {
    lines.push("IF ASKED ABOUT MWAI ITSELF, ANSWER LIKE THIS:");
    lines.push(`Q: ${cfg.mwaiMethodQnA.question}`);
    lines.push(`A: ${cfg.mwaiMethodQnA.answer}`);
    lines.push("");
  }

  // Make sure we always ground responses in the business name
  lines.push(`Always answer as ${platformName} for ${businessName}.`);

  return lines.join("\n");
}

/**
 * Normalize inbound payloads from different frontends:
 * - { messages: [{role, content}, ...] }
 * - { message: "..." }
 * - { prompt: "..." }
 */
function normalizeMessages(body) {
  const msgs = [];

  // 1) Preferred: messages array
  if (Array.isArray(body?.messages)) {
    for (const m of body.messages) {
      if (!m) continue;
      const role = m.role === "assistant" || m.role === "system" ? m.role : "user";
      const content =
        typeof m.content === "string"
          ? m.content
          : typeof m?.content?.text === "string"
            ? m.content.text
            : typeof m?.text === "string"
              ? m.text
              : "";
      if (content.trim()) msgs.push({ role, content: content.trim() });
    }
  }

  // 2) Single message
  if (msgs.length === 0) {
    const single =
      (typeof body?.message === "string" && body.message) ||
      (typeof body?.prompt === "string" && body.prompt) ||
      "";
    if (single.trim()) msgs.push({ role: "user", content: single.trim() });
  }

  return msgs;
}

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY env var" });
    }

    const cfg = MWAI_CONFIG;
    const systemPrompt = buildSystemPrompt(cfg);

    const messages = normalizeMessages(req.body);
    if (!messages.length) {
      return res.status(400).json({ error: "No messages provided" });
    }

    // Build Responses API input as role/content messages
    const input = [{ role: "system", content: systemPrompt }, ...messages];

    // You can change model later; keep stable for now.
    const payload = {
      model: "gpt-4o-mini",
      input,
      // Keep it deterministic-ish for concierge answers
      temperature: 0.4
    };

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();

    if (!r.ok) {
      // Return OpenAI error details for debugging
      return res.status(r.status).json({
        error: "OpenAI request failed",
        details: data
      });
    }

    const text = extractOutputText(data) || "";

    return res.status(200).json({
      text,
      // keep raw for debugging (you can remove later)
      raw: data
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: String(err?.message || err)
    });
  }
}
