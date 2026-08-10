/**
 * uploadMiddleware.js
 * 
 * Configures Multer for file uploads.
 * - photo: JPG/JPEG/PNG, max 2MB, stored in uploads/photos/
 * - paymentProof: JPG/JPEG/PNG/PDF, max 5MB, stored in uploads/payment-proofs/
 * 
 * Uses diskStorage to generate unique filenames and preserve extensions.
 * File filter validates MIME types. Size limits prevent oversized uploads.
 */

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Storage configuration for photos
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/photos'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

// Storage configuration for payment proofs

// File filter for photos (JPG, JPEG, PNG)
const photoFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed for photos.'), false);
  }
};


// Upload instance for photos
const uploadPhoto = multer({
  storage: photoStorage,
  fileFilter: photoFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

module.exports = { uploadPhoto };
