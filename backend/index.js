const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Para procesar JSON en el cuerpo de la solicitud

// Rutas
// Rutas de productos
app.use('/api/productos', require('./routes/productos'));

// Rutas de ingredientes
app.use('/api/ingredientes', require('./routes/ingredientes'));


// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

