"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState([
    { role: "wizard", text: "I am here. Tap the crystal to begin." },
  ]);

  // ----- Voice -----
  const synthRef = useRef(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) return;

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const preferred = voicesRef.current.find(v =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("samantha") ||
      v.name.toLowerCase().includes("zira")
    );

    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    synthRef.current.speak(utterance);
  };

  const handleActivateClick = () => {
    if (active) return;

    setActive(true);
    const greeting = "Greetings. I am Mr. Wizard. Ask me anything.";
    setMessages(m => [...m, { role: "wizard", text: greeting }]);
    speak(greeting);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b1c2d, #05080f)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <h1 style={{ marginBottom: 20 }}>SeniorLimo – Mr. Wizard</h1>

      {/* Crystal Ball Area */}
      <div style={{ position: "relative", width: 320, height: 420 }}>
        {/* Mystic Fog */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            height: 120,
            background:
              "radial-gradient(circle, rgba(200,220,255,0.35), transparent 70%)",
            filter: "blur(18px)",
            animation: "fog 6s ease-in-out infinite",
            zIndex: 1,
          }}
        />

        {/* Crystal Ball Image */}
        <img
          src="/crystal-ball.png"
          alt="Crystal Ball"
          style={{
            width: "100%",
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* Tap & Speak Button */}
        <button
          onClick={handleActivateClick}
          disabled={active}
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "14px 28px",
            borderRadius: 30,
            border: "none",
            background: "linear-gradient(135deg, #d4af37, #f5d76e)",
            color: "#000",
            fontSize: 18,
            fontWeight: "bold",
            cursor: active ? "default" : "pointer",
            zIndex: 3,
            boxShadow: "0 0 20px rgba(212,175,55,0.7)",
          }}
        >
          {active ? "Listening…" : "Tap & Speak"}
        </button>
      </div>

      {/* Helper Text */}
      <p style={{ marginTop: 20, opacity: 0.8 }}>
        Ask me anything…
      </p>

      {/* Hidden message store (kept for future expansion) */}
      <div style={{ display: "none" }}>
        {messages.map((m, i) => (
          <div key={i}>{m.text}</div>
        ))}
      </div>

      {/* Fog animation */}
      <style>{`
        @keyframes fog {
          0% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 0.6; transform: translateY(-10px); }
          100% { opacity: 0.3; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
