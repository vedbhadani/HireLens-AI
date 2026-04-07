const express = require('express');
const resumeController = require('../controllers/ResumeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// only candidates can upload resumes
router.post(
  '/upload',
  protect,
  authorize('candidate'),
  upload.single('resume'),
  resumeController.upload.bind(resumeController)
);

router.get(
  '/me',
  protect,
  resumeController.getMyResumes.bind(resumeController)
);

router.get(
  '/:id',
  protect,
  resumeController.getById.bind(resumeController)
);

router.delete(
  '/:id',
  protect,
  resumeController.delete.bind(resumeController)
);

module.exports = router;