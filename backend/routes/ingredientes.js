// routes/ingredientes.js
const express = require('express');
const router = express.Router();
const { Ingrediente } = require('../models');

// Obtener todos los ingredientes
router.get('/', async (req, res) => {
  try {
    const ingredientes = await Ingrediente.findAll();
    res.json(ingredientes);
  } catch (error) {
    console.error('Error al obtener ingredientes:', error);
    res.status(500).json({ error: 'Error al obtener ingredientes.' });
  }
});

// Crear un nuevo ingrediente
router.post('/', async (req, res) => {
  const { nombre, unidad, cantidad_porcion, stock_actual, stock_minimo } = req.body;
  try {
    const nuevoIngrediente = await Ingrediente.create({
      nombre,
      unidad,
      cantidad_porcion,
      stock_actual,
      stock_minimo
    });
    res.json(nuevoIngrediente);
  } catch (error) {
    console.error('Error al crear ingrediente:', error);
    res.status(500).json({ error: 'Error al crear ingrediente.' });
  }
});
// Editar un ingrediente
router.put('/:id', async (req, res) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    await ingrediente.update(req.body);
    res.json(ingrediente);
  } catch (error) {
    res.status(500).json({ error: 'Error al editar ingrediente' });
  }
});
// Eliminar un ingrediente
router.delete('/:id', async (req, res) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    await ingrediente.destroy();
    res.json({ message: 'Ingrediente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ingrediente' });
  }
});


module.exports = router;
