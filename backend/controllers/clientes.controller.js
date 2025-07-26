// backend/controllers/clientes.controller.js
const { pool } = require('../db/index');

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id_cliente DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener clientes:', err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

// Crear nuevo cliente
exports.crearCliente = async (req, res) => {
  const { nombre, correo, telefono, empresa, rfc } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO clientes (nombre, correo, telefono, empresa, rfc)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, correo, telefono, empresa, rfc]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear cliente:', err);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

// Eliminar cliente por ID
exports.eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
    res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar cliente:', err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};

// Editar cliente por ID
exports.actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, empresa, rfc } = req.body;
  try {
    const result = await pool.query(
      `UPDATE clientes
       SET nombre = $1, correo = $2, telefono = $3, empresa = $4, rfc = $5
       WHERE id_cliente = $6
       RETURNING *`,
      [nombre, correo, telefono, empresa, rfc, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar cliente:', err);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};
