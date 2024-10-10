const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Importar las rutas de arepas e ingredientes
const arepaRoutes = require('./routes/arepas');
const ingredienteRoutes = require('./routes/ingredientes');
const bebidaRoutes = require('./routes/bebidas'); // Para el CRUD de bebidas (paso 6)

// Middleware para analizar JSON
app.use(express.json());

// Middleware para manejar CORS
app.use(cors());

// Registrar las rutas de la API
app.use('/api/arepas', arepaRoutes);
app.use('/api/ingredientes', ingredienteRoutes);
app.use('/api/bebidas', bebidaRoutes); // Registrar la ruta de bebidas

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ha ocurrido un error en el servidor' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
