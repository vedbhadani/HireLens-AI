const pdfParse = require('pdf-parse');
const resumeRepository = require('../repositories/ResumeRepository');
const skillExtractor = require('./SkillExtractorService');

class ResumeService {
  async upload(file, userId) {
    // save a placeholder first, update after parsing
    const resume = await resumeRepository.create({
      userId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      status: 'processing',
    });

    try {
      const parsed = await pdfParse(file.buffer);
      const rawText = parsed.text || '';
      const extractedSkills = skillExtractor.extract(rawText);

      const updated = await resumeRepository.updateStatus(resume._id, 'parsed', {
        rawText,
        extractedSkills,
      });

      return updated;
    } catch (err) {
      // parsing failed — mark it and bubble the error up
      await resumeRepository.updateStatus(resume._id, 'failed');
      throw new Error('Failed to parse PDF');
    }
  }

  async getMyResumes(userId) {
    return await resumeRepository.findByUserId(userId);
  }

  async getById(id, userId) {
    const resume = await resumeRepository.findById(id);
    if (!resume) throw new Error('Resume not found');

    // make sure the resume belongs to the requesting user
    if (resume.userId.toString() !== userId.toString()) {
      throw new Error('Not authorized');
    }

    return resume;
  }

  async delete(id, userId) {
    const resume = await resumeRepository.findById(id);
    if (!resume) throw new Error('Resume not found');

    if (resume.userId.toString() !== userId.toString()) {
      throw new Error('Not authorized');
    }

    await resumeRepository.delete(id);
  }
}

module.exports = new ResumeService();