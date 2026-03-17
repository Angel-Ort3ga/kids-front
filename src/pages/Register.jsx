import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validarEmail = (correo) => {
    // Solo permite Gmail, Outlook y Yahoo
    const regex = /^[^\s@]+@(gmail\.com|outlook\.com|yahoo\.com)$/i;
    return regex.test(correo);
  };

  const validarFecha = (fecha) => {
    const hoy = new Date();
    const ingresada = new Date(fecha);
    return ingresada <= hoy;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !genero || !fechaNacimiento || !email || !password) {
      toast.error("Todos los campos son obligatorios ❌");
      return;
    }

    if (!validarEmail(email)) {
      toast.error("El correo debe ser de Gmail, Outlook o Yahoo ❌");
      return;
    }

    if (!validarFecha(fechaNacimiento)) {
      toast.error("La fecha de nacimiento no puede ser mayor al día de hoy ❌");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        nombre,
        apellido,
        genero,
        fechaNacimiento,
        email,
        password,
      });
alert(res.data.message);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.usuario.rol);

      toast.success("Cuenta creada exitosamente 🎉");

      if (res.data.usuario.rol === "PADRE") {
        navigate("/perfil-padre");
      } else {
        navigate("/selector");
      }
    } catch (error) {
      toast.error("Error al registrar ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta 🐾</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            style={styles.input}
          />
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            style={styles.input}
          >
            <option value="">Selecciona género</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="OTRO">Otro</option>
          </select>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            style={styles.input}
            max={new Date().toISOString().split("T")[0]} // 👈 no permite fechas futuras
          />
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
          <button style={styles.button}>Registrarse</button>
        </form>
        <p style={styles.login}>
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f9ff" },
  card: { background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "400px", textAlign: "center" },
  title: { color: "#0077b6", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #ddd" },
  button: { padding: "12px", borderRadius: "10px", border: "none", background: "#0077b6", color: "white", cursor: "pointer", fontWeight: "bold" },
  login: { marginTop: "20px" },
  link: { color: "#0077b6", fontWeight: "bold", cursor: "pointer" },
};
