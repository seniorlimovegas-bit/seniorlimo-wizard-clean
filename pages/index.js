import { useState } from "react";

export default function Home() {
  const [active, setActive] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "wizard", text: "I am here. Ask when ready." }
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "wizard", text: data.reply || "…" }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "wizard", text: "Connection failed. Try again." }
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mr. Wizard</h1>

        {!active ? (
          <>
            <p style={styles.subtitle}>
              Calm. Aware. Waiting.
            </p>
            <button style={styles.button} onClick={() => setActive(true)}>
              Activate Mr. Wizard
            </button>
          </>
        ) : (
          <>
            <div style={styles.chat}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.message,
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    background:
                      m.role === "user" ? "#2563eb" : "#1f2937"
                  }}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div style={styles.message}>Thinking…</div>
              )}
            </div>

            <div style={styles.inputRow}>
              <input
                style={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Mr. Wizard…"
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button style={styles.send} onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at center, #0b1220, #000)"
  },
  card: {
    width: "360px",
    padding: "24px",
    borderRadius: "16px",
    background: "rgba(15,23,42,0.9)",
    boxShadow: "0 0 60px rgba(59,130,246,0.35)",
    color: "#fff"
  },
  title: {
    textAlign: "center",
    marginBottom: "8px"
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: "16px"
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },
  chat: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "300px",
    overflowY: "auto",
    marginBottom: "12px"
  },
  message: {
    padding: "8px 12px",
    borderRadius: "10px",
    maxWidth: "80%"
  },
  inputRow: {
    display: "flex",
    gap: "8px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none"
  },
  send: {
    padding: "10px 14px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }
};
