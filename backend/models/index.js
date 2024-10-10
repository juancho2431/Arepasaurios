const sequelize = require('../config/db');
const Arepa = require('./Producto');
const Ingrediente = require('./ingrediente');
const ArepaIngrediente = require('./productosIngrediente');
const Bebida = require('./bebida');

// Definir las relaciones entre los modelos
Arepa.belongsToMany(Ingrediente, { through: ArepaIngrediente, foreignKey: 'arepa_id' });
Ingrediente.belongsToMany(Arepa, { through: ArepaIngrediente, foreignKey: 'ingredient_id' });

// Sincronizar modelos con la base de datos
sequelize.sync({ force: false }) // `force: false` mantiene las tablas existentes sin borrarlas
  .then(() => {
    console.log('Tablas sincronizadas.');
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
  });

module.exports = {
  sequelize,
  Arepa,
  Ingrediente,
  ArepaIngrediente,
  Bebida
};