// backend/routes/productos.routes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth.middleware');
const {
  obtenerProductos,
  crearProducto,
  eliminarProducto,
  editarProducto,
  buscarProductos
} = require('../controllers/productos.controller'); 


router.get('/', verificarToken, obtenerProductos);
router.post('/', verificarToken, crearProducto);
router.delete('/:id', verificarToken, eliminarProducto);
router.put('/:id', verificarToken, editarProducto);
router.get('/buscar', verificarToken, buscarProductos);
module.exports = router;
