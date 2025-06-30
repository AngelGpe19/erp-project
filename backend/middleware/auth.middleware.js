const jwt = require('jsonwebtoken');

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
