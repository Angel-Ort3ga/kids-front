import React from "react";

function CategoriaTerminada({ mensaje, onReiniciar, onIrOtras }) {
  return (
    <div style={styles.finalScreen}>
      <h2 style={styles.title}>{mensaje}</h2>
      <p style={styles.subtitle}>¿Qué quieres hacer ahora?</p>

      <div style={styles.buttons}>
        <button style={styles.btnReiniciar} onClick={onReiniciar}>
          🔄 Reiniciar categoría
        </button>
        <button style={styles.btnOtras} onClick={onIrOtras}>
          📂 Ir a otras categorías
        </button>
      </div>
    </div>
  );
}

const styles = {
  finalScreen: {
    textAlign: "center",
    padding: "40px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "40px auto",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#555",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  btnReiniciar: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  btnOtras: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#2196F3",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default CategoriaTerminada;
