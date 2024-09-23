const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('inventario_arepas', 'inventario_user', 'Usa.2024#', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
