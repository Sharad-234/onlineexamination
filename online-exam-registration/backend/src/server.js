/**
 * server.js
 * 
 * Entry point for the Express backend server.
 * Loads environment variables, connects to MongoDB, configures
 * middleware (CORS, helmet, rate limiting, JSON parsing, static files),
 * registers routes, sets up global error handler, and starts listening.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDatabase = require('./config/database');
const examRoutes = require('./routes/examRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDatabase();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

// ============ MIDDLEWARE ============

// Security headers
app.use(helmet());

// CORS configuration - allow frontend origin
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: origin not allowed'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});
app.use('/api/', limiter);

// Parse JSON bodies (for non-file-upload routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads/photos', express.static(path.join(__dirname, '../uploads/photos')));

// ============ ROUTES ============

app.use('/api/exams', examRoutes);
app.use('/api/applications', applicationRoutes);
// Payment endpoints removed

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// ============ ERROR HANDLER ============

// 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// ============ START SERVER ============

const startServer = (port) => {
  const numericPort = Number(port);
  if (!Number.isInteger(numericPort) || numericPort < 1 || numericPort > 65535) {
    console.error(`Invalid port: ${port}`);
    process.exit(1);
  }

  const server = app.listen(numericPort, () => {
    console.log(`Server running on port ${numericPort}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = numericPort + 1;
      if (nextPort > 65535) {
        console.error('No available ports to bind to.');
        process.exit(1);
      }
      console.warn(`Port ${numericPort} in use. Trying port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error(error);
      process.exit(1);
    }
  });
};

startServer(PORT);
