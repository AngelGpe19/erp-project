// src/components/cotizaciones/CotizacionForm.jsx
import React, { useContext } from "react";
import BuscarProductoForm from "./BuscarProductoForm"; 
import TablaDetalleCotizacion from "./TablaDetalleCotizacion";
import TotalesResumen from "./TotalesResumen"; 
import BotonGuardar  from "./BotonGuardar"; 
import { CotizacionContext } from "../../context/CotizacionContext";



const CotizacionForm = () => {

  
  const {
    productosCotizacion,
    actualizarCantidadContenido,
   actualizarCantidadPiezas,
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
         actualizarCantidadPiezas={actualizarCantidadPiezas}
        actualizarGanancia={actualizarGanancia}
        eliminarProducto={eliminarProducto}
      />

      <TotalesResumen productosCotizacion={productosCotizacion} />

      <BotonGuardar />


    </div>
  );
};

export default CotizacionForm;
