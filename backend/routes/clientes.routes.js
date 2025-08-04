// backend/routes/clientes.routes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth.middleware');
const {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente
} = require('../controllers/clientes.controller');

router.get('/', verificarToken, obtenerClientes);
router.post('/', verificarToken, crearCliente);
router.delete('/:id', verificarToken, eliminarCliente);
router.put('/:id', verificarToken, actualizarCliente);

module.exports = router;
