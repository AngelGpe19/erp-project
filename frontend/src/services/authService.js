// src/services/authService.js
const API_URL = 'http://localhost:4000/api/auth';

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data;
  } else {
    throw new Error(data.message || 'Error al iniciar sesión');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
