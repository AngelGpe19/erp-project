// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);



  const fetchUsuario = async () => {
    const token = localStorage.getItem("token");
    
    // Paso 1: Verificar si el token existe antes de hacer la petición
    if (!token) {
      setLoading(false);
      return; // Detiene la ejecución si no hay token
    }

    // Opcional: Para depuración, comprueba que el token tiene la longitud correcta
    console.log("Token obtenido:", token);
    
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuario(res.data);
    } catch (err) {
      console.error("❌ Error obteniendo usuario:", err);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);