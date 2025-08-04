// frontend/src/components/CrearPrecioForm.jsx
import React, { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;

const CrearPrecioForm = ({ onSuccess, enEdicion, onCancelEdit }) => {

  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [formulario, setFormulario] = useState({
    id_producto: '',
    id_proveedor: '',
    precio_unitario: '',
    condiciones_pago: '',
    cantidad: '',
    marca: '',
    enlace: ''
  });

  const obtenerProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/productos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos', error);
    }
  };

  const obtenerProveedores = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/proveedores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error al obtener proveedores', error);
    }
  };

  useEffect(() => {
    obtenerProductos();

    obtenerProveedores();
  }, []);
  useEffect(() => {
  if (enEdicion) {
    setFormulario({
      id_producto: enEdicion.id_producto,
      id_proveedor: enEdicion.id_proveedor,
      precio_unitario: enEdicion.precio_unitario,
      condiciones_pago: enEdicion.condiciones_pago,
      cantidad: enEdicion.cantidad,
      marca: enEdicion.marca,
      enlace: enEdicion.enlace
    });
  }
}, [enEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/precios${enEdicion ? `/${enEdicion.id_precio}` : ''}`, {
  method: enEdicion ? 'PUT' : 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(formulario)
});


      if (!res.ok) throw new Error('Error al crear precio');

      const nuevoPrecio = await res.json();
      onSuccess(nuevoPrecio);
      setFormulario({
        id_producto: '',
        id_proveedor: '',
        precio_unitario: '',
        condiciones_pago: '',
        cantidad: '',
        marca: '',
        enlace: ''
      });
    } catch (err) {
      console.error('Error al registrar precio:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow">
      <select name="id_producto" value={formulario.id_producto} onChange={handleChange} required>
        <option value="">Selecciona un producto</option>
        {productos.map(p => (
          <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
        ))}
      </select>

      <select name="id_proveedor" value={formulario.id_proveedor} onChange={handleChange} required>
        <option value="">Selecciona un proveedor</option>
        {proveedores.map(p => (
          <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
        ))}
      </select>

      <input type="number" name="precio_unitario" value={formulario.precio_unitario} onChange={handleChange} placeholder="Precio unitario" required step="0.01" />
      <input type="number" name="cantidad" value={formulario.cantidad} onChange={handleChange} placeholder="Cantidad" required />
      <input type="text" name="marca" value={formulario.marca} onChange={handleChange} placeholder="Marca" required />
      <input type="url" name="enlace" value={formulario.enlace} onChange={handleChange} placeholder="Enlace del producto" required />
      <textarea name="condiciones_pago" value={formulario.condiciones_pago} onChange={handleChange} placeholder="Condiciones de pago" rows={3} />
{enEdicion && (
  <button
    type="button"
    onClick={onCancelEdit}
    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
  >
    Cancelar edición
  </button>
)}

     <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
  {enEdicion ? 'Actualizar precio' : 'Registrar precio'}
</button>
    </form>
  );
};

export default CrearPrecioForm;