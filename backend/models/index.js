const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Importar modelos directamente
const Producto = require('./Producto');
const Ingrediente = require('./Ingrediente');
const ProductoIngrediente = require('./ProductoIngrediente');

// Asociaciones
Producto.belongsToMany(Ingrediente, { through: ProductoIngrediente });
Ingrediente.belongsToMany(Producto, { through: ProductoIngrediente });

// Exportar los modelos
const models = {
  Producto,
  Ingrediente,
  ProductoIngrediente,
};

module.exports = { ...models, sequelize };
