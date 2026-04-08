const jobRepository = require('../repositories/JobRepository');
const skillExtractor = require('./SkillExtractorService');

class JobService {
  async create(recruiterId, data) {
    const { title, company, description } = data;

    // reuse the same extractor from resume module
    const requiredSkills = skillExtractor.extract(description);

    const job = await jobRepository.create({
      recruiterId,
      title,
      company,
      description,
      requiredSkills,
    });

    return job;
  }

  async getMyJobs(recruiterId) {
    return await jobRepository.findByRecruiterId(recruiterId);
  }

  async getAll() {
    return await jobRepository.findAll();
  }

  async getById(id) {
    const job = await jobRepository.findById(id);
    if (!job) throw new Error('Job not found');
    return job;
  }

  async update(id, recruiterId, data) {
    const job = await jobRepository.findById(id);
    if (!job) throw new Error('Job not found');

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      throw new Error('Not authorized');
    }

    // re-extract skills if description changed
    if (data.description) {
      data.requiredSkills = skillExtractor.extract(data.description);
    }

    return await jobRepository.update(id, data);
  }

  async delete(id, recruiterId) {
    const job = await jobRepository.findById(id);
    if (!job) throw new Error('Job not found');

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      throw new Error('Not authorized');
    }

    await jobRepository.softDelete(id);
  }
}

module.exports = new JobService();