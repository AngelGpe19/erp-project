 const express = require('express');
const router = express.Router();
const cotizacionesController = require('../controllers/cotizaciones.controller');
const verifyToken = require('../middleware/auth.middleware'); // Asumiendo que ya lo tienes

router.use(verifyToken); // Protege todas las rutas siguientes

router.get('/', cotizacionesController.obtenerCotizaciones);
router.post('/', cotizacionesController.crearCotizacion);

module.exports = router;
