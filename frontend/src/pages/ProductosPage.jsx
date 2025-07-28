// frontend/src/pages/ProductosPage.jsx
import React, { useEffect, useState } from 'react';

const API_URL = `${process.env.REACT_APP_API_URL}/productos`;

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    unidad_medida: '',
    descripcion: '',
    categoria: ''
  });
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(null);
  const [editadoProducto, setEditadoProducto] = useState({});

  const token = localStorage.getItem('token');

  const fetchProductos = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleCrear = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevoProducto)
      });
      if (res.ok) {
        setNuevoProducto({ nombre: '', unidad_medida: '', descripcion: '', categoria: '' });
        fetchProductos();
      }
    } catch (err) {
      console.error('Error al crear producto:', err);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
    }
  };

  const handleEditar = (producto) => {
    setEditando(producto.id_producto);
    setEditadoProducto(producto);
  };

  const handleEditarChange = (e) => {
    setEditadoProducto({ ...editadoProducto, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`${API_URL}/${editando}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editadoProducto)
      });
      if (res.ok) {
        setEditando(null);
        fetchProductos();
      }
    } catch (err) {
      console.error('Error al editar producto:', err);
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="contenedor-principal">
      <h1 className="titulo-pagina">Gestión de Productos</h1>

      <input
        type="text"
        placeholder="Buscar producto por nombre"
        className="input-busqueda"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="formulario-registro">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="unidad_medida"
          placeholder="Unidad de Medida"
          value={nuevoProducto.unidad_medida}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          value={nuevoProducto.categoria}
          onChange={handleChange}
          className="input"
        />
        <button onClick={handleCrear} className="btn btn-azul">➕ Agregar</button>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Unidad</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id_producto}>
              {editando === producto.id_producto ? (
                <>
                  <td><input type="text" name="nombre" value={editadoProducto.nombre} onChange={handleEditarChange} className="input-tabla" /></td>
                  <td><input type="text" name="unidad_medida" value={editadoProducto.unidad_medida} onChange={handleEditarChange} className="input-tabla" /></td>
                  <td><input type="text" name="descripcion" value={editadoProducto.descripcion} onChange={handleEditarChange} className="input-tabla" /></td>
                  <td><input type="text" name="categoria" value={editadoProducto.categoria} onChange={handleEditarChange} className="input-tabla" /></td>
                  <td>
                    <button onClick={handleGuardar} className="btn btn-verde">💾 Guardar</button>
                    <button onClick={() => setEditando(null)} className="btn btn-gris">❌ Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{producto.nombre}</td>
                  <td>{producto.unidad_medida}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.categoria}</td>
                  <td>
                    <button onClick={() => handleEditar(producto)} className="btn btn-naranja">✏️ Editar</button>
                    <button onClick={() => handleEliminar(producto.id_producto)} className="btn btn-rojo">🗑️ Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
