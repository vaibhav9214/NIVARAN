const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { handleFileUpload } = require('../middleware/upload');

// All student routes require valid auth AND 'student' role
router.use(authenticateToken, requireRole('student'));

// Page 04: Student Dashboard Summary (Status counts, deadlines, action required)
router.get('/dashboard', grievanceController.getStudentDashboard);

// Submit Grievance (supports multipart/form-data with file attachments or JSON)
router.post('/complaints', handleFileUpload('attachments'), grievanceController.submitGrievance);
router.post('/grievances', handleFileUpload('attachments'), grievanceController.submitGrievance);

// Retrieve all grievances submitted by this student
router.get('/complaints', grievanceController.getMyGrievances);
router.get('/grievances', grievanceController.getMyGrievances);

// Retrieve specific grievance by Ticket ID or MongoDB _id
router.get('/complaints/:identifier', grievanceController.getGrievanceById);
router.get('/grievances/:identifier', grievanceController.getGrievanceById);

// Student Lifecycle Actions:
// 1. Withdraw grievance (institutional policy)
router.post('/complaints/:identifier/withdraw', grievanceController.withdrawGrievance);
router.post('/grievances/:identifier/withdraw', grievanceController.withdrawGrievance);

// 2. Respond to officer inquiry (when in Awaiting Student Response)
router.post('/complaints/:identifier/respond', grievanceController.respondToOfficer);
router.post('/grievances/:identifier/respond', grievanceController.respondToOfficer);

// 3. Submit feedback rating/comments or request reconsideration
router.post('/complaints/:identifier/feedback', grievanceController.submitFeedbackOrReconsideration);
router.post('/grievances/:identifier/feedback', grievanceController.submitFeedbackOrReconsideration);

// 4. View grievance audit trail
router.get('/complaints/:identifier/audit-trail', grievanceController.getAuditTrail);
router.get('/grievances/:identifier/audit-trail', grievanceController.getAuditTrail);

module.exports = router;
