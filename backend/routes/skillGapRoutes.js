const express = require('express');
const skillGapController = require('../controllers/SkillGapController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/analyze',
  protect,
  authorize('candidate'),
  skillGapController.analyze.bind(skillGapController)
);

module.exports = router;