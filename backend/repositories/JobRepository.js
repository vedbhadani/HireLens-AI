const JobDescription = require('../models/JobDescription');

class JobRepository {
  async create(data) {
    const job = new JobDescription(data);
    return await job.save();
  }

  async findByRecruiterId(recruiterId) {
    return await JobDescription.find({ recruiterId, isActive: true }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await JobDescription.findById(id);
  }

  async findAll() {
    return await JobDescription.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async update(id, data) {
    return await JobDescription.findByIdAndUpdate(id, data, { new: true });
  }

  async softDelete(id) {
    return await JobDescription.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}

module.exports = new JobRepository();