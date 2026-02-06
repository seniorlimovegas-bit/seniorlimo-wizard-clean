"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [active, setActive] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "wizard", text: "I am here. Click Activate to begin." },
  ]);
  const [loading, setLoading] = useState(false);

  // ---- Speech / Voice ----
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const synthRef = useRef(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) return;

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      try {
        voicesRef.current = window.speechSynthesis.getVoices() || [];
      } catch (e) {
        // ignore
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      try {
        window.speechSynthesis.onvoiceschanged = null;
      } catch (e) {
        // ignore
      }
    };
  }, []);

  function pickVoice() {
    const voices = voicesRef.current || [];
    if (!voices.length) return null;

    // Prefer English voices
    const en = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
    const pool = en.length ? en : voices;

    // Prefer Siri-ish / enhanced voices if present
    const preferred = pool.find((v) =>
      /siri|enhanced|premium|natural/i.test(v.name || "")
    );
    return preferred || pool[0] || null;
  }

  function speak(text) {
    if (!voiceEnabled) return;
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) return;

    try {
      const synth = window.speechSynthesis;
      const utter = new SpeechSynthesisUtterance(text);

      const v = pickVoice();
      if (v) utter.voice = v;

      utter.rate = 0.95;
      utter.pitch = 1.0;

      synth.cancel();
      synth.speak(utter);
    } catch (e) {
      // If speech fails, we just fall back to text
      console.log("Speech error:", e);
    }
  }

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

      // Accept several possible shapes so we don’t break:
      const reply =
        data.reply ||
        data.text ||
        data.message ||
        (data.output && data.output[0] && data.output[0].content && data.output[0].content[0] && data.output[0].content[0].text) ||
        "I received your message, but I did not get a reply back.";

      setMessages((prev) => [...prev, { role: "wizard", text: reply }]);

      // Speak Wizard reply (works AFTER Activate unlock)
      speak(reply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "wizard", text: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  // IMPORTANT: iOS requires speech to be triggered inside a user click.
  function handleActivateClick() {
    setActive(true);

    // This line "unlocks" speech on iPhone/iPad for the session:
    speak("Hello. I am Mr. Wizard. How may I help you today?");
  }

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 48, margin: "10px 0 20px" }}>SeniorLimo – Mr. Wizard</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <button onClick={handleActivateClick} disabled={active} style={{ padding: "6px 12px" }}>
          {active ? "Activated" : "Activate"}
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: 8, userSelect: "none" }}>
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(e) => setVoiceEnabled(e.target.checked)}
          />
          Voice
        </label>
      </div>

      <div style={{ marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{m.role === "wizard" ? "Wizard" : "You"}:</b> {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, maxWidth: 700 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={active ? "Type your message..." : "Click Activate first..."}
          disabled={!active || loading}
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button
          onClick={sendMessage}
          disabled={!active || loading || !input.trim()}
          style={{ padding: "10px 14px" }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
