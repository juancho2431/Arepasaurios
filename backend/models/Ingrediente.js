const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ingrediente = sequelize.define('Ingrediente', {
  ingredient_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock_current: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock_minimum: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ingredients',
  timestamps: false
});

module.exports = Ingrediente;

