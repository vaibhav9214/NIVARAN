const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const grievanceController = require('../controllers/grievanceController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleFileUpload } = require('../middleware/upload');

// All student routes require valid auth AND 'student' role
router.use(authenticateToken, requireRole('student'));

// Student Dashboard Summary
router.get('/dashboard', async (req, res) => {
  try {
    const activeComplaintsCount = await Grievance.countDocuments({
      student: req.user.id,
      status: { $in: ['Submitted', 'Under Review', 'In Progress'] }
    });
    const resolvedComplaintsCount = await Grievance.countDocuments({
      student: req.user.id,
      status: 'Resolved'
    });

    return res.status(200).json({
      success: true,
      message: 'Welcome to the Student Portal',
      portal: 'student',
      user: req.user,
      data: {
        activeComplaintsCount,
        resolvedComplaintsCount,
        announcements: [
          { id: 1, title: 'Hostel WiFi upgrade completed', date: '2026-10-20' },
          { id: 2, title: 'Library extended hours during exams', date: '2026-10-18' }
        ]
      }
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching dashboard.'
    });
  }
});

// Submit Grievance (supports multipart/form-data with file attachments or JSON)
router.post('/complaints', handleFileUpload('attachments'), grievanceController.submitGrievance);
router.post('/grievances', handleFileUpload('attachments'), grievanceController.submitGrievance);

// Retrieve all grievances submitted by this student
router.get('/complaints', grievanceController.getMyGrievances);
router.get('/grievances', grievanceController.getMyGrievances);

// Retrieve specific grievance by Ticket ID or MongoDB _id
router.get('/complaints/:identifier', grievanceController.getGrievanceById);
router.get('/grievances/:identifier', grievanceController.getGrievanceById);

module.exports = router;
