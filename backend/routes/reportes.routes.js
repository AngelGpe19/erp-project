const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// Rutas para los reportes de Excel
router.get('/productos', verificarToken, reportesController.obtenerReporteProductos);
router.get('/precios', verificarToken, reportesController.obtenerReportePrecios);

module.exports = router;
// backend/routes/reportes.routes.js