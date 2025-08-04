// backend/routes/proveedores.routes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth.middleware');
const {
  obtenerProveedores,
  crearProveedor,
  eliminarProveedor,
  editarProveedor // editar a futuro cuando se implemente
} = require('../controllers/proveedores.controller'); // Esta es la importación correcta

router.get('/', verificarToken, obtenerProveedores);
router.post('/', verificarToken, crearProveedor);
router.delete('/:id', verificarToken, eliminarProveedor);
// router.put('/:id', verificarToken, editarProveedor); // Habilitar  cuando la edicion esté implementada

module.exports = router;
