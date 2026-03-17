import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function JuegoAnimales() {
  const [nivelActual, setNivelActual] = useState(1);
  const [animales, setAnimales] = useState([]);
  const [indiceAnimal, setIndiceAnimal] = useState(0);
  const [popup, setPopup] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [vidas, setVidas] = useState(3);
  const [correctos, setCorrectos] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  const navigate = useNavigate();

  // ✅ Cargar progreso y contenidos del nivel actual
  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const progresoRes = await api.get("/progreso", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const nivel = progresoRes.data.progresoPorCategoria.animal.nivelActual;
        setNivelActual(nivel);
        setVidas(progresoRes.data.progresoPorCategoria.animal.vidas);
        setCorrectos(progresoRes.data.progresoPorCategoria.animal.correctos);

        const contenidosRes = await api.get(
          `/contenido?tipo=animal&nivel=${nivel}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAnimales(contenidosRes.data || []);
        setIndiceAnimal(0);
      } catch (error) {
        console.error("Error al cargar contenido:", error.response?.data || error.message);
        setAnimales([]);
      }
    };
    fetchContenido();
  }, []);

  const animalActual = animales.length > 0 ? animales[indiceAnimal] : null;

  useEffect(() => {
    if (animalActual && animales.length > 0) {
      const distractores = animales
        .filter((a) => a.nombre !== animalActual.nombre)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      setOpciones([animalActual, ...distractores].sort(() => Math.random() - 0.5));
    }
  }, [animalActual, animales]);

  const verificarRespuesta = async (nombre) => {
    if (!animalActual) return;
    const token = localStorage.getItem("token");

    try {
      const res = await api.post("/progreso/subir-nivel",
        { tipo: "animal", correcto: nombre === animalActual.nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVidas(res.data.vidas);
      setCorrectos(res.data.correctos);

      if (nombre === animalActual.nombre) {
        setPopup({ message: "🎉 ¡Correcto!", type: "success" });

        if (indiceAnimal + 1 < animales.length) {
          setTimeout(() => {
            setIndiceAnimal(indiceAnimal + 1);
            setPopup(null);
          }, 1500);
        } else {
          if (res.data.nivelCompletado) {
            setPopup({ message: `🎉 ¡Completaste el nivel ${nivelActual}!`, type: "success" });
            setTimeout(() => {
              setNivelActual(res.data.nivelActual);
              setAnimales(res.data.contenidos);
              setIndiceAnimal(0);
              setPopup(null);
            }, 2000);
          } else if (res.data.nivelActual > nivelActual && res.data.contenidos && res.data.contenidos.length > 0) {
            setNivelActual(res.data.nivelActual);
            setAnimales(res.data.contenidos);
            setIndiceAnimal(0);
            setPopup(null);
          } else if (res.data.contenidos && res.data.contenidos.length > 0) {
            setAnimales(res.data.contenidos);
            setIndiceAnimal(0);
            setPopup(null);
          } else if (res.data.categoriaTerminada) {
            setPopup({ message: "✅ Ya terminaste la categoría Animales", type: "success" });
            setTimeout(() => navigate("/selec"), 2000);
          }
        }
      } else {
        setPopup({ message: "❌ Incorrecto", type: "error" });

       if (res.data.message === "Game Over") {
  setPopup({ message: "💀 Game Over - Reiniciando nivel", type: "error" });
  setTimeout(() => {
    // 👇 ahora sí tenemos contenidos del backend
    setNivelActual(res.data.nivelActual);
    setAnimales(res.data.contenidos || []);
    setIndiceAnimal(0);   // reinicia al primer animal
    setVidas(res.data.vidas); // ya viene reiniciado a 3
    setCorrectos(res.data.correctos); // reiniciado a 0
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

  return (
    <>
      <Navbar
  onToggleSound={() => setSoundOn(!soundOn)}
  soundOn={soundOn}
  onHome={() => navigate("/selec")}
  showProfile={true}   // 👈 esto activa el botón Perfil
/>
<div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <span style={styles.nivel}>Nivel {nivelActual}</span>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: animales.length > 0 ? `${(correctos / animales.length) * 100}%` : "0%",
                }}
              ></div>
            </div>
            <div style={styles.vidas}>
              {Array.from({ length: vidas }).map((_, i) => (
                <span key={i} style={{ color: "red", fontSize: "22px" }}>❤️</span>
              ))}
            </div>
          </div>

          {animalActual ? (
            <div style={styles.animal}>
              <img
                src={`/images/${animalActual.imagen}`}
                alt={animalActual.nombre}
                style={{ width: "150px", height: "150px", objectFit: "contain" }}
              />
            </div>
          ) : (
            <p>💀 Nivel reiniciado o categoría completada</p>
          )}

          <div style={styles.opciones}>
            {animalActual && opciones.map((op, i) => (
              <button key={i} style={styles.boton} onClick={() => verificarRespuesta(op.nombre)}>
                <img
                  src={`/images/${op.imagen}`}
                  alt={op.nombre}
                  style={{ width: "80px", height: "80px", objectFit: "contain" }}
                />
                <p>{op.nombre}</p>
              </button>
            ))}
          </div>
        </div>

        {popup && (
          <div style={styles.popup}>
            <p>{popup.message}</p>
          </div>
        )}
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

export default JuegoAnimales;
