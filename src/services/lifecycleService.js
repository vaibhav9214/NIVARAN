const Grievance = require('../models/Grievance');
const Department = require('../models/Department');
const AuditEvent = require('../models/AuditEvent');
const { notifyStatusChanged } = require('./notificationService');

const GRIEVANCE_STATUSES = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  IN_PROGRESS: 'In Progress',
  AWAITING_STUDENT_RESPONSE: 'Awaiting Student Response',
  RESOLVED: 'Resolved',
  FEEDBACK_OR_RECONSIDERATION: 'Feedback or Reconsideration',
  FORWARDED: 'Forwarded',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  CLOSED: 'Closed'
};

const ALL_STATUSES = Object.values(GRIEVANCE_STATUSES);

const PERMITTED_TRANSITIONS = {
  'Submitted': {
    allowedNext: ['Under Review', 'Forwarded', 'Rejected', 'Withdrawn'],
    rolePermissions: {
      'Under Review': ['officer', 'admin'],
      'Forwarded': ['officer', 'admin'],
      'Rejected': ['officer', 'admin'],
      'Withdrawn': ['student']
    }
  },
  'Under Review': {
    allowedNext: ['In Progress', 'Awaiting Student Response', 'Forwarded', 'Rejected', 'Withdrawn'],
    rolePermissions: {
      'In Progress': ['officer', 'admin'],
      'Awaiting Student Response': ['officer', 'admin'],
      'Forwarded': ['officer', 'admin'],
      'Rejected': ['officer', 'admin'],
      'Withdrawn': ['student']
    }
  },
  'In Progress': {
    allowedNext: ['Awaiting Student Response', 'Resolved', 'Forwarded', 'Rejected', 'Withdrawn'],
    rolePermissions: {
      'Awaiting Student Response': ['officer', 'admin'],
      'Resolved': ['officer', 'admin'],
      'Forwarded': ['officer', 'admin'],
      'Rejected': ['officer', 'admin'],
      'Withdrawn': ['student']
    }
  },
  'Awaiting Student Response': {
    allowedNext: ['In Progress', 'Under Review', 'Rejected', 'Withdrawn'],
    rolePermissions: {
      'In Progress': ['student', 'officer', 'admin'],
      'Under Review': ['student', 'officer', 'admin'],
      'Rejected': ['officer', 'admin'],
      'Withdrawn': ['student']
    }
  },
  'Forwarded': {
    allowedNext: ['Under Review', 'In Progress', 'Forwarded', 'Rejected', 'Withdrawn'],
    rolePermissions: {
      'Under Review': ['officer', 'admin'],
      'In Progress': ['officer', 'admin'],
      'Forwarded': ['officer', 'admin'],
      'Rejected': ['officer', 'admin'],
      'Withdrawn': ['student']
    }
  },
  'Resolved': {
    allowedNext: ['Feedback or Reconsideration', 'Closed', 'Under Review'],
    rolePermissions: {
      'Feedback or Reconsideration': ['student'],
      'Closed': ['officer', 'admin'],
      'Under Review': ['admin']
    }
  },
  'Feedback or Reconsideration': {
    allowedNext: ['Under Review', 'In Progress', 'Resolved', 'Rejected', 'Closed'],
    rolePermissions: {
      'Under Review': ['officer', 'admin'],
      'In Progress': ['officer', 'admin'],
      'Resolved': ['officer', 'admin'],
      'Rejected': ['officer', 'admin'],
      'Closed': ['officer', 'admin']
    }
  },
  'Rejected': {
    allowedNext: ['Feedback or Reconsideration', 'Under Review'],
    rolePermissions: {
      'Feedback or Reconsideration': ['student'],
      'Under Review': ['admin']
    }
  },
  'Withdrawn': {
    allowedNext: [],
    rolePermissions: {}
  },
  'Closed': {
    allowedNext: ['Under Review'],
    rolePermissions: {
      'Under Review': ['admin']
    }
  }
};

/**
 * Validates whether a transition from currentStatus to targetStatus is permitted
 * for a user with the given role, alongside specific contextual fields.
 */
