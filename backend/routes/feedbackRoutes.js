const express = require('express');
const { body } = require('express-validator');
const feedbackController = require('../controllers/FeedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('recruiter'),
  [
    body('candidateId').notEmpty().withMessage('candidateId is required'),
    body('jobId').notEmpty().withMessage('jobId is required'),
    body('resumeId').notEmpty().withMessage('resumeId is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
  ],
  feedbackController.submit.bind(feedbackController)
);

router.get(
  '/me',
  protect,
  authorize('candidate'),
  feedbackController.getMyFeedback.bind(feedbackController)
);

router.get(
  '/job/:jobId',
  protect,
  authorize('recruiter'),
  feedbackController.getJobFeedbacks.bind(feedbackController)
);

module.exports = router;