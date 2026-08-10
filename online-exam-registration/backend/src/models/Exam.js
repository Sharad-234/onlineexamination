/**
 * Exam.js
 * 
 * Mongoose model for examinations.
 * Each exam has a name, fee, duration, and status.
 * Only active exams should be shown to applicants.
 */

const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
      maxlength: [200, 'Exam name cannot exceed 200 characters'],
    },
    fee: {
      type: Number,
      required: [true, 'Exam fee is required'],
      min: [0, 'Exam fee cannot be negative'],
    },
    duration: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exam', examSchema);
