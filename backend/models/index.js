const sequelize = require('../config/db');
const Ventas = require('./ventas');  // Importa el modelo Ventas
const VentaDetalle = require('./VentaDetalle');
const Arepa = require('./Producto');
const Bebida = require('./bebida');
const Ingrediente = require('./ingrediente');
const ArepaIngrediente = require('./productosIngrediente');

// Definir las relaciones entre los modelos
Arepa.belongsToMany(Ingrediente, { through: ArepaIngrediente, foreignKey: 'arepa_id' });
Ingrediente.belongsToMany(Arepa, { through: ArepaIngrediente, foreignKey: 'ingredient_id' });

// Relación entre Ventas y VentaDetalle
Ventas.hasMany(VentaDetalle, { foreignKey: 'ventas_id' });
VentaDetalle.belongsTo(Ventas, { foreignKey: 'ventas_id' });

// Relación entre VentaDetalle y Arepa
VentaDetalle.belongsTo(Arepa, {
  foreignKey: 'producto_id',
  constraints: false,
  as: 'arepa'
});

// Relación entre VentaDetalle y Bebida
VentaDetalle.belongsTo(Bebida, {
  foreignKey: 'producto_id',
  constraints: false,
  as: 'bebida'
});

// Sincronizar modelos con la base de datos
sequelize.sync({ force: true }) // Esto recreará las tablas
  .then(() => {
    console.log('Tablas sincronizadas.');
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
  });

module.exports = {
  sequelize,
  Ventas,           // Exportar como 'Ventas'
  VentaDetalle,
  Arepa,
  Bebida,
  Ingrediente,
  ArepaIngrediente,
};
