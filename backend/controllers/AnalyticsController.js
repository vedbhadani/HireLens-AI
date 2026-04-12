const analyticsService = require('../services/AnalyticsService');

class AnalyticsController {
  async getSummary(req, res, next) {
    try {
      const summary = await analyticsService.getSummary();
      return res.status(200).json({ summary });
    } catch (error) {
      next(error);
    }
  }

  async getJobAnalytics(req, res, next) {
    try {
      const data = await analyticsService.getJobAnalytics(
        req.params.jobId,
        req.user._id
      );
      return res.status(200).json({ data });
    } catch (error) {
      if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Not authorized') {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new AnalyticsController();