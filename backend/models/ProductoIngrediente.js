const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class ProductoIngrediente extends Model {}

ProductoIngrediente.init({
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ProductoIngrediente',
  timestamps: true
});

module.exports = ProductoIngrediente;
