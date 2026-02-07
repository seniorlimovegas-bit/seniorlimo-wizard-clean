import { useState } from "react";

export default function Home() {
  // TAP TEST (proves iOS click/touch is working)
  const [tapColor, setTapColor] = useState("blue"); // "blue" | "gold"
  const [tapCount, setTapCount] = useState(0);

  // CHAT (your old baseline behavior)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const BLUE = "#2926EF";
  const GOLD = "#C28B00";

  const handleTapTest = () => {
    setTapCount((n) => n + 1);
    setTapColor((c) => (c === "blue" ? "gold" : "blue"));
    // Hard proof in console
    console.log("TAP TEST FIRED", new Date().toISOString());
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setIsSending(true);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        { role: "assistant", text: data?.reply ?? "(no reply returned)" },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Error: failed to reach /api/chat" },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const onInputKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const tapBg = tapColor === "blue" ? BLUE : GOLD;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0F18",
        color: "#EAF0FF",
        display: "flex",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 720 }}>
        {/* TAP TEST BLOCK */}
        <div
          style={{
            marginBottom: 18,
            padding: 14,
            borderRadius: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>
            Tap Test (must work on iPad/iPhone). Taps: <b>{tapCount}</b>
          </div>

          <div
            role="button"
            aria-label="Tap Test Square"
            // iOS: touch + pointer + click (belt + suspenders)
            onClick={handleTapTest}
            onTouchStart={handleTapTest}
            onPointerDown={handleTapTest}
            style={{
              width: "100%",
              height: 120,
              borderRadius: 12,
              background: tapBg,
              boxShadow:
                tapColor === "blue"
                  ? `0 0 30px rgba(41,38,239,0.55)`
                  : `0 0 30px rgba(194,139,0,0.55)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#0B0F18",
              cursor: "pointer",
              userSelect: "none",
              WebkitUserSelect: "none",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          >
            TAP HERE (toggles Blue ↔ Gold)
          </div>

          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 10 }}>
            If this does NOT toggle, the problem is not the crystal ball — it’s
            click/touch being blocked by layout/CSS/overlay or the wrong build
            being served.
          </div>
        </div>

        {/* CHAT UI (baseline) */}
        <h1 style={{ margin: "0 0 12px 0", fontSize: 22 }}>
          Mr. Wizard (Baseline Chat)
        </h1>

        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: 12,
            minHeight: 260,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0 ? (
              <div style={{ opacity: 0.7 }}>
                Type a message below to test /api/chat.
              </div>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "92%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    background:
                      m.role === "user"
                        ? "rgba(41,38,239,0.25)"
                        : "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>
                    {m.role === "user" ? "You" : "Mr. Wizard"}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.35 }}>{m.text}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKeyDown}
           
