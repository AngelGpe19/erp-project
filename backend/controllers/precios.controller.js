// backend/controllers/precios.controller.js
const { pool } = require('../db/index');

// Obtener precios con paginación y búsqueda por producto o proveedor
exports.obtenerPrecios = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const busqueda = req.query.busqueda || '';

  try {
    let consulta;
    let valores;
    let totalConsulta;
    let totalValores;

    if (busqueda) {
      consulta = `
        SELECT pp.*, pr.nombre AS nombre_proveedor, p.nombre AS nombre_producto
        FROM precios_producto pp
        LEFT JOIN proveedores pr ON pr.id_proveedor = pp.id_proveedor
        LEFT JOIN productos p ON p.id_producto = pp.id_producto
        WHERE pr.nombre ILIKE $1 OR p.nombre ILIKE $1
        ORDER BY pp.id_precio DESC
        LIMIT $2 OFFSET $3
      `;
      valores = [`%${busqueda}%`, limit, offset];

      totalConsulta = `
        SELECT COUNT(*)
        FROM precios_producto pp
        LEFT JOIN proveedores pr ON pr.id_proveedor = pp.id_proveedor
        LEFT JOIN productos p ON p.id_producto = pp.id_producto
        WHERE pr.nombre ILIKE $1 OR p.nombre ILIKE $1
      `;
      totalValores = [`%${busqueda}%`];
    } else {
      consulta = `
        SELECT pp.*, pr.nombre AS nombre_proveedor, p.nombre AS nombre_producto
        FROM precios_producto pp
        LEFT JOIN proveedores pr ON pr.id_proveedor = pp.id_proveedor
        LEFT JOIN productos p ON p.id_producto = pp.id_producto
        ORDER BY pp.id_precio DESC
        LIMIT $1 OFFSET $2
      `;
      valores = [limit, offset];

      totalConsulta = `SELECT COUNT(*) FROM precios_producto`;
      totalValores = [];
    }

    const result = await pool.query(consulta, valores);
    const total = await pool.query(totalConsulta, totalValores);

    res.status(200).json({
      precios: result.rows,
      total: parseInt(total.rows[0].count)
    });
  } catch (err) {
    console.error('Error al obtener precios:', err);
    res.status(500).json({ error: 'Error al obtener precios' });
  }
};

// Crear nuevo precio
exports.crearPrecio = async (req, res) => {
  const {
    id_producto,
    id_proveedor,
    precio_unitario,
    condiciones_pago,
    cantidad,
    marca,
    enlace
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO precios_producto
      (id_producto, id_proveedor, precio_unitario, condiciones_pago, cantidad, marca, enlace)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      id_producto,
      id_proveedor,
      precio_unitario,
      condiciones_pago,
      cantidad,
      marca,
      enlace
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear precio:', err);
    res.status(500).json({ error: 'Error al registrar precio' });
  }
};

// Eliminar precio por ID
exports.eliminarPrecio = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM precios_producto WHERE id_precio = $1', [id]);
    res.status(200).json({ mensaje: 'Precio eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar precio:', err);
    res.status(500).json({ error: 'Error al eliminar precio' });
  }
};

// Editar precio por ID
exports.editarPrecio = async (req, res) => {
  const { id } = req.params;
  const {
    id_producto,
    id_proveedor,
    precio_unitario,
    condiciones_pago,
    cantidad,
    marca,
    enlace
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE precios_producto
      SET id_producto = $1,
          id_proveedor = $2,
          precio_unitario = $3,
          condiciones_pago = $4,
          cantidad = $5,
          marca = $6,
          enlace = $7
      WHERE id_precio = $8
      RETURNING *
    `, [
      id_producto,
      id_proveedor,
      precio_unitario,
      condiciones_pago,
      cantidad,
      marca,
      enlace,
      id
    ]);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar precio:', err);
    res.status(500).json({ error: 'Error al actualizar precio' });
  }
};
