const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Asegúrate de que esto esté correctamente configurado

class Producto extends Model {}

Producto.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio_venta: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock_actual: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Producto',
  timestamps: true
});

module.exports = Producto;
