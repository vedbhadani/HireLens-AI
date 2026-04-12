const resumeRepository = require('../repositories/ResumeRepository');
const jobRepository = require('../repositories/JobRepository');

class SkillGapService {
  async analyze(resumeId, jobId, candidateId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw new Error('Resume not found');

    if (resume.userId.toString() !== candidateId.toString()) {
      throw new Error('Not authorized');
    }

    const job = await jobRepository.findById(jobId);
    if (!job) throw new Error('Job not found');

    const resumeSet = new Set(resume.extractedSkills.map(s => s.toLowerCase()));

    const missingSkills = job.requiredSkills.filter(
      s => !resumeSet.has(s.toLowerCase())
    );

    const matchedSkills = job.requiredSkills.filter(s =>
      resumeSet.has(s.toLowerCase())
    );

    return {
      jobTitle: job.title,
      company: job.company,
      totalRequired: job.requiredSkills.length,
      matchedSkills,
      missingSkills,
      coveragePercent: job.requiredSkills.length
        ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100)
        : 0,
    };
  }
}

module.exports = new SkillGapService();