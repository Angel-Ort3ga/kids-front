import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function PerfilPadre() {
  const [data, setData] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/progreso/perfil", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error perfil padre:", err));
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setModalMessage("❌ Las contraseñas no coinciden");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/auth/change-password",
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalMessage("✅ Contraseña cambiada correctamente");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setModalMessage("❌ Error al cambiar contraseña");
    }
  };

  if (!data) return <p>Cargando perfil...</p>;

  return (
    <div style={styles.container}>
      <Navbar showSound={false} showProfile={true} />
      <div style={styles.card}>
        <h2 style={styles.title}>Perfil del Padre 👨‍👩‍👧</h2>
        <p>👤 {data.nombre} {data.apellido}</p>
        <p>📧 {data.email}</p>

        {/* Cambiar contraseña */}
        <div style={styles.section}>
          <h3>🔐 Cambiar contraseña</h3>
          <input type="password" placeholder="Nueva contraseña"
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={styles.input} />
          <input type="password" placeholder="Repite contraseña"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} />
          <button style={styles.button} onClick={handleChangePassword}>
            Guardar nueva contraseña
          </button>
        </div>

        {/* Botón para abrir modal de hijo */}
        <div style={styles.section}>
          <button style={styles.button} onClick={() => setShowAddChildModal(true)}>
            ➕ Agregar hijo
          </button>
        </div>
      </div>

      {showAddChildModal && (
        <AddChildModal onClose={() => setShowAddChildModal(false)} setModalMessage={setModalMessage} />
      )}

      {modalMessage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <p>{modalMessage}</p>
            <button style={styles.button} onClick={() => setModalMessage(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddChildModal({ onClose, setModalMessage }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validarEmail = (correo) => {
    const regex = /^[^\s@]+@(gmail\.com|outlook\.com|yahoo\.com)$/i;
    return regex.test(correo);
  };

  const validarFecha = (fecha) => {
    const hoy = new Date();
    const ingresada = new Date(fecha);
    return ingresada <= hoy;
  };

  const handleAddChild = async () => {
    if (!nombre || !apellido || !genero || !fechaNacimiento || !email || !password) {
      setModalMessage("❌ Todos los campos son obligatorios");
      return;
    }

    if (!validarEmail(email)) {
      setModalMessage("❌ El correo debe ser de Gmail, Outlook o Yahoo");
      return;
    }

    if (!validarFecha(fechaNacimiento)) {
      setModalMessage("❌ La fecha de nacimiento no puede ser mayor al día de hoy");
      return;
    }

    if (password !== confirmPassword) {
      setModalMessage("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/auth/crear-nino",
        { nombre, apellido, genero, fechaNacimiento, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalMessage("🎉 Hijo agregado correctamente");
      onClose();
    } catch {
      setModalMessage("❌ Error al agregar hijo");
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBox}>
        <h3>Agregar hijo 👶</h3>
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} style={styles.input} />
        <input placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} style={styles.input} />
        <select value={genero} onChange={(e) => setGenero(e.target.value)} style={styles.input}>
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
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Repite contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} />
        <button style={styles.button} onClick={handleAddChild}>Agregar hijo</button>
        <button style={styles.backButton} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}


const styles = {
  container: { minHeight: "100vh", background: "#f0f9ff", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "600px", textAlign: "center" },
  title: { color: "#0077b6", marginBottom: "20px" },
  section: { marginTop: "30px" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "10px", width: "100%" },
  button: { padding: "12px", borderRadius: "10px", border: "none", background: "#0077b6", color: "white", cursor: "pointer", width: "100%", fontWeight: "bold", marginTop: "10px" },
  backButton: { marginTop: "10px", padding: "10px", borderRadius: "10px", border: "none", background: "#f44336", color: "white", cursor: "pointer", width: "100%", fontWeight: "bold" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 3000 },
  modalBox: { background: "white", padding: "30px", borderRadius: "16px", textAlign: "center", width: "400px", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" },
};

export default PerfilPadre;
