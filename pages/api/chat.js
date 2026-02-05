async function sendMessage(message) {
  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await r.json().catch(() => ({}));

    // ✅ If backend returned OpenAI error, SHOW IT
    if (!r.ok) {
      const details =
        data?.details?.error?.message ||
        JSON.stringify(data?.details || data || {}, null, 2) ||
        "Unknown error";

      return `❌ API ERROR (${data?.status || r.status}): ${details}`;
    }

    return data.reply || "No reply";
  } catch (err) {
    return `❌ Network/Server exception: ${err?.message || String(err)}`;
  }
}