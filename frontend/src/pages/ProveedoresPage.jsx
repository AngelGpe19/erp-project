import React, { useState, useEffect } from 'react';

const API_URL = `${process.env.REACT_APP_API_URL}/proveedores`;

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: '',
    empresa: '',
    correo: '',
    telefono: '',
    contacto_principal: '',
    rfc: '',
  });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const fetchProveedores = async () => {
    try {
      const url = busqueda
        ? `${API_URL}?nombre=${encodeURIComponent(busqueda)}`
        : API_URL;

      const res = await fetch(url, { headers });
      const data = await res.json();
      setProveedores(data);
    } catch (err) {
      console.error('Error al obtener proveedores:', err);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, [busqueda]);

  const handleInputChange = (e) => {
    setNuevoProveedor({
      ...nuevoProveedor,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgregarProveedor = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(nuevoProveedor),
      });

      if (!res.ok) throw new Error('Error al agregar proveedor');
      setNuevoProveedor({
        nombre: '',
        empresa: '',
        correo: '',
        telefono: '',
        contacto_principal: '',
        rfc: '',
      });
      fetchProveedores();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminarProveedor = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este proveedor?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Error al eliminar proveedor');
      fetchProveedores();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Gestión de Proveedores</h2>

      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formSection}>
        <h3>➕ Agregar Proveedor</h3>
        <div style={styles.formGrid}>
          {['nombre', 'empresa', 'correo', 'telefono', 'contacto_principal', 'rfc'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace('_', ' ')}
              value={nuevoProveedor[field]}
              onChange={handleInputChange}
              style={styles.input}
            />
          ))}
        </div>
        <button style={styles.button} onClick={handleAgregarProveedor}>
          Guardar
        </button>
      </div>

      <div style={styles.listSection}>
        <h3>📋 Lista de Proveedores</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Contacto</th>
              <th>RFC</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((prov) => (
              <tr key={prov.id_proveedor}>
                <td>{prov.nombre}</td>
                <td>{prov.empresa}</td>
                <td>{prov.correo}</td>
                <td>{prov.telefono}</td>
                <td>{prov.contacto_principal}</td>
                <td>{prov.rfc}</td>
                <td>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleEliminarProveedor(prov.id_proveedor)}
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f6ff',
    minHeight: '100vh',
  },
  title: {
    color: '#2b5dab',
    marginBottom: '1.5rem',
  },
  searchSection: {
    marginBottom: '1.5rem',
  },
  formSection: {
    backgroundColor: '#e8f0fe',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '0.8rem',
    marginBottom: '1rem',
  },
  listSection: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#2b5dab',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#dbe9ff',
    textAlign: 'left',
    padding: '0.5rem',
  },
  td: {
    padding: '0.5rem',
    borderBottom: '1px solid #ccc',
  },
};

export default ProveedoresPage;
