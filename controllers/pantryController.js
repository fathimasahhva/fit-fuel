/**
 * Pantry controller — CRUD for user ingredients
 */
const Pantry = require('../models/Pantry');

async function getOrCreatePantry(userId) {
  let pantry = await Pantry.findOne({ userId });
  if (!pantry) {
    pantry = await Pantry.create({ userId, ingredients: [] });
  }
  return pantry;
}

// GET /api/pantry
async function getPantry(req, res) {
  try {
    const pantry = await getOrCreatePantry(req.user._id);
    res.json(pantry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/pantry/items
async function addItem(req, res) {
  try {
    const { name, quantity, unit, category } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Ingredient name is required' });
    }

    const pantry = await getOrCreatePantry(req.user._id);
    const normalized = name.trim().toLowerCase();

    // Update quantity if ingredient already exists
    const existing = pantry.ingredients.find((i) => i.name === normalized);
    if (existing) {
      if (quantity) existing.quantity = quantity;
      if (unit) existing.unit = unit;
      if (category) existing.category = category;
    } else {
      pantry.ingredients.push({
        name: normalized,
        quantity: quantity || '',
        unit: unit || '',
        category: category || 'other'
      });
    }

    await pantry.save();
    res.status(201).json(pantry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// PUT /api/pantry/items/:itemId
async function updateItem(req, res) {
  try {
    const pantry = await getOrCreatePantry(req.user._id);
    const item = pantry.ingredients.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { name, quantity, unit, category } = req.body;
    if (name) item.name = name.trim().toLowerCase();
    if (quantity !== undefined) item.quantity = quantity;
    if (unit !== undefined) item.unit = unit;
    if (category) item.category = category;

    await pantry.save();
    res.json(pantry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// DELETE /api/pantry/items/:itemId
async function removeItem(req, res) {
  try {
    const pantry = await getOrCreatePantry(req.user._id);
    const item = pantry.ingredients.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.deleteOne();
    await pantry.save();
    res.json(pantry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// DELETE /api/pantry — clear all
async function clearPantry(req, res) {
  try {
    const pantry = await getOrCreatePantry(req.user._id);
    pantry.ingredients = [];
    await pantry.save();
    res.json(pantry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getPantry, addItem, updateItem, removeItem, clearPantry };
