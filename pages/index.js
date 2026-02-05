"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;

    const glow = document.getElementById("glow");
    if (!glow) return;

    let t = 0;
    const loop = setInterval(() => {
      t += 0.03;
      const size = 30 + Math.sin(t) * 12;
      glow.style.boxShadow = `0 0 ${size}px rgba(96,165,250,0.6)`;
    }, 50);

    return () => clearInterval(loop);
  }, [active]);

  return (
    <>
      <div className="bg" />
      <div className="stars" />

      <div className="container">
        <div id="glow" className="card">
          <h1>Mr. Wizard</h1>

          <p className="tag">
            Your AI-powered concierge, guide, and assistant.
            <br />
            Calm. Aware. Waiting.
          </p>

          <p className="status">
            {active
              ? "ACTIVE • AWARE • READY"
              : "IDLE • LISTENING FOR ACTIVATION"}
          </p>

          <button
            className="activate"
            onClick={() => setActive(true)}
            disabled={active}
          >
            {active ? "Mr. Wizard Online" : "Activate Mr. Wizard"}
          </button>

          <p className="footer">© 2026 Mr. Wizard</p>
        </div>
      </div>
    </>
  );
}
