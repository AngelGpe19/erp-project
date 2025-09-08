// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Panel Principal</h1>
          <UserProfile />
        </div>
      </header>
      <main style={styles.mainContent}>
        <div style={styles.container}>
          <p style={styles.subtitle}>Selecciona una opción:</p>
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
      </main>
      <Footer />
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
    margin: '0 auto',
  },
  title: {
    color: '#2b5dab',
    fontSize: '2rem',
  },
  mainContent: {
    flexGrow: 1,
    padding: '2rem',
  },
  container: {
    maxWidth: 600,
    margin: '0 auto',
    background: '#f4f4f4',
    borderRadius: 12,
    padding: '2rem',
    marginTop: '5rem',
  },
  subtitle: {
    marginBottom: '1rem',
  },
  menu: {
    listStyle: 'none',
    padding: 0,
    fontSize: '18px',
    lineHeight: '2rem',
  },
};

export default Home;