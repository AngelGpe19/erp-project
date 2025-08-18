// backend/controllers/cotizaciones.controller.js
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

exports.crearCotizacionConDetalles = async (req, res) => {
  const client = await pool.connect();
  try {
     console.log("📩 Datos recibidos del frontend:", JSON.stringify(req.body, null, 2));

    const { id_cliente, margen_utilidad, total_estimado, productos } = req.body;

    //validar el payload

    // 🔎 Validador de payload
    if (!id_cliente) {
      return res.status(400).json({ error: "El campo id_cliente es obligatorio" });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: "Debe incluir al menos un producto válido" });
    }

    // Validar que cada producto tenga lo necesario
    for (const [i, p] of productos.entries()) {
      if (
        !p.id_producto ||
        !p.id_precio ||
        !p.cantidad ||
        !p.precio_unitario_estimado ||
        !p.ganancia_tipo ||
        p.ganancia_valor === undefined ||
        !p.precio_unitario_con_ganancia
      ) {
        return res.status(400).json({
          error: `El producto en posición ${i} está incompleto o tiene valores inválidos`,
        });
      }
    }




    //Hasta aqui se valida el payload

    await client.query("BEGIN");

    const resultCotizacion = await client.query(
      `INSERT INTO cotizaciones (id_cliente, margen_utilidad, total_estimado)
       VALUES ($1, $2, $3) RETURNING id_cotizacion`,
      [id_cliente, margen_utilidad, total_estimado]
    );

    const id_cotizacion = resultCotizacion.rows[0].id_cotizacion;

     console.log(`🆕 Cotización creada con ID: ${id_cotizacion}`);

    const insertDetalleText = `
      INSERT INTO detalle_cotizacion
      (id_cotizacion, id_producto, id_precio, cantidad, precio_unitario_estimado, ganancia_tipo, ganancia_valor, precio_unitario_con_ganancia)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    for (const p of productos) {
      await client.query(insertDetalleText, [
        id_cotizacion,
        p.id_producto,
        p.id_precio,
        p.cantidad,
        p.precio_unitario_estimado,
        p.ganancia_tipo,
        p.ganancia_valor,
        p.precio_unitario_con_ganancia,
      ]);
    }

    await client.query("COMMIT");

    res.status(201).json({ id_cotizacion });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al crear cotización con detalles:", err);
    res.status(500).json({ error: "Error al registrar cotización" });
  } finally {
    client.release();
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
