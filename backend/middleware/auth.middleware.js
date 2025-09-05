// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET ;
//const secretKey = process.env.JWT_SECRET;
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.error('No se encontró el encabezado Authorization');
    return res.status(401).json({ error: 'No autorizado: Falta token' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.error('Token no presente en encabezado');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.usuario = decoded;
    console.log('Token verificado correctamente:', decoded);
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = { verificarToken };