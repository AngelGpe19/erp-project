// frontend/src/pages/ClientesPage.jsx
import React, { useEffect, useState } from 'react';

const ClientesPage = () => {
  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL;

  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    empresa: '',
    rfc: ''
  });

  const [editando, setEditando] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const registrosPorPagina = 10;

  // 🔁 Debounce con timeout
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      obtenerClientes();
    }, 500); // Espera 500ms antes de llamar

    return () => clearTimeout(delayDebounce);
  }, [busqueda, pagina]);

  const obtenerClientes = async () => {
    try {
      const offset = (pagina - 1) * registrosPorPagina;
      const url = `${API_URL}/clientes?limit=${registrosPorPagina}&offset=${offset}&busqueda=${encodeURIComponent(busqueda)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setClientes(data.clientes);
      setTotalPaginas(Math.ceil(data.total / registrosPorPagina));
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const url = editando
      ? `${API_URL}/clientes/${clienteActual}`
      : `${API_URL}/clientes`;
    const metodo = editando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formulario)
      });

      if (res.ok) {
        setFormulario({
          nombre: '',
          correo: '',
          telefono: '',
          empresa: '',
          rfc: ''
        });
        setEditando(false);
        setClienteActual(null);
        obtenerClientes();
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  const manejarEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
    try {
      await fetch(`${API_URL}/clientes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      obtenerClientes();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  const manejarEditar = (cliente) => {
    setFormulario(cliente);
    setEditando(true);
    setClienteActual(cliente.id_cliente);
  };

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPagina(1); // Reiniciar a la primera página cuando se busca algo nuevo
  };

  return (
    <div className="contenedor-principal">
      <h2 className="titulo-seccion">Clientes</h2>

      <form className="formulario" onSubmit={manejarSubmit}>
        <input type="text" name="nombre" value={formulario.nombre} onChange={manejarCambio} placeholder="Nombre" required />
        <input type="email" name="correo" value={formulario.correo} onChange={manejarCambio} placeholder="Correo" required />
        <input type="text" name="telefono" value={formulario.telefono} onChange={manejarCambio} placeholder="Teléfono" required />
        <input type="text" name="empresa" value={formulario.empresa} onChange={manejarCambio} placeholder="Empresa" />
        <input type="text" name="rfc" value={formulario.rfc} onChange={manejarCambio} placeholder="RFC" />
        <button className="btn btn-azul" type="submit">
          {editando ? 'Actualizar' : 'Registrar'}
        </button>
      </form>

      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={manejarBusqueda}
        style={{ margin: '1rem 0', padding: '0.5rem', width: '100%', maxWidth: '400px' }}
      />

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Empresa</th>
            <th>RFC</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.nombre}</td>
              <td>{cliente.correo}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.empresa}</td>
              <td>{cliente.rfc}</td>
              <td>
                <button className="btn btn-amarillo" onClick={() => manejarEditar(cliente)}>Editar</button>
                <button className="btn btn-rojo" onClick={() => manejarEliminar(cliente.id_cliente)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacion">
        <button className="btn btn-azul" onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>Anterior</button>
        <span className="pagina-actual">Página {pagina} de {totalPaginas}</span>
        <button className="btn btn-azul" onClick={() => setPagina(pagina + 1)} disabled={pagina === totalPaginas}>Siguiente</button>
      </div>
    </div>
  );
};

export default ClientesPage;
