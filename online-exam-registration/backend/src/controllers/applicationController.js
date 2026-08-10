/**
 * applicationController.js
 * 
 * Handles HTTP request/response for application-related endpoints.
 * Delegates business logic to applicationService.
 * Manages file upload fields from Multer and constructs the data
 * object passed to the service layer.
 */

const applicationService = require('../services/applicationService');
const path = require('path');
const fs = require('fs');

/**
 * POST /api/applications
 * Submits a new examination registration application.
 * Expects multipart/form-data with fields and files.
 */
const submitApplication = async (req, res, next) => {
  try {
    // Check if files were uploaded
    if (!req.files || !req.files.photo) {
      return res.status(400).json({
        success: false,
        message: 'Photo is required',
      });
    }


    // Build application data
    const applicationData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      course: req.body.course,
      college: req.body.college,
      examId: req.body.examId,
      photo: req.files.photo[0].path,
    };

    // Create application via service
    const application = await applicationService.createApplication(applicationData);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
        application: {
          applicationId: application.applicationId,
          status: application.applicationStatus,
        },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/:applicationId
 * Retrieves application details by application ID.
 */
const getApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await applicationService.getApplicationById(applicationId);

    // Return safe subset of fields (no file paths, no internal IDs)
    res.json({
      success: true,
      application: {
        applicationId: application.applicationId,
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        course: application.course,
        college: application.college,
        examName: application.examName,
        examFee: application.examFee,
        
        applicationStatus: application.applicationStatus,
        submittedAt: application.submittedAt,
        hasPhoto: !!application.photo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/:applicationId/pdf
 * Sends the generated PDF as a downloadable file.
 */
const downloadApplicationPDF = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const { pdfPath, fullName } = await applicationService.getApplicationPDF(applicationId);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found on server',
      });
    }

    const filename = `${applicationId}.pdf`;

    res.download(pdfPath, filename, (err) => {
      if (err) {
        console.error(`PDF download error for ${applicationId}:`, err.message);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Failed to download PDF',
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getApplication,
  downloadApplicationPDF,
};
