import { useNavigate } from "react-router-dom";

function JuegoSelector() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>¿Qué quieres jugar?</h1>
        <div style={styles.options}>
          <button style={styles.button} onClick={() => navigate("/juego/animales")}>🐾 Animales</button>
          <button style={styles.button} onClick={() => navigate("/juego/colores")}>🎨 Colores</button>
          <button style={styles.button} onClick={() => navigate("/juego/numeros")}>🔢 Números</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#fffbea" },
  card: { background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center" },
  title: { fontSize: "28px", marginBottom: "20px", color: "#ff9800" },
  options: { display: "flex", gap: "20px", justifyContent: "center" },
  button: { padding: "20px 40px", fontSize: "20px", borderRadius: "12px", border: "none", background: "#ff9800", color: "white", cursor: "pointer" },
};

export default JuegoSelector;
