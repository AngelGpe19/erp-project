// src/routes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Cotizaciones from './pages/Cotizaciones';


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

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
