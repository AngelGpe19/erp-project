const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { pool } = require('../db');

router.post('/login', login);
router.post('/register', register); // Opcional, para pruebas

// Ruta GET para testear conexión
router.get('/test-usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios LIMIT 5');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error al consultar usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;
