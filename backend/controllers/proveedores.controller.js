// backend/controllers/proveedores.controller.js
const { pool } = require('../db/index');

exports.obtenerProveedores = async (req, res) => {
  const { nombre } = req.query;
  try {
    const query = nombre
      ? `SELECT * FROM proveedores WHERE LOWER(nombre) LIKE LOWER($1) ORDER BY nombre`
      : `SELECT * FROM proveedores ORDER BY nombre`;

    const values = nombre ? [`%${nombre}%`] : [];

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener proveedores:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.crearProveedor = async (req, res) => {
  const { nombre, empresa, correo, telefono, contacto_principal, rfc } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO proveedores (nombre, empresa, correo, telefono, contacto_principal, rfc)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [nombre, empresa, correo, telefono, contacto_principal, rfc]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear proveedor:', err);
    res.status(500).json({ error: 'Error al registrar proveedor' });
  }
};

exports.eliminarProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM proveedores WHERE id_proveedor = $1', [id]);
    res.status(200).json({ mensaje: 'Proveedor eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar proveedor:', err);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
};

exports.editarProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, empresa, correo, telefono, contacto_principal, rfc } = req.body;
  try {
    const result = await pool.query(`
      UPDATE proveedores SET nombre=$1, empresa=$2, correo=$3, telefono=$4, contacto_principal=$5, rfc=$6
      WHERE id_proveedor=$7 RETURNING *`,
      [nombre, empresa, correo, telefono, contacto_principal, rfc, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al editar proveedor:', err);
    res.status(500).json({ error: 'Error al editar proveedor' });
  }
};
