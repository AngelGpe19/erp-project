// backend/controllers/authController.js 
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//require('dotenv').config();

const login = async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password)
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (result.rows.length === 0)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    // CAMBIO CRÍTICO: Usar 'id_usuario' en el payload
    const payload = { id_usuario: user.id_usuario, correo: user.correo, role: user.id_rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ token, user: { id_usuario: user.id_usuario, correo: user.correo, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const register = async (req, res) => {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const existingUser = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO usuarios (nombre, correo, password_hash, id_rol, activo, fecha_creacion) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id_usuario',
      [nombre, correo, password_hash, 2, true] // puedes ajustar el id_rol si lo deseas
    );

    res.status(201).json({ message: 'Usuario creado exitosamente', id_usuario: result.rows[0].id_usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

const getUsuario = async (req, res) => {
  try {
   if (!req.usuario || !req.usuario.id_usuario) { 
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const { id_usuario } = req.usuario;
    
    // Se realiza un JOIN para obtener el nombre del rol desde la tabla 'roles'
    const usuario = await db.query(
      "SELECT u.id_usuario, u.nombre, r.nombre_rol AS rol FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE u.id_usuario = $1",
      [id_usuario]
    );
    
    if (usuario.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario.rows[0]);
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = { login, register, getUsuario };
