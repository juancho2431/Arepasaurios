const express = require('express');
const router = express.Router();
const { Ingrediente } = require('../models');

// Obtener todos los ingredientes
router.get('/', async (req, res) => {
  try {
    const ingredientes = await Ingrediente.findAll();
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los ingredientes' });
  }
});

// Obtener un ingrediente específico
router.get('/:id', async (req, res) => {
  try {
    const ingredienteId = req.params.id;
    const ingrediente = await Ingrediente.findByPk(ingredienteId);

    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    res.json(ingrediente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el ingrediente' });
  }
});

// Crear un nuevo ingrediente
router.post('/', async (req, res) => {
  try {
    const { name, stock_current, stock_minimum } = req.body;
    const nuevoIngrediente = await Ingrediente.create({ name, stock_current, stock_minimum });
    res.status(201).json(nuevoIngrediente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el ingrediente' });
  }
});

// Actualizar un ingrediente
router.put('/:id', async (req, res) => {
  try {
    const ingredienteId = req.params.id;
    const { name, stock_current, stock_minimum } = req.body;

    const ingrediente = await Ingrediente.findByPk(ingredienteId);
    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    await ingrediente.update({ name, stock_current, stock_minimum });
    res.json(ingrediente);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el ingrediente' });
  }
});

// Eliminar un ingrediente
router.delete('/:id', async (req, res) => {
  try {
    const ingredienteId = req.params.id;

    const ingrediente = await Ingrediente.findByPk(ingredienteId);
    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    await ingrediente.destroy();
    res.json({ message: 'Ingrediente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el ingrediente' });
  }
});

module.exports = router;