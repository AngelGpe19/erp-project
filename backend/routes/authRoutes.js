// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, register,getUsuario } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth.middleware');
const { pool } = require('../db');
// Rutas de autenticación
router.post('/login', login);
router.post('/register', register); // Opcional, para pruebas
//  para traer info del usuario autenticado
router.get('/me',verificarToken,getUsuario);

module.exports = router;
