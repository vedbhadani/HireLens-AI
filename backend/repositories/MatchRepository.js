const MatchResult = require('../models/MatchResult');

class MatchRepository {
  async create(data) {
    const match = new MatchResult(data);
    return await match.save();
  }

  async findByJobId(jobId) {
    return await MatchResult.find({ jobId })
      .populate('candidateId', 'name email')
      .populate('resumeId', 'originalName extractedSkills')
      .sort({ score: -1 });
  }

  async findByCandidate(candidateId) {
    return await MatchResult.find({ candidateId })
      .populate('jobId', 'title company requiredSkills')
      .sort({ score: -1 });
  }

  async findExisting(resumeId, jobId) {
    return await MatchResult.findOne({ resumeId, jobId });
  }

  async update(id, data) {
    return await MatchResult.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new MatchRepository();