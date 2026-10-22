const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { evaluateCaseAccess } = require('../middleware/caseAccess');

// All officer routes require valid auth AND 'officer' or 'admin' role
router.use(authenticateToken, requireRole('officer', 'admin'));

router.get('/dashboard', async (req, res) => {
  const officer = await User.findById(req.user.id).populate('department', 'name code');

  return res.status(200).json({
    success: true,
    message: 'Welcome to the Grievance Officer Portal',
    portal: 'officer',
    user: req.user,
    department: officer ? officer.department : null,
    caseAccessConfig: officer ? officer.caseAccessConfig : null,
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

/**
 * Verify whether this officer has permission to access a case
 * POST /api/officer/verify-case-access
 * Body: { department, category, isEscalated }
 */
router.post('/verify-case-access', async (req, res) => {
  try {
    const officer = await User.findById(req.user.id);
    const caseData = req.body || {};

    const evaluation = evaluateCaseAccess(officer, caseData);

    if (!evaluation.allowed) {
      return res.status(403).json({
        success: false,
        message: 'Case access denied.',
        reason: evaluation.reason,
        officerConfig: officer.caseAccessConfig,
        officerDepartment: officer.department
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Case access granted.',
      reason: evaluation.reason
    });
  } catch (error) {
    console.error('Verify case access error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error evaluating case access.'
    });
  }
});

module.exports = router;
