const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All admin routes strictly require 'admin' role
// Both students and officers are strictly blocked with 403 Forbidden
router.use(authenticateToken, requireRole('admin'));

router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const officers = await User.countDocuments({ role: 'officer' });
    const admins = await User.countDocuments({ role: 'admin' });

    return res.status(200).json({
      success: true,
      message: 'Welcome to the Administrator Control Center',
      portal: 'admin',
      user: req.user,
      stats: {
        totalUsers,
        students,
        officers,
        admins,
        systemStatus: 'Operational',
        securityMode: 'Strict RBAC Active',
        database: 'MongoDB'
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching admin dashboard statistics.'
    });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: 1 });
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
      { new: true, runValidators: true }
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

module.exports = router;
