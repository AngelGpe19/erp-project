// src/pages/CotizacionCrearEditarPage.jsx
import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CotizacionContext } from "../context/CotizacionContext";
import CotizacionForm from "../components/cotizaciones/CotizacionForm";
import axios from "axios";

const CotizacionesCrearEditarPage = ({ modo }) => {
  const { id } = useParams();
  const { cargarCotizacionExistente, limpiarCotizacion } = useContext(CotizacionContext);

  useEffect(() => {
    if (modo === "editar" && id) {
      const fetchCotizacion = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/cotizaciones/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // suponiendo que el backend devuelva los productos en res.data.productos
          cargarCotizacionExistente(res.data.productos);
        } catch (err) {
          console.error("Error al cargar cotización:", err);
        }
      };

      fetchCotizacion();
    } else {
      limpiarCotizacion();
    }
  }, [id, modo]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {modo === "editar" ? "Editar Cotización" : "Crear Cotización"}
      </h1>
      <CotizacionForm modo={modo} idCotizacion={id} />
    </div>
  );
};

export default CotizacionesCrearEditarPage;
