const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Grievance = require('../models/Grievance');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { evaluateCaseAccess } = require('../middleware/caseAccess');

// All officer routes require valid auth AND 'officer' or 'admin' role
router.use(authenticateToken, requireRole('officer', 'admin'));

router.get('/dashboard', async (req, res) => {
  const officer = await User.findById(req.user.id).populate('department', 'name code');
  const deptId = officer ? officer.department : null;

  let pendingCount = 0;
  let escalatedCount = 0;
  let recent = [];

  if (deptId) {
    pendingCount = await Grievance.countDocuments({
      department: deptId,
      status: { $in: ['Submitted', 'Under Review'] }
    });
    escalatedCount = await Grievance.countDocuments({
      department: deptId,
      isEscalated: true
    });
    recent = await Grievance.find({ department: deptId })
      .populate('student', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
  }

  return res.status(200).json({
    success: true,
    message: 'Welcome to the Grievance Officer Portal',
    portal: 'officer',
    user: req.user,
    department: officer ? officer.department : null,
    caseAccessConfig: officer ? officer.caseAccessConfig : null,
    data: {
      pendingReviewsCount: pendingCount,
      escalatedCasesCount: escalatedCount,
      slaComplianceRate: '94.2%',
      recentGrievances: recent
    }
  });
});

router.get('/assigned-complaints', async (req, res) => {
  try {
    const officer = await User.findById(req.user.id);
    const filter = officer && officer.department ? { department: officer.department } : {};
    const complaints = await Grievance.find(filter)
      .populate('department', 'name code')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      portal: 'officer',
      count: complaints.length,
      assignedComplaints: complaints
    });
  } catch (error) {
    console.error('Error fetching officer complaints:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching assigned complaints.'
    });
  }
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
