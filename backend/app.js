// backend/app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const cotizacionesRoutes = require('./routes/cotizaciones.routes');
const productosRoutes = require('./routes/productos.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const clientesRoutes = require('./routes/clientes.routes');
const preciosRoutes = require('./routes/precios.routes');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/cotizaciones', cotizacionesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/proveedores', proveedoresRoutes)
app.use('/api/clientes', clientesRoutes);
app.use('/api/precios', preciosRoutes);

app.get('/', (req, res) => {
  res.send('API ERP backend está corriendo');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

