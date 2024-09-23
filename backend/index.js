const express = require('express');
const app = express();
const sequelize = require('./config/database'); // Importamos la configuración de la base de datos
const port = process.env.PORT || 3000;

// Probar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos.');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Bienvenido al sistema de inventario de arepas!');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
