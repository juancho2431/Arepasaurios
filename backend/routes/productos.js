// routes/productos.js
const express = require('express');
const router = express.Router();
const { Producto, Ingrediente, ProductoIngrediente } = require('../models');

// Obtener todos los productos junto con sus ingredientes
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [{ 
        model: Ingrediente, 
        through: { attributes: ['cantidad'] } // Incluye los ingredientes y la cantidad en ProductoIngrediente
      }]
    });
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Crear un nuevo producto con ingredientes
// Guardar un nuevo producto con ingredientes asociados
router.post('/', async (req, res) => {
  console.log(req.body);
  try {
    const { nombre, categoria, precio_venta, ingredientes } = req.body;

    if (!nombre || !categoria || !precio_venta || ingredientes.length === 0) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    // Crear el producto
    const nuevoProducto = await Producto.create({
      nombre,
      categoria,
      precio_venta,
      stock_actual: 0,
      stock_minimo: 0,
    });

    // Asociar los ingredientes al producto
    if (ingredientes && ingredientes.length > 0) {
      for (const ingrediente of ingredientes) {
        await ProductoIngrediente.create({
          ProductoId: nuevoProducto.id,
          IngredienteId: ingrediente.id,
          cantidad: ingrediente.cantidad,
        });
      }
    }

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// routes/productos.js

// Modificar un producto con ingredientes
// Editar un producto
router.put('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    res.status(500).send('Error al editar producto');
  }
});

// Eliminar un ingrediente de un producto
router.delete('/ingredientes/:productoId/:ingredienteId', async (req, res) => {
  try {
    const productoIngrediente = await ProductoIngrediente.findOne({
      where: {
        ProductoId: req.params.productoId,
        IngredienteId: req.params.ingredienteId
      }
    });

    if (!productoIngrediente) {
      return res.status(404).send('Ingrediente no encontrado');
    }

    await productoIngrediente.destroy();
    res.send('Ingrediente eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar ingrediente');
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    await producto.destroy();
    res.send('Producto eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar producto');
  }
});


module.exports = router;
