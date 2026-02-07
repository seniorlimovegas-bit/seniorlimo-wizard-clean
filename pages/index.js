export default function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.ballWrapper}>
        <div style={styles.crystalBall}></div>
        <div style={styles.label}>Tap to Speak</div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0f1a",
  },
  ballWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  crystalBall: {
    width: 220,
    height: 220,
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 30% 30%, #9fd3ff, #1e4ed8, #0a1a44)",
    boxShadow:
      "0 0 30px rgba(100,150,255,0.8), inset 0 0 20px rgba(255,255,255,0.4)",
    cursor: "pointer",
  },
  label: {
    marginTop: 16,
    fontSize: 18,
    color: "#f5c77a",
    fontFamily: "sans-serif",
  },
};
