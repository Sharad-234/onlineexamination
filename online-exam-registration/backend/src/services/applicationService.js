/**
 * applicationService.js
 * 
 * Business logic layer for application operations.
 * Handles the core logic of creating an application: validating the exam,
 * generating the application ID, saving to the database, and
 * triggering PDF generation.
 */

const Application = require('../models/Application');
const Exam = require('../models/Exam');
const generateApplicationId = require('../utils/generateApplicationId');
const { generateApplicationPDF } = require('./pdfService');

/**
 * Creates a new examination registration application.
 * @param {Object} data - Application data from the controller
 * @returns {Promise<Object>} - The created application document
 */
const createApplication = async (data) => {
  const { fullName, email, phone, course, college, examId, photo } = data;

  // Verify the selected exam exists and is active
  const exam = await Exam.findOne({ _id: examId, status: 'active' });
  if (!exam) {
    const error = new Error('Selected examination is not available or inactive');
    error.statusCode = 400;
    throw error;
  }

  // Generate unique application ID
  const applicationId = await generateApplicationId();

  // Create the application document
  const application = new Application({
    applicationId,
    fullName,
    email,
    phone,
    course,
    college,
    exam: exam._id,
    examName: exam.name,
    examFee: exam.fee,
    photo,
    applicationStatus: 'submitted',
    
    submittedAt: new Date(),
  });

  // Save to database
  await application.save();

  // Generate PDF application copy
  const pdfPath = await generateApplicationPDF(application);

  // Update application with PDF path
  application.pdfPath = pdfPath;
  await application.save();

  return application;
};

/**
 * Retrieves an application by its application ID.
 * @param {string} applicationId - The unique application ID
 * @returns {Promise<Object>} - The application document
 */
const getApplicationById = async (applicationId) => {
  const application = await Application.findOne({ applicationId });
  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }
  return application;
};

/**
 * Retrieves the PDF path for an application.
 * @param {string} applicationId - The unique application ID
 * @returns {Promise<Object>} - Object with pdfPath and applicationId
 */
const getApplicationPDF = async (applicationId) => {
  const application = await Application.findOne({ applicationId });
  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }
  if (!application.pdfPath) {
    const error = new Error('PDF not available for this application');
    error.statusCode = 404;
    throw error;
  }
  return {
    pdfPath: application.pdfPath,
    applicationId: application.applicationId,
    fullName: application.fullName,
  };
};
module.exports = {
  createApplication,
  getApplicationById,
  getApplicationPDF,
};
