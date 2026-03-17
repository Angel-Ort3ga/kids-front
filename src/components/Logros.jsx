function Logros({ logros }) {
  if (!logros || logros.length === 0) {
    return <p style={{ color: "#999" }}>No hay logros desbloqueados todavía</p>;
  }

  return (
    <div style={styles.logrosGrid}>
      {logros.map((logro) => (
        <div key={logro._id} style={styles.logroCard}>
          <span style={styles.icon}>{logro.icono}</span>
          <h4 style={styles.titulo}>{logro.titulo}</h4>
          <p style={styles.descripcion}>{logro.descripcion}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  logrosGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    marginTop: "20px",
  },
  logroCard: {
    background: "linear-gradient(135deg, #fdfdfd, #f0f0f0)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    minWidth: "180px",
    textAlign: "center",
  },
  icon: { fontSize: "40px" },
  titulo: { fontSize: "18px", margin: "10px 0", color: "#333" },
  descripcion: { fontSize: "14px", color: "#555" },
};

export default Logros;
