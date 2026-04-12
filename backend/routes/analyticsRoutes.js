const express = require('express');
const analyticsController = require('../controllers/AnalyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/summary',
  protect,
  authorize('admin'),
  analyticsController.getSummary.bind(analyticsController)
);

router.get(
  '/jobs/:jobId',
  protect,
  authorize('recruiter'),
  analyticsController.getJobAnalytics.bind(analyticsController)
);

module.exports = router;