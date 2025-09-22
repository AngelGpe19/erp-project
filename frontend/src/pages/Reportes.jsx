// src/pages/Reportes.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { generarReporteProductos, generarReportePrecios } from '../utils/generarReportesExcel';

const Reportes = () => {
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleDownloadProductos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/reportes/productos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Datos de productos obtenidos:", res.data);
      generarReporteProductos(res.data);
    } catch (error) {
      console.error("Error al descargar reporte de productos:", error);
      alert("❌ Error al generar el reporte de productos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrecios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/reportes/precios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Datos de precios obtenidos:", res.data);
      generarReportePrecios(res.data);
    } catch (error) {
      console.error("Error al descargar reporte de precios:", error);
      alert("❌ Error al generar el reporte de precios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📁 Reportes de Datos Maestros</h1>
      <p>Selecciona el tipo de reporte que deseas generar y descargar.</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button
          className="btn btn-azul"
          onClick={handleDownloadProductos}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Descargar Reporte de Productos'}
        </button>
        <button
          className="btn btn-azul"
          onClick={handleDownloadPrecios}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Descargar Reporte de Precios'}
        </button>
      </div>

      {loading && (
        <p style={{ marginTop: '1rem', color: '#2b5c99' }}>Generando tu reporte, por favor espera...</p>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ flex: '1' }}>
          <h3>Reporte de Productos</h3>
          <p>Genera un Excel con la lista completa de todos los productos registrados, incluyendo su ID, nombre, unidad de medida, descripción y categoría.</p>
        </div>
        <div style={{ flex: '1' }}>
          <h3>Reporte de Precios</h3>
          <p>Genera un Excel con todos los precios registrados. El reporte incluirá detalles como el nombre del producto, el proveedor y el precio unitario.</p>
        </div>
      </div>
    </div>
  );
};

export default Reportes;