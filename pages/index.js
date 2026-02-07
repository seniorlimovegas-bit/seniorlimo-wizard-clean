// pages/index.js
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [glow, setGlow] = useState("blue"); // "blue" | "gold"
  const [animKey, setAnimKey] = useState(0);

  const handleTap = () => {
    // switch to gold immediately
    setGlow("gold");
    // restart the pulse animation each tap
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    if (glow !== "gold") return;
    const t = setTimeout(() => setGlow("blue"), 900); // back to blue after 0.9s
    return () => clearTimeout(t);
  }, [glow]);

  const styles = useMemo(() => {
    const isGold = glow === "gold";

    return {
      page: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1200px 800px at 50% 55%, rgba(50,70,110,0.35) 0%, rgba(8,10,16,1) 45%, rgba(0,0,0,1) 100%)",
        color: "#fff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
      },

      ballWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      },

      ballButton: {
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      },

      ballGlow: {
        width: 240,
        height: 240,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        // the animated “aura”
        boxShadow: isGold
          ? "0 0 18px rgba(194,139,0,0.55), 0 0 55px rgba(194,139,0,0.35), 0 0 120px rgba(194,139,0,0.22)"
          : "0 0 18px rgba(41,38,239,0.55), 0 0 55px rgba(41,38,239,0.35), 0 0 120px rgba(41,38,239,0.22)",

        // subtle ring
        border: isGold
          ? "1px solid rgba(194,139,0,0.28)"
          : "1px solid rgba(120,160,255,0.18)",

        // smooth color shift
        transition: "box-shadow 250ms ease, border 250ms ease",

        // pulse only when gold is active
        animation: isGold ? "mwPulse 900ms ease-in-out 1" : "none",
      },

      ballImage: {
        width: 210,
        height: 210,
        borderRadius: "50%",
        objectFit: "cover",
        filter: isGold
          ? "saturate(1.15) brightness(1.05)"
          : "saturate(1.05) brightness(1.0)",
        transition: "filter 250ms ease",
      },

      label: {
        fontSize: 18,
        letterSpacing: 0.2,
        opacity: 0.95,
        color: isGold ? "#C28B00" : "#d7d9ff",
        textShadow: isGold
          ? "0 0 10px rgba(194,139,0,0.25)"
          : "0 0 10px rgba(41,38,239,0.18)",
        transition: "color 250ms ease, text-shadow 250ms ease",
      },

      hint: {
        marginTop: 2,
        fontSize: 12,
        opacity: 0.55,
      },
    };
  }, [glow]);

  return (
    <div style={styles.page}>
      {/* Keyframes embedded right here so we don't touch other files */}
      <style>{`
        @keyframes mwPulse {
          0%   { transform: scale(1);   filter: brightness(1); }
          45%  { transform: scale(1.03); filter: brightness(1.08); }
          100% { transform: scale(1);   filter: brightness(1); }
        }
      `}</style>

      <div style={styles.ballWrapper}>
        <button
          type="button"
          onClick={handleTap}
          style={styles.ballButton}
          aria-label="Tap the crystal ball"
        >
          <div key={animKey} style={styles.ballGlow}>
            <img
              src="/crystal-ball.png"
              alt="Crystal ball"
              style={styles.ballImage}
              draggable={false}
            />
          </div>
        </button>

        <div style={styles.label}>Tap to Speak</div>
        <div style={styles.hint}>
          (Visual test: tap = gold glow, then back to blue)
        </div>
      </div>
    </div>
  );
}
