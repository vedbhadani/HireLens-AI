const Feedback = require('../models/Feedback');

class FeedbackRepository {
  async create(data) {
    const feedback = new Feedback(data);
    return await feedback.save();
  }

  async findByCandidate(candidateId) {
    return await Feedback.find({ candidateId })
      .populate('recruiterId', 'name email')
      .populate('jobId', 'title company')
      .sort({ createdAt: -1 });
  }

  async findByJob(jobId) {
    return await Feedback.find({ jobId }).sort({ createdAt: -1 });
  }

  async findByJobForRecruiter(jobId, recruiterId) {
    return await Feedback.find({ jobId, recruiterId });
  }

  async findExisting(recruiterId, candidateId, jobId) {
    return await Feedback.findOne({ recruiterId, candidateId, jobId });
  }
}

module.exports = new FeedbackRepository();