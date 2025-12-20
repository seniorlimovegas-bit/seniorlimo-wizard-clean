export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body || {};

  return res.status(200).json({
    reply: `Mr. Wizard received: ${message || "no message sent"}`,
  });
}