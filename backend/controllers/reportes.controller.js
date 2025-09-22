// backend/controllers/reportes.controller.js
const { pool } = require('../db/index');

// Función para obtener todos los productos para el reporte
exports.obtenerReporteProductos = async (req, res) => {
    try {
        const result = await pool.query('SELECT id_producto, nombre, unidad_medida, descripcion, categoria FROM productos ORDER BY nombre');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener reporte de productos:', error.message);
        res.status(500).json({ error: 'Error del servidor al obtener datos de productos.' });
    }
};

// Función para obtener todos los precios para el reporte
exports.obtenerReportePrecios = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                pp.id_precio,
                p.nombre AS nombre_producto,
                pr.nombre AS nombre_proveedor,
                pp.precio_unitario,
                pp.fecha_registro,
                pp.condiciones_pago,
                pp.cantidad,
                pp.marca,
                pp.enlace
            FROM precios_producto pp
            JOIN productos p ON pp.id_producto = p.id_producto
            JOIN proveedores pr ON pp.id_proveedor = pr.id_proveedor
            ORDER BY p.nombre`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener reporte de precios:', error.message);
        res.status(500).json({ error: 'Error del servidor al obtener datos de precios.' });
    }
};