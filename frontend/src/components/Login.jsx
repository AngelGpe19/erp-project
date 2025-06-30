// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Ingresar</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: '80px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 10,
    textAlign: 'center',
    background: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    border: 'none',
    borderRadius: 5,
  },
  error: {
    color: 'red',
  },
};

export default Login;