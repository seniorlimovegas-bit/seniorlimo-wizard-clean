// components/CrystalBall.tsx
import React from "react";

type CrystalBallProps = {
  /** Overall stage width in px. The stage auto-centers. */
  width?: number;
  /** True when the mic/listening mode is active (changes label + glow) */
  listening?: boolean;
  /** Called when user taps the gold "Tap to Talk" button */
  onTapToTalk?: () => void;
  /** Optional text shown in the answer area below the ball */
  answerText?: string;
  /** Optional placeholder shown when there's no answer yet */
  answerPlaceholder?: string;
  /** Optional extra className for outer wrapper */
  className?: string;
};

export default function CrystalBall({
  width = 360,
  listening = false,
  onTapToTalk,
  answerText = "",
  answerPlaceholder = "Answers will appear here…",
  className = "",
}: CrystalBallProps) {
  // Stage geometry (responsive-ish while staying predictable)
  const stageW = Math.max(280, Math.min(width, 520));
  const ballSize = Math.round(stageW * 0.82); // ball dominates the stage
  const stageH = ballSize + 210; // ball+fog area + answer area space
  const ballTopPad = 10;

  return (
    <div className={className} style={{ display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: stageW,
          height: stageH,
          position: "relative",
          borderRadius: 22,
          overflow: "hidden",
        }}
      >
        {/* BACKDROP */}
        <div className="mw-bg" />

        {/* BALL + FOG ZONE (reserves plenty of space) */}
        <div
          style={{
            position: "relative",
            height: ballSize + 60,
            display: "grid",
            placeItems: "center",
            paddingTop: ballTopPad,
          }}
        >
          {/* Fog layers (behind the ball) */}
          <div className="mw-fog mw-fog-1" />
          <div className="mw-fog mw-fog-2" />
          <div className="mw-fog mw-fog-3" />

          {/* Crystal ball */}
          <div
            className={`mw-ball ${listening ? "mw-ball-listening" : ""}`}
            style={{ width: ballSize, height: ballSize }}
            aria-hidden="true"
          >
            <div className="mw-ball-glow" />
            <div className="mw-ball-spec" />
            <div className="mw-ball-swirl" />
          </div>

          {/* GOLD "TAP TO TALK" BOX (centered over the ball) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: Math.round(stageW * 0.72),
              maxWidth: 380,
              minWidth: 220,
              pointerEvents: "auto",
            }}
          >
            <button
              type="button"
              onClick={onTapToTalk}
              className="mw-talk"
              aria-label={listening ? "Listening…" : "Tap to Talk"}
            >
              <span className="mw-talk-top">
                {listening ? "Listening…" : "Tap to Talk"}
              </span>
              <span className="mw-talk-sub">
                {listening ? "Speak now" : "Ask Mr. Wizard a question"}
              </span>
            </button>
          </div>

          {/* Soft vignette on top */}
          <div className="mw-vignette" aria-hidden="true" />
        </div>

        {/* ANSWER AREA BELOW THE BALL (guaranteed space) */}
        <div
          style={{
            position: "absolute",
            left: 14,
            right: 14,
            bottom: 14,
            height: 150,
            borderRadius: 18,
            padding: 14,
            background: "rgba(5, 10, 20, 0.55)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: 0.4,
              opacity: 0.75,
              marginBottom: 8,
            }}
          >
            Mr. Wizard
          </div>

          <div
            style={{
              height: "calc(100% - 22px)",
              overflowY: "auto",
              paddingRight: 6,
              fontSize: 15,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {answerText?.trim()
              ? answerText
              : <span style={{ opacity: 0.6 }}>{answerPlaceholder}</span>}
          </div>
        </div>

        {/* Styles */}
        <style jsx>{`
          .mw-bg {
            position: absolute;
            inset: 0;
            background: radial-gradient(1200px 600px at 50% 10%, rgba(120, 190, 255, 0.20), transparent 55%),
                        radial-gradient(900px 500px at 20% 40%, rgba(40, 90, 160, 0.35), transparent 60%),
                        radial-gradient(900px 500px at 80% 45%, rgba(35, 65, 120, 0.35), transparent 60%),
                        linear-gradient(180deg, rgba(6, 12, 22, 1) 0%, rgba(6, 12, 22, 1) 55%, rgba(5, 10, 20, 1) 100%);
          }

          .mw-fog {
            position: absolute;
            inset: -20%;
            background: radial-gradient(circle at 50% 55%, rgba(255,255,255,0.14), transparent 58%),
                        radial-gradient(circle at 30% 60%, rgba(140, 200, 255, 0.10), transparent 55%),
                        radial-gradient(circle at 70% 60%, rgba(140, 200, 255, 0.10), transparent 55%);
            filter: blur(14px);
            opacity: 0.8;
            animation: fogFloat 10s ease-in-out infinite;
          }
          .mw-fog-1 { animation-duration: 12s; opacity: 0.65; }
          .mw-fog-2 { animation-duration: 16s; opacity: 0.55; }
          .mw-fog-3 { animation-duration: 20s; opacity: 0.45; }

          @keyframes fogFloat {
            0%   { transform: translate3d(-1%, 0%, 0) scale(1.02); }
            50%  { transform: translate3d(1%, -1%, 0) scale(1.04); }
            100% { transform: translate3d(-1%, 0%, 0) scale(1.02); }
          }

          .mw-ball {
            position: relative;
            border-radius: 999px;
            background:
              radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), rgba(255,255,255,0.10) 30%, rgba(80,160,255,0.12) 55%, rgba(20,60,120,0.35) 75%, rgba(0,0,0,0.45) 100%),
              radial-gradient(circle at 50% 60%, rgba(80, 200, 255, 0.25), transparent 55%),
              radial-gradient(circle at 60% 50%, rgba(140, 230, 255, 0.12), transparent 60%);
            box-shadow:
              0 30px 70px rgba(0,0,0,0.45),
              inset 0 0 40px rgba(255,255,255,0.10);
            overflow: hidden;
          }

          .mw-ball-glow {
            position: absolute;
            inset: -10%;
            background: radial-gradient(circle at 50% 70%, rgba(120, 220, 255, 0.45), transparent 60%);
            filter: blur(18px);
            opacity: 0.75;
          }

          .mw-ball-spec {
            position: absolute;
            top: 12%;
            left: 18%;
            width: 28%;
            height: 18%;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.75), rgba(255,255,255,0.12) 65%, transparent 70%);
            filter: blur(1px);
            transform: rotate(-12deg);
            border-radius: 999px;
            opacity: 0.85;
          }

          .mw-ball-swirl {
            position: absolute;
            inset: -20%;
            background:
              conic-gradient(from 220deg at 55% 60%,
                rgba(120,220,255,0.00),
                rgba(120,220,255,0.18),
                rgba(255,255,255,0.06),
                rgba(120,220,255,0.00)
              );
            filter: blur(10px);
            opacity: 0.7;
            animation: swirl 8s linear infinite;
          }

          @keyframes swirl {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .mw-ball-listening {
            box-shadow:
              0 30px 80px rgba(0,0,0,0.50),
              0 0 40px rgba(120, 220, 255, 0.35),
              inset 0 0 40px rgba(255,255,255,0.12);
          }

          .mw-talk {
            width: 100%;
            border: none;
            border-radius: 16px;
            padding: 12px 14px;
            cursor: pointer;
            text-align: center;
            color: rgba(20, 10, 0, 0.95);
            background: linear-gradient(180deg, rgba(210, 160, 55, 1) 0%, rgba(194, 139, 0, 1) 100%);
            box-shadow: 0 10px 28px rgba(0,0,0,0.28);
          }

          .mw-talk:active {
            transform: translateY(1px);
          }

          .mw-talk-top {
            display: block;
            font-weight: 800;
            font-size: 16px;
            letter-spacing: 0.4px;
          }

          .mw-talk-sub {
            display: block;
            margin-top: 4px;
            font-size: 12px;
            font-weight: 700;
            opacity: 0.85;
          }

          .mw-vignette {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: radial-gradient(circle at 50% 45%, rgba(0,0,0,0.00), rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.42) 100%);
          }
        `}</style>
      </div>
    </div>
  );
}      
