const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/AuthController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['candidate', 'recruiter'])
      .withMessage('Role must be candidate or recruiter'),
  ],
  authController.register.bind(authController)
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login.bind(authController)
);

router.post('/refresh', authController.refreshToken.bind(authController));

router.post('/logout', authController.logout.bind(authController));

router.get('/me', protect, authController.getMe.bind(authController));

module.exports = router;
