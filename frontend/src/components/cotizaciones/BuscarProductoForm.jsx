//src/components/cotizaciones/BuscarProductoForm.jsx 
import React, { useState } from "react";
import { useCotizacion } from "../../context/CotizacionContext";

const BuscarProductoForm = () => {
  const [termino, setTermino] = useState("");
  const [resultados, setResultados] = useState([]);
  const { agregarProducto } = useCotizacion();

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!termino.trim()) return;

    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const res = await fetch(
        `${API_URL}/productos/buscar?q=${encodeURIComponent(termino)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al buscar productos");

      const data = await res.json();
      setResultados(data);
    } catch (err) {
      console.error("Error al buscar productos:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleBuscar} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </form>

      {resultados.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th>ID</th>
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Precio Unitario</th>
                <th>Cantidad Contenido</th>
                <th>Marca</th>
                <th>Enlace</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((prod, index) => (
                <tr key={`${prod.id_precio ?? prod.id_producto}-${index}`}>
                  <td>{prod.id_producto}</td>
                  <td>{prod.nombre}</td>
                  <td>{prod.unidad_medida}</td>
                  <td>{prod.descripcion}</td>
                  <td>{prod.categoria}</td>
                  <td>${parseFloat(prod.precio_unitario).toFixed(2)}</td>
                  <td>{prod.cantidad}</td>
                  <td>{prod.marca}</td>
                  <td>
                    {prod.enlace ? (
                      <a
                        href={prod.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Ver
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        agregarProducto({
                          producto: {
                            id_producto: prod.id_producto,
                            nombre: prod.nombre,
                            unidad_medida: prod.unidad_medida,
                            descripcion: prod.descripcion,
                            categoria: prod.categoria,
                          },
                          precio: {
                            id_precio: prod.id_precio,
                            precio_unitario: prod.precio_unitario,
                            cantidad: prod.cantidad,
                            marca: prod.marca,
                            enlace: prod.enlace,
                          },
                          cantidadContenido: prod.cantidad || 1, // cantidad de contenido/volumen
                          ganancia: { tipo: "porcentaje", valor: 0 }, // default sin ganancia
                        })
                      }
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Añadir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuscarProductoForm;
