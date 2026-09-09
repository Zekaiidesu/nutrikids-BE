const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticle,
  createArticle,
  getByCategory,
  getPreventionTimeline,
} = require('../controllers/educationController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAllArticles);
router.get('/prevention-timeline', getPreventionTimeline);
router.get('/category/:category', getByCategory);
router.get('/:id', getArticle);
router.post('/', protect, admin, createArticle);

module.exports = router;
