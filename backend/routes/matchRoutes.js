const express = require('express');
const matchController = require('../controllers/MatchController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// candidate triggers a match
router.post(
  '/',
  protect,
  authorize('candidate'),
  matchController.match.bind(matchController)
);

// recruiter sees ranked candidates for a job
router.get(
  '/job/:jobId/ranked',
  protect,
  authorize('recruiter'),
  matchController.getRankedCandidates.bind(matchController)
);

// candidate sees all their match results
router.get(
  '/me',
  protect,
  authorize('candidate'),
  matchController.getMyMatches.bind(matchController)
);

module.exports = router;