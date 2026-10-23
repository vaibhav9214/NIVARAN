const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
const Grievance = require('../models/Grievance');
const AuditEvent = require('../models/AuditEvent');
const { computeSlaMetrics } = require('../utils/slaCalculator');

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

/**
 * ========================================================
 * PAGE 11: ADMIN DASHBOARD & INSTITUTION-WIDE REPORTING
 * ========================================================
 */

/**
 * Page 11: Admin Dashboard
 * GET /api/admin/dashboard
 */
exports.getAdminDashboard = async (req, res) => {
  try {
    // 1. Institution-wide entity counts
    const [
      totalUsers,
      studentsCount,
      officersCount,
      adminsCount,
      departmentsCount,
      totalGrievances,
      submittedCount,
      underReviewCount,
      inProgressCount,
      awaitingCount,
      resolvedCount,
      rejectedCount,
      withdrawnCount,
      forwardedCount,
      escalatedCount,
      overdueCount
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'officer' }),
      User.countDocuments({ role: 'admin' }),
      Department.countDocuments(),
      Grievance.countDocuments(),
      Grievance.countDocuments({ status: 'Submitted' }),
      Grievance.countDocuments({ status: 'Under Review' }),
      Grievance.countDocuments({ status: 'In Progress' }),
      Grievance.countDocuments({ status: 'Awaiting Student Response' }),
      Grievance.countDocuments({ status: 'Resolved' }),
      Grievance.countDocuments({ status: 'Rejected' }),
      Grievance.countDocuments({ status: 'Withdrawn' }),
      Grievance.countDocuments({ status: 'Forwarded' }),
      Grievance.countDocuments({ isEscalated: true }),
      Grievance.countDocuments({
        status: { $nin: ['Resolved', 'Rejected', 'Withdrawn', 'Closed'] },
        slaDeadline: { $lt: new Date() }
      })
    ]);

    const activeGrievances = submittedCount + underReviewCount + inProgressCount + awaitingCount + forwardedCount;

    // SLA compliance rate
    const totalFinished = resolvedCount + rejectedCount;
    let complianceRate = 100;
    if (activeGrievances + totalFinished > 0) {
      const nonOverdueActive = Math.max(0, activeGrievances - overdueCount);
      complianceRate = Math.round(((nonOverdueActive + resolvedCount) / (activeGrievances + totalFinished)) * 1000) / 10;
    }

    // 2. Workload Charts: By Department
    const allDepartments = await Department.find().sort({ name: 1 });
    const workloadByDepartment = await Promise.all(
      allDepartments.map(async (dept) => {
        const [
          deptTotal,
          deptPending,
          deptInProgress,
          deptResolved,
          deptRejected,
          deptOverdue,
          deptOfficers
        ] = await Promise.all([
          Grievance.countDocuments({ department: dept._id }),
          Grievance.countDocuments({ department: dept._id, status: { $in: ['Submitted', 'Under Review'] } }),
          Grievance.countDocuments({ department: dept._id, status: 'In Progress' }),
          Grievance.countDocuments({ department: dept._id, status: 'Resolved' }),
          Grievance.countDocuments({ department: dept._id, status: 'Rejected' }),
          Grievance.countDocuments({
            department: dept._id,
            status: { $nin: ['Resolved', 'Rejected', 'Withdrawn', 'Closed'] },
            slaDeadline: { $lt: new Date() }
          }),
          User.countDocuments({ department: dept._id, role: 'officer' })
        ]);

        return {
          departmentId: dept._id,
          name: dept.name,
          code: dept.code,
          total: deptTotal,
          pending: deptPending,
          inProgress: deptInProgress,
          resolved: deptResolved,
          rejected: deptRejected,
          overdue: deptOverdue,
          officerCount: deptOfficers
        };
      })
    );

    // 3. Workload Charts: By Priority
    const priorityAgg = await Grievance.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const workloadByPriority = ['Urgent', 'High', 'Medium', 'Low'].map((p) => {
      const match = priorityAgg.find((item) => item._id === p);
      return { priority: p, count: match ? match.count : 0 };
    });

    // 4. Workload Charts: By Category
    const categoryAgg = await Grievance.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const workloadByCategory = categoryAgg.map((item) => ({
      category: item._id,
      count: item.count
    }));

    // 5. Recent System Activity (Audit Events)
    const recentActivity = await AuditEvent.find()
      .populate('performedBy', 'name email role')
      .sort({ timestamp: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: 'Welcome to the Administrator Control Center',
      portal: 'admin',
      user: req.user,
      // Backward-compatible stats object
      stats: {
        totalUsers,
        students: studentsCount,
        officers: officersCount,
        admins: adminsCount,
        departments: departmentsCount,
        totalGrievances,
        activeGrievances,
        resolvedGrievances: resolvedCount,
        systemStatus: 'Operational',
        securityMode: 'Strict RBAC Active',
        database: 'MongoDB'
      },
      statusCounts: {
        total: totalGrievances,
        submitted: submittedCount,
        underReview: underReviewCount,
        inProgress: inProgressCount,
        awaitingStudentResponse: awaitingCount,
        resolved: resolvedCount,
        rejected: rejectedCount,
        withdrawn: withdrawnCount,
        forwarded: forwardedCount,
        active: activeGrievances,
        overdue: overdueCount,
        escalated: escalatedCount
      },
      workloadCharts: {
        byDepartment: workloadByDepartment,
        byPriority: workloadByPriority,
        byCategory: workloadByCategory,
        institutionSlaComplianceRate: `${complianceRate}%`,
        overdueCases: overdueCount
      },
      recentActivity
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching admin dashboard statistics.'
    });
  }
};

