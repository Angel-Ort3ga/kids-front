import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function Ajuste() {
  const [soundOn, setSoundOn] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/auth/change-password",
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Contraseña cambiada correctamente ✅");
    } catch (error) {
      setMessage("Error al cambiar contraseña ❌");
    }
  };

  return (
    <div style={styles.container}>
      <Navbar onToggleSound={() => setSoundOn(!soundOn)} soundOn={soundOn} />

      <div style={styles.card}>
        <h2>Ajustes ⚙️</h2>

        <div style={styles.section}>
          <label>🔊 Sonido:</label>
          <button onClick={() => setSoundOn(!soundOn)}>
            {soundOn ? "Desactivar" : "Activar"}
          </button>
        </div>

        <div style={styles.section}>
          <label>🔐 Cambiar contraseña:</label>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleChangePassword}>Guardar</button>
        </div>

        <div style={styles.section}>
          <button onClick={handleLogout} style={styles.logout}>
            🚪 Cerrar sesión
          </button>
        </div>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f5f5",
    paddingTop: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "500px",
  },
  section: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginRight: "10px",
  },
  logout: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #111",
    background: "white",
    cursor: "pointer",
  },
};

export default Ajuste;
