const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');

/**
 * ========================================================
 * DEPARTMENT MANAGEMENT
 * ========================================================
 */

// 1. Create a Department
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description = '', headOfficer = null, isActive = true } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Department name and code are required.'
      });
    }

    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();

    // Check unique constraints
    const existing = await Department.findOne({
      $or: [{ name: trimmedName }, { code: trimmedCode }]
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A department with this name or code already exists.'
      });
    }

    // If head officer provided, verify existence and officer role
    if (headOfficer) {
      const officer = await User.findOne({ _id: headOfficer, role: 'officer' });
      if (!officer) {
        return res.status(400).json({
          success: false,
          message: 'Specified head officer does not exist or is not an officer.'
        });
      }
    }

    const department = await Department.create({
      name: trimmedName,
      code: trimmedCode,
      description: description.trim(),
      headOfficer: headOfficer || null,
      isActive
    });

    // If head officer was assigned, ensure officer's department is set
    if (headOfficer) {
      await User.findByIdAndUpdate(headOfficer, { department: department._id });
    }

    return res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      department
    });
  } catch (error) {
    console.error('Create department error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error creating department.'
    });
  }
};

// 2. Edit a Department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, headOfficer, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid department ID format.' });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    // Check unique name if updated
    if (name && name.trim() !== department.name) {
      const duplicateName = await Department.findOne({ name: name.trim(), _id: { $ne: id } });
      if (duplicateName) {
        return res.status(409).json({ success: false, message: 'Department name is already in use.' });
      }
      department.name = name.trim();
    }

    // Check unique code if updated
    if (code && code.trim().toUpperCase() !== department.code) {
      const duplicateCode = await Department.findOne({ code: code.trim().toUpperCase(), _id: { $ne: id } });
      if (duplicateCode) {
        return res.status(409).json({ success: false, message: 'Department code is already in use.' });
      }
      department.code = code.trim().toUpperCase();
    }

    if (description !== undefined) department.description = description.trim();
    if (isActive !== undefined) department.isActive = isActive;

    if (headOfficer !== undefined) {
      if (headOfficer) {
        const officer = await User.findOne({ _id: headOfficer, role: 'officer' });
        if (!officer) {
          return res.status(400).json({ success: false, message: 'Specified head officer is invalid.' });
        }
        department.headOfficer = officer._id;
        await User.findByIdAndUpdate(officer._id, { department: department._id });
      } else {
        department.headOfficer = null;
      }
    }

    await department.save();

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully.',
      department
    });
  } catch (error) {
    console.error('Update department error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error updating department.'
    });
  }
};

// 3. Get all Departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('headOfficer', 'name email status')
      .sort({ name: 1 });

    // Aggregate count of assigned officers for each department
    const deptsWithCount = await Promise.all(
      departments.map(async (dept) => {
        const assignedOfficersCount = await User.countDocuments({
          department: dept._id,
          role: 'officer'
        });
        return {
          ...dept.toObject(),
          assignedOfficersCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      departments: deptsWithCount
    });
  } catch (error) {
    console.error('Get departments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching departments.'
    });
  }
};

// 4. Get Department by ID with assigned officers
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid department ID.' });
    }

    const department = await Department.findById(id).populate('headOfficer', 'name email status');
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    const assignedOfficers = await User.find({ department: id, role: 'officer' })
      .select('name email status caseAccessConfig');

    return res.status(200).json({
      success: true,
      department,
      assignedOfficers
    });
  } catch (error) {
    console.error('Get department details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching department details.'
    });
  }
};

/**
 * ========================================================
 * OFFICER MANAGEMENT
 * ========================================================
 */

// 5. Create Officer Account directly by Admin
exports.createOfficer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department = null,
      caseAccessConfig = {},
      status = 'active'
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Validate department if specified
    let departmentId = null;
    if (department) {
      if (!mongoose.Types.ObjectId.isValid(department)) {
        return res.status(400).json({ success: false, message: 'Invalid department ID.' });
      }
      const dept = await Department.findById(department);
      if (!dept) {
        return res.status(404).json({ success: false, message: 'Department does not exist.' });
      }
      departmentId = dept._id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const officer = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      role: 'officer',
      status,
      department: departmentId,
      caseAccessConfig: {
        accessScope: caseAccessConfig.accessScope || 'department',
        assignedCategories: caseAccessConfig.assignedCategories || [],
        canHandleEscalated: Boolean(caseAccessConfig.canHandleEscalated)
      },
      tokenVersion: 0
    });

    return res.status(201).json({
      success: true,
      message: 'Officer account created successfully.',
      officer: {
        id: officer._id.toString(),
        name: officer.name,
        email: officer.email,
        role: officer.role,
        status: officer.status,
        department: officer.department,
        caseAccessConfig: officer.caseAccessConfig
      }
    });
  } catch (error) {
    console.error('Create officer error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error creating officer account.'
    });
  }
};

