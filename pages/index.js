// pages/index.js
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  // glow mode
  const [glow, setGlow] = useState("blue"); // "blue" | "gold"
  const backTimerRef = useRef(null);

  // OPTIONAL: if you already have voice logic, wire it here.
  // Example: const startVoice = () => { ... };
  // For now we keep it safe.
  const startVoiceIfAvailable = () => {
    // If you later attach a global or imported function, call it here.
    // Example:
    // if (typeof window !== "undefined" && typeof window.__startVoice === "function") {
    //   window.__startVoice();
    // }
  };

  const triggerGoldFlash = () => {
    // Hard proof the tap fired
    if (typeof document !== "undefined") {
      document.title = "TAPPED " + new Date().toLocaleTimeString();
    }

    // Cancel prior timer so repeated taps feel responsive
    if (backTimerRef.current) clearTimeout(backTimerRef.current);

    // Flash gold
    setGlow("gold");

    // Go back to blue shortly after
    backTimerRef.current = setTimeout(() => {
      setGlow("blue");
    }, 650);

    // Start voice ONLY from a user gesture (this tap)
    startVoiceIfAvailable();
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (backTimerRef.current) clearTimeout(backTimerRef.current);
    };
  }, []);

  const styles = useMemo(() => {
    // Brand colors
    const BLUE = "rgba(41, 38, 239, 1)"; // #2926EF
    const GOLD = "rgba(194, 139, 0, 1)"; // #C28B00

    const isGold = glow === "gold";

    const blueGlow = "0 0 28px rgba(41, 38, 239, 0.55), 0 0 95px rgba(41, 38, 239, 0.22)";
    const goldGlow = "0 0 28px rgba(194, 139, 0, 0.65), 0 0 95px rgba(194, 139, 0, 0.25)";

    return {
      page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 30%, #0b1220 0%, #05070d 60%, #000 100%)",
        color: "#fff",
        touchAction: "manipulation", // helps iOS with taps
        WebkitTapHighlightColor: "transparent",
      },

      // Clickable area must be a real control on iOS
      button: {
        appearance: "none",
        border: "none",
        background: "transparent",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        outline: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        zIndex: 5,
        position: "relative",
        pointerEvents: "auto",
      },

      ballWrap: {
        width: 220,
        height: 220,
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
        boxShadow: isGold ? goldGlow : blueGlow,
        transition: "box-shadow 180ms ease, transform 180ms ease",
        transform: isGold ? "scale(1.03)" : "scale(1.0)",
        pointerEvents: "auto",
      },

      ball: {
        width: 190,
        height: 190,
        borderRadius: 999,
        background: isGold
          ? `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.12) 25%, rgba(0,0,0,0) 45%),
             radial-gradient(circle at 50% 70%, ${GOLD} 0%, rgba(120, 80, 0, 1) 55%, rgba(10, 8, 3, 1) 100%)`
          : `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.12) 25%, rgba(0,0,0,0) 45%),
             radial-gradient(circle at 50% 70%, ${BLUE} 0%, rgba(12, 25, 130, 1) 55%, rgba(5, 8, 18, 1) 100%)`,
        transition: "background 180ms ease",
      },

      label: {
        fontSize: 18,
        letterSpacing: "0.5px",
        color: "rgba(194, 139, 0, 0.95)",
        userSelect: "none",
      },

      tiny: {
        marginTop: 6,
        fontSize: 12,
        opacity: 0.55,
        userSelect: "none",
      },
    };
  }, [glow]);

  // A single unified handler we can bind to multiple events
  const handleGesture = (e) => {
    // IMPORTANT: on iOS, preventDefault on touch can help stop weird delays,
    // but don't do it on click.
    if (e?.type === "touchstart") e.preventDefault();
    triggerGoldFlash();
  };

  return (
    <div style={styles.page}>
      <button
        type="button"
        aria-label="Tap to speak"
        style={styles.button}
        onPointerDown={handleGesture}
        onTouchStart={handleGesture}
        onMouseDown={handleGesture}
        onClick={handleGesture}
      >
        <div style={styles.ballWrap}>
          <div style={styles.ball} />
        </div>

        <div style={styles.label}>Tap to Speak</div>
        <div style={styles.tiny}>(If the tab title changes, tap is working)</div>
      </button>
    </div>
  );
}
