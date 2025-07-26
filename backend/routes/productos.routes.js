// backend/routes/productos.routes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth.middleware');
const {
  obtenerProveedores,
  crearProveedor,
  eliminarProveedor,
  editarProveedor
} = require('../controllers/proveedores.controller');

router.get('/', verificarToken, obtenerProveedores);
router.post('/', verificarToken, crearProveedor);
router.delete('/:id', verificarToken, eliminarProveedor);
router.put('/:id', verificarToken, editarProveedor);

module.exports = router;
