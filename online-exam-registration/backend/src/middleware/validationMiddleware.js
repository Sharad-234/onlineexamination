/**
 * validationMiddleware.js
 * 
 * Uses express-validator to validate incoming request fields.
 * Provides reusable validation chains for application submission.
 * The validateApplication middleware checks all fields and returns
 * formatted error messages if validation fails.
 */

const { validationResult, body } = require('express-validator');

/**
 * Validation rules for application submission.
 * Each field has its own chain of validators.
 */
const applicationValidationRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Full name must be between 3 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^9\d{9}$/)
    .withMessage('Please provide a valid Nepali phone number (10 digits starting with 9)'),

  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course / Program is required'),

  body('college')
    .trim()
    .notEmpty()
    .withMessage('College / School is required'),

  body('examId')
    .trim()
    .notEmpty()
    .withMessage('Examination selection is required')
    .isMongoId()
    .withMessage('Invalid examination ID'),
  
];

/**
 * Middleware that checks the result of previous validation rules.
 * If errors exist, returns a 400 response with the first error message.
 */
const validateApplication = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({
      success: false,
      message: firstError,
    });
  }
  next();
};

module.exports = { applicationValidationRules, validateApplication };
