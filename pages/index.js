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
      t += 0.04;
      const size = 30 + Math.sin(t) * 14;
      glow.style.boxShadow = `0 0 ${size}px rgba(96,165,250,0.7)`;
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

          {!active && (
            <button
              className="activate"
              onClick={() => setActive(true)}
            >
              Activate Mr. Wizard
            </button>
          )}
        </div>
      </div>
    </>
  );
}
