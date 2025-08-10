// src/pages/CotizacionCrearEditarPage.jsx
import React, { useContext } from "react";
import { CotizacionContext } from "../context/CotizacionContext";
import CotizacionForm  from "../components/cotizaciones/CotizacionForm";

const CotizacionesCrearEditarPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Cotización</h1>
      <CotizacionForm />
    </div>
  );
};

export default CotizacionesCrearEditarPage;
