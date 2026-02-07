// components/CrystalBall.tsx
import React from "react";

type CrystalBallProps = {
  width?: number;
  listening?: boolean;
  onTapToTalk: () => void;
  answerText?: string;
  answerPlaceholder?: string;
};

export default function CrystalBall({
  width = 360,
  listening = false,
  onTapToTalk,
  answerText = "",
  answerPlaceholder = "The crystal awaits your question…",
}: CrystalBallProps) {
  return (
    <div
      style={{
        width,
        margin: "0 auto",
        textAlign: "center",
        paddingTop: 24,
      }}
    >
      {/* Crystal stage */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: width,
          marginBottom: 24,
        }}
      >
        {/* Crystal Ball */}
        <img
          src="/crystal-ball.png"
          alt="Crystal Ball"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: listening
              ? "drop-shadow(0 0 25px rgba(255,215,120,0.9))"
              : "drop-shadow(0 0 10px rgba(120,180,255,0.4))",
            transition: "filter 0.3s ease",
          }}
        />

        {/* Tap to Talk Button */}
        <button
          onClick={onTapToTalk}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "linear-gradient(180deg, #f5d98b, #c89b2c)",
            border: "none",
            borderRadius: 24,
            padding: "12px 22px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            color: "#2b2108",
            boxShadow: listening
              ? "0 0 20px rgba(255,215,120,0.9)"
              : "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          {listening ? "Listening…" : "Tap to Talk"}
        </button>
      </div>

      {/* Answer Area */}
      <div
        style={{
          minHeight: 80,
          padding: "12px 16px",
          borderRadius: 12,
          background: "rgba(0,0,0,0.35)",
          color: "#f5f5f5",
          fontSize: 16,
          lineHeight: 1.4,
        }}
      >
        {answerText || (
          <span style={{ opacity: 0.7 }}>{answerPlaceholder}</span>
        )}
      </div>
    </div>
  );
}
