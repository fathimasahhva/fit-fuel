const express = require('express');
const {
  getPantry,
  addItem,
  updateItem,
  removeItem,
  clearPantry
} = require('../controllers/pantryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getPantry);
router.post('/items', addItem);
router.put('/items/:itemId', updateItem);
router.delete('/items/:itemId', removeItem);
router.delete('/', clearPantry);

module.exports = router;
