//productos.controller.js
const { pool } = require('../db/index');

exports.obtenerProductos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY nombre');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.crearProducto = async (req, res) => {
  const { nombre, unidad_medida, descripcion, categoria } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO productos (nombre, unidad_medida, descripcion, categoria)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [nombre, unidad_medida, descripcion, categoria]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al registrar producto' });
  }
};

exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
    res.status(200).json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

exports.editarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, unidad_medida, descripcion, categoria } = req.body;
  try {
    const result = await pool.query(`
      UPDATE productos SET nombre=$1, unidad_medida=$2, descripcion=$3, categoria=$4
      WHERE id_producto=$5 RETURNING *`,
      [nombre, unidad_medida, descripcion, categoria, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al editar producto:', err);
    res.status(500).json({ error: 'Error al editar producto' });
  }
};