/**
 * Admin Master Grievances Queue
 * GET /api/admin/complaints
 */
exports.getAdminComplaints = async (req, res) => {
  try {
    const {
      search,
      department,
      status,
      priority,
      category,
      isOverdue,
      isEscalated,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const filter = {};

    if (department) {
      if (mongoose.Types.ObjectId.isValid(department)) {
        filter.department = department;
      } else {
        const deptDoc = await Department.findOne({ code: String(department).toUpperCase() });
        if (deptDoc) filter.department = deptDoc._id;
      }
    }

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, 'i');

      const matchedStudents = await User.find({
        role: 'student',
        $or: [{ name: regex }, { email: regex }]
      }).select('_id');
      const studentIds = matchedStudents.map((s) => s._id);

      filter.$or = [
        { ticketId: regex },
        { title: regex },
        { description: regex },
        { category: regex },
        { student: { $in: studentIds } }
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (category) {
      filter.category = category;
    }

    if (isEscalated !== undefined) {
      filter.isEscalated = isEscalated === 'true' || isEscalated === true;
    }

    if (isOverdue === 'true' || isOverdue === true) {
      filter.slaDeadline = { $lt: new Date() };
      filter.status = { $nin: ['Resolved', 'Rejected', 'Withdrawn', 'Closed'] };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'deadline' || sort === 'slaDeadline') {
      sortOption = { slaDeadline: 1 };
    } else if (sort === 'priority') {
      sortOption = { priority: 1, createdAt: -1 };
    } else if (typeof sort === 'string') {
      sortOption = sort;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, complaintsDocs] = await Promise.all([
      Grievance.countDocuments(filter),
      Grievance.find(filter)
        .populate('department', 'name code')
        .populate('student', 'name email')
        .populate('assignedOfficer', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
    ]);

    const complaintsWithSla = complaintsDocs.map(computeSlaMetrics);

    return res.status(200).json({
      success: true,
      portal: 'admin',
      count: complaintsWithSla.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      limit: limitNum,
      complaints: complaintsWithSla
    });
  } catch (error) {
    console.error('Error fetching admin complaints:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching master complaints queue.'
    });
  }
};


