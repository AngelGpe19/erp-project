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
  // Ahora el body de la solicitud debe incluir 'nombre', 'correo', 'password' y 'id_rol'
  const { nombre, correo, password, id_rol } = req.body;

  // Validación de campos requeridos
  if (!nombre || !correo || !password || !id_rol) {
    return res.status(400).json({ message: 'Todos los campos (nombre, correo, password, id_rol) son requeridos' });
  }
  
  // Validación del id_rol para asegurar que sea 1 o 2
  if (id_rol !== 1 && id_rol !== 2) {
      return res.status(400).json({ message: 'El id_rol debe ser 1 (Administrador) o 2 (Ventas)' });
  }

  try {
    const existingUser = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // El servidor hashea la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      // La consulta ahora usa el id_rol proporcionado
      'INSERT INTO usuarios (nombre, correo, password_hash, id_rol, activo, fecha_creacion) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id_usuario',
      [nombre, correo, password_hash, id_rol, true]
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

const getUsers = async (req, res) => {
  const { query, limit = 30 } = req.query;

  try {
    let users;
    // Si se proporciona una consulta, busca por nombre, correo o id_usuario
    if (query) {
      // Intenta convertir la consulta a un número para buscar por id_usuario
      const idQuery = parseInt(query, 10);
      let sqlQuery;
      let params;

      if (!isNaN(idQuery)) {
        // Si es un número, busca por id_usuario
        sqlQuery = 'SELECT id_usuario, nombre, correo, id_rol, activo, fecha_creacion FROM usuarios WHERE id_usuario = $1 LIMIT $2';
        params = [idQuery, limit];
      } else {
        // Si no es un número, busca por nombre o correo (insensible a mayúsculas)
        sqlQuery = 'SELECT id_usuario, nombre, correo, id_rol, activo, fecha_creacion FROM usuarios WHERE LOWER(nombre) LIKE LOWER($1) OR LOWER(correo) LIKE LOWER($1) LIMIT $2';
        params = [`%${query}%`, limit];
      }
      const result = await db.query(sqlQuery, params);
      users = result.rows;
    } else {
      // Si no hay consulta, trae los últimos usuarios creados
      const result = await db.query('SELECT id_usuario, nombre, correo, id_rol, activo, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC LIMIT $1', [limit]);
      users = result.rows;
    }
    
    // Si no se encuentran usuarios, devuelve un mensaje
    if (users.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios.' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Función para eliminar un usuario por su ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

module.exports = { login, register, getUsuario,getUsers, deleteUser };
