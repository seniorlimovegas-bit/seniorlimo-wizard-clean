// pages/index.js
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [glow, setGlow] = useState("blue"); // "blue" | "gold"
  const [animKey, setAnimKey] = useState(0);
  const backTimerRef = useRef(null);

  const BLUE = "rgba(41, 38, 239, 1)"; // #2926EF
  const GOLD = "rgba(194, 139, 0, 1)"; // #C28B00

  const triggerGoldFlash = () => {
    // Cancel any previous timer so repeated taps feel responsive
    if (backTimerRef.current) clearTimeout(backTimerRef.current);

    setGlow("gold");
    setAnimKey((k) => k + 1);

    backTimerRef.current = setTimeout(() => {
      setGlow("blue");
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (backTimerRef.current) clearTimeout(backTimerRef.current);
    };
  }, []);

  const styles = useMemo(() => {
    const isGold = glow === "gold";

    const ringShadowBlue = `0 0 28px rgba(41, 38, 239, 0.55), 0 0 110px rgba(41, 38, 239, 0.25)`;
    const ringShadowGold = `0 0 28px rgba(194, 139, 0, 0.60), 0 0 110px rgba(194, 139, 0, 0.28)`;

    const ringShadow = isGold ? ringShadowGold : ringShadowBlue;

    // Sphere gradients (looks like a glass ball)
    const sphereBg = isGold
      ? `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 18%, rgba(194,139,0,0.75) 55%, rgba(90,55,0,0.85) 100%)`
      : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 18%, rgba(41,38,239,0.78) 55%, rgba(10,18,90,0.88) 100%)`;

    const labelColor = isGold ? GOLD : "rgba(194, 139, 0, 0.95)"; // keep gold label vibe

    return {
      page: {
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1200px 800px at 50% 55%, rgba(20,24,40,0.55) 0%, rgba(8,10,16,1) 60%, rgba(0,0,0,1) 100%)",
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        padding: "24px",
        boxSizing: "border-box",
      },

      wrap: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "18px",
        userSelect: "none",
        WebkitUserSelect: "none",
      },

      // Real button so iPad Safari always treats it as tappable
      ballButton: {
        width: "220px",
        height: "220px",
        borderRadius: "999px",
        border: "0",
        outline: "none",
        padding: 0,
        background: "transparent",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
      },

      sphere: {
        width: "220px",
        height: "220px",
        borderRadius: "999px",
        background: sphereBg,
        boxShadow: ringShadow,
        position: "relative",
        transform: "translateZ(0)",
        animation: `pulse 1.1s ease-in-out`,
      },

      // A soft inner rim to make it feel “3D”
      innerRim: {
        position: "absolute",
        inset: "10px",
        borderRadius: "999px",
        boxShadow: isGold
          ? "inset 0 0 18px rgba(255, 230, 170, 0.18)"
          : "inset 0 0 18px rgba(170, 190, 255, 0.16)",
        pointerEvents: "none",
      },

      // A highlight “shine”
      shine: {
        position: "absolute",
        width: "95px",
        height: "95px",
        left: "28px",
        top: "26px",
        borderRadius: "999px",
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.12) 60%, rgba(255,255,255,0) 100%)",
        filter: "blur(0.2px)",
        pointerEvents: "none",
      },

      label: {
        fontSize: "18px",
        letterSpacing: "0.3px",
        color: labelColor,
        opacity: 0.95,
        textShadow: "0 2px 14px rgba(0,0,0,0.55)",
      },

      hint: {
        fontSize: "13px",
        color: "rgba(255,255,255,0.38)",
        marginTop: "-10px",
      },

      // Inject keyframes
      keyframes: `
        @keyframes pulse {
          0%   { transform: scale(1); }
          45%  { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `,
    };
  }, [glow]);

  return (
    <>
      <style>{styles.keyframes}</style>
      <div style={styles.page}>
        <div style={styles.wrap}>
          <button
            type="button"
            style={styles.ballButton}
            // iPad/mobile-friendly: pointer + touch + click (belt and suspenders)
            onPointerDown={triggerGoldFlash}
            onTouchStart={(e) => {
              e.preventDefault(); // prevents “ghost click” / weird delays on iOS
              triggerGoldFlash();
            }}
            onClick={triggerGoldFlash}
            aria-label="Tap to Speak"
          >
            <div key={animKey} style={styles.sphere}>
              <div style={styles.innerRim} />
              <div style={styles.shine} />
            </div>
          </button>

          <div style={styles.label}>Tap to Speak</div>
          <div style={styles.hint}>Ball should flash Gold, then return Blue.</div>
        </div>
      </div>
    </>
  );
}
