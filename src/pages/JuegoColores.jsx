import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function JuegoColores() {
  const [nivelActual, setNivelActual] = useState(1);
  const [colores, setColores] = useState([]);
  const [indiceColor, setIndiceColor] = useState(0);
  const [popup, setPopup] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [vidas, setVidas] = useState(3);
  const [correctos, setCorrectos] = useState(0);
  const [respuestasPorNivel, setRespuestasPorNivel] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [categoriaFinalizada, setCategoriaFinalizada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const progresoRes = await api.get("/progreso", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const nivel = progresoRes.data.progresoPorCategoria.color.nivelActual;
        setNivelActual(nivel);
        setVidas(progresoRes.data.progresoPorCategoria.color.vidas);
        setCorrectos(progresoRes.data.progresoPorCategoria.color.correctos);

        const contenidosRes = await api.get(
          `/contenido?tipo=color&nivel=${nivel}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (Array.isArray(contenidosRes.data)) {
          setColores(contenidosRes.data);
          setRespuestasPorNivel(contenidosRes.data.length);
        } else {
          setColores(contenidosRes.data.contenidos || []);
          setRespuestasPorNivel(contenidosRes.data.respuestasPorNivel || 0);
        }

        setIndiceColor(0);
      } catch (error) {
        console.error("Error al cargar contenido:", error.response?.data || error.message);
        setColores([]);
      }
    };
    fetchContenido();
  }, []);

  const colorActual = colores.length > 0 ? colores[indiceColor] : null;

  useEffect(() => {
    if (colorActual && colores.length > 0) {
      const distractores = colores
        .filter((c) => c.nombre !== colorActual.nombre)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      setOpciones([colorActual, ...distractores].sort(() => Math.random() - 0.5));
    }
  }, [colorActual, colores]);

  const verificarRespuesta = async (nombre) => {
    if (!colorActual) return;
    const token = localStorage.getItem("token");

    try {
      const res = await api.post("/progreso/subir-nivel",
        { tipo: "color", correcto: nombre === colorActual.nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVidas(res.data.vidas);
      setCorrectos(res.data.correctos);
      setRespuestasPorNivel(res.data.respuestasPorNivel || colores.length);

      if (nombre === colorActual.nombre) {
        setPopup({ message: "🎉 ¡Correcto!", type: "success" });

        if (indiceColor + 1 < colores.length) {
          setTimeout(() => {
            setIndiceColor((prev) => prev + 1);
            setPopup(null);
          }, 1500);
        } else {
          // 🔧 Ajuste: manejar fin de categoría
          if (res.data.categoriaTerminada) {
            setCategoriaFinalizada({
              mensaje: res.data.mensaje || "🎉 ¡Has completado todos los niveles de colores!",
              tipo: "color"
            });
            setPopup(null);
          } else if (res.data.nivelCompletado) {
            setPopup({ message: `🎉 ¡Completaste el nivel ${nivelActual}!`, type: "success" });
            setTimeout(() => {
              setNivelActual(res.data.nivelActual);
              if (res.data.contenidos && res.data.contenidos.length > 0) {
                setColores(res.data.contenidos);
              }
              setIndiceColor(0);
              setPopup(null);
            }, 2000);
          }
        }
      } else {
        setPopup({ message: "❌ Incorrecto", type: "error" });

        if (res.data.message === "Game Over") {
          setPopup({ message: "💀 Game Over - Reiniciando nivel", type: "error" });
          setTimeout(() => {
            setNivelActual(res.data.nivelActual);
            setColores(res.data.contenidos || []);
            setIndiceColor(0);
            setVidas(res.data.vidas);
            setCorrectos(res.data.correctos);
            setPopup(null);
          }, 2000);
        } else {
          setTimeout(() => setPopup(null), 1500);
        }
      }
    } catch (error) {
      console.error("Error al verificar respuesta:", error.response?.data || error.message);
    }
  };

  if (categoriaFinalizada) {
    return (
      <>
        <Navbar onToggleSound={() => setSoundOn(!soundOn)} soundOn={soundOn} onHome={() => navigate("/selec")} showProfile={true} />
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>{categoriaFinalizada.mensaje}</h2>
            <button style={styles.btn} onClick={() => navigate("/selec")}>Ir al Selector</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onToggleSound={() => setSoundOn(!soundOn)} soundOn={soundOn} onHome={() => navigate("/selec")} showProfile={true} />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <span style={styles.nivel}>Nivel {nivelActual}</span>
            <div style={styles.progressBar}>
              <div style={{
                ...styles.progressFill,
                width: respuestasPorNivel > 0 ? `${(correctos / respuestasPorNivel) * 100}%` : "0%",
              }}></div>
            </div>
            <div style={styles.vidas}>
              {Array.from({ length: vidas }).map((_, i) => (<span key={i} style={{ color: "red", fontSize: "22px" }}>❤️</span>))}
            </div>
          </div>
          {colorActual ? (
            <div style={styles.animal}>
              <img src={`/images/${colorActual.imagen}`} alt={colorActual.nombre} style={{ width: "150px", height: "150px", objectFit: "contain" }} />
            </div>
          ) : <p>No hay color actual</p>}
          <div style={styles.opciones}>
            {colorActual && opciones.map((op, i) => (
              <button key={i} style={styles.boton} onClick={() => verificarRespuesta(op.nombre)}>
                <img src={`/images/${op.imagen}`} alt={op.nombre} style={{ width: "80px", height: "80px", objectFit: "contain" }} />
                <p>{op.nombre}</p>
              </button>
            ))}
          </div>
        </div>
        {popup && (<div style={styles.popup}><p>{popup.message}</p></div>)}
      </div>
    </>
  );
}


const styles = {
  container: { minHeight: "100vh", background: "#fffbea", display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "80px" },
  card: { background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center", width: "600px" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "20px" },
  nivel: { fontSize: "20px", fontWeight: "bold", color: "#ff9800" },
  progressBar: { flex: 1, background: "#eee", borderRadius: "10px", height: "20px" },
  progressFill: { background: "#4CAF50", height: "100%", borderRadius: "10px" },
  vidas: { display: "flex", gap: "5px" },
  animal: { margin: "20px 0" },
  opciones: { display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginTop: "20px" },
  boton: { padding: "20px", borderRadius: "12px", border: "2px solid #ff9800", background: "#ff9800", color: "white", cursor: "pointer", fontSize: "18px", fontWeight: "bold", transition: "0.3s", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  popup: { position: "fixed", top: "30%", left: "50%", transform: "translate(-50%, -50%)", background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", fontSize: "20px", fontWeight: "bold", color: "#ff9800" },
};

export default JuegoColores;
