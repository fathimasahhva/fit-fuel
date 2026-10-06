const express = require('express');
const {
  searchFood,
  addFoodLog,
  getFoodLog,
  deleteFoodLog
} = require('../controllers/foodController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/search', protect, searchFood);
router.post('/log', protect, addFoodLog);
router.get('/log', protect, getFoodLog);
router.delete('/log/:id', protect, deleteFoodLog);

module.exports = router;
