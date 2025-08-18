// src/context/CotizacionContext.jsx
import React, { createContext, useContext, useState } from "react";

export const CotizacionContext = createContext();

export const CotizacionProvider = ({ children }) => {
  const [productosCotizacion, setProductosCotizacion] = useState([]);

  // Nuevo: agregar producto con cantidadContenido fijo y cantidadPiezas inicial 1
  const agregarProducto = ({ producto, precio, cantidadContenido = 1, cantidadPiezas = 1, ganancia = { tipo: "porcentaje", valor: 0 } }) => {

if (!producto || !precio) {
    console.error("🚨 Error: se intentó agregar producto sin datos válidos", { producto, precio });
    return;
  }
    setProductosCotizacion((prev) => [
      ...prev,
      { producto, precio, cantidadContenido, cantidadPiezas, ganancia },
    ]);
  };

  const actualizarCantidadContenido = (index, cantidadContenido) => {
    setProductosCotizacion((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, cantidadContenido: parseFloat(cantidadContenido) || 1 }
          : item
      )
    );
  };

  // Esta es la cantidad que realmente cambia para el cálculo
  const actualizarCantidadPiezas = (index, cantidadPiezas) => {
    setProductosCotizacion((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, cantidadPiezas: parseInt(cantidadPiezas) || 1 }
          : item
      )
    );
  };

  const actualizarGanancia = (index, ganancia) => {
    setProductosCotizacion((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, ganancia } : item
      )
    );
  };

  const eliminarProducto = (index) => {
    setProductosCotizacion((prev) => prev.filter((_, i) => i !== index));
  };

  const limpiarCotizacion = () => setProductosCotizacion([]);

  return (
    <CotizacionContext.Provider
      value={{
        productosCotizacion,
        agregarProducto,
        actualizarCantidadContenido,
        actualizarCantidadPiezas,
        actualizarGanancia,
        eliminarProducto,
        limpiarCotizacion,
      }}
    >
      {children}
    </CotizacionContext.Provider>
  );
};


export const useCotizacion = () => useContext(CotizacionContext);
