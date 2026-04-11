const matchService = require('../services/MatchService');

class MatchController {
  async match(req, res, next) {
    try {
      const { resumeId, jobId } = req.body;

      if (!resumeId || !jobId) {
        return res.status(400).json({ message: 'resumeId and jobId are required' });
      }

      const result = await matchService.match(resumeId, jobId, req.user._id);
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

  async getRankedCandidates(req, res, next) {
    try {
      const results = await matchService.getRankedCandidates(
        req.params.jobId,
        req.user._id
      );
      return res.status(200).json({ results });
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

  async getMyMatches(req, res, next) {
    try {
      const results = await matchService.getMyMatches(req.user._id);
      return res.status(200).json({ results });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MatchController();