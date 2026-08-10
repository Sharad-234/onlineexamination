/**
 * examRoutes.js
 * 
 * Routes for examination-related endpoints.
 * Currently only supports fetching the list of active exams.
 */

const express = require('express');
const router = express.Router();
const { getExams } = require('../controllers/examController');

// GET /api/exams - Get all active examinations
router.get('/', getExams);

module.exports = router;
