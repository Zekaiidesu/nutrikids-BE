const express = require('express');
const router = express.Router();
const {
  getAllNutrition,
  getByCategory,
  getRecommendations,
  addNutrition,
} = require('../controllers/nutritionController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAllNutrition);
router.get('/recommendations', getRecommendations);
router.get('/category/:category', getByCategory);
router.post('/', protect, admin, addNutrition);

module.exports = router;
