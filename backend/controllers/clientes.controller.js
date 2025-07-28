// backend/controllers/clientes.controller.js
const { pool } = require('../db/index');

// Obtener todos los clientes
// controllers/clientes.controller.js
// Obtener todos los clientes con paginación y búsqueda
exports.obtenerClientes = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const busqueda = req.query.busqueda || '';

  try {
    let consulta;
    let valores;
    let totalConsulta;
    let totalValores;

    if (busqueda) {
      // Si hay texto de búsqueda, filtrar por nombre, correo, empresa o RFC
      consulta = `
        SELECT * FROM clientes
        WHERE nombre ILIKE $1 OR correo ILIKE $1 OR empresa ILIKE $1 OR rfc ILIKE $1
        ORDER BY id_cliente DESC
        LIMIT $2 OFFSET $3
      `;
      valores = [`%${busqueda}%`, limit, offset];

      totalConsulta = `
        SELECT COUNT(*) FROM clientes
        WHERE nombre ILIKE $1 OR correo ILIKE $1 OR empresa ILIKE $1 OR rfc ILIKE $1
      `;
      totalValores = [`%${busqueda}%`];
    } else {
      // Sin filtro de búsqueda
      consulta = `SELECT * FROM clientes ORDER BY id_cliente DESC LIMIT $1 OFFSET $2`;
      valores = [limit, offset];

      totalConsulta = `SELECT COUNT(*) FROM clientes`;
      totalValores = [];
    }

    const result = await pool.query(consulta, valores);
    const total = await pool.query(totalConsulta, totalValores);

    res.status(200).json({
      clientes: result.rows,
      total: parseInt(total.rows[0].count)
    });
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
