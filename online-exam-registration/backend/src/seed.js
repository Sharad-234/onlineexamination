/**
 * seed.js
 * 
 * Seeds the MongoDB database with sample examination data.
 * Run this script once to populate the exams collection.
 * Usage: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Exam = require('./models/Exam');

const seedExams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing exams
    await Exam.deleteMany({});
    console.log('Cleared existing exams');

    // Sample examinations
    const exams = [
      {
        name: 'BSc CSIT Entrance Examination',
        fee: 1000,
        duration: '2 Hours',
        status: 'active',
      },
      {
        name: 'BIT Entrance Examination',
        fee: 1000,
        duration: '2 Hours',
        status: 'active',
      },
      {
        name: 'BIM Entrance Examination',
        fee: 800,
        duration: '1.5 Hours',
        status: 'active',
      },
      {
        name: 'BBA Entrance Examination',
        fee: 800,
        duration: '1.5 Hours',
        status: 'active',
      },
      {
        name: 'MSc CSIT Entrance Examination',
        fee: 1500,
        duration: '2.5 Hours',
        status: 'active',
      },
    ];

    await Exam.insertMany(exams);
    console.log(`Seeded ${exams.length} examinations successfully`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedExams();
