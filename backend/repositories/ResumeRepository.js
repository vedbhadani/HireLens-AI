const Resume = require('../models/Resume');

class ResumeRepository {
  async create(data) {
    const resume = new Resume(data);
    return await resume.save();
  }

  async findByUserId(userId) {
    return await Resume.find({ userId }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Resume.findById(id);
  }

  async updateStatus(id, status, extras = {}) {
    return await Resume.findByIdAndUpdate(
      id,
      { status, ...extras },
      { new: true }
    );
  }

  async delete(id) {
    return await Resume.findByIdAndDelete(id);
  }
}

module.exports = new ResumeRepository();