const express = require('express');
const { body } = require('express-validator');
const jobController = require('../controllers/JobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('recruiter'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('company').notEmpty().withMessage('Company is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  jobController.create.bind(jobController)
);

// candidates see all active jobs
router.get(
  '/',
  protect,
  jobController.getAll.bind(jobController)
);

// recruiter sees only their own jobs
router.get(
  '/my',
  protect,
  authorize('recruiter'),
  jobController.getMyJobs.bind(jobController)
);

router.get(
  '/:id',
  protect,
  jobController.getById.bind(jobController)
);

router.put(
  '/:id',
  protect,
  authorize('recruiter'),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('company').optional().notEmpty().withMessage('Company cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  ],
  jobController.update.bind(jobController)
);

router.delete(
  '/:id',
  protect,
  authorize('recruiter'),
  jobController.delete.bind(jobController)
);

module.exports = router;