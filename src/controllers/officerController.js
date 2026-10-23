const mongoose = require('mongoose');
const User = require('../models/User');
const Grievance = require('../models/Grievance');
const Department = require('../models/Department');
const { computeSlaMetrics } = require('../utils/slaCalculator');
const { evaluateCaseAccess } = require('../middleware/caseAccess');

/**
 * Page 08: Officer Dashboard
 * GET /api/officer/dashboard
 */
exports.getOfficerDashboard = async (req, res) => {
  try {
    const officer = await User.findById(req.user.id).populate('department', 'name code');
    const deptId = officer ? officer.department : null;

    // Base filter according to officer's department/scope
    const filter = deptId ? { department: deptId } : {};

    // 1. Status Counts
    const [
      totalCount,
      submittedCount,
      underReviewCount,
      inProgressCount,
      awaitingCount,
      resolvedCount,
      rejectedCount,
      forwardedCount,
      escalatedCount
    ] = await Promise.all([
      Grievance.countDocuments(filter),
      Grievance.countDocuments({ ...filter, status: 'Submitted' }),
      Grievance.countDocuments({ ...filter, status: 'Under Review' }),
      Grievance.countDocuments({ ...filter, status: 'In Progress' }),
      Grievance.countDocuments({ ...filter, status: 'Awaiting Student Response' }),
      Grievance.countDocuments({ ...filter, status: 'Resolved' }),
      Grievance.countDocuments({ ...filter, status: 'Rejected' }),
      Grievance.countDocuments({ ...filter, status: 'Forwarded' }),
      Grievance.countDocuments({ ...filter, isEscalated: true })
    ]);

    const pendingCount = submittedCount + underReviewCount;
    const activeCount = submittedCount + underReviewCount + inProgressCount + awaitingCount + forwardedCount;

    // 2. Overdue count (non-terminal grievances whose slaDeadline has passed)
    const overdueCount = await Grievance.countDocuments({
      ...filter,
      status: { $nin: ['Resolved', 'Rejected', 'Withdrawn', 'Closed'] },
      slaDeadline: { $lt: new Date() }
    });

    // 3. Workload Charts: Priority breakdown
    const priorityBreakdown = await Grievance.aggregate([
      { $match: filter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const byPriority = ['Urgent', 'High', 'Medium', 'Low'].map((p) => {
      const match = priorityBreakdown.find((item) => item._id === p);
      return { priority: p, count: match ? match.count : 0 };
    });

    // 4. Workload Charts: Category breakdown
    const categoryBreakdown = await Grievance.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const byCategory = categoryBreakdown.map((item) => ({
      category: item._id,
      count: item.count
    }));

    // 5. Workload Charts: Status breakdown
    const byStatus = [
      { status: 'Submitted', count: submittedCount },
      { status: 'Under Review', count: underReviewCount },
      { status: 'In Progress', count: inProgressCount },
      { status: 'Awaiting Student Response', count: awaitingCount },
      { status: 'Resolved', count: resolvedCount },
      { status: 'Rejected', count: rejectedCount },
      { status: 'Forwarded', count: forwardedCount }
    ];

    // 6. SLA compliance rate
    const totalFinished = resolvedCount + rejectedCount;
    let slaComplianceRate = 100;
    if (activeCount + totalFinished > 0) {
      const nonOverdueActive = Math.max(0, activeCount - overdueCount);
      slaComplianceRate = Math.round(((nonOverdueActive + resolvedCount) / (activeCount + totalFinished)) * 1000) / 10;
    }

    // 7. Urgent & Overdue Action Queue (top 5 urgent or overdue)
    const urgentDocs = await Grievance.find({
      ...filter,
      status: { $nin: ['Resolved', 'Rejected', 'Withdrawn', 'Closed'] },
      $or: [{ priority: 'Urgent' }, { slaDeadline: { $lt: new Date() } }, { isEscalated: true }]
    })
      .populate('student', 'name email')
      .populate('department', 'name code')
      .sort({ slaDeadline: 1, createdAt: 1 })
      .limit(5);

    const urgentActionQueue = urgentDocs.map(computeSlaMetrics);

    // 8. Recent department grievances
    const recentDocs = await Grievance.find(filter)
      .populate('student', 'name email')
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentGrievances = recentDocs.map(computeSlaMetrics);

    return res.status(200).json({
      success: true,
      message: 'Welcome to the Grievance Officer Portal',
      portal: 'officer',
      user: req.user,
      department: officer ? officer.department : null,
      caseAccessConfig: officer ? officer.caseAccessConfig : null,
      statusCounts: {
        total: totalCount,
        submitted: submittedCount,
        underReview: underReviewCount,
        inProgress: inProgressCount,
        awaitingStudentResponse: awaitingCount,
        resolved: resolvedCount,
        rejected: rejectedCount,
        forwarded: forwardedCount,
        pendingReview: pendingCount,
        active: activeCount,
        overdue: overdueCount,
        escalated: escalatedCount
      },
      workloadCharts: {
        byStatus,
        byPriority,
        byCategory,
        slaComplianceRate: `${slaComplianceRate}%`,
        overdueCases: overdueCount
      },
      urgentActionQueue,
      recentGrievances,
      // Backward-compatibility data object
      data: {
        pendingReviewsCount: pendingCount,
        escalatedCasesCount: escalatedCount,
        slaComplianceRate: `${slaComplianceRate}%`,
        recentGrievances
      }
    });
  } catch (error) {
    console.error('Officer dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching officer dashboard.'
    });
  }
};

/**
 * Page 10: Assigned Grievances Case Queue
 * GET /api/officer/assigned-complaints
 * GET /api/officer/case-queue
 */
exports.getAssignedComplaints = async (req, res) => {
  try {
    const officer = await User.findById(req.user.id);
    const {
      search,
      status,
      priority,
      category,
      isOverdue,
      isEscalated,
      assignedToMe,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const filter = {};

    // Apply department scope if not universal
    if (officer && officer.caseAccessConfig && officer.caseAccessConfig.accessScope === 'all') {
      // Global scope for officer
    } else if (officer && officer.department) {
      filter.department = officer.department;
    }

    // Filter: search
    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, 'i');

      // Also search students by name or email
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

    // Filter: status
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Filter: priority
    if (priority) {
      filter.priority = priority;
    }

    // Filter: category
    if (category) {
      filter.category = category;
    }

    // Filter: isEscalated
    if (isEscalated !== undefined) {
      filter.isEscalated = isEscalated === 'true' || isEscalated === true;
    }

    // Filter: assignedToMe
    if (assignedToMe === 'true' || assignedToMe === true) {
      filter.assignedOfficer = req.user.id;
    }

    // Filter: isOverdue
    if (isOverdue === 'true' || isOverdue === true) {
      filter.slaDeadline = { $lt: new Date() };
      filter.status = { $nin: ['Resolved', 'Rejected', 'Withdrawn', 'Closed'] };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'deadline' || sort === 'slaDeadline') {
      sortOption = { slaDeadline: 1 };
    } else if (sort === 'priority') {
      sortOption = { priority: 1, createdAt: -1 };
    } else if (typeof sort === 'string') {
      sortOption = sort;
    }

    // Pagination
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

    // Enrich complaints with dynamic SLA deadlines, isOverdue flag, and remaining hours
    const complaintsWithSla = complaintsDocs.map(computeSlaMetrics);

    return res.status(200).json({
      success: true,
      portal: 'officer',
      count: complaintsWithSla.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      limit: limitNum,
      assignedComplaints: complaintsWithSla,
      complaints: complaintsWithSla
    });
  } catch (error) {
    console.error('Error fetching officer complaints queue:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching assigned complaints queue.'
    });
  }
};

