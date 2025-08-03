const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth.middleware');
const {
  obtenerPrecios,
  crearPrecio,
  eliminarPrecio,
  editarPrecio
} = require('../controllers/precios.controller');

router.get('/', verificarToken, obtenerPrecios);
router.post('/', verificarToken, crearPrecio);
router.delete('/:id', verificarToken, eliminarPrecio);
router.put('/:id', verificarToken, editarPrecio);

module.exports = router;
