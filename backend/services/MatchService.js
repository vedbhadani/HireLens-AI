const MatchingEngine = require('./MatchingEngine');
const matchRepository = require('../repositories/MatchRepository');
const resumeRepository = require('../repositories/ResumeRepository');
const jobRepository = require('../repositories/JobRepository');

const engine = new MatchingEngine();

class MatchService {
  async match(resumeId, jobId, candidateId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new Error('Resume not found');

    if (resume.userId.toString() !== candidateId.toString()) {
      throw new Error('Not authorized');
    }

    const job = await jobRepository.findById(jobId);
    if (!job) throw new Error('Job not found');

    const result = engine.run(resume.extractedSkills, job.requiredSkills);

    // update if already matched, create if not
    const existing = await matchRepository.findExisting(resumeId, jobId);

    if (existing) {
      return await matchRepository.update(existing._id, {
        score: result.score,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
      });
    }

    return await matchRepository.create({
      resumeId,
      jobId,
      candidateId,
      score: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
    });
  }

  async getRankedCandidates(jobId, recruiterId) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new Error('Job not found');

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      throw new Error('Not authorized');
    }

    // already sorted by score desc in repository
    return await matchRepository.findByJobId(jobId);
  }

  async getMyMatches(candidateId) {
    return await matchRepository.findByCandidate(candidateId);
  }
}

module.exports = new MatchService();