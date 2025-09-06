// src/components/cotizaciones/SeleccionarCliente.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SeleccionarCliente({ onClienteSeleccionado }) {
  const [clientes, setClientes] = useState([]);
  const [idCliente, setIdCliente] = useState("");

 useEffect(() => {
  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token guardado en localStorage");
        setClientes([]);
        return;
      }

      const API_URL = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${API_URL}/clientes`, {
        headers: {
          Authorization: `Bearer ${token}`, // <- importante
        },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.clientes || [];
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setClientes([]);
    }
  };

  fetchClientes();
}, []);


  const handleChange = (e) => {
    setIdCliente(e.target.value);
    onClienteSeleccionado(e.target.value);
  };

  return (
    <div>
      <label>Selecciona un cliente:</label>
      <select value={idCliente} onChange={handleChange}>
        <option value="">-- Selecciona --</option>
        {clientes.map((cliente) => (
          <option key={cliente.id_cliente} value={cliente.id_cliente}>
            {cliente.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
