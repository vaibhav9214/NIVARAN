const fs = require('fs');
const mongoose = require('mongoose');
const Grievance = require('../models/Grievance');
const Department = require('../models/Department');
const User = require('../models/User');
const AuditEvent = require('../models/AuditEvent');
const { generateUniqueTicketId } = require('../utils/ticketGenerator');
const { executeTransition, recordAuditEvent } = require('../services/lifecycleService');
const { evaluateCaseAccess } = require('../middleware/caseAccess');

/**
 * Helper to remove uploaded files if validation fails
 */
function cleanupFiles(files) {
  if (Array.isArray(files)) {
    for (const file of files) {
      if (file && file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          console.error('Error cleaning up file:', e.message);
        }
      }
    }
  }
}

/**
 * Helper to find grievance by ticketId or ObjectId
 */
async function findGrievanceByIdentifier(identifier) {
  if (!identifier) return null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await Grievance.findById(identifier);
    if (byId) return byId;
  }
  return await Grievance.findOne({ ticketId: identifier.toUpperCase() });
}

/**
 * Submit Grievance
 * POST /api/student/complaints
 */
exports.submitGrievance = async (req, res) => {
  const uploadedFiles = req.files || [];

  try {
    const { title, category, department, description, priority = 'Medium' } = req.body;

    // 1. Validation: Title
    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Title is required and must be at least 5 characters long.'
      });
    }

    if (title.trim().length > 200) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Title cannot exceed 200 characters.'
      });
    }

    // 2. Validation: Category
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Category is required.'
      });
    }

    // 3. Validation: Department
    if (!department) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Department is required.'
      });
    }

    let deptDoc = null;
    if (mongoose.Types.ObjectId.isValid(department)) {
      deptDoc = await Department.findById(department);
    } else {
      deptDoc = await Department.findOne({
        $or: [{ code: department.toUpperCase() }, { name: department }]
      });
    }

    if (!deptDoc) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Selected department does not exist.'
      });
    }

    if (!deptDoc.isActive) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Selected department is currently inactive.'
      });
    }

    // 4. Validation: Description
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      cleanupFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        message: 'Validation error: Description is required and must be at least 10 characters long.'
      });
    }

    // 5. Generate Unique Ticket ID
    const ticketId = await generateUniqueTicketId();

    // 6. Map uploaded attachments
    const attachments = uploadedFiles.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path,
      uploadedAt: new Date()
    }));

    // 7. Save Grievance in MongoDB
    const grievance = await Grievance.create({
      ticketId,
      student: req.user.id,
      title: title.trim(),
      category: category.trim(),
      department: deptDoc._id,
      description: description.trim(),
      priority: ['Low', 'Medium', 'High', 'Urgent'].includes(priority) ? priority : 'Medium',
      attachments,
      status: 'Submitted',
      statusHistory: [
        {
          fromStatus: null,
          toStatus: 'Submitted',
          changedBy: req.user.id,
          role: req.user.role,
          remarks: 'Initial grievance submission.',
          timestamp: new Date()
        }
      ]
    });

    // Populate department details for clean response
    await grievance.populate('department', 'name code');

    // 8. Generate Audit Event for Initial Submission
    await recordAuditEvent({
      grievanceId: grievance._id,
      ticketId: grievance.ticketId,
      action: 'SUBMITTED',
      fromStatus: null,
      toStatus: 'Submitted',
      user: req.user,
      remarks: 'Initial grievance submission.',
      metadata: {
        title: grievance.title,
        category: grievance.category,
        department: deptDoc._id,
        departmentCode: deptDoc.code,
        priority: grievance.priority,
        attachmentCount: grievance.attachments.length
      }
    });

    // 9. Display Submission Confirmation
    return res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully.',
      confirmation: {
        ticketId: grievance.ticketId,
        title: grievance.title,
        category: grievance.category,
        department: deptDoc.name,
        departmentCode: deptDoc.code,
        status: grievance.status,
        priority: grievance.priority,
        attachmentCount: grievance.attachments.length,
        submittedAt: grievance.createdAt
      },
      grievance
    });
  } catch (error) {
    cleanupFiles(uploadedFiles);
    console.error('Grievance submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while submitting grievance.'
    });
  }
};

/**
 * Retrieve grievances submitted by the logged-in student
 * GET /api/student/complaints
 */
exports.getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.user.id })
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      portal: 'student',
      count: grievances.length,
      complaints: grievances
    });
  } catch (error) {
    console.error('Fetch student grievances error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching complaints.'
    });
  }
};

/**
 * Retrieve a specific grievance by Ticket ID or MongoDB _id
 * GET /api/student/complaints/:identifier
 */
exports.getGrievanceById = async (req, res) => {
  try {
    const { identifier } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier, student: req.user.id };
    } else {
      query = { ticketId: identifier.toUpperCase(), student: req.user.id };
    }

    const grievance = await Grievance.findOne(query)
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name email')
      .populate('statusHistory.changedBy', 'name role email');

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      grievance
    });
  } catch (error) {
    console.error('Fetch grievance details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching grievance details.'
    });
  }
};

/**
 * Officer/Admin: Update Grievance Status
 * PATCH /api/officer/complaints/:identifier/status
 */
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { status: targetStatus, remarks = '', ...options } = req.body;

    if (!targetStatus) {
      return res.status(400).json({
        success: false,
        message: 'Target status is required in request body.'
      });
    }

    const grievance = await findGrievanceByIdentifier(identifier);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    // Verify case access if caller is officer
    if (req.user.role === 'officer') {
      const officerDoc = await User.findById(req.user.id);
      const accessCheck = evaluateCaseAccess(officerDoc, grievance);
      if (!accessCheck.allowed) {
        return res.status(403).json({
          success: false,
          message: 'Case access denied.',
          reason: accessCheck.reason
        });
      }
    }

    // Execute verified transition
    const result = await executeTransition({
      grievance,
      targetStatus,
      user: req.user,
      options: { remarks, ...options }
    });

    await result.grievance.populate('department', 'name code');
    if (result.grievance.assignedOfficer) {
      await result.grievance.populate('assignedOfficer', 'name email');
    }

    return res.status(200).json({
      success: true,
      message: `Grievance status updated successfully to '${targetStatus}'.`,
      ticketId: result.grievance.ticketId,
      status: result.grievance.status,
      grievance: result.grievance,
      auditEvent: result.auditEvent
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error('Update grievance status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating grievance status.'
    });
  }
};

/**
 * Officer/Admin: Forward Grievance to another Department
 * POST /api/officer/complaints/:identifier/forward
 */
exports.forwardGrievance = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { targetDepartment, remarks = '', reason } = req.body;

    const grievance = await findGrievanceByIdentifier(identifier);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    if (req.user.role === 'officer') {
      const officerDoc = await User.findById(req.user.id);
      const accessCheck = evaluateCaseAccess(officerDoc, grievance);
      if (!accessCheck.allowed) {
        return res.status(403).json({
          success: false,
          message: 'Case access denied.',
          reason: accessCheck.reason
        });
      }
    }

    const result = await executeTransition({
      grievance,
      targetStatus: 'Forwarded',
      user: req.user,
      options: {
        targetDepartment,
        remarks: reason || remarks,
        forwardReason: reason || remarks
      }
    });

    await result.grievance.populate('department', 'name code');

    return res.status(200).json({
      success: true,
      message: `Grievance successfully forwarded to ${result.grievance.department.name}.`,
      ticketId: result.grievance.ticketId,
      status: result.grievance.status,
      grievance: result.grievance,
      auditEvent: result.auditEvent
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error('Forward grievance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while forwarding grievance.'
    });
  }
};

/**
 * Officer/Admin: Resolve Grievance
 * POST /api/officer/complaints/:identifier/resolve
 */
