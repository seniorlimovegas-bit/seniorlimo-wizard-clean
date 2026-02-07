// pages/index.js
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [glow, setGlow] = useState("blue"); // "blue" | "gold"
  const [animKey, setAnimKey] = useState(0);

  const handleTap = () => {
    // Switch to gold immediately
    setGlow("gold");
    // Restart pulse animation each tap
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    if (glow !== "gold") return;
    const t = setTimeout(() => setGlow("blue"), 900); // back to blue after 0.9s
    return () => clearTimeout(t);
  }, [glow]);

  const styles = useMemo(() => {
    const isGold = glow === "gold";

    const blueGlow = "0 0 28px rgba(41, 38, 239, 0.45), 0 0 90px rgba(41, 38, 239, 0.18)";
    const goldGlow = "0 0 28px rgba(194, 139, 0, 0.55), 0 0 90px rgba(194, 139, 0, 0.22)";

    return {
      page: {
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at center, #0b1220 0%, #05070d 60%, #02030a 100%)",
        overflow: "hidden",
        WebkitTapHighlightColor: "transparent",
      },
      ballWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      },
      crystalBall: {
        width: 260,
        height: 260,
        borderRadius: "50%",
        backgroundImage: "url(/crystal-ball.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: isGold ? goldGlow : blueGlow,
        transform: "translateZ(0)",
        cursor: "pointer",
        outline: "none",
        border: isGold ? "1px solid rgba(194, 139, 0, 0.35)" : "1px solid rgba(41, 38, 239, 0.25)",
        animation: `mwPulse 900ms ease-out 1`,
      },
      label: {
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: 18,
        letterSpacing: 0.2,
        color: isGold ? "#C28B00" : "#b6c2ff",
        textShadow: isGold
          ? "0 0 18px rgba(194, 139, 0, 0.20)"
          : "0 0 18px rgba(41, 38, 239, 0.18)",
        userSelect: "none",
      },
    };
  }, [glow, animKey]);

  return (
    <div style={styles.page}>
      {/* Keyframes are injected safely (no window usage, no build issues) */}
      <style jsx global>{`
        @keyframes mwPulse {
          0% {
            transform: scale(1);
            filter: saturate(1);
          }
          35% {
            transform: scale(1.03);
            filter: saturate(1.1);
          }
          100% {
            transform: scale(1);
            filter: saturate(1);
          }
        }
      `}</style>

      <div style={styles.ballWrapper}>
        <div
          key={animKey} // forces animation restart
          style={styles.crystalBall}
          role="button"
          tabIndex={0}
          aria-label="Tap to Speak"
          onClick={handleTap}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleTap();
          }}
        />
        <div style={styles.label}>Tap to Speak</div>
      </div>
    </div>
  );
}
