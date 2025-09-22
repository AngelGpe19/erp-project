// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, register,getUsuario,getUsers,deleteUser } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth.middleware');
const { pool } = require('../db');
// Rutas de autenticación
router.post('/login', login);
router.post('/register', register); // Opcional, para pruebas
//  para traer info del usuario autenticado
router.get('/me',verificarToken,getUsuario);
// para gestionar los usuarios (solo admin)
router.get('/users', verificarToken, getUsers);
router.delete('/users/:id', verificarToken, deleteUser);


module.exports = router;
