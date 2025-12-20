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

      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply || "No reply" },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "API error" },
      ]);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>🧙‍♂️ Mr. Wizard</h1>
      <p>Simple test interface</p>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 12,
          minHeight: 200,
          marginBottom: 12,
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{m.role === "user" ? "You" : "Mr. Wizard"}:</strong>{" "}
            {m.text}
          </div>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 10 }}
        placeholder="Type your message..."
      />

      <button
        onClick={sendMessage}
        style={{ marginTop: 10, padding: "10px 16px" }}
      >
        Send
      </button>
    </div>
  );
}