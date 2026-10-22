const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

// All student routes require valid auth AND 'student' role
router.use(authenticateToken, requireRole('student'));

router.get('/dashboard', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Student Portal',
    portal: 'student',
    user: req.user,
    data: {
      activeComplaintsCount: 2,
      resolvedComplaintsCount: 5,
      announcements: [
        { id: 1, title: 'Hostel WiFi upgrade completed', date: '2026-10-20' },
        { id: 2, title: 'Library extended hours during exams', date: '2026-10-18' }
      ]
    }
  });
});

router.get('/complaints', (req, res) => {
  return res.status(200).json({
    success: true,
    portal: 'student',
    user: req.user,
    complaints: [
      {
        id: 'CMP-101',
        title: 'Water cooler not working on 3rd floor',
        category: 'Infrastructure',
        status: 'In Progress',
        submittedAt: '2026-10-19'
      },
      {
        id: 'CMP-094',
        title: 'Mess food quality feedback',
        category: 'Mess & Cafeteria',
        status: 'Resolved',
        submittedAt: '2026-10-15'
      }
    ]
  });
});

module.exports = router;
