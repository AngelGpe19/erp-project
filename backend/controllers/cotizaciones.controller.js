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

// Otros controladores (obtenerCotizacionPorId, actualizarCotizacion, eliminarCotizacion) permanecen igual


exports.eliminarCotizacion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM detalle_cotizacion WHERE id_cotizacion = $1", [id]);
    await pool.query("DELETE FROM cotizaciones WHERE id_cotizacion = $1", [id]);
    res.status(200).json({ message: "Cotización eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar cotización:", err);
    res.status(500).json({ error: "Error al eliminar cotización" });
  }
};

exports.actualizarCotizacion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { id_cliente, margen_utilidad, total_estimado, productos } = req.body;

    await client.query("BEGIN");

    // Actualizar cabecera
    await client.query(
      `UPDATE cotizaciones
       SET id_cliente = $1, margen_utilidad = $2, total_estimado = $3
       WHERE id_cotizacion = $4`,
      [id_cliente, margen_utilidad, total_estimado, id]
    );

    // Eliminar detalles viejos
    await client.query("DELETE FROM detalle_cotizacion WHERE id_cotizacion = $1", [id]);

    // Insertar detalles nuevos
    const insertDetalle = `
      INSERT INTO detalle_cotizacion
      (id_cotizacion, id_producto, id_precio, cantidad, precio_unitario_estimado, ganancia_tipo, ganancia_valor, precio_unitario_con_ganancia)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `;
    for (const p of productos) {
      await client.query(insertDetalle, [
        id, p.id_producto, p.id_precio, p.cantidad,
        p.precio_unitario_estimado, p.ganancia_tipo, p.ganancia_valor,
        p.precio_unitario_con_ganancia
      ]);
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Cotización actualizada correctamente" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar cotización:", err);
    res.status(500).json({ error: "Error al actualizar cotización" });
  } finally {
    client.release();
  }
};

exports.obtenerCotizacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cotizacion = await pool.query(
      `SELECT * FROM cotizaciones WHERE id_cotizacion = $1`,
      [id]
    );

    const productos = await pool.query(
      `SELECT 
        dc.id_producto,
        dc.id_precio,
        dc.cantidad,
        dc.precio_unitario_estimado,
        dc.ganancia_tipo,
        dc.ganancia_valor,
        dc.precio_unitario_con_ganancia,
        p.nombre,
        p.unidad_medida
       FROM detalle_cotizacion dc
       JOIN productos p ON dc.id_producto = p.id_producto
       WHERE dc.id_cotizacion = $1`,
      [id]
    );

    res.json({
      ...cotizacion.rows[0],
      productos: productos.rows,
    });
  } catch (err) {
    console.error("Error al obtener cotización por ID:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};



exports.actualizarEstadoCotizacion = async (req, res) => {
  const { id_cotizacion } = req.params;
  const { nuevoEstado, id_usuario } = req.body;

  try {
    // Obtener cotización actual
    const cotizacion = await pool.query(
      "SELECT estado FROM cotizaciones WHERE id_cotizacion = $1",
      [id_cotizacion]
    );

    if (cotizacion.rows.length === 0) {
      return res.status(404).json({ error: "Cotización no encontrada" });
    }

    const estadoActual = cotizacion.rows[0].estado;

    // Validar transición
    if (estadoActual === "pendiente" && nuevoEstado !== "Revisado") {
      return res.status(400).json({ error: "Solo puede pasar a 'Revisado' desde pendiente." });
    }

    if (estadoActual === "Revisado" && !["Aprobado", "Rechazada"].includes(nuevoEstado)) {
      return res.status(400).json({ error: "Solo puede pasar a 'Aprobado' o 'Rechazada' desde Revisado." });
    }

    // Actualizar estado cotización
    await pool.query(
      "UPDATE cotizaciones SET estado = $1, autorizado_por = $2 WHERE id_cotizacion = $3",
      [nuevoEstado, id_usuario, id_cotizacion]
    );

    // Registrar en historial
    await pool.query(
      "INSERT INTO historial_aprobaciones (id_cotizacion, id_usuario, estado) VALUES ($1, $2, $3)",
      [id_cotizacion, id_usuario, nuevoEstado]
    );

    res.json({ message: "Estado actualizado correctamente", nuevoEstado });
  } catch (error) {
    console.error("Error al actualizar estado:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
