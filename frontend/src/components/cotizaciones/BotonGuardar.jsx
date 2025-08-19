// src/components/cotizaciones/BotonGuardar.jsx
import React, { useContext, useState } from "react";
import SeleccionarCliente from "./SeleccionarCliente";
import axios from "axios";
import { CotizacionContext } from "../../context/CotizacionContext";

export default function BotonGuardar() {
  const [idCliente, setIdCliente] = useState(null);
  const { productosCotizacion, limpiarCotizacion } = useContext(CotizacionContext);

  const guardarCotizacion = async () => {
    if (!idCliente || productosCotizacion.length === 0) {
      alert("❌ Debes seleccionar un cliente y agregar al menos un producto");
      return;
    }

    // Calcular total estimado y margen de utilidad
    const productosValidos = productosCotizacion.filter(
      (item) => item.producto && item.precio
    );

   const total_estimado = productosValidos.reduce((acc, item) => {
  const precioConGanancia =
    item.ganancia.tipo === "porcentaje"
      ? parseFloat(item.precio.precio_unitario) * (1 + parseFloat(item.ganancia.valor) / 100)
      : parseFloat(item.precio.precio_unitario) + parseFloat(item.ganancia.valor);

  return acc + precioConGanancia * parseInt(item.cantidadPiezas || 0, 10);
}, 0);

    const margen_utilidad =
      productosValidos.length === 0
        ? 0
        : productosValidos.reduce(
            (acc, item) =>
              acc + (item.ganancia.tipo === "porcentaje" ? Number(item.ganancia.valor) : 0),
            0
          ) / productosValidos.length;

    // Preparar payload
  const body = {
  id_cliente: Number(idCliente),
  margen_utilidad,
  total_estimado,
  productos: productosValidos.map((item) => ({
    id_producto: Number(item.producto.id_producto),
    id_precio: Number(item.precio.id_precio),
    cantidad: Number(item.cantidadPiezas),
    ganancia_tipo: item.ganancia.tipo,
    ganancia_valor: Number(item.ganancia.valor),
    precio_unitario_estimado: Number(item.precio.precio_unitario),
    precio_unitario_con_ganancia:
      item.ganancia.tipo === "porcentaje"
        ? parseFloat(item.precio.precio_unitario) * (1 + parseFloat(item.ganancia.valor) / 100)
        : parseFloat(item.precio.precio_unitario) + parseFloat(item.ganancia.valor),
  })),
};

    console.log(" Payload final a enviar:", body);

    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.REACT_APP_API_URL;

      const res = await axios.post(`${API_URL}/cotizaciones/con-detalles`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Cotización guardada:", res.data);
      alert("✅ Cotización guardada con éxito");

      // Limpiar cotización después de guardar
      limpiarCotizacion();
      setIdCliente(null);
    } catch (error) {
      console.error("Error al guardar cotización:", error);
      alert("❌ Ocurrió un error al guardar la cotización");
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <SeleccionarCliente onClienteSeleccionado={setIdCliente} />
      <button
        onClick={guardarCotizacion}
        disabled={!idCliente || productosCotizacion.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Guardar Cotización
      </button>
    </div>
  );
}
