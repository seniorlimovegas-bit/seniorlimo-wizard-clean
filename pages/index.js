"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [active, setActive] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "wizard", text: "I am here. Click Activate to begin." }
  ]);
  const [loading, setLoading] = useState(false);

  // ---- Voice / Speech ----
  const [ttsReady, setTtsReady] = useState(false);
  const voicesRef = useRef([]);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        voicesRef.current = voices;
        setTtsReady(true);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  function speak(text) {
    if (!synthRef.current || !ttsReady) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = voicesRef.current;

    const preferred =
      voices.find(v => v.name.toLowerCase().includes("google")) ||
      voices.find(v => v.lang.startsWith("en")) ||
      voices[0];

    if (preferred) utterance.voice = preferred;

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    synthRef.current.speak(utterance);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      const reply = data.reply || "I am thinking… please try again.";

      setMessages(prev => [...prev, { role: "wizard", text: reply }]);
      speak(reply);
    } catch (err) {
      const errorMsg = "Something went wrong. Please try again.";
      setMessages(prev => [...prev, { role: "wizard", text: errorMsg }]);
      speak(errorMsg);
    }

    setLoading(false);
  }

  function activateWizard() {
    setActive(true);
    const greeting = "Hello. I am Mr. Wizard. How may I help you today?";
    setMessages([{ role: "wizard", text: greeting }]);
    speak(greeting);
  }

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>SeniorLimo – Mr. Wizard</h1>

      {!active && (
        <button onClick={activateWizard}>
          Activate
        </button>
      )}

      <div style={{ marginTop: 20, minHeight: 300 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{m.role === "wizard" ? "Wizard" : "You"}:</strong>{" "}
            {m.text}
          </div>
        ))}
      </div>

      {active && (
        <div style={{ marginTop: 20 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask Mr. Wizard…"
            style={{ width: "70%", padding: 8 }}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Thinking…" : "Send"}
          </button>
        </div>
      )}
    </main>
  );
}
