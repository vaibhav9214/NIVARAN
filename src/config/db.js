const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Department = require('../models/Department');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nivaran';

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`[MongoDB] Connected to database: ${conn.connection.name}`);
    await seedInitialData();
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    throw error;
  }
}

async function seedInitialData() {
  try {
    // 1. Seed Departments if none exist
    let hostelDept = await Department.findOne({ code: 'HOSTEL' });
    if (!hostelDept) {
      console.log('[MongoDB] Seeding initial departments...');
      const depts = await Department.insertMany([
        {
          name: 'Hostel & Infrastructure',
          code: 'HOSTEL',
          description: 'Handles hostel maintenance, utilities, and campus infrastructure complaints.'
        },
        {
          name: 'Academics & Examination',
          code: 'ACAD',
          description: 'Handles timetable collisions, exam grievances, and faculty issues.'
        },
        {
          name: 'Mess & Cafeteria',
          code: 'MESS',
          description: 'Handles food quality, dining hall hygiene, and catering grievances.'
        }
      ]);
      hostelDept = depts[0];
      console.log('[MongoDB] Departments successfully seeded.');
    }

    // 2. Seed Users if none exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB] Seeding default accounts (student, officer, admin)...');

      const admin = await User.create({
        name: 'System Administrator',
        email: 'admin@nivaran.edu',
        password: await bcrypt.hash('Admin@123', 10),
        role: 'admin',
        status: 'active',
        tokenVersion: 0
      });

      const officer = await User.create({
        name: 'Grievance Officer',
        email: 'officer@nivaran.edu',
        password: await bcrypt.hash('Officer@123', 10),
        role: 'officer',
        status: 'active',
        department: hostelDept._id,
        caseAccessConfig: {
          accessScope: 'department',
          assignedCategories: ['Infrastructure', 'Hostel'],
          canHandleEscalated: true
        },
        tokenVersion: 0
      });

      await User.create({
        name: 'Aarav Sharma (Student)',
        email: 'student@nivaran.edu',
        password: await bcrypt.hash('Student@123', 10),
        role: 'student',
        status: 'active',
        tokenVersion: 0
      });

      // Set headOfficer on hostelDept
      await Department.findByIdAndUpdate(hostelDept._id, { headOfficer: officer._id });

      console.log('[MongoDB] Default accounts successfully seeded and officer associated with department.');
    } else {
      // Ensure existing seeded officer has department associated
      const officer = await User.findOne({ email: 'officer@nivaran.edu' });
      if (officer && !officer.department && hostelDept) {
        officer.department = hostelDept._id;
        officer.status = officer.status || 'active';
        await officer.save();
        await Department.findByIdAndUpdate(hostelDept._id, { headOfficer: officer._id });
      }
    }
  } catch (err) {
    console.error('[MongoDB] Error seeding data:', err.message);
  }
}

module.exports = { connectDB, seedInitialData };
