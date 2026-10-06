const express = require('express');
const {
  getProfile,
  updateProfile,
  calculateMetrics
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/calculate', calculateMetrics);

module.exports = router;
