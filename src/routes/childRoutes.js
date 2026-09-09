const express = require('express');
const router = express.Router();
const {
  addChild,
  getChildren,
  getChild,
  addGrowthData,
  checkNutrition,
  getGrowthChart,
} = require('../controllers/childController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', addChild);
router.get('/', getChildren);
router.post('/check-nutrition', checkNutrition);
router.get('/:id', getChild);
router.post('/:id/growth', addGrowthData);
router.get('/:id/chart', getGrowthChart);

module.exports = router;
