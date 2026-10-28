const Notification = require('../models/Notification');
const { emitToUser } = require('./socketService');

/**
 * Persist notification in MongoDB and emit via WebSockets to user room
 */
async function sendNotification({ recipientId, type, title, message, grievanceId }) {
  if (!recipientId) return null;
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type: type || 'system',
      title,
      message,
      grievance: grievanceId || null,
      isRead: false
    });

    // Populate grievance info if available
    let grievanceData = null;
    if (grievanceId) {
      grievanceData = { _id: grievanceId };
    }

    emitToUser(recipientId.toString(), 'new_notification', {
      id: notification._id.toString(),
      _id: notification._id.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      grievance: grievanceData,
      createdAt: notification.createdAt,
      isRead: false
    });

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
}

/**
 * 1. Grievance Submitted Notification (sent to Student)
 */
async function notifyGrievanceSubmitted(grievance, studentId) {
  return sendNotification({
    recipientId: studentId || grievance.student,
    type: 'grievance_submitted',
    title: `Docket Filed: #${grievance.ticketId}`,
    message: `Your grievance "${grievance.title}" has been registered in the institutional ledger.`,
    grievanceId: grievance._id
  });
}

/**
 * 2. Status Changed Notification (sent to Student)
 */
async function notifyStatusChanged(grievance, fromStatus, toStatus, remarks = '') {
  let title = `Status Update: #${grievance.ticketId}`;
  let type = 'status_changed';
  if (toStatus === 'Resolved') {
    type = 'grievance_resolved';
    title = `Case Resolved: #${grievance.ticketId}`;
  } else if (toStatus === 'Awaiting Student Response') {
    type = 'deadline_reminder';
    title = `Action Required: #${grievance.ticketId}`;
  }

  const snippet = remarks ? ` - "${remarks.slice(0, 80)}${remarks.length > 80 ? '...' : ''}"` : '';
  const message = `Status transitioned from ${fromStatus} to ${toStatus}${snippet}`;

  return sendNotification({
    recipientId: grievance.student,
    type,
    title,
    message,
    grievanceId: grievance._id
  });
}

/**
 * 3. Officer Assigned Notification (sent to Officer & Student)
 */
async function notifyOfficerAssigned(grievance, officerId) {
  // Notify Officer
  if (officerId) {
    await sendNotification({
      recipientId: officerId,
      type: 'officer_assigned',
      title: `Case Assigned: #${grievance.ticketId}`,
      message: `You have been designated as the responsible officer for "${grievance.title}".`,
      grievanceId: grievance._id
    });
  }

  // Notify Student
  if (grievance.student) {
    await sendNotification({
      recipientId: grievance.student,
      type: 'officer_assigned',
      title: `Officer Assigned: #${grievance.ticketId}`,
      message: `An institutional grievance officer has been assigned to investigate your case.`,
      grievanceId: grievance._id
    });
  }
}

module.exports = {
  sendNotification,
  notifyGrievanceSubmitted,
  notifyStatusChanged,
  notifyOfficerAssigned
};
