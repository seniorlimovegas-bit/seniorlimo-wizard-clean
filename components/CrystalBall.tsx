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
          background: listening
            ? "radial-gradient(circle, #ffd700 0%, #b8860b 70%)"
            : "radial-gradient(circle, #444 0%, #111 70%)",
          boxShadow: listening
            ? "0 0 40px 15px gold"
            : "0 0 20px 5px #000",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      />
      <div
        style={{
          marginTop: 20,
          padding: 12,
          maxWidth: 500,
          marginLeft: "auto",
          marginRight: "auto",
          border: "2px solid gold",
          borderRadius: 8,
          background: "#000",
          color: "gold",
          fontSize: 18,
          minHeight: 60,
        }}
      >
        {answer || "Tap the crystal ball to speak"}
      </div>
    </div>
  );
}
