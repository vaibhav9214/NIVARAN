const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nivaran';

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`[MongoDB] Connected to database: ${conn.connection.name}`);
    await seedUsers();
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    throw error;
  }
}

async function seedUsers() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('[MongoDB] Seeding default accounts (student, officer, admin)...');

      const usersToSeed = [
        {
          name: 'System Administrator',
          email: 'admin@nivaran.edu',
          password: await bcrypt.hash('Admin@123', 10),
          role: 'admin',
          tokenVersion: 0
        },
        {
          name: 'Grievance Officer',
          email: 'officer@nivaran.edu',
          password: await bcrypt.hash('Officer@123', 10),
          role: 'officer',
          tokenVersion: 0
        },
        {
          name: 'Aarav Sharma (Student)',
          email: 'student@nivaran.edu',
          password: await bcrypt.hash('Student@123', 10),
          role: 'student',
          tokenVersion: 0
        }
      ];

      await User.insertMany(usersToSeed);
      console.log('[MongoDB] Default accounts successfully seeded.');
    }
  } catch (err) {
    console.error('[MongoDB] Error seeding users:', err.message);
  }
}

module.exports = { connectDB, seedUsers };
