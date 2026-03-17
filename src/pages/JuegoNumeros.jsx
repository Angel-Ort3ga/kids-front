import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function JuegoNumeros() {
  const [nivelActual, setNivelActual] = useState(1);
  const [numeros, setNumeros] = useState([]);
  const [indiceNumero, setIndiceNumero] = useState(0);
  const [popup, setPopup] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [vidas, setVidas] = useState(3);
  const [correctos, setCorrectos] = useState(0);
  const [respuestasPorNivel, setRespuestasPorNivel] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [categoriaFinalizada, setCategoriaFinalizada] = useState(null);
  const [showSelectorModal, setShowSelectorModal] = useState(false);
  const navigate = useNavigate();

  // ✅ Cargar progreso y contenidos del nivel actual
  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const progresoRes = await axios.get("http://localhost:3000/api/progreso", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const nivel = progresoRes.data.progresoPorCategoria.numero.nivelActual;
        setNivelActual(nivel);
        setVidas(progresoRes.data.progresoPorCategoria.numero.vidas);
        setCorrectos(progresoRes.data.progresoPorCategoria.numero.correctos);

        const contenidosRes = await axios.get(
          `http://localhost:3000/api/contenido?tipo=numero&nivel=${nivel}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 🔧 Detectar si la respuesta es array o objeto
        if (Array.isArray(contenidosRes.data)) {
          setNumeros(contenidosRes.data);
          setRespuestasPorNivel(contenidosRes.data.length);
        } else {
          setNumeros(contenidosRes.data.contenidos || []);
          setRespuestasPorNivel(contenidosRes.data.respuestasPorNivel || (contenidosRes.data.contenidos?.length || 0));
        }

        setIndiceNumero(0);
      } catch (error) {
        console.error("Error al cargar contenido:", error.response?.data || error.message);
        setNumeros([]);
      }
    };
    fetchContenido();
  }, []);

  const numeroActual = numeros.length > 0 ? numeros[indiceNumero] : null;

  useEffect(() => {
    if (numeroActual && numeros.length > 0) {
      const distractores = numeros
        .filter((n) => n.nombre !== numeroActual.nombre)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      setOpciones([numeroActual, ...distractores].sort(() => Math.random() - 0.5));
    }
  }, [numeroActual, numeros]);

  const verificarRespuesta = async (nombre) => {
    if (!numeroActual) return;
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:3000/api/progreso/subir-nivel",
        { tipo: "numero", correcto: nombre === numeroActual.nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVidas(res.data.vidas);
      setCorrectos(res.data.correctos);
      setRespuestasPorNivel(res.data.respuestasPorNivel || numeros.length);

      if (nombre === numeroActual.nombre) {
        setPopup({ message: "🎉 ¡Correcto!", type: "success" });

        if (indiceNumero + 1 < numeros.length) {
          setTimeout(() => {
            setIndiceNumero((prev) => prev + 1);
            setPopup(null);
          }, 1500);
        } else {
          if (res.data.nivelCompletado) {
            setPopup({ message: `🎉 ¡Completaste el nivel ${nivelActual}!`, type: "success" });
            setTimeout(() => {
              setNivelActual(res.data.nivelActual);
              if (Array.isArray(res.data.contenidos)) {
                setNumeros(res.data.contenidos);
                setRespuestasPorNivel(res.data.contenidos.length);
              } else {
                setNumeros(res.data.contenidos || []);
                setRespuestasPorNivel(res.data.respuestasPorNivel || (res.data.contenidos?.length || 0));
              }
              setIndiceNumero(0);
              setPopup(null);
            }, 2000);
          } else if (res.data.categoriaTerminada) {
            setCategoriaFinalizada({
              mensaje: res.data.mensaje,
              tipo: "numero"
            });
            setPopup(null);
          }
        }
      } else {
        setPopup({ message: "❌ Incorrecto", type: "error" });

        if (res.data.message === "Game Over") {
          setPopup({ message: "💀 Game Over - Reiniciando nivel", type: "error" });
          setTimeout(() => {
            setNivelActual(res.data.nivelActual);
            if (Array.isArray(res.data.contenidos)) {
              setNumeros(res.data.contenidos);
              setRespuestasPorNivel(res.data.contenidos.length);
            } else {
              setNumeros(res.data.contenidos || []);
              setRespuestasPorNivel(res.data.respuestasPorNivel || (res.data.contenidos?.length || 0));
            }
            setIndiceNumero(0);
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

  // 👇 Si la categoría terminó, mostramos el modal Selector
  if (categoriaFinalizada) {
    return (
      <>
        <Navbar onToggleSound={() => setSoundOn(!soundOn)} soundOn={soundOn} onHome={() => navigate("/selec")} showProfile={true} />
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>{categoriaFinalizada.mensaje}</h2>
            <button style={styles.btn} onClick={() => setShowSelectorModal(true)}>📂 Abrir Selector</button>
          </div>
        </div>
        {showSelectorModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.selectorModal}>
              <h3>Selecciona otra categoría</h3>
              <button style={styles.btn} onClick={() => navigate("/selec")}>Ir al Selector</button>
              <button style={styles.btn} onClick={() => setShowSelectorModal(false)}>❌ Cerrar</button>
            </div>
          </div>
        )}
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
          {numeroActual ? (
            <div style={styles.animal}>
              <img src={`/images/${numeroActual.imagen}`} alt={numeroActual.nombre} style={{ width: "150px", height: "150px", objectFit: "contain" }} />
            </div>
          ) : null}
          <div style={styles.opciones}>
            {numeroActual && opciones.map((op, i) => (
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

export default JuegoNumeros;
