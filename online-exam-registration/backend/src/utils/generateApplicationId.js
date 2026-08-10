/**
 * generateApplicationId.js
 * 
 * Generates a unique application ID in the format EXAM-YYYY-NNNNNN.
 * Example: EXAM-2026-000001
 * 
 * It queries the database to find the latest application for the current year
 * and increments the serial number. If no application exists for the year,
 * it starts from 000001.
 */

const Application = require('../models/Application');

const generateApplicationId = async () => {
  const year = new Date().getFullYear();
  const prefix = `EXAM-${year}-`;

  // Find the latest application for this year
  const latestApplication = await Application.findOne({
    applicationId: { $regex: `^${prefix}` },
  })
    .sort({ applicationId: -1 })
    .select('applicationId')
    .lean();

  let nextSerial = 1;

  if (latestApplication) {
    // Extract the serial number from the application ID
    const parts = latestApplication.applicationId.split('-');
    const lastSerial = parseInt(parts[2], 10);
    nextSerial = lastSerial + 1;
  }

  // Pad with leading zeros to 6 digits
  const serialString = String(nextSerial).padStart(6, '0');

  return `${prefix}${serialString}`;
};

module.exports = generateApplicationId;
