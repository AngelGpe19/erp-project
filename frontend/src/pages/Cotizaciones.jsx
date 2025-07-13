// src/pages/Cotizaciones.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');

  const fetchCotizaciones = async () => {

    try {
      const token = localStorage.getItem('token'); // Asegúrate de guardarlo tras login
     console.log('Token obtenido:', token);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/cotizaciones/cotizaciones`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      console.log('Respuesta del backend:', res.data);
      setCotizaciones(res.data);
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
    }
  };

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const cotizacionesFiltradas = cotizaciones.filter((cot) => {
    return (
      (filtro === '' || cot.id.toString().includes(filtro)) &&
      (filtroCliente === '' || cot.nombre_cliente.toLowerCase().includes(filtroCliente.toLowerCase()))
    );
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📄 Cotizaciones</h1>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por ID"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar por cliente"
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
        />
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total Estimado</th>
            <th>Margen</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {cotizacionesFiltradas.map((cot) => (
            <tr key={cot.id}>
              <td>{cot.id}</td>
              <td>{cot.nombre_cliente}</td>
              <td>{new Date(cot.fecha_creacion).toLocaleDateString()}</td>
             <td>
  {cot.total_estimado != null && !isNaN(cot.total_estimado)
    ? `$${Number(cot.total_estimado).toFixed(2)}`
    : 'N/D'}
</td>

              <td>{cot.margen_utilidad}%</td>
              <td>
                <span style={getStatusStyle(cot.estatus)}>
                  {cot.estatus || 'Pendiente'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  status: {
    padding: '0.2rem 0.6rem',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
};

const getStatusStyle = (estatus) => {
  const base = {
    padding: '0.2rem 0.6rem',
    borderRadius: '5px',
    color: 'white',
    fontWeight: 'bold',
  };

  switch ((estatus || '').toLowerCase()) {
    case 'aprobada':
      return { ...base, backgroundColor: 'green' };
    case 'rechazada':
      return { ...base, backgroundColor: 'red' };
    case 'pendiente':
    default:
      return { ...base, backgroundColor: 'gray' };
  }
};

export default Cotizaciones;
