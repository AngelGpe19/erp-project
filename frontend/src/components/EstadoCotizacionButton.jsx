// src/components/cotizaciones/EstadoCotizacionButton.jsx
import React from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const EstadoCotizacionButton = ({ idCotizacion, estadoActual, fetchCotizaciones }) => {
  const { usuario } = useAuth();
  const token = localStorage.getItem("token");

  const cambiarEstado = async (nuevoEstado) => {
    if (!usuario) {
      alert("⚠️ Usuario no autenticado");
      return;
    }

    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/cotizaciones/${idCotizacion}/estado`,
        {
          nuevoEstado,
          id_usuario: usuario.id_usuario, // 🔥 ahora usamos el ID real
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`✅ Estado cambiado a ${res.data.nuevoEstado}`);
      fetchCotizaciones();
    } catch (err) {
      console.error("❌ Error al cambiar estado:", err);
      alert("Error al cambiar estado");
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {estadoActual === "pendiente" && (
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          onClick={() => cambiarEstado("Revisado")}
        >
          Revisar
        </button>
      )}

      {estadoActual === "Revisado" && (
        <>
          <button
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            onClick={() => cambiarEstado("Aprobado")}
          >
            Aprobar
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            onClick={() => cambiarEstado("Rechazada")}
          >
            Rechazar
          </button>
        </>
      )}
    </div>
  );
};

export default EstadoCotizacionButton;
