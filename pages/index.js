// pages/index.js
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [glow, setGlow] = useState("blue"); // "blue" | "gold"
  const [animKey, setAnimKey] = useState(0);

  const handleTap = () => {
    // Switch to gold immediately
    setGlow("gold");
    // Restart the pulse animation each tap
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    if (glow !== "gold") return;
    const t = setTimeout(() => setGlow("blue"), 900); // back to blue after 0.9s
    return () => clearTimeout(t);
  }, [glow]);

  const styles = useMemo(() => {
    const isGold = glow === "gold";

    // Your brand colors
    const BLUE = "rgba(41, 38, 239, 1)"; // #2926EF
    const GOLD = "rgba(194, 139, 0, 1)"; // #C28B00

    const blueGlow = "0 0 28px rgba(41, 38, 239, 0.45), 0 0 90px rgba(41, 38, 239, 0.18)";
    const goldGlow = "0 0 28px rgba(194, 139, 0, 0.55), 0 0 90px rgba(194, 139, 0, 0.22)";

    return {
      page: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 40%, #0c1222 0%, #05070d 70%, #02030a 100%)",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent",
      },
      ballWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      },
      crystalBall: {
        width: 240,
        height: 240,
        borderRadius: "999px",
        cursor: "pointer",

        // If you want to use your PNG, keep this ON.
        // If you’d rather use pure gradients only, comment out backgroundImage.
        backgroundImage: "url(/crystal-ball.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",

        // “Color shift” effect
        filter: isGold
          ? "hue-rotate(115deg) saturate(1.35) brightness(1.05)"
          : "hue-rotate(0deg) saturate(1.15) brightness(1.0)",

        // Glow swap
        boxShadow: isGold ? goldGlow : blueGlow,

        // Soft inner shine overlay feel
        position: "relative",
        overflow: "hidden",

        // Pulse animation keyed by animKey
        animation: `pulse 0.9s ease-out`,
      },
      ballOverlay: {
        position: "absolute",
        inset: 0,
        borderRadius: "999px",
        background: isGold
          ? `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 25%, rgba(0,0,0,0.00) 60%),
             radial-gradient(circle at 55% 70%, rgba(${GOLD.replace("rgba(", "").replace(")", "")}, 0.10) 0%, rgba(0,0,0,0.00) 60%)`
          : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 25%, rgba(0,0,0,0.00) 60%),
             radial-gradient(circle at 55% 70%, rgba(${BLUE.replace("rgba(", "").replace(")", "")}, 0.10) 0%, rgba(0,0,0,0.00) 60%)`,
        pointerEvents: "none",
      },
      label: {
        fontSize: 16,
        letterSpacing: 0.6,
        color: "rgba(194, 139, 0, 0.95)", // gold-ish
      },
      keyframes: `
        @keyframes pulse {
          0% { transform: scale(1); }
          35% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `,
    };
  }, [glow, animKey]);

  return (
    <div style={styles.page}>
      {/* keyframes injected */}
      <style>{styles.keyframes}</style>

      <div style={styles.ballWrapper}>
        <div
          key={animKey}
          style={styles.crystalBall}
          // Make taps reliable on iOS + desktop
          onPointerDown={handleTap}
          onTouchStart={handleTap}
          onClick={handleTap}
          role="button"
          aria-label="Tap to Speak"
        >
          <div style={styles.ballOverlay} />
        </div>

        <div style={styles.label}>Tap to Speak</div>
      </div>
    </div>
  );
}
