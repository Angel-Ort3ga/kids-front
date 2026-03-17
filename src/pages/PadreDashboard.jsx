import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function PadreDashboard() {
  const [hijos, setHijos] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/progreso/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setHijos(res.data))
      .catch((err) => console.error("Error dashboard:", err));
  }, []);

  return (
    <div style={styles.container}>
      <Navbar showSound={false} />

      <div style={styles.card}>
        <h2>Panel del Padre 👨‍👩‍👧</h2>

        {!selectedChild ? (
          <div style={styles.grid}>
            {hijos.map((hijo, i) => (
              <div
                key={i}
                style={styles.hijoCard}
                onClick={() => setSelectedChild(hijo)}
              >
                <h3>{hijo.nombre} {hijo.apellido}</h3>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.detail}>
            <h3>Progreso de {selectedChild.nombre}</h3>
            <div style={styles.progressGrid}>
              <ProgressCard
  icon="🐾"
  titulo="Animales"
  data={selectedChild.progreso?.animal}
/>
<ProgressCard
  icon="🔢"
  titulo="Números"
  data={selectedChild.progreso?.numero}
/>
<ProgressCard
  icon="🎨"
  titulo="Colores"
  data={selectedChild.progreso?.color}
/>
</div>
            <button style={styles.backButton} onClick={() => setSelectedChild(null)}>
              ⬅️ Regresar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressCard({ icon, titulo, data }) {
  if (!data) {
    return <p style={{ color: "red" }}>Sin progreso registrado en {titulo}</p>;
  }

  const nivelActual = data.nivelActual;
  const totalNiveles = data.totalNiveles;

  return (
    <div style={styles.progressCard}>
      <h4>{icon} {titulo}</h4>
      <div style={styles.checks}>
        {Array.from({ length: totalNiveles }).map((_, i) => {
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
      {nivelActual > totalNiveles && (
        <p style={{ color: "green", marginTop: "10px" }}>
          ✅ Categoría completada
        </p>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f5f5f5", paddingTop: "60px", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "700px", textAlign: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" },
  hijoCard: { background: "#fafafa", border: "1px solid #eee", borderRadius: "12px", padding: "20px", cursor: "pointer", transition: "transform 0.2s" },
  detail: { fontSize: "18px", color: "#333" },
  backButton: { marginTop: "20px", padding: "12px 24px", fontSize: "16px", borderRadius: "8px", border: "none", background: "#111", color: "white", cursor: "pointer" },
  progressGrid: { display: "flex", justifyContent: "space-around", gap: "20px", marginTop: "20px", flexWrap: "wrap" },
  progressCard: { flex: "1", minWidth: "180px", background: "#fdfdfd", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" },
  checks: { fontSize: "16px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px" },
};

export default PadreDashboard;
