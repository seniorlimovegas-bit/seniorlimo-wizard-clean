"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "⚠️ Wizard signal disrupted." },
      ]);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1b2a4e, #050914)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: 420,
          padding: 24,
          borderRadius: 20,
          background: "rgba(10,20,60,0.6)",
          boxShadow: "0 0 40px rgba(80,120,255,0.4)",
          textAlign: "center",
        }}
      >
        {/* Crystal Ball */}
        <div
          style={{
            width: 180,
            height: 180,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 30%, #b7e7ff, #3b6cff, #0a1030)",
            boxShadow:
              "0 0 60px rgba(120,180,255,0.9), inset 0 0 40px rgba(255,255,255,0.4)",
          }}
        />

        <h1 style={{ marginBottom: 6 }}>Mr. Wizard</h1>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
          Calm. Aware. Waiting.
        </div>

        {/* Chat */}
        <div
          style={{
            minHeight: 160,
            maxHeight: 200,
            overflowY: "auto",
            textAlign: "left",
            marginBottom: 12,
          }}
        >
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong>
                {m.role === "user" ? "You" : "Mr. Wizard"}:
              </strong>{" "}
              {m.text}
            </div>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Speak to the Wizard…"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "none",
            marginBottom: 10,
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 30,
            border: "none",
            fontWeight: "bold",
            background:
              "linear-gradient(135deg, #4f7cff, #7aa2ff)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Activate Mr. Wizard
        </button>

        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 10 }}>
          © 2026 Mr. Wizard
        </div>
      </div>
    </div>
  );
}
