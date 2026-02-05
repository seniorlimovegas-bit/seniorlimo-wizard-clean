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

          <p className="footer">
            © 2026 Mr. Wizard • All Rights Reserved
          </p>
        </div>
      </div>

      <style jsx>{`
        .bg {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center, #0b1d3a, #020617);
          z-index: -2;
        }

        .stars {
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.6), transparent),
            radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,.5), transparent),
            radial-gradient(1px 1px at 50% 80%, rgba(255,255,255,.4), transparent);
          animation: drift 40s linear infinite;
          z-index: -1;
        }

        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-200px); }
        }

        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card {
          background: rgba(15, 23, 42, 0.85);
          border-radius: 18px;
          padding: 32px 28px;
          width: 340px;
          text-align: center;
          color: #e5e7eb;
          transition: box-shadow 0.3s ease;
        }

        h1 {
          margin: 0 0 12px;
          font-size: 28px;
          font-weight: 600;
        }

        .tag {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 16px;
        }

        .status {
          font-size: 12px;
          letter-spacing: 1px;
          opacity: 0.75;
          margin-bottom: 20px;
        }

        .activate {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          font-size: 15px;
          font-weight: 600;
          background: #3b82f6;
          color: white;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .activate:hover:not(:disabled) {
          background: #2563eb;
        }

        .activate:disabled {
          background: #1e3a8a;
          cursor: default;
        }

        .footer {
          margin-top: 18px;
          font-size: 11px;
          opacity: 0.5;
        }
      `}</style>
    </>
  );
}
