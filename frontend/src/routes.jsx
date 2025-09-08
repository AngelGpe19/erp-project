// src/routes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Cotizaciones from './pages/Cotizaciones';
import ProveedoresPage from './pages/ProveedoresPage';
import ProductosPage from './pages/ProductosPage';
import ClientesPage from './pages/ClientesPage';
import PreciosPage from './pages/PreciosPage';
import CotizacionCrearEditarPage from './pages/CotizacionCrearEditarPage';
import ManageUsers from './pages/ManageUsers';
function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
  path="/home"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>

        <Route
  path="/cotizaciones"
  element={
    <ProtectedRoute>
      <Cotizaciones />
    </ProtectedRoute>
  }
/>

<Route path="/cotizaciones/editar/:id" element={<CotizacionCrearEditarPage modo="editar" />} />

  <Route path="/crear-cotizacion" element={<CotizacionCrearEditarPage modo="crear" />} />


          <Route
  path="/productos"
  element={
    <ProtectedRoute>
      <ProductosPage />
    </ProtectedRoute>
  }
/>


          <Route
  path="/usuarios"
  element={
    <ProtectedRoute>
      <ManageUsers />
    </ProtectedRoute>
  }
/>


           <Route
  path="/proveedores"
  element={
    <ProtectedRoute>
      <ProveedoresPage />
    </ProtectedRoute>
  }
/>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

         <Route
  path="/clientes"
  element={
    <ProtectedRoute>
      <ClientesPage/>
    </ProtectedRoute>
  }
/>

<Route
  path="/precios"
  element={
    <ProtectedRoute>
      <PreciosPage/>
    </ProtectedRoute>
  }
/>






      </Routes>


    </Router>
  );
}

export default AppRoutes;
