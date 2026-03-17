import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setLoading(true);
    // Simulamos un pequeño delay para dar sensación de carga
    setTimeout(() => {
      setLoading(false);
      navigate("/login"); // 👈 redirige al login
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bienvenido 🐾</h1>
        <p style={styles.subtitle}>
          Aprende jugando con animales, colores y números
        </p>

        {loading ? (
          <p style={styles.loading}>Cargando...</p>
        ) : (
          <button style={styles.button} onClick={handleStart}>
            Comenzar ▶️
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "white",
    padding: "60px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "500px",
  },
  title: {
    fontSize: "36px",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "40px",
  },
  button: {
    padding: "20px 40px",
    fontSize: "24px",
    borderRadius: "12px",
    border: "none",
    background: "#111",
    color: "white",
    cursor: "pointer",
  },
  loading: {
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default Splash;
