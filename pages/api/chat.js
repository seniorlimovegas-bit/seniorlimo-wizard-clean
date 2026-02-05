const openaiResponse = await fetch(
  "https://api.openai.com/v1/responses",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: message,
    }),
  }
);

const data = await openaiResponse.json();

console.log("🧠 OpenAI raw response:", data);

const reply =
  data.output_text ||
  data.output?.[0]?.content?.[0]?.text ||
  "No response";

return res.status(200).json({ reply });