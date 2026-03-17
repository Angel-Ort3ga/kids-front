import React from "react";
import { useNavigate } from "react-router-dom";

function Inicio() {
  const navigate = useNavigate();

  return (
    <div style={styles.inicio}>
      <h1>Bienvenido al Juego de Animales 🐾</h1>
      <button style={styles.playButton} onClick={() => navigate("/juego")}>
        ▶️ Jugar
      </button>
    </div>
  );
}

const styles = {
  inicio: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  playButton: {
    padding: "20px 40px",
    fontSize: "24px",
    borderRadius: "12px",
    border: "none",
    background: "#111",
    color: "white",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Inicio;
