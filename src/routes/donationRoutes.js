const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgram,
  createProgram,
  donate,
  getMyDonations,
} = require('../controllers/donationController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getPrograms);
router.get('/my-donations', protect, getMyDonations);
router.get('/:id', getProgram);
router.post('/', protect, admin, createProgram);
router.post('/:id/donate', protect, donate);

module.exports = router;
