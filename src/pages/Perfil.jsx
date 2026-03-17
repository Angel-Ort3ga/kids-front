import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Logros from "../components/Logros"; // 👈 nuevo import

function Perfil() {
  const [data, setData] = useState(null);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/progreso/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("Perfil niño (respuesta backend):", JSON.stringify(res.data, null, 2));
        setData(res.data);
      })
      .catch((err) => console.error("Error perfil:", err));
  }, []);

  if (!data) return <p>Cargando perfil...</p>;

  return (
    <div style={styles.container}>
      <Navbar
        onToggleSound={() => setSoundOn(!soundOn)}
        soundOn={soundOn}
        showProfile={true}
      />

      <div style={styles.card}>
        <h2 style={styles.title}>
          Perfil de {data.nombre} {data.apellido}
        </h2>
        <p style={styles.email}>📧 {data.email}</p>

        {/* 👇 Mostrar nombre del padre solo si existe */}
        {data.padre?.nombre && (
          <p style={styles.parent}>👨‍👦 Vinculado con su padre: {data.padre.nombre}</p>
        )}

        {/* Progreso */}
        <h3 style={styles.sectionTitle}>📈 Progreso</h3>
        <div style={styles.progressGrid}>
          <ProgressCard
            icon="🐾"
            titulo="Animales"
            categoria={data.progreso?.animal?.progresoPorCategoria?.animal}
            totalNiveles={data.progreso?.animal?.totalNiveles}
          />
          <ProgressCard
            icon="🔢"
            titulo="Números"
            categoria={data.progreso?.numero?.progresoPorCategoria?.numero}
            totalNiveles={data.progreso?.numero?.totalNiveles}
          />
          <ProgressCard
            icon="🎨"
            titulo="Colores"
            categoria={data.progreso?.color?.progresoPorCategoria?.color}
            totalNiveles={data.progreso?.color?.totalNiveles}
          />
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ icon, titulo, categoria, totalNiveles }) {
  if (!categoria) {
    return <p style={{ color: "red" }}>Sin progreso registrado en {titulo}</p>;
  }

  const nivelActual = categoria.nivelActual;
  const niveles = totalNiveles || 3;

  return (
    <div style={styles.progressCard}>
      <h4>{icon} {titulo}</h4>
      <div style={styles.checks}>
        {Array.from({ length: niveles }).map((_, i) => {
          const nivel = i + 1;
          const completado = nivel < nivelActual;
          const actual = nivel === nivelActual;

          return (
            <span key={nivel} style={{
              color: completado ? "green" : actual ? "blue" : "#999",
              fontWeight: completado || actual ? "bold" : "normal"
            }}>
              {completado ? `✅ Nivel ${nivel}`
               : actual ? `➡️ Nivel actual: ${nivel}`
               : `Nivel ${nivel}`}
            </span>
          );
        })}
      </div>
      {nivelActual > niveles && (
        <p style={{ color: "green", marginTop: "10px" }}>
          ✅ Categoría completada
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f9fafb",
    paddingTop: "70px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    width: "700px",
    textAlign: "center",
  },
  title: { fontSize: "28px", marginBottom: "10px", color: "#333" },
  email: { fontSize: "16px", color: "#555", marginBottom: "10px" },
  parent: { fontSize: "16px", color: "#444", marginBottom: "15px" },
  sectionTitle: { fontSize: "22px", margin: "20px 0 10px", color: "#4CAF50" },
  progressGrid: {
    display: "flex",
    justifyContent: "space-around",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  progressCard: {
    flex: "1",
    minWidth: "180px",
    background: "#fdfdfd",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  checks: {
    fontSize: "16px",
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
};

export default Perfil;
