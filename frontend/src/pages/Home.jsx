// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Panel Principal</h1>
      <p>Selecciona una opción:</p>
      <ul style={styles.menu}>
        <li><Link to="/cotizaciones">📄 Ver Cotizaciones</Link></li>
        <li><Link to="/crear-cotizacion">➕ Nueva Cotización</Link></li>
        <li><Link to="/base-datos">💾 Base de Datos de Elementos</Link></li>
        <li><Link to="/productos">🧴 Agregar Nuevo Producto</Link></li>
        <li><Link to="/usuarios">🛠️ Gestión de Usuarios</Link></li>
        <li><Link to="/proveedores">👤 Proveedores</Link></li>
        <li><Link to="/clientes">💬 Clientes</Link></li>
        <li><Link to="/precios">💲 Precios</Link></li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: 600,
    margin: '0 auto',
    background: '#f4f4f4',
    borderRadius: 12,
    marginTop: '5rem',
  },
  menu: {
    listStyle: 'none',
    padding: 0,
    fontSize: '18px',
    lineHeight: '2rem',
  }
};

export default Home;
