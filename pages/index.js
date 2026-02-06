"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [active, setActive] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "wizard", text: "I am here. Click Activate to begin." },
  ]);
  const [loading, setLoading] = useState(false);

  // --- Voice / Speech ---
  const [ttsReady, setTtsReady] = useState(false);
  const voicesRef = useRef([]);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      try {
        voicesRef.current = window.speechSynthesis.getVoices() || [];
      } catch (e) {
        // ignore
      }
    };

    loadVoices();
    // Some browsers (especially iOS) load voices asynchronously
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  function pickVoice() {
    const voices = voicesRef.current || [];
    if (!voices.length) return null;

    // Prefer an English voice; prefer US if available
    const preferred =
      voices.find((v) => /en-US/i.test(v.lang)) ||
      voices.find((v) => /^en/i.test(v.lang)) ||
      voices[0];

    return preferred || null;
  }

  function speak(text) {
    if (!text) return;
    if (typeof window === "undefined") return;

    const synth = synthRef.current || window.speechSynthesis;
    if (!synth) return;

    // iOS Safari often requires a user gesture first (we do that on Activate)
    if (!ttsReady) return;

    try {
      // Stop any previous speaking
      synth.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      const voice = pickVoice();
      if (voice) utter.voice = voice;

      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.volume = 1.0;

      synth.speak(utter);
    } catch (e) {
      // If speech fails, we still keep the text chat working
      console.error("Speech error:", e);
    }
  }

  // This "unlocks" speech on iOS/iPadOS by speaking a silent/short utterance
  function unlockSpeech() {
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0; // silent unlock
      synth.speak(u);
      setTtsReady(true);
    } catch (e) {
      // Still set ready; some devices don’t like volume=0
      setTtsReady(true);
    }
  }

  function extractReply(data) {
    // Handles different common response shapes without you having to re-edit later
    if (!data) return "";

    // Your likely format:
    if (typeof data.reply === "string") return data.reply;

    // Other common formats:
    if (typeof data.text === "string") return data.text;
    if (typeof data.message === "string") return data.message;
    if (typeof data.output_text === "string") return data.output_text;

    // Sometimes nested:
    if (data.output && typeof data.output === "string") return data.output;
    if (data.result && typeof data.result === "string") return data.result;

    // If OpenAI raw-ish shapes accidentally come back:
    if (Array.isArray(data.output)) {
      // Try to find any text parts
      for (const item of data.output) {
        if (item && typeof item === "object") {
          if (typeof item.text === "string") return item.text;
          if (Array.isArray(item.content)) {
            const txt = item.content
              .map((c) => (typeof c?.text === "string" ? c.text : ""))
              .join("")
              .trim();
            if (txt) return txt;
          }
        }
      }
    }

    return "";
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

      let reply = extractReply(data);

      if (!reply) {
        // fallback if server returned something unexpected
        reply =
          (res.ok
            ? ""
            : `Server error (${res.status}). Check /api/chat output.`) ||
          "Sorry — I didn’t get a reply. Try again.";
      }

      setMessages((prev) => [...prev, { role: "wizard", text: reply }]);

      // 🔊 SPEAK IT
      speak(reply);
    } catch (err) {
      console.error(err);
      const reply = "Network error. Please try again.";
      setMessages((prev) => [...prev, { role: "wizard", text: reply }]);
      speak(reply);
    } finally {
      setLoading(false);
    }
  }

  function onActivate() {
    setActive(true);

    // Unlock speech on user gesture (this is the iPad/iPhone requirement)
    unlockSpeech();

    // Optional: speak a quick greeting
    speak("Hello. Mr. Wizard is online.");
  }

  function onKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mr. Wizard</h1>

        {!active ? (
          <button style={styles.activateBtn} onClick={onActivate}>
            Activate
          </button>
        ) : (
          <>
            <div style={styles.chatBox}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.msg,
                    ...(m.role === "user" ? styles.userMsg : styles.wizardMsg),
                  }}
                >
                  <div style={styles.roleLabel}>
                    {m.role === "user" ? "You" : "Wizard"}
                  </div>
                  <div style={styles.msgText}>{m.text}</div>
                </div>
              ))}
            </div>

            <div style={styles.inputRow}>
              <input
                style={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message…"
                disabled={loading}
              />
              <button
                style={{
                  ...styles.sendBtn,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onClick={sendMessage}
                disabled={loading}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>

            <div style={styles.footerRow}>
              <button
                style={styles.smallBtn}
                onClick={() => {
                  // Manual voice re-unlock (sometimes useful on iOS)
                  unlockSpeech();
                  speak("Voice is ready.");
                }}
              >
                Test Voice
              </button>

              <button
                style={styles.smallBtn}
                onClick={() => {
                  if (typeof window !== "undefined" && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }}
              >
                Stop Voice
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
    background: "#f5f5f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  title: { margin: "0 0 12px 0", fontSize: 28 },
  activateBtn: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "none",
    fontSize: 18,
    fontWeight: 700,
    background: "#111",
    color: "#fff",
  },
  chatBox: {
    height: 420,
    overflowY: "auto",
    padding: 12,
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    background: "#fafafa",
    marginBottom: 12,
  },
  msg: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    border: "1px solid #e9e9e9",
  },
  userMsg: { background: "#fff" },
  wizardMsg: { background: "#f0f7ff" },
  roleLabel: { fontSize: 12, opacity: 0.65, marginBottom: 6 },
  msgText: { fontSize: 16, lineHeight: 1.35 },
  inputRow: { display: "flex", gap: 10 },
  input: {
    flex: 1,
    padding: "12px 12px",
    fontSize: 16,
    borderRadius: 12,
    border: "1px solid #dcdcdc",
    outline: "none",
  },
  sendBtn: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    fontWeight: 700,
    background: "#2563eb",
    color: "#fff",
  },
  footerRow: { display: "flex", gap: 10, marginTop: 12 },
  smallBtn: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #dcdcdc",
    background: "#fff",
    fontWeight: 700,
  },
};
