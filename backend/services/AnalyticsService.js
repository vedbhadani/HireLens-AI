const User = require('../models/User');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const MatchResult = require('../models/MatchResult');
const Feedback = require('../models/Feedback');

class AnalyticsService {
  async getSummary() {
    const [totalCandidates, totalRecruiters, totalResumes, totalJobs, totalMatches] =
      await Promise.all([
        User.countDocuments({ role: 'candidate' }),
        User.countDocuments({ role: 'recruiter' }),
        Resume.countDocuments({ status: 'parsed' }),
        JobDescription.countDocuments({ isActive: true }),
        MatchResult.countDocuments(),
      ]);

    return {
      totalCandidates,
      totalRecruiters,
      totalResumes,
      totalJobs,
      totalMatches,
    };
  }

  async getJobAnalytics(jobId, recruiterId) {
    const job = await JobDescription.findById(jobId);
    if (!job) throw new Error('Job not found');

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      throw new Error('Not authorized');
    }

    const [totalMatches, feedbacks] = await Promise.all([
      MatchResult.countDocuments({ jobId }),
      Feedback.find({ jobId }),
    ]);

    const avgRating = feedbacks.length
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;

    return {
      jobTitle: job.title,
      totalMatches,
      totalFeedbacks: feedbacks.length,
      avgRating: Math.round(avgRating * 10) / 10,
    };
  }
}

module.exports = new AnalyticsService();