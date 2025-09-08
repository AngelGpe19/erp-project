// frontend/src/pages/ManageUsers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ManageUsers = () => {
  const { usuario, loading } = useAuth();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [idRol, setIdRol] = useState(2); // Por defecto "Ventas"
  const [mensaje, setMensaje] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Obtener el token del localStorage
  const token = localStorage.getItem("token");

  // Función para obtener usuarios del backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { query: busqueda },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
      // Limpiar usuarios si hay un error (ej. 404 No encontrado)
      setUsuarios([]); 
      // Puedes mostrar un mensaje al usuario si el error es relevante
      if (err.response && err.response.status === 404) {
          setMensaje("No se encontraron usuarios con ese criterio de búsqueda.");
      } else {
          setMensaje("Error al cargar la lista de usuarios.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Si el usuario es administrador y se ha cargado la info, obtenemos los usuarios
    if (!loading && usuario && usuario.rol === "Administrador") {
      fetchUsers();
    } else {
        // Limpiar la lista de usuarios si no es admin o si el loading está activo
        setUsuarios([]); 
    }
  }, [usuario, loading, busqueda]); // Dependencias para re-cargar en caso de cambio

  // Función para registrar un nuevo usuario
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!usuario || usuario.rol !== "Administrador") {
      setMensaje("⚠️ No tienes permisos para registrar usuarios.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          nombre,
          correo,
          password,
          id_rol: parseInt(idRol),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensaje(`✅ Usuario ${res.data.id_usuario} creado exitosamente.`);
      // Limpiar formulario y recargar la lista de usuarios
      setNombre("");
      setCorreo("");
      setPassword("");
      fetchUsers();
    } catch (err) {
      console.error("❌ Error al registrar usuario:", err);
      setMensaje(
        `Error al registrar: ${err.response?.data?.message || err.message}`
      );
    }
  };

  // Función para eliminar un usuario
  const handleDelete = async (userId) => {
    if (!usuario || usuario.rol !== "Administrador") {
      setMensaje("⚠️ No tienes permisos para eliminar usuarios.");
      return;
    }

    const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar al usuario con ID ${userId}?`);
    if (!isConfirmed) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/auth/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensaje(`✅ Usuario con ID ${userId} eliminado exitosamente.`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Error al eliminar usuario:", err);
      setMensaje(
        `Error al eliminar: ${err.response?.data?.message || err.message}`
      );
    }
  };

  // Mostrar mensaje de carga mientras se valida el rol
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si el usuario no es "Administrador", no renderizar nada
  if (!usuario || usuario.rol !== "Administrador") {
    return <div>Acceso denegado. Solo los administradores pueden gestionar usuarios.</div>;
  }

  return (
    <div className="container">
      <div className="section">
        <h2>Crear Nuevo Usuario</h2>
        <p>{mensaje}</p>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={idRol}
            onChange={(e) => setIdRol(e.target.value)}
            required
          >
            <option value={1}>1 - Administrador</option>
            <option value={2}>2 - Ventas</option>
          </select>
          <button type="submit">Registrar Usuario</button>
        </form>
      </div>
      
      <hr className="my-8"/>

      <div className="section">
        <h2 className="mb-4">Usuarios Existentes</h2>
        <input 
          type="text"
          placeholder="Buscar por nombre, correo o ID..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full mb-4"
        />
        {isLoading ? (
            <div>Cargando usuarios...</div>
        ) : (
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((user) => (
                  <tr key={user.id_usuario}>
                    <td>{user.id_usuario}</td>
                    <td>{user.nombre}</td>
                    <td>{user.correo}</td>
                    <td>{user.id_rol === 1 ? "Administrador" : "Ventas"}</td>
                    <td>{user.activo ? "Sí" : "No"}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(user.id_usuario)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No hay usuarios para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
