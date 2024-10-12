// models/Ventas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ventas = sequelize.define('Ventas', {
  ventas_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'ventas',  // Asegúrate de que el nombre de la tabla esté en minúsculas
  timestamps: false,
});

module.exports = Ventas;
