// frontend/src/components/UserProfile.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
    const { usuario, loading, setUsuario } = useAuth();

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        const isConfirmed = window.confirm("¿Estás seguro que quieres cerrar sesión?");
        if (isConfirmed) {
            // Eliminar el token del almacenamiento local
            localStorage.removeItem("token");
            // Limpiar el estado del usuario en el contexto
            setUsuario(null);
            // Redirigir al usuario (forzando una recarga de página para ir al login)
            window.location.reload(); 
        }
    };

    // No mostrar nada si el usuario está cargando o no está autenticado
    if (loading || !usuario) {
        return null;
    }

    // Determina el rol a mostrar
    const rolDisplay = usuario.rol || "Sin Rol";

    return (
        <div 
            onClick={handleLogout}
            className="flex items-center justify-center cursor-pointer p-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
            <div className="flex flex-col items-center justify-center">
                <span className="text-xl">
                    {rolDisplay === "Administrador" ? "👑" : "💼"}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                    {usuario.nombre},    
                </span>
                <span className="text-xs text-gray-500">
                         {rolDisplay}
                </span>
            </div>
        </div>
    );
};

export default UserProfile;
