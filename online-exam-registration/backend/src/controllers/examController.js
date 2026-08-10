/**
 * examController.js
 * 
 * Handles HTTP request/response for exam-related endpoints.
 * Returns a list of active examinations to the frontend.
 * The frontend uses this to populate the exam selection dropdown.
 */

const Exam = require('../models/Exam');

/**
 * GET /api/exams
 * Returns all active examinations.
 */
const getExams = async (req, res, next) => {
  try {
    const exams = await Exam.find({ status: 'active' }).select('name fee duration status').sort({ name: 1 });

    res.json({
      success: true,
      exams,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExams,
};