// 6. Get Pending Officer Approvals
exports.getPendingOfficers = async (req, res) => {
  try {
    const pendingOfficers = await User.find({ role: 'officer', status: 'pending' })
      .select('-password')
      .populate('department', 'name code');

    return res.status(200).json({
      success: true,
      count: pendingOfficers.length,
      pendingOfficers
    });
  } catch (error) {
    console.error('Get pending officers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching pending officers.'
    });
  }
};

// 7. Approve Officer Account
exports.approveOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentId, caseAccessConfig } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid officer ID.' });
    }

    const officer = await User.findOne({ _id: id, role: 'officer' });
    if (!officer) {
      return res.status(404).json({ success: false, message: 'Officer not found.' });
    }

    officer.status = 'active';

    if (departmentId) {
      const dept = await Department.findById(departmentId);
      if (!dept) {
        return res.status(404).json({ success: false, message: 'Department not found.' });
      }
      officer.department = dept._id;
    }

    if (caseAccessConfig) {
      officer.caseAccessConfig = {
        accessScope: caseAccessConfig.accessScope || officer.caseAccessConfig.accessScope,
        assignedCategories: caseAccessConfig.assignedCategories || officer.caseAccessConfig.assignedCategories,
        canHandleEscalated: caseAccessConfig.canHandleEscalated !== undefined ? caseAccessConfig.canHandleEscalated : officer.caseAccessConfig.canHandleEscalated
      };
    }

    await officer.save();

    return res.status(200).json({
      success: true,
      message: `Officer ${officer.email} has been approved and activated.`,
      officer: {
        id: officer._id.toString(),
        name: officer.name,
        email: officer.email,
        status: officer.status,
        department: officer.department,
        caseAccessConfig: officer.caseAccessConfig
      }
    });
  } catch (error) {
    console.error('Approve officer error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error approving officer.'
    });
  }
};

// 8. Assign Officer to Department
exports.assignOfficerDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid officer ID.' });
    }

    const officer = await User.findOne({ _id: id, role: 'officer' });
    if (!officer) {
      return res.status(404).json({ success: false, message: 'Officer not found.' });
    }

    let assignedDepartment = null;
    if (departmentId) {
      if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        return res.status(400).json({ success: false, message: 'Invalid department ID.' });
      }
      assignedDepartment = await Department.findById(departmentId);
      if (!assignedDepartment) {
        return res.status(404).json({ success: false, message: 'Department not found.' });
      }
      officer.department = assignedDepartment._id;
    } else {
      officer.department = null;
    }

    await officer.save();

    return res.status(200).json({
      success: true,
      message: assignedDepartment
        ? `Officer ${officer.name} successfully assigned to ${assignedDepartment.name}.`
        : `Officer ${officer.name} unassigned from department.`,
      officer: {
        id: officer._id.toString(),
        name: officer.name,
        email: officer.email,
        department: officer.department
      }
    });
  } catch (error) {
    console.error('Assign department error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error assigning officer department.'
    });
  }
};

// 9. Activate or Deactivate User/Officer Account
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'pending'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = status.toLowerCase();

    // If deactivated, increment tokenVersion to immediately kill all active sessions across all devices
    if (user.status === 'inactive') {
      user.tokenVersion = (user.tokenVersion || 0) + 1;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Account status for ${user.email} updated to '${user.status}'.`,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error updating account status.'
    });
  }
};

// 10. Configure which cases an officer can access
exports.configureOfficerCaseAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { accessScope, assignedCategories, canHandleEscalated } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid officer ID.' });
    }

    const officer = await User.findOne({ _id: id, role: 'officer' });
    if (!officer) {
      return res.status(404).json({ success: false, message: 'Officer not found.' });
    }

    if (accessScope) {
      const validScopes = ['department', 'all', 'custom'];
      if (!validScopes.includes(accessScope.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `accessScope must be one of: ${validScopes.join(', ')}`
        });
      }
      officer.caseAccessConfig.accessScope = accessScope.toLowerCase();
    }

    if (assignedCategories !== undefined) {
      if (!Array.isArray(assignedCategories)) {
        return res.status(400).json({
          success: false,
          message: 'assignedCategories must be an array of category strings.'
        });
      }
      officer.caseAccessConfig.assignedCategories = assignedCategories.map(c => String(c).trim());
    }

    if (canHandleEscalated !== undefined) {
      officer.caseAccessConfig.canHandleEscalated = Boolean(canHandleEscalated);
    }

    await officer.save();

    return res.status(200).json({
      success: true,
      message: `Case access policy configured for officer ${officer.email}.`,
      caseAccessConfig: officer.caseAccessConfig
    });
  } catch (error) {
    console.error('Configure case access error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error configuring case access.'
    });
  }
};

