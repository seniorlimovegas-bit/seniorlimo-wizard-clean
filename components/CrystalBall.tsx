return (
  <div style={{ textAlign: "center", marginTop: 40 }}>
    <div
      onClick={onTapToTalk}
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

      {/* diagonal shimmer sweep */}
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
        {listening ? "LISTENING…" : "TAP THE CRYSTAL BALL"}
      </div>
    </div>

    {answer && (
      <p style={{ marginTop: 14, fontSize: 18, fontWeight: 700 }}>
        {answer}
      </p>
    )}
  </div>
);
