const { validationResult } = require('express-validator');
const jobService = require('../services/JobService');

class JobController {
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const job = await jobService.create(req.user._id, req.body);
      return res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
      next(error);
    }
  }

  async getMyJobs(req, res, next) {
    try {
      const jobs = await jobService.getMyJobs(req.user._id);
      return res.status(200).json({ jobs });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const jobs = await jobService.getAll();
      return res.status(200).json({ jobs });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const job = await jobService.getById(req.params.id);
      return res.status(200).json({ job });
    } catch (error) {
      if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const job = await jobService.update(req.params.id, req.user._id, req.body);
      return res.status(200).json({ message: 'Job updated', job });
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

  async delete(req, res, next) {
    try {
      await jobService.delete(req.params.id, req.user._id);
      return res.status(200).json({ message: 'Job deleted' });
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

module.exports = new JobController();