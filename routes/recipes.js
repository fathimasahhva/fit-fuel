const express = require('express');
const {
  listRecipes,
  getRecipe,
  suggestFromPantry
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public browse
router.get('/', listRecipes);
// Suggest must be before :id to avoid route collision
router.get('/suggest/from-pantry', protect, suggestFromPantry);
router.get('/:id', getRecipe);

module.exports = router;
