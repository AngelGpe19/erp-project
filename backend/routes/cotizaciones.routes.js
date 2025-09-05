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
  crearCotizacionConDetalles,
  eliminarCotizacion,
  actualizarCotizacion,
  obtenerCotizacionPorId,
  actualizarEstadoCotizacion
} = require('../controllers/cotizaciones.controller');


//router.use(verifyToken); // Protege todas las rutas siguientes
router.get('/cotizaciones', verificarToken, obtenerCotizaciones);
// router.get('/', cotizacionesController.obtenerCotizaciones);
router.post('/', verificarToken, crearCotizacion); // Protegida también
router.post('/con-detalles', verificarToken, crearCotizacionConDetalles);
router.delete('/:id', verificarToken, eliminarCotizacion);
router.put('/:id', verificarToken, actualizarCotizacion);

router.get('/:id', verificarToken, obtenerCotizacionPorId);
router.patch("/:id/estado", cotizacionesController.actualizarEstadoCotizacion);

module.exports = router;
