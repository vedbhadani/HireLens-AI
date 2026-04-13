const feedbackRepository = require('../repositories/FeedbackRepository');
const jobRepository = require('../repositories/JobRepository');

class FeedbackService {
  async submit(recruiterId, data) {
    const { candidateId, jobId, resumeId, rating, comment } = data;

    const job = await jobRepository.findById(jobId);
    if (!job) throw new Error('Job not found');

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      throw new Error('Not authorized');
    }

    const existing = await feedbackRepository.findExisting(
      recruiterId,
      candidateId,
      jobId
    );
    if (existing) throw new Error('Feedback already submitted');

    return await feedbackRepository.create({
      recruiterId,
      candidateId,
      jobId,
      resumeId,
      rating,
      comment,
    });
  }

  async getMyFeedback(candidateId) {
    return await feedbackRepository.findByCandidate(candidateId);
  }

  async getJobFeedbacks(jobId, recruiterId) {
    return await feedbackRepository.findByJobForRecruiter(jobId, recruiterId);
  }
}

module.exports = new FeedbackService();