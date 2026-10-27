const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Grievance = require('../models/Grievance');
const grievanceController = require('../controllers/grievanceController');
const officerController = require('../controllers/officerController');
const aiController = require('../controllers/aiController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { evaluateCaseAccess } = require('../middleware/caseAccess');

// All officer routes require valid auth AND 'officer' or 'admin' role
router.use(authenticateToken, requireRole('officer', 'admin'));

// Page 08: Officer Dashboard (Status counts, workload charts, SLA metrics)
router.get('/dashboard', officerController.getOfficerDashboard);

// Page 10: Assigned Grievances Case Queue (Search, filters, deadlines, pagination)
router.get('/assigned-complaints', officerController.getAssignedComplaints);
router.get('/case-queue', officerController.getAssignedComplaints);

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

// --- Step 8: AI Grievance Intelligence Features ---
// 1. Get or Generate AI Insights (advisory-only)
router.get('/complaints/:id/ai-insights', aiController.getOrGenerateAiInsights);
router.post('/complaints/:id/ai-insights', aiController.getOrGenerateAiInsights);
router.get('/grievances/:id/ai-insights', aiController.getOrGenerateAiInsights);
router.post('/grievances/:id/ai-insights', aiController.getOrGenerateAiInsights);

// 2. Human Officer Review of AI Suggestions (never silently changes status)
router.patch('/complaints/:id/ai-review', aiController.reviewAiInsights);
router.patch('/grievances/:id/ai-review', aiController.reviewAiInsights);

// --- Grievance Lifecycle Actions (Officer / Admin) ---

// 1. General Status Transition
router.patch('/complaints/:identifier/status', grievanceController.updateGrievanceStatus);
router.patch('/grievances/:identifier/status', grievanceController.updateGrievanceStatus);

// 2. Forward to another Department
router.post('/complaints/:identifier/forward', grievanceController.forwardGrievance);
router.post('/grievances/:identifier/forward', grievanceController.forwardGrievance);

// 3. Resolve Grievance with resolution notes
router.post('/complaints/:identifier/resolve', grievanceController.resolveGrievance);
router.post('/grievances/:identifier/resolve', grievanceController.resolveGrievance);

// 4. Reject Grievance with documented justification
router.post('/complaints/:identifier/reject', grievanceController.rejectGrievance);
router.post('/grievances/:identifier/reject', grievanceController.rejectGrievance);

// 5. Request Information / Clarification from Student
router.post('/complaints/:identifier/request-info', grievanceController.requestStudentInfo);
router.post('/grievances/:identifier/request-info', grievanceController.requestStudentInfo);

// 6. View Grievance Audit Trail
router.get('/complaints/:identifier/audit-trail', grievanceController.getAuditTrail);
router.get('/grievances/:identifier/audit-trail', grievanceController.getAuditTrail);

module.exports = router;
