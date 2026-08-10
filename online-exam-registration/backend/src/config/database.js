/**
 * database.js
 * 
 * Establishes a connection to MongoDB using Mongoose.
 * Reads the MONGO_URI from environment variables.
 * Logs connection status and exits the process on failure.
 */

const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
