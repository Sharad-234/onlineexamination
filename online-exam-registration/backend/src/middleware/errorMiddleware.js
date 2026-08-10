/**
 * errorMiddleware.js
 * 
 * Global error handling middleware for Express.
 * Catches Multer file upload errors specifically (file size, type)
 * and provides consistent JSON error responses.
 * In production, internal stack traces are not exposed.
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Multer file size errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size exceeds the maximum allowed limit';
  }

  // Handle Multer unexpected field errors
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field';
  }

  // Log the full error for debugging (server-side only)
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