function validateTransition(currentStatus, targetStatus, role, options = {}) {
  if (!ALL_STATUSES.includes(targetStatus)) {
    return {
      valid: false,
      message: `Invalid status '${targetStatus}'. Must be one of: ${ALL_STATUSES.join(', ')}`
    };
  }

  if (currentStatus === targetStatus) {
    return {
      valid: false,
      message: `Grievance is already in status '${currentStatus}'.`
    };
  }

  const rules = PERMITTED_TRANSITIONS[currentStatus];
  if (!rules) {
    return {
      valid: false,
      message: `Unknown or unconfigured current status: '${currentStatus}'.`
    };
  }

  if (!rules.allowedNext.includes(targetStatus)) {
    return {
      valid: false,
      message: `Invalid status transition: Cannot transition grievance from '${currentStatus}' to '${targetStatus}'. Permitted transitions from '${currentStatus}': [${rules.allowedNext.join(', ')}]`
    };
  }

  const allowedRoles = rules.rolePermissions[targetStatus] || [];
  if (!allowedRoles.includes(role)) {
    return {
      valid: false,
      message: `Role unauthorized: Users with role '${role}' are not permitted to transition from '${currentStatus}' to '${targetStatus}'. Allowed roles: [${allowedRoles.join(', ')}]`
    };
  }

  // Institutional policy requirements for specific transitions
  if (targetStatus === 'Rejected') {
    const reason = options.rejectionReason || options.reason || options.remarks;
    if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
      return {
        valid: false,
        message: 'Rejection requires a descriptive reason (minimum 5 characters).'
      };
    }
  }

  if (targetStatus === 'Withdrawn') {
    const reason = options.withdrawalReason || options.reason || options.remarks;
    if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
      return {
        valid: false,
        message: 'Withdrawal requires a reason explaining why the grievance is being withdrawn.'
      };
    }
  }

  if (targetStatus === 'Forwarded') {
    if (!options.targetDepartment) {
      return {
        valid: false,
        message: 'Forwarding requires a target department (department ID or code).'
      };
    }
    const reason = options.forwardReason || options.reason || options.remarks;
    if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
      return {
        valid: false,
        message: 'Forwarding requires a justification reason (minimum 5 characters).'
      };
    }
  }

  if (targetStatus === 'Resolved') {
    const notes = options.resolutionNotes || options.remarks;
    if (!notes || typeof notes !== 'string' || notes.trim().length < 5) {
      return {
        valid: false,
        message: 'Resolution requires resolution notes documenting how the issue was addressed.'
      };
    }
  }

  if (targetStatus === 'Awaiting Student Response') {
    const query = options.query || options.remarks;
    if (!query || typeof query !== 'string' || query.trim().length < 5) {
      return {
        valid: false,
        message: 'Awaiting student response requires specifying what information or clarification is needed from the student.'
      };
    }
  }

  if (targetStatus === 'Feedback or Reconsideration') {
    if (options.isReconsiderationRequested) {
      const reason = options.reconsiderationReason || options.reason || options.remarks;
      if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
        return {
          valid: false,
          message: 'Reconsideration request requires a detailed reason explaining the appeal grounds.'
        };
      }
    } else {
      if (options.rating !== undefined) {
        const rating = Number(options.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          return {
            valid: false,
            message: 'Feedback rating must be an integer between 1 and 5.'
          };
        }
      }
    }
  }

  return { valid: true };
}

/**
 * Creates and saves an AuditEvent document
 */
async function recordAuditEvent({
  grievanceId,
  ticketId,
  action,
  fromStatus,
  toStatus,
  user,
  remarks = '',
  metadata = {}
}) {
  const auditEvent = await AuditEvent.create({
    grievance: grievanceId,
    ticketId: ticketId.toUpperCase(),
    action,
    fromStatus,
    toStatus,
    performedBy: user._id || user.id,
    performedByRole: user.role,
    performedByName: user.name || '',
    remarks: remarks.trim(),
    metadata,
    timestamp: new Date()
  });

  return auditEvent;
}

/**
 * Executes a verified transition:
 * 1. Checks validation
 * 2. Applies status and tracking updates
 * 3. Saves Grievance
 * 4. Logs immutable AuditEvent
 */
