
/* const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Opcional, por si necesitas datos del usuario
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}


module.exports = verifyToken;

*/
// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'secreto_predeterminado';

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