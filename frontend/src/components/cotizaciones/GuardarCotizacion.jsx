// src/components/cotizaciones/GuardarCotizacion.jsx
import React, { useContext } from "react";
import { CotizacionContext } from "../../context/CotizacionContext";    

const guardarCotizacion = async (id_cliente, productosCotizacion) => {
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  const productos = Array.isArray(productosCotizacion) ? productosCotizacion : [];

  const total_estimado = productos.reduce((acc, item) => {
    const precioConGanancia =
      Number(item.precio.precio_unitario) *
      (item.ganancia.tipo === "porcentaje"
        ? 1 + Number(item.ganancia.valor) / 100
        : 1 + Number(item.ganancia.valor));
    return acc + precioConGanancia * Number(item.cantidadPiezas);
  }, 0);

  const margen_utilidad =
    productos.length === 0
      ? 0
      : productos.reduce(
          (acc, item) =>
            acc + (item.ganancia.tipo === "porcentaje" ? Number(item.ganancia.valor) : 0),
          0
        ) / productos.length;

  const payload = {
    id_cliente: id_cliente ?? null,
    margen_utilidad,
    total_estimado,
    //aqui segun yo agregue el filter pero sabra dios si lo agarra en la misma linea u es otra
    productos: productos.filter(item => item.producto && item.precio).map((item) => ({
      id_producto: Number(item.producto.id_producto),
      id_precio: Number(item.precio.id_precio),
      cantidad: Number(item.cantidadPiezas),
      ganancia_tipo: item.ganancia.tipo,
      ganancia_valor: Number(item.ganancia.valor),
      precio_unitario_estimado: Number(item.precio.precio_unitario),
      precio_unitario_con_ganancia:
        Number(item.precio.precio_unitario) *
        (item.ganancia.tipo === "porcentaje"
          ? 1 + Number(item.ganancia.valor) / 100
          : 1 + Number(item.ganancia.valor)),
     // subtotal_estimado: Number(item.precio.precio_unitario) * Number(item.cantidadPiezas),
    })),
  };
  console.log("📦 Productos en contexto:", productosCotizacion);
  console.log("Payload que se enviará:", payload);

  try {
    const res = await fetch(`${API_URL}/cotizaciones/con-detalles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al guardar cotización");


    const data = await res.json();
    return data.id_cotizacion;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
//no se usa este export, pero lo dejo por si acaso
export default guardarCotizacion;