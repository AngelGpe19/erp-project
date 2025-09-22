import React, { useState } from "react";
import axios from "axios";
import { generarExcelCotizacion } from "../utils/generarExcelCotizacion";

const DownloadExcelButton = ({ cotizacionId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDownloadExcel = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticación no encontrado.");
      }

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/cotizaciones/${cotizacionId}/excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Datos del backend para Excel:", res.data);
      await generarExcelCotizacion(res.data);
    } catch (err) {
      console.error("Error al descargar el Excel:", err);
      setError("❌ Error al descargar el archivo. Intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onDownloadExcel}
        className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 ml-2"
        disabled={loading}
      >
        {loading ? "Cargando..." : "Descargar"}
      </button>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
};

export default DownloadExcelButton;
