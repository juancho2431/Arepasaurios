// Archivo: routes/reportes.js

const express = require('express');
const { Op } = require('sequelize');
const Venta = require('../models/Venta');

const router = express.Router();

// Endpoint para obtener reportes de ventas
router.get('/ventas/reportes', async (req, res) => {
  try {
    const { startDate, endDate, role } = req.query;

    // Verificar si hay fechas proporcionadas y si se pueden convertir a tipo Date
    let filterStartDate = new Date(startDate);
    let filterEndDate = new Date(endDate);

    // Si el rol es 'Empleado' o 'Cajero', restringir la consulta a la fecha actual
    if (role === 'Empleado' || role === 'Cajero') {
      filterStartDate = new Date();
      filterStartDate.setHours(0, 0, 0, 0); // Inicio del día actual
      filterEndDate = new Date();
      filterEndDate.setHours(23, 59, 59, 999); // Fin del día actual
    }

    // Si no hay fechas proporcionadas, devuelve un error
    if (isNaN(filterStartDate.getTime()) || isNaN(filterEndDate.getTime())) {
      return res.status(400).json({ error: 'Las fechas proporcionadas no son válidas' });
    }

    // Obtener las ventas dentro del rango de fechas especificado
    const ventas = await Venta.sum('total', {
      where: {
        fecha: {
          [Op.gte]: filterStartDate,
          [Op.lte]: filterEndDate,
        },
      },
    });

    res.json({ total_ventas: ventas || 0 });
  } catch (error) {
    console.error('Error al obtener reportes de ventas:', error);
    res.status(500).json({ error: 'Error al obtener reportes de ventas' });
  }
});

module.exports = router;
