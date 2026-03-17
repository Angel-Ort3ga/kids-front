import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Toast from "../components/Toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setToast({ message: "Todos los campos son obligatorios", type: "error" });
        return;
      }

      const res = await api.post("/auth/login", { email, password });

      // Guardar token y rol
      localStorage.setItem("token", res.data.token);
      const rol = res.data.usuario.rol.toUpperCase();
      localStorage.setItem("rol", rol);

      // Redirigir según rol
      if (rol === "PADRE") {
        navigate("/dashboard-padre");
      } else {
        navigate("/selector");
      }
    } catch (error) {
      setToast({ message: "Error al iniciar sesión ❌", type: "error" });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión 🔑</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button style={styles.button}>Entrar</button>
        </form>
        <p style={styles.register}>
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/register")} style={styles.link}>
            Regístrate
          </span>
        </p>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff0f5",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
  },
  title: { color: "#ff69b4", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #ddd" },
  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#ff69b4",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  register: { marginTop: "20px" },
  link: { color: "#ff69b4", fontWeight: "bold", cursor: "pointer" },
};

export default Login;
