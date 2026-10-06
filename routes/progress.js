const express = require('express');
const {
  logWeight,
  getWeightHistory,
  nutritionSummary,
  deleteWeight
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/weight', logWeight);
router.get('/weight', getWeightHistory);
router.delete('/weight/:id', deleteWeight);
router.get('/nutrition-summary', nutritionSummary);

module.exports = router;
