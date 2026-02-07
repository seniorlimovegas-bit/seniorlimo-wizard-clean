

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [activated, setActivated] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("I am here. Click Activate to begin.");

  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    synthRef.current = window.speechSynthesis || null;
  }, []);

  const speak = (text) => {
    try {
      if (!voiceOn) return;
      if (!synthRef.current) return;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.pitch = 0.9;
      u.volume = 1;
      synthRef.current.cancel();
      synthRef.current.speak(u);
    } catch (e) {
      // ignore
    }
  };

  const activate = () => {
    setActivated(true);
    setAnswer("I am awake. Ask your question.");
    speak("I am awake. Ask your question.");
  };

  const onBallTap = () => {
    // Tap ball = quick activation + a little magic glow
    if (!activated) {
      activate();
      return;
    }
    setListening(true);
    setTimeout(() => setListening(false), 900);
  };

  const send = () => {
    if (!activated) return;
    const q = input.trim();
    if (!q) return;

    setInput("");
    setListening(true);

    // For now: placeholder response so UI works today.
    // Later we wire this to your API call again.
    const a = `Got it. You asked: "${q}". (Next step: connect this to the chat API.)`;
    setTimeout(() => {
      setAnswer(a);
      setListening(false);
      speak(a);
    }, 450);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1 style={{ marginTop: 0 }}>SeniorLimo — Mr. Wizard</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
        <button onClick={activate} style={{ padding: "8px 14px", borderRadius: 10 }}>
          Activate
        </button>

        <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
          <input
            type="checkbox"
            checked={voiceOn}
            onChange={(e) => setVoiceOn(e.target.checked)}
          />
          Voice
        </label>
      </div>

      {/* CRYSTAL BALL (NO PNG, PURE CSS) */}
      <div style={{ textAlign: "center", margin: "18px 0 22px" }}>
        <div
          onClick={onBallTap}
          style={{
            width: 260,
            height: 260,
            borderRadius: "50%",
            margin: "0 auto",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            border: "7px solid #C28B00",
            background: listening
              ? "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95) 0%, rgba(125,211,255,0.9) 14%, rgba(41,38,239,0.95) 52%, rgba(7,12,28,1) 100%)"
              : "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(191,231,255,0.9) 12%, rgba(41,38,239,0.85) 50%, rgba(7,12,28,1) 100%)",
            boxShadow: listening
              ? "0 0 42px rgba(41,38,239,0.9), 0 0 22px rgba(194,139,0,0.85)"
              : "0 0 22px rgba(0,0,0,0.45)",
            userSelect: "none",
          }}
        >
          {/* glossy shine */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 30,
              width: 95,
              height: 95,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.55)",
              filter: "blur(1px)",
            }}
          />

          {/* shimmer sweep */}
          <div
            style={{
              position: "absolute",
              inset: -60,
              transform: "rotate(25deg)",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.20) 45%, rgba(255,255,255,0) 70%)",
              opacity: listening ? 0.8 : 0.45,
            }}
          />

          {/* inner swirl */}
          <div
            style={{
              position: "absolute",
              inset: 22,
              borderRadius: "50%",
              background: listening
                ? "conic-gradient(from 200deg, rgba(255,255,255,0.0), rgba(125,211,255,0.35), rgba(194,139,0,0.22), rgba(41,38,239,0.35), rgba(255,255,255,0.0))"
                : "conic-gradient(from 220deg, rgba(255,255,255,0.0), rgba(125,211,255,0.25), rgba(194,139,0,0.18), rgba(41,38,239,0.25), rgba(255,255,255,0.0))",
              filter: "blur(0.4px)",
            }}
          />

          {/* label */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              letterSpacing: 0.6,
              color: "#fff",
              textShadow: "0 2px 12px rgba(0,0,0,0.85)",
              textAlign: "center",
              padding: 18,
              fontSize: 18,
            }}
          >
            {activated ? (listening ? "LISTENING…" : "TAP THE CRYSTAL BALL") : "TAP TO ACTIVATE"}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 18, marginBottom: 10 }}>
        <b>Wizard:</b> {answer}
      </div>

      <div style={{ display: "flex", gap: 10, maxWidth: 860 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={activated ? "Ask Mr. Wizard..." : "Click Activate first..."}
          disabled={!activated}
          style={{ flex: 1, padding: 12, fontSize: 16 }}
        />
        <button
          onClick={send}
          disabled={!activated}
          style={{ padding: "10px 16px", fontSize: 16 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
