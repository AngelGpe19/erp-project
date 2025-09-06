// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [precios, setPrecios] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchProductos = async (busqueda = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/productos?busqueda=${encodeURIComponent(busqueda)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProductos(data || []);
      return data;
    } catch (err) {
      console.error("Error al obtener productos:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchPreciosPorProducto = async (productoId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/precios/producto/${productoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPrecios((prev) => ({ ...prev, [productoId]: data.precios || [] }));
      return data.precios || [];
    } catch (err) {
      console.error("Error al obtener precios:", err);
      return [];
    }
  };

  return (
    <AppContext.Provider
      value={{
        productos,
        precios,
        fetchProductos,
        fetchPreciosPorProducto,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
