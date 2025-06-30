const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
  // Cambié username por correo
  const { correo, password } = req.body;
  if (!correo || !password)
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });

  try {
    // Cambié la consulta para buscar por correo en lugar de username
    const result = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (result.rows.length === 0)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    // Crear payload para token, manteniendo username por si lo usas en el frontend o puedes cambiar a correo
    const payload = { id: user.id, correo: user.correo, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ token, user: { id: user.id, correo: user.correo, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const register = async (req, res) => {
  return res.status(501).json({ message: 'Funcionalidad de registro aún no implementada' });
};


module.exports = { login, register };
