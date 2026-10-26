const mongoose = require('mongoose');
const Notification = require('../models/Notification');

function currentUserId(req) {
  return (req.user?._id || req.user?.id || '').toString();
}

/**
 * GET /api/notifications
 * Get user's notifications sorted newest first
 */
exports.getNotifications = async (req, res) => {
  try {
    const userId = currentUserId(req);

    const notifications = await Notification.find({
      recipient: userId
    })
      .populate('grievance', 'ticketId title status')
      .sort({ createdAt: -1 })
      .limit(100);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error('getNotifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not load notifications.'
    });
  }
};

/**
 * GET /api/notifications/unread-count
 * Get count of unread notifications for the current user
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = currentUserId(req);
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('getUnreadCount error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not count unread notifications.'
    });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = currentUserId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID format.'
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { $set: { isRead: true, readAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      notification
    });
  } catch (error) {
    console.error('markAsRead error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not update notification.'
    });
  }
};

/**
 * PATCH /api/notifications/read-all
 * Mark all unread notifications as read
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = currentUserId(req);

    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('markAllAsRead error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not update notifications.'
    });
  }
};
