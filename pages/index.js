"use client";

import { useState } from "react";
import CrystalBall from "../components/CrystalBall";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleTapToTalk = () => {
    setListening(true);
    setAnswer("I am awake. Ask your question.");
    setTimeout(() => setListening(false), 2000);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>SeniorLimo – Mr. Wizard</h1>

      <CrystalBall
        listening={listening}
        onTapToTalk={handleTapToTalk}
        answer={answer}
      />
    </div>
  );
}
