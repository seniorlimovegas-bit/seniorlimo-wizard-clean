import React from "react";

export default function CrystalBall({
  listening,
  onTapToTalk,
  answer,
}: {
  listening: boolean;
  onTapToTalk: () => void;
  answer?: string;
}) {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <div
        onClick={onTapToTalk}
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          margin: "0 auto",
          cursor: "pointer",
          background: listening
            ? "radial-gradient(circle, #00ffff, #0047ff)"
            : "radial-gradient(circle, #999, #333)",
          boxShadow: listening
            ? "0 0 40px rgba(0,255,255,0.9)"
            : "0 0 20px rgba(0,0,0,0.5)",
          transition: "all 0.3s ease",
        }}
      />

      {answer && (
        <p style={{ marginTop: 20, fontSize: 18 }}>
          <strong>Wizard:</strong> {answer}
        </p>
      )}
    </div>
  );
}
