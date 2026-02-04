export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const message = body?.message?.trim();

    if (!message) {
      return new Response(JSON.stringify({ reply: "No message provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5",
        input: message
      })
    });

    const data = await r.json();

    const text =
      data?.output?.[0]?.content?.find(c => c.type === "output_text")?.text
      || "No response from model.";

    return new Response(JSON.stringify({ reply: text }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      reply: "Server error",
      error: String(err)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
