const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Ingrediente extends Model {}

Ingrediente.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unidad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cantidad_porcion: {
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
  modelName: 'Ingrediente',
  timestamps: true
});

module.exports = Ingrediente;
