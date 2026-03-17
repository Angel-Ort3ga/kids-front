import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ showSound = true, soundOn, onToggleSound }) {
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const tokenData = localStorage.getItem("rol");
    if (tokenData) {
      setRol(tokenData);
    }
  }, []);

  const handleBack = () => {
    navigate(-1); // regresa a la pantalla anterior
  };

  const handleHome = () => {
    if (rol === "PADRE") {
      navigate("/dashboard-padre"); // casita → dashboard padre
    } else {
      navigate("/selector"); // casita → selector de juego niño
    }
  };

  const handleLogoutClick = () => setShowConfirmLogout(true);
  const confirmLogout = () => {
    localStorage.clear();
    navigate("/"); // manda al inicio
  };

  return (
    <>
      <div style={styles.navbar}>
        {/* Flechita de regresar */}
        <button style={styles.navButton} onClick={handleBack}>←</button>

        {/* Casita → Dashboard o Selector */}
        <button style={styles.navButton} onClick={handleHome}>🏠</button>

        {/* Perfil para PADRE y también para NIÑO */}
        {rol === "PADRE" && (
          <button style={styles.navButton} onClick={() => navigate("/perfil-padre")}>
            👤 Perfil
          </button>
        )}
        {rol === "NINO" && (
          <button style={styles.navButton} onClick={() => navigate("/perfil")}>
            👤 Perfil
          </button>
        )}

        {/* Sonido solo para NIÑO */}
        {rol === "NINO" && showSound && (
          <button style={styles.navButton} onClick={onToggleSound}>
            {soundOn ? "🔊" : "🔇"}
          </button>
        )}

        {/* Logout */}
        <button style={styles.navButton} onClick={handleLogoutClick}>🚪 Salir</button>
      </div>

      {/* Confirmación de logout */}
      {showConfirmLogout && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmBox}>
            <h2>¿Seguro que quieres salir?</h2>
            <div style={styles.confirmButtons}>
              <button style={styles.confirmYes} onClick={confirmLogout}>Sí</button>
              <button style={styles.confirmNo} onClick={() => setShowConfirmLogout(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "#4CAF50",
    color: "white",
    display: "flex",
    justifyContent: "space-around",
    padding: "12px",
    zIndex: 1000,
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  navButton: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "22px",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  confirmOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3000,
  },
  confirmBox: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    width: "300px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },
  confirmButtons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-around",
  },
  confirmYes: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  confirmNo: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#f44336",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;
