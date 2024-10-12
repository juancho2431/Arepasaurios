// routes/ventas.js
const express = require('express');
const router = express.Router();
const { Arepa, Bebida, Ingrediente, Ventas, VentaDetalle} = require('../models');
console.log('Modelo Ventas:', Ventas);

const sequelize = require('../config/db');

router.get('/', async (req, res) => {
  console.log('Intentando obtener todas las ventas...');
  try {
    const ventas = await Ventas.findAll({
      include: [
        {
          model: VentaDetalle,
          include: [
            {
              model: Arepa,
              as: 'arepa',
              attributes: ['name', 'price'],
              required: false
            },
            {
              model: Bebida,
              as: 'bebida',
              attributes: ['name', 'price'],
              required: false
            }
          ]
        }
      ]
    });

    console.log('Ventas obtenidas:', ventas);
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ error: 'Error al obtener las ventas', detalle: error.message });
  }
});

// Ruta para realizar una venta
router.post('/', async (req, res) => {
  const { fecha, total, detalles } = req.body;

  // Validar los datos de la solicitud
  if (!fecha || !total || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ message: 'Debe proporcionar una fecha, un total y detalles válidos para la venta.' });
  }

  try {
    // Iniciar una transacción para asegurar la consistencia de los datos
    await sequelize.transaction(async (transaction) => {
      // Crear la venta principal
      const venta = await Ventas.create({ fecha, total }, { transaction });

      // Iterar sobre los detalles para crear registros y actualizar el stock
      for (const detalle of detalles) {
        const { tipo_producto, producto_id, cantidad, precio } = detalle;

        // Validar los datos de cada detalle
        if (!producto_id || !cantidad || !precio) {
          throw new Error('Debe proporcionar todos los datos para cada detalle de la venta.');
        }

        // Crear el registro del detalle de la venta
        await VentaDetalle.create({
          venta_id: venta.ventas_id, // Asegurar que se está usando el ID correcto de la venta recién creada
          producto_id,
          tipo_producto,
          cantidad,
          precio,
        }, { transaction });

        // Actualizar el stock según el tipo de producto
        if (tipo_producto === 'arepa') {
          // Obtener los ingredientes asociados con la arepa
          const arepa = await Arepa.findByPk(producto_id, {
            include: {
              model: Ingrediente,
              through: {
                attributes: ['amount'],
              },
            },
            transaction,
          });

          if (arepa && arepa.Ingredientes) {
            for (const ingrediente of arepa.Ingredientes) {
              // Calcular la cantidad de cada ingrediente necesario
              const cantidadNecesaria = ingrediente.ArepaIngrediente.amount * cantidad;

              if (ingrediente.stock_current < cantidadNecesaria) {
                throw new Error(`Stock insuficiente para el ingrediente: ${ingrediente.name}`);
              }

              // Descontar el stock del ingrediente
              ingrediente.stock_current -= cantidadNecesaria;
              await ingrediente.save({ transaction });
            }
          }
        } else if (tipo_producto === 'bebida') {
          // Descontar el stock de la bebida
          const bebida = await Bebida.findByPk(producto_id, { transaction });

          if (bebida && bebida.stock < cantidad) {
            throw new Error(`Stock insuficiente para la bebida: ${bebida.name}`);
          }

          bebida.stock -= cantidad;
          await bebida.save({ transaction });
        }
      }

      // Si todo es exitoso, la transacción se completa automáticamente
    });

    // Enviar respuesta de éxito
    res.status(201).json({ message: 'Venta creada con éxito' });

  } catch (error) {
    console.error('Error al crear la venta:', error);
    res.status(500).json({ message: 'Error al crear la venta', detalle: error.message });
  }
});



module.exports = router;