exports.resolveGrievance = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { resolutionNotes, remarks = '' } = req.body;

    const grievance = await findGrievanceByIdentifier(identifier);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    if (req.user.role === 'officer') {
      const officerDoc = await User.findById(req.user.id);
      const accessCheck = evaluateCaseAccess(officerDoc, grievance);
      if (!accessCheck.allowed) {
        return res.status(403).json({
          success: false,
          message: 'Case access denied.',
          reason: accessCheck.reason
        });
      }
    }

    const result = await executeTransition({
      grievance,
      targetStatus: 'Resolved',
      user: req.user,
      options: {
        resolutionNotes: resolutionNotes || remarks,
        remarks: remarks || resolutionNotes
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Grievance resolved successfully.',
      ticketId: result.grievance.ticketId,
      status: result.grievance.status,
      grievance: result.grievance,
      auditEvent: result.auditEvent
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error('Resolve grievance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while resolving grievance.'
    });
  }
};

/**
 * Officer/Admin: Reject Grievance
 * POST /api/officer/complaints/:identifier/reject
 */
exports.rejectGrievance = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { reason, remarks = '' } = req.body;

    const grievance = await findGrievanceByIdentifier(identifier);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    if (req.user.role === 'officer') {
      const officerDoc = await User.findById(req.user.id);
      const accessCheck = evaluateCaseAccess(officerDoc, grievance);
      if (!accessCheck.allowed) {
        return res.status(403).json({
          success: false,
          message: 'Case access denied.',
          reason: accessCheck.reason
        });
      }
    }

    const rejectionReason = reason || remarks;
    const result = await executeTransition({
      grievance,
      targetStatus: 'Rejected',
      user: req.user,
      options: {
        rejectionReason,
        remarks: rejectionReason
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Grievance rejected with documented justification.',
      ticketId: result.grievance.ticketId,
      status: result.grievance.status,
      grievance: result.grievance,
      auditEvent: result.auditEvent
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error('Reject grievance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while rejecting grievance.'
    });
  }
};

/**
 * Officer/Admin: Request more information from Student
 * POST /api/officer/complaints/:identifier/request-info
 */
exports.requestStudentInfo = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { query, remarks = '' } = req.body;

    const grievance = await findGrievanceByIdentifier(identifier);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    if (req.user.role === 'officer') {
      const officerDoc = await User.findById(req.user.id);
      const accessCheck = evaluateCaseAccess(officerDoc, grievance);
      if (!accessCheck.allowed) {
        return res.status(403).json({
          success: false,
          message: 'Case access denied.',
          reason: accessCheck.reason
        });
      }
    }

    const result = await executeTransition({
      grievance,
      targetStatus: 'Awaiting Student Response',
      user: req.user,
      options: {
        query: query || remarks,
        remarks: remarks || query
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Information request sent to student. Status updated to Awaiting Student Response.',
      ticketId: result.grievance.ticketId,
      status: result.grievance.status,
      grievance: result.grievance,
      auditEvent: result.auditEvent
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error('Request student info error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while requesting student information.'
    });
  }
};

/**
 * Student: Withdraw own Grievance
 * POST /api/student/complaints/:identifier/withdraw
 */
exports.withdrawGrievance = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { reason = 'Withdrawn by student', remarks } = req.body;

    const grievance = await findGrievanceByIdentifier(identifier);
    if (!grievance || grievance.student.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    const withdrawalReason = reason || remarks || 'Withdrawn by student';
    const result = await executeTransition({
      grievance,
      targetStatus: 'Withdrawn',
      user: req.user,
      options: {
        withdrawalReason,
        remarks: withdrawalReason
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Grievance withdrawn successfully.',
      ticketId: result.grievance.ticketId,
      status: result.grievance.status,
      grievance: result.grievance,
      auditEvent: result.auditEvent
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error('Withdraw grievance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while withdrawing grievance.'
    });
  }
};

/**
 * Student: Respond to Officer Query (moves from Awaiting Student Response -> In Progress)
 * POST /api/student/complaints/:identifier/respond
 */
exports.respondToOfficer = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { message, remarks } = req.body;

    const studentMessage = message || remarks;
    if (!studentMessage || typeof studentMessage !== 'string' || studentMessage.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'A descriptive response message is required (minimum 5 characters).'
      });
    }

    const grievance = await findGrievanceByIdentifier(identifier);
    if (!grievance || grievance.student.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    const result = await executeTransition({
      grievance,
      targetStatus: 'In Progress',
      user: req.user,
      options: {
        message: studentMessage,
        remarks: studentMessage
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Response submitted successfully. Grievance is back In Progress.',
      ticketId: result.grievance.ticketId,
      status: result.grievance.status,
      grievance: result.grievance,
      auditEvent: result.auditEvent
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error('Student response error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error submitting response.'
    });
  }
};

/**
 * Student: Submit Feedback or Request Reconsideration
 * POST /api/student/complaints/:identifier/feedback
 */
exports.submitFeedbackOrReconsideration = async (req, res) => {
  try {
    const { identifier } = req.params;
    const {
      rating,
      comments = '',
      isReconsiderationRequested = false,
      reconsiderationReason = '',
      remarks = ''
    } = req.body;

    const grievance = await findGrievanceByIdentifier(identifier);
    if (!grievance || grievance.student.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    const result = await executeTransition({
      grievance,
      targetStatus: 'Feedback or Reconsideration',
      user: req.user,
      options: {
        rating,
        comments,
        isReconsiderationRequested,
        reconsiderationReason: reconsiderationReason || remarks,
        remarks: isReconsiderationRequested
          ? `Reconsideration requested: ${reconsiderationReason || remarks}`
          : `Feedback submitted: Rating ${rating || 'N/A'}`
      }
    });

    return res.status(200).json({
      success: true,
      message: isReconsiderationRequested
        ? 'Reconsideration request submitted successfully.'
        : 'Feedback recorded successfully.',
      ticketId: result.grievance.ticketId,
      status: result.grievance.status,
      grievance: result.grievance,
      auditEvent: result.auditEvent
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error('Feedback / Reconsideration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error submitting feedback/reconsideration.'
    });
  }
};

/**
 * Retrieve Audit Trail for a specific grievance
 * GET /api/officer/complaints/:identifier/audit-trail
 * GET /api/student/complaints/:identifier/audit-trail
 */
exports.getAuditTrail = async (req, res) => {
  try {
    const { identifier } = req.params;

    const grievance = await findGrievanceByIdentifier(identifier);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    // Role-specific check
    if (req.user.role === 'student' && grievance.student.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: `Grievance with identifier '${identifier}' was not found.`
      });
    }

    if (req.user.role === 'officer') {
      const officerDoc = await User.findById(req.user.id);
      const accessCheck = evaluateCaseAccess(officerDoc, grievance);
      if (!accessCheck.allowed) {
        return res.status(403).json({
          success: false,
          message: 'Case access denied.',
          reason: accessCheck.reason
        });
      }
    }

    const auditTrail = await AuditEvent.find({ grievance: grievance._id })
      .populate('performedBy', 'name email role')
      .sort({ timestamp: 1 });

    return res.status(200).json({
      success: true,
      ticketId: grievance.ticketId,
      currentStatus: grievance.status,
      count: auditTrail.length,
      auditTrail
    });
  } catch (error) {
    console.error('Fetch audit trail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching audit trail.'
    });
  }
};

/**
 * Admin: View system-wide Audit Events
 * GET /api/admin/audit-events
 */
exports.getSystemAuditEvents = async (req, res) => {
  try {
    const { ticketId, action, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (ticketId) {
      filter.ticketId = ticketId.toUpperCase();
    }
    if (action) {
      filter.action = action.toUpperCase();
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const take = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const [total, events] = await Promise.all([
      AuditEvent.countDocuments(filter),
      AuditEvent.find(filter)
        .populate('performedBy', 'name email role')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(take)
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / take),
      count: events.length,
      auditEvents: events
    });
  } catch (error) {
    console.error('Fetch system audit events error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching system audit events.'
    });
  }
};
