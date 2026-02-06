// components/CrystalBall.tsx
import React from "react";

type CrystalBallProps = {
  /** Size in pixels (ball diameter). Default: 320 */
  size?: number;
  /** Optional className for layout (ex: "mx-auto my-6") */
  className?: string;
};

export default function CrystalBall({ size = 320, className = "" }: CrystalBallProps) {
  const ball = size;
  const baseW = Math.round(size * 0.85);
  const baseH = Math.round(size * 0.18);

  return (
    <div className={className} style={{ width: ball, height: ball + baseH + 10 }}>
      {/* Ball wrapper */}
      <div
        className="cb-wrap"
        style={{
          width: ball,
          height: ball,
        }}
      >
        {/* Outer glass */}
        <div className="cb-glass">
          {/* Inner glow */}
          <div className="cb-core" />
          {/* Swirl */}
          <div className="cb-swirl" />
          {/* Sparkles */}
          <div className="cb-sparkles" />
          {/* Highlights */}
          <div className="cb-highlight-1" />
          <div className="cb-highlight-2" />
          {/* Rim */}
          <div className="cb-rim" />
        </div>
      </div>

      {/* Base */}
      <div
        className="cb-base"
        style={{
          width: baseW,
          height: baseH,
          marginTop: 8,
          marginLeft: (ball - baseW) / 2,
        }}
      >
        <div className="cb-base-top" />
        <div className="cb-base-shadow" />
      </div>

      <style jsx>{`
        .cb-wrap {
          position: relative;
          display: block;
        }

        .cb-glass {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          overflow: hidden;

          /* Glass + atmosphere */
          background: radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0) 40%),
            radial-gradient(circle at 50% 60%, rgba(120, 200, 255, 0.45), rgba(30, 70, 120, 0.15) 55%, rgba(10, 20, 40, 0.55) 100%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));

          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.35),
            inset 0 0 50px rgba(255, 255, 255, 0.12);

          transform: translateZ(0);
        }

        /* Inner glow core */
        .cb-core {
          position: absolute;
          inset: -15%;
          border-radius: 9999px;
          background: radial-gradient(circle at 50% 70%, rgba(220, 250, 255, 0.95), rgba(120, 210, 255, 0.35) 42%, rgba(60, 120, 200, 0.18) 65%, rgba(0, 0, 0, 0) 78%);
          filter: blur(2px);
          animation: cbPulse 4.8s ease-in-out infinite;
          opacity: 0.95;
        }

        /* Swirl light streak */
        .cb-swirl {
          position: absolute;
          inset: -20%;
          border-radius: 9999px;
          background:
            conic-gradient(
              from 200deg,
              rgba(255, 255, 255, 0) 0deg,
              rgba(170, 230, 255, 0.0) 70deg,
              rgba(170, 230, 255, 0.35) 105deg,
              rgba(255, 255, 255, 0.0) 150deg,
              rgba(255, 255, 255, 0) 360deg
            );
          filter: blur(1px);
          mix-blend-mode: screen;
          animation: cbSpin 8.5s linear infinite;
          opacity: 0.8;
        }

        /* Sparkles (soft dots) */
        .cb-sparkles {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(255, 255, 255, 0.75) 0 1px, rgba(255, 255, 255, 0) 2px),
            radial-gradient(circle, rgba(255, 255, 255, 0.55) 0 1px, rgba(255, 255, 255, 0) 2px),
            radial-gradient(circle, rgba(255, 255, 255, 0.35) 0 1px, rgba(255, 255, 255, 0) 2px);
          background-size: 120px 120px, 160px 160px, 220px 220px;
          background-position: 10% 20%, 70% 35%, 35% 75%;
          opacity: 0.55;
          animation: cbDrift 6.5s ease-in-out infinite;
          filter: blur(0.2px);
        }

        /* Highlights */
        .cb-highlight-1 {
          position: absolute;
          width: 36%;
          height: 36%;
          left: 16%;
          top: 14%;
          border-radius: 9999px;
          background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0) 70%);
          opacity: 0.75;
          filter: blur(0.4px);
        }

        .cb-highlight-2 {
          position: absolute;
          width: 18%;
          height: 18%;
          left: 30%;
          top: 42%;
          border-radius: 9999px;
          background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 70%);
          opacity: 0.6;
          filter: blur(0.6px);
        }

        /* Glass rim */
        .cb-rim {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          box-shadow:
            inset 0 0 0 2px rgba(255, 255, 255, 0.18),
            inset 0 0 0 10px rgba(255, 255, 255, 0.05),
            inset 0 -20px 50px rgba(0, 0, 0, 0.25);
          pointer-events: none;
        }

        /* Base */
        .cb-base {
          position: relative;
          border-radius: 9999px;
          background:
            linear-gradient(180deg, rgba(40, 55, 85, 0.95), rgba(12, 18, 30, 0.98));
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          overflow: hidden;
        }

        .cb-base-top {
          position: absolute;
          left: 8%;
          right: 8%;
          top: 12%;
          height: 38%;
          border-radius: 9999px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0));
        }

        .cb-base-shadow {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: radial-gradient(circle at 50% 120%, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0) 60%);
          opacity: 0.8;
        }

        /* Animations */
        @keyframes cbSpin {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.01);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes cbPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.03);
            opacity: 1;
          }
        }

        @keyframes cbDrift {
          0%,
          100% {
            transform: translate3d(0px, 0px, 0px);
            opacity: 0.5;
          }
          50% {
            transform: translate3d(6px, -6px, 0px);
            opacity: 0.65;
          }
        }
      `}</style>
    </div>
  );
}
