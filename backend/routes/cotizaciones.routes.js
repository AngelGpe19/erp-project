// backend/routes/cotizaciones.routes.js
 const express = require('express');
const router = express.Router();
const cotizacionesController = require('../controllers/cotizaciones.controller');
const { pool } = require('../db/index');

//const verifyToken = require('../middleware/auth.middleware'); // Asumiendo que ya lo tienes
const { verificarToken } = require('../middleware/auth.middleware');


// Importa las funciones necesarias desde el controlador
const {
  obtenerCotizaciones,
  crearCotizacion,
  crearCotizacionConDetalles
} = require('../controllers/cotizaciones.controller');

// Ruta de prueba sin autenticación
router.get('/test', async (req, res) => {
  try {
    const result = await pool.query(`

      SELECT c.*, cl.nombre AS nombre_cliente 
      FROM cotizaciones c
      JOIN clientes cl ON c.id_cliente = cl.id_cliente
      ORDER BY c.fecha_creacion DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error en la ruta de prueba:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


//router.use(verifyToken); // Protege todas las rutas siguientes
router.get('/cotizaciones', verificarToken, obtenerCotizaciones);
// router.get('/', cotizacionesController.obtenerCotizaciones);
router.post('/', verificarToken, crearCotizacion); // Protegida también
router.post('/con-detalles', verificarToken, crearCotizacionConDetalles);

module.exports = router;
