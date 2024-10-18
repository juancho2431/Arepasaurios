// routes/ventas.js
const express = require('express');
const router = express.Router();
const { Arepa, Bebida, Ingrediente, Ventas, VentaDetalle } = require('../models');
const sequelize = require('../config/db');
console.log('Modelo Ventas:', Ventas);

// Ruta para obtener todas las ventas
router.get('/', async (req, res) => {
  console.log('Intentando obtener todas las ventas...');
  try {
    const ventas = await Ventas.findAll({
      include: [
        {
          model: VentaDetalle,
          as: 'VentaDetalles',
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

    if (!ventas.length) {
      return res.status(404).json({ error: 'No se encontraron ventas.' });
    }

    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
});

// Ruta para obtener una venta específica por ID
router.get('/:ventaId', async (req, res) => {
  const { ventaId } = req.params;
  try {
    console.log('Intentando obtener la venta con ventaId:', ventaId);
    const venta = await Ventas.findByPk(ventaId, {
      include: [
        {
          model: VentaDetalle,
          as: 'VentaDetalles',
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

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    console.log('Resultado de la consulta:', venta);
    res.json(venta);
  } catch (error) {
    console.error('Error al obtener la venta:', error);
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
});

// Ruta para crear una nueva venta
router.post('/', async (req, res) => {
  const { fecha, total, metodoPago, detalles } = req.body;

  // Validar los datos de la solicitud
  if (!fecha || !total || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ message: 'Debe proporcionar una fecha, un total y detalles válidos para la venta.' });
  }

  try {
    // Iniciar una transacción para asegurar la consistencia de los datos
    await sequelize.transaction(async (transaction) => {
      // Crear la venta principal
      const venta = await Ventas.create({ fecha, total, metodoPago }, { transaction });

      // Iterar sobre los detalles para crear registros y actualizar el stock
      for (const detalle of detalles) {
        const { tipo_producto, producto_id, cantidad, precio } = detalle;

        // Validar los datos de cada detalle
        if (!producto_id || !cantidad || !precio) {
          throw new Error('Debe proporcionar todos los datos para cada detalle de la venta.');
        }

        // Crear el registro del detalle de la venta
        await VentaDetalle.create({
          venta_id: venta.ventas_id,
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

// Ruta para eliminar una venta por ID
router.delete('/:ventaId', async (req, res) => {
  const { ventaId } = req.params;
  try {
    console.log('Intentando eliminar la venta con ventaId:', ventaId);
    const venta = await Ventas.findByPk(ventaId);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    await venta.destroy();
    res.json({ message: 'Venta eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la venta:', error);
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
});

module.exports = router;