async function executeTransition({ grievance, targetStatus, user, options = {} }) {
  const currentStatus = grievance.status;
  const remarks = (options.remarks || options.reason || options.resolutionNotes || options.query || '').trim();

  // 1. Validate
  const validation = validateTransition(currentStatus, targetStatus, user.role, { ...options, remarks });
  if (!validation.valid) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  const metadata = {};
  let action = 'STATUS_CHANGE';

  // 2. Specific status updates & metadata tracking
  if (targetStatus === 'Forwarded') {
    action = 'FORWARDED';
    let targetDeptDoc = null;
    if (typeof options.targetDepartment === 'object' && options.targetDepartment._id) {
      targetDeptDoc = options.targetDepartment;
    } else {
      targetDeptDoc = await Department.findOne({
        $or: [
          { _id: options.targetDepartment },
          { code: String(options.targetDepartment).toUpperCase() }
        ]
      });
    }

    if (!targetDeptDoc) {
      const error = new Error(`Target department '${options.targetDepartment}' does not exist.`);
      error.statusCode = 400;
      throw error;
    }

    if (!targetDeptDoc.isActive) {
      const error = new Error(`Target department '${targetDeptDoc.name}' is currently inactive.`);
      error.statusCode = 400;
      throw error;
    }

    if (grievance.department.toString() === targetDeptDoc._id.toString()) {
      const error = new Error('Cannot forward grievance to the same department it is already assigned to.');
      error.statusCode = 400;
      throw error;
    }

    const previousDept = grievance.department;
    grievance.department = targetDeptDoc._id;
    grievance.assignedOfficer = null; // Unassign so target department officer can claim/review

    grievance.forwardingHistory.push({
      fromDepartment: previousDept,
      toDepartment: targetDeptDoc._id,
      forwardedBy: user._id || user.id,
      reason: remarks,
      forwardedAt: new Date()
    });

    metadata.previousDepartment = previousDept;
    metadata.targetDepartment = targetDeptDoc._id;
    metadata.targetDepartmentName = targetDeptDoc.name;
    metadata.targetDepartmentCode = targetDeptDoc.code;
  } else if (targetStatus === 'Rejected') {
    action = 'REJECTED';
    grievance.rejectionReason = remarks;
    metadata.rejectionReason = remarks;
  } else if (targetStatus === 'Withdrawn') {
    action = 'WITHDRAWN';
    grievance.withdrawalDetails = {
      reason: remarks,
      withdrawnAt: new Date()
    };
    metadata.withdrawalReason = remarks;
  } else if (targetStatus === 'Resolved') {
    action = 'RESOLVED';
    const resolutionNotes = options.resolutionNotes || remarks;
    grievance.resolutionDetails = {
      resolutionNotes,
      resolvedBy: user._id || user.id,
      resolvedAt: new Date()
    };
    metadata.resolutionNotes = resolutionNotes;
  } else if (targetStatus === 'Awaiting Student Response') {
    action = 'AWAITING_STUDENT_RESPONSE';
    metadata.query = options.query || remarks;
  } else if (targetStatus === 'In Progress' && currentStatus === 'Awaiting Student Response' && user.role === 'student') {
    action = 'STUDENT_RESPONDED';
    const studentMessage = options.message || remarks;
    grievance.studentResponses.push({
      message: studentMessage,
      respondedAt: new Date()
    });
    metadata.studentResponse = studentMessage;
  } else if (targetStatus === 'Feedback or Reconsideration') {
    action = 'FEEDBACK_OR_RECONSIDERATION';
    const isReconsideration = Boolean(options.isReconsiderationRequested);
    grievance.studentFeedback = {
      rating: options.rating ? Number(options.rating) : undefined,
      comments: options.comments || remarks,
      isReconsiderationRequested: isReconsideration,
      reconsiderationReason: isReconsideration ? (options.reconsiderationReason || remarks) : null,
      submittedAt: new Date()
    };
    metadata.isReconsiderationRequested = isReconsideration;
    metadata.feedback = grievance.studentFeedback;
  } else if (targetStatus === 'Closed') {
    action = 'CLOSED';
    metadata.closureNotes = remarks;
  }

  // 3. Update grievance status and append to status history
  grievance.status = targetStatus;
  grievance.statusHistory.push({
    fromStatus: currentStatus,
    toStatus: targetStatus,
    changedBy: user._id || user.id,
    role: user.role,
    remarks,
    timestamp: new Date()
  });

  await grievance.save();

  // Trigger Notification to Student regarding status transition
  notifyStatusChanged(grievance, currentStatus, targetStatus, remarks).catch((err) => {
    console.warn('Could not dispatch status change notification:', err.message);
  });

  // 4. Record Audit Event
  const auditEvent = await recordAuditEvent({
    grievanceId: grievance._id,
    ticketId: grievance.ticketId,
    action,
    fromStatus: currentStatus,
    toStatus: targetStatus,
    user,
    remarks,
    metadata
  });

  return { grievance, auditEvent };
}

module.exports = {
  GRIEVANCE_STATUSES,
  ALL_STATUSES,
  PERMITTED_TRANSITIONS,
  validateTransition,
  recordAuditEvent,
  executeTransition
};

