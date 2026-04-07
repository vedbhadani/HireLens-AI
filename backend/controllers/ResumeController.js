const resumeService = require('../services/ResumeService');

class ResumeController {
  async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const resume = await resumeService.upload(req.file, req.user._id);

      return res.status(201).json({
        message: 'Resume uploaded successfully',
        resume,
      });
    } catch (error) {
      if (error.message === 'Failed to parse PDF') {
        return res.status(422).json({ message: error.message });
      }
      next(error);
    }
  }

  async getMyResumes(req, res, next) {
    try {
      const resumes = await resumeService.getMyResumes(req.user._id);
      return res.status(200).json({ resumes });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const resume = await resumeService.getById(req.params.id, req.user._id);
      return res.status(200).json({ resume });
    } catch (error) {
      if (error.message === 'Resume not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Not authorized') {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await resumeService.delete(req.params.id, req.user._id);
      return res.status(200).json({ message: 'Resume deleted' });
    } catch (error) {
      if (error.message === 'Resume not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Not authorized') {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new ResumeController();