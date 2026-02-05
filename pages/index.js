"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const glow = document.getElementById("glow");
    let t = 0;
    const loop = setInterval(() => {
      t += 0.03;
      glow.style.boxShadow = `0 0 ${30 + Math.sin(t) * 10}px rgba(96,165,250,0.6)`;
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
          </p>
          <p className="status">
            {active ? "ACTIVE • AWARE • READY" : "IDLE • LISTENING FOR ACTIVATION"}
          </p>

          <button onClick={() => setActive(true)}>
            {active ? "Mr. Wizard Online" : "Activate Mr. Wizard"}
          </button>

          <footer>© 2026 Mr. Wizard · All Rights Reserved</footer>
        </div>
      </div>

      <style jsx>{`
        body {
          margin: 0;
          overflow: hidden;
          background: #020617;
        }

        .bg {
          position: fixed;
          inset: 0;
          background: radial-gradient(
            circle at center,
            #020617 0%,
            #000 70%
          );
        }

        .stars {
          position: fixed;
          inset: 0;
          background-image: radial-gradient(
              1px 1px at 20% 30%,
              rgba(255, 255, 255, 0.6) 50%,
              transparent 51%
            ),
            radial-gradient(
              1px 1px at 80% 60%,
              rgba(255, 255, 255, 0.4) 50%,
              transparent 51%
            ),
            radial-gradient(
              1px 1px at 50% 80%,
              rgba(255, 255, 255, 0.5) 50%,
              transparent 51%
            );
          animation: drift 60s linear infinite;
        }

        @keyframes drift {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-1000px);
          }
        }

        .container {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card {
          width: 360px;
          padding: 28px;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(14px);
          text-align: center;
          color: #e5e7eb;
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.45);
        }

        h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: 0.5px;
        }

        .tag {
          margin: 12px 0 18px;
          font-size: 14px;
          opacity: 0.9;
        }

        .status {
          font-size: 12px;
          letter-spacing: 1px;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        button {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          color: #020617;
          font-weight: 600;
          cursor: pointer;
          font-size: 15px;
        }

        footer {
          margin-top: 18px;
          font-size: 11px;
          opacity: 0.4;
        }
      `}</style>
    </>
  );
}
