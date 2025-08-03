// frontend/src/pages/PreciosPage.jsx
import React, { useEffect, useState } from 'react';
import CrearPrecioForm from '../components/CrearPrecioForm';
const API_URL = process.env.REACT_APP_API_URL;

const PreciosPage = () => {
  const [precios, setPrecios] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(10);

  const fetchPrecios = async () => {
    try {
      const token = localStorage.getItem('token');
      const offset = (pagina - 1) * limite;
      const res = await fetch(`${API_URL}/precios?limit=${limite}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPrecios(data.precios);
      setTotal(data.total);
    } catch (error) {
      console.error('Error al cargar precios:', error);
    }
  };

  useEffect(() => {
    fetchPrecios();
  }, [pagina]);

  const handleNuevoPrecio = () => {
    fetchPrecios(); // Refresca tabla al agregar nuevo
  };

  const totalPaginas = Math.ceil(total / limite);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Precios</h1>

      <CrearPrecioForm onSuccess={handleNuevoPrecio} />

      <table className="w-full border mt-4 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Proveedor</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Marca</th>
            <th>Enlace</th>
            <th>Condiciones</th>
          </tr>
        </thead>
        <tbody>
          {precios.map(p => (
            <tr key={p.id_precio} className="border-t">
              <td>{p.id_precio}</td>
              <td>{p.nombre_producto}</td>
              <td>{p.nombre_proveedor}</td>
              <td>${parseFloat(p.precio_unitario).toFixed(2)}</td>
              <td>{p.cantidad}</td>
              <td>{p.marca}</td>
              <td><a href={p.enlace} target="_blank" rel="noreferrer" className="text-blue-600 underline">Ver</a></td>
              <td>{p.condiciones_pago}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPagina(p => Math.max(1, p - 1))}
          disabled={pagina === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span>Página {pagina} de {totalPaginas}</span>

        <button
          onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
          disabled={pagina >= totalPaginas}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PreciosPage;
