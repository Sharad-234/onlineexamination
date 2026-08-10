/**
 * applicationRoutes.js
 * 
 * Routes for application submission, retrieval, and PDF download.
 * Uses Multer fields() to handle multiple file uploads in a single request.
 * Validation middleware runs after file upload but before the controller.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { submitApplication, getApplication, downloadApplicationPDF } = require('../controllers/applicationController');
const { applicationValidationRules, validateApplication } = require('../middleware/validationMiddleware');

// Configure Multer for multiple file fields in one request
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'photo') {
        cb(null, 'uploads/photos');
      } else {
        cb(new Error('Unexpected field'), false);
      }
    },
    filename: (req, file, cb) => {
      const { v4: uuidv4 } = require('uuid');
      const ext = require('path').extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const photoTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file.fieldname === 'photo' && !photoTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed for photos.'), false);
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// POST /api/applications - Submit new application
router.post(
  '/',
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  applicationValidationRules,
  validateApplication,
  submitApplication
);

// GET /api/applications/:applicationId - Get application details
router.get('/:applicationId', getApplication);

// GET /api/applications/:applicationId/pdf - Download application PDF
router.get('/:applicationId/pdf', downloadApplicationPDF);

module.exports = router;
