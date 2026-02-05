"use client";
import { useState } from "react";

export default function Home() {
  const [active, setActive] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "wizard", text: "I am here. Click Activate to begin." },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg =
          data?.error ||
          `Server error (${res.status}). Check Cloudflare Functions logs.`;
        setMessages((prev) => [...prev, { role: "wizard", text: errMsg }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "wizard", text: data.reply || "(No reply returned.)" },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "wizard", text: "Network error. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.title}>Mr. Wizard</div>
        <div style={styles.subtitle}>
          Your AI-powered concierge, guide, and assistant.
          <br />
          Calm. Aware. Waiting.
        </div>

        {!active ? (
          <>
            <div style={styles.status}>IDLE • LISTENING FOR ACTIVATION</div>
            <button
              style={styles.button}
              onClick={() => {
                setActive(true);
                setMessages((prev) => [
                  ...prev,
                  { role: "wizard", text: "Mr. Wizard is awake. Ask me anything." },
                ]);
              }}
            >
              Activate Mr. Wizard
            </button>
          </>
        ) : (
          <>
            <div style={styles.status}>ACTIVE • READY</div>

            <div style={styles.chatBox}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.bubble,
                    ...(m.role === "user" ? styles.userBubble : styles.wizardBubble),
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div style={styles.row}>
              <input
                style={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your question…"
                disabled={loading}
              />
              <button style={styles.send} onClick={sendMessage} disabled={loading}>
                {loading ? "…" : "Send"}
              </button>
            </div>
          </>
        )}

        <div style={styles.footer}>© 2026 Mr. Wizard • All Rights Reserved</div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at center, rgba(30,60,120,0.45), rgba(0,0,0,0.92))",
    padding: 20,
  },
  card: {
    width: "min(520px, 92vw)",
    background: "rgba(10,20,40,0.72)",
    border: "1px solid rgba(120,170,255,0.25)",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 0 70px rgba(90,150,255,0.25)",
    backdropFilter: "blur(10px)",
    color: "#e9f1ff",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },
  title: { fontSize: 34, fontWeight: 800, textAlign: "center" },
  subtitle: {
    opacity: 0.85,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 1.3,
  },
  status: {
    textAlign: "center",
    marginTop: 16,
    letterSpacing: 1.2,
    opacity: 0.75,
    fontSize: 12,
  },
  button: {
    width: "100%",
    marginTop: 14,
    padding: "14px 16px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(180deg, #4a77ff, #2f55ff)",
    color: "white",
    fontSize: 16,
    fontWeight: 700,
  },
  chatBox: {
    marginTop: 16,
    padding: 12,
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(120,170,255,0.18)",
    borderRadius: 12,
    height: 260,
    overflowY: "auto",
  },
  bubble: {
    padding: "10px 12px",
    borderRadius: 12,
    marginBottom: 10,
    whiteSpace: "pre-wrap",
    lineHeight: 1.3,
  },
  wizardBubble: {
    background: "rgba(90,150,255,0.18)",
    border: "1px solid rgba(90,150,255,0.22)",
  },
  userBubble: {
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
  },
  row: { display: "flex", gap: 10, marginTop: 12 },
  input: {
    flex: 1,
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(120,170,255,0.25)",
    background: "rgba(0,0,0,0.22)",
    color: "#e9f1ff",
    outline: "none",
  },
  send: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    background: "rgba(90,150,255,0.9)",
    color: "white",
    fontWeight: 800,
  },
  footer: { opacity: 0.6, marginTop: 14, textAlign: "center", fontSize: 12 },
};
