"use client";

import { useEffect, useRef, useState } from "react";
import CrystalBall from "../components/CrystalBall";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [answer, setAnswer] = useState("");

  // --- Speech synthesis (kept simple & safe)
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) return;
    synthRef.current = window.speechSynthesis;
  }, []);

  const handleTapToTalk = () => {
    setListening(true);

    // Placeholder behavior for now
    setTimeout(() => {
      setAnswer("I am here. Ask me anything.");
      setListening(false);
    }, 1200);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b1a2a, #000)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "40px",
        color: "#f5f5f5",
      }}
    >
      {/* 🔮 Crystal Ball Stage */}
      <CrystalBall
        width={420}
        listening={listening}
        onTapToTalk={handleTapToTalk}
        answerText={answer}
        answerPlaceholder="Tap the crystal to speak"
      />

      {/* 📝 Answer text area */}
      <div
        style={{
          marginTop: "28px",
          width: "90%",
          maxWidth: "520px",
          minHeight: "120px",
          padding: "18px",
          borderRadius: "12px",
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(194,139,0,0.4)",
          fontSize: "1.1rem",
          lineHeight: "1.5",
          textAlign: "center",
        }}
      >
        {answer || "The crystal awaits your question."}
      </div>
    </main>
  );
}
