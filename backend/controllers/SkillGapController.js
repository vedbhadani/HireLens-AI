const skillGapService = require('../services/SkillGapService');

class SkillGapController {
  async analyze(req, res, next) {
    try {
      const { resumeId, jobId } = req.query;

      if (!resumeId || !jobId) {
        return res.status(400).json({ message: 'resumeId and jobId are required' });
      }

      const result = await skillGapService.analyze(resumeId, jobId, req.user._id);
      return res.status(200).json({ result });
    } catch (error) {
      if (error.message === 'Resume not found' || error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Not authorized') {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new SkillGapController();