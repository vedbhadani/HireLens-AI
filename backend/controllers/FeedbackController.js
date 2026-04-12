const { validationResult } = require('express-validator');
const feedbackService = require('../services/FeedbackService');

class FeedbackController {
  async submit(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const feedback = await feedbackService.submit(req.user._id, req.body);
      return res.status(201).json({ message: 'Feedback submitted', feedback });
    } catch (error) {
      if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Not authorized') {
        return res.status(403).json({ message: error.message });
      }
      if (error.message === 'Feedback already submitted') {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }

  async getMyFeedback(req, res, next) {
    try {
      const feedbacks = await feedbackService.getMyFeedback(req.user._id);
      return res.status(200).json({ feedbacks });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FeedbackController();