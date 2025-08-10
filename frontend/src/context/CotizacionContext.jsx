// src/context/CotizacionContext.jsx
import React, { createContext, useContext, useState } from "react";

export const CotizacionContext = createContext();

export const CotizacionProvider = ({ children }) => {
  // Estado con productos, cada uno con producto, precio, cantidadContenido y ganancia
  const [productosCotizacion, setProductosCotizacion] = useState([]);

  // Agrega producto completo con cantidadContenido inicial 1 y ganancia 0%
  const agregarProducto = ({ producto, precio, cantidadContenido = 1, ganancia = { tipo: "porcentaje", valor: 0 } }) => {
    setProductosCotizacion((prev) => [
      ...prev,
      { producto, precio, cantidadContenido, ganancia },
    ]);
  };

  // Actualiza cantidad de contenido (volumen) para el producto en el índice
  const actualizarCantidadContenido = (index, cantidadContenido) => {
    setProductosCotizacion((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, cantidadContenido: parseFloat(cantidadContenido) || 1 }
          : item
      )
    );
  };

  // Actualiza ganancia para el producto en el índice (objeto {tipo, valor})
  const actualizarGanancia = (index, ganancia) => {
    setProductosCotizacion((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, ganancia }
          : item
      )
    );
  };

  // Elimina producto por índice
  const eliminarProducto = (index) => {
    setProductosCotizacion((prev) => prev.filter((_, i) => i !== index));
  };

  // Limpia la cotización
  const limpiarCotizacion = () => setProductosCotizacion([]);

  return (
    <CotizacionContext.Provider
      value={{
        productosCotizacion,
        agregarProducto,
        actualizarCantidadContenido,
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
