const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

// All officer routes require valid auth AND 'officer' or 'admin' role
// Students are strictly blocked with 403 Forbidden
router.use(authenticateToken, requireRole('officer', 'admin'));

router.get('/dashboard', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Grievance Officer Portal',
    portal: 'officer',
    user: req.user,
    data: {
      pendingReviewsCount: 14,
      escalatedCasesCount: 3,
      slaComplianceRate: '94.2%',
      recentGrievances: [
        { id: 'CMP-101', student: 'Aarav Sharma', department: 'Infrastructure', urgency: 'Medium' },
        { id: 'CMP-102', student: 'Riya Sen', department: 'Academics', urgency: 'High' }
      ]
    }
  });
});

router.get('/assigned-complaints', (req, res) => {
  return res.status(200).json({
    success: true,
    portal: 'officer',
    assignedComplaints: [
      { id: 'CMP-101', title: 'Water cooler not working on 3rd floor', status: 'Under Review' },
      { id: 'CMP-102', title: 'Class timetable collision on Tuesdays', status: 'Assigned' }
    ]
  });
});

module.exports = router;
