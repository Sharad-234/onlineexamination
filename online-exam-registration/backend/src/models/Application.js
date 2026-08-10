/**
 * Application.js
 * 
 * Mongoose model for examination registration applications.
 * Stores applicant personal info, academic info, exam selection,
 * payment details, file references, and generated PDF path.
 * Application ID is unique and follows the format EXAM-YYYY-NNNNNN.
 */

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [3, 'Full name must be at least 3 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^9\d{9}$/,
        'Please provide a valid Nepali phone number (10 digits starting with 9)',
      ],
    },
    course: {
      type: String,
      required: [true, 'Course / Program is required'],
      trim: true,
    },
    college: {
      type: String,
      required: [true, 'College / School is required'],
      trim: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Examination is required'],
    },
    examName: {
      type: String,
      required: true,
    },
    examFee: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: [true, 'Photo is required'],
    },
    
    applicationStatus: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected'],
      default: 'submitted',
    },
    pdfPath: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);
