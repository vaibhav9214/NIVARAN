const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Department = require('../models/Department');
const adminController = require('../controllers/adminController');
const grievanceController = require('../controllers/grievanceController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All admin routes strictly require 'admin' role
// Both students and officers are strictly blocked with 403 Forbidden
router.use(authenticateToken, requireRole('admin'));

// --- Page 11: Admin Dashboard & Global Reporting ---
router.get('/dashboard', adminController.getAdminDashboard);

// --- Master Grievances Queue (Search, Filter, Pagination, Deadlines) ---
router.get('/complaints', adminController.getAdminComplaints);
router.get('/grievances', adminController.getAdminComplaints);

// --- User Management ---

router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('department', 'name code')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      portal: 'admin',
      users
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user list.'
    });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['student', 'officer', 'admin'];
    if (!role || !validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: role.toLowerCase() },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${updatedUser.email} role updated to ${role}.`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Admin update user role error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating user role.'
    });
  }
});

// Activate or deactivate user/officer account
router.patch('/users/:id/status', adminController.updateUserStatus);

// --- Department Management ---
router.post('/departments', adminController.createDepartment);
router.get('/departments', adminController.getDepartments);
router.get('/departments/:id', adminController.getDepartmentById);
router.patch('/departments/:id', adminController.updateDepartment);

// --- Officer Management ---
router.post('/officers', adminController.createOfficer);
router.get('/officers/pending', adminController.getPendingOfficers);
router.patch('/officers/:id/approve', adminController.approveOfficer);
router.patch('/officers/:id/department', adminController.assignOfficerDepartment);
router.patch('/officers/:id/case-access', adminController.configureOfficerCaseAccess);

// --- System Audit Trail ---
router.get('/audit-events', grievanceController.getSystemAuditEvents);

module.exports = router;
