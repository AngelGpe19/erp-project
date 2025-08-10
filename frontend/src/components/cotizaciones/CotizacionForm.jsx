// src/components/cotizaciones/CotizacionForm.jsx
import React, { useContext } from "react";
import BuscarProductoForm from "./BuscarProductoForm"; // corregido nombre según tu importación
import TablaDetalleCotizacion from "./TablaDetalleCotizacion";
import TotalesResumen from "./TotalesResumen"; // asumimos que ya está creado y exportado
import { CotizacionContext } from "../../context/CotizacionContext";

const CotizacionForm = () => {
  const {
    productosCotizacion,
    actualizarCantidadContenido,
    actualizarGanancia,
    eliminarProducto,
  } = useContext(CotizacionContext);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Agregar Productos a la Cotización</h2>

      <BuscarProductoForm />

      <TablaDetalleCotizacion
        productosCotizacion={productosCotizacion}
        actualizarCantidadContenido={actualizarCantidadContenido}
        actualizarGanancia={actualizarGanancia}
        eliminarProducto={eliminarProducto}
      />

      <TotalesResumen productosCotizacion={productosCotizacion} />
    </div>
  );
};

export default CotizacionForm;
