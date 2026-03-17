import { useEffect } from "react";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "14px 20px",
        borderRadius: "10px",
        color: "white",
        fontWeight: "500",
        background:
          type === "error"
            ? "#e74c3c"
            : type === "success"
            ? "#2ecc71"
            : "#333",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}
