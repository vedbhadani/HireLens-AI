const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    rawText: {
      type: String,
      default: '',
    },
    extractedSkills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['processing', 'parsed', 'failed'],
      default: 'processing',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);