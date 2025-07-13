const { pool } = require('../db/index');

exports.obtenerCotizaciones = async (req, res) => {
  try {
   const result = await pool.query(`
  SELECT 
    c.id_cotizacion AS id,
    cl.nombre AS nombre_cliente,
    c.fecha_creacion,
    c.total_estimado,
    c.margen_utilidad,
    c.estado AS estatus
  FROM cotizaciones c
  JOIN clientes cl ON c.id_cliente = cl.id_cliente
  ORDER BY c.fecha_creacion DESC
`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener cotizaciones:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.crearCotizacion = async (req, res) => {
  const { id_cliente, margen_utilidad, total_estimado } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO cotizaciones (id_cliente, margen_utilidad, total_estimado)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [id_cliente, margen_utilidad, total_estimado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear cotización:', err);
    res.status(500).json({ error: 'Error al registrar cotización' });
  }
};
