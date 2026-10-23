const mongoose = require("mongoose");
const Notification = require("../models/Notification");

function currentUserId(req) {
  return req.user?._id || req.user?.id;
}

// GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = currentUserId(req);

    const notifications = await Notification.find({
      recipient: userId,
    })
      .populate("grievance", "ticketId title status")
      .sort({ createdAt: -1 })
      .limit(100);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return res.json({ notifications, unreadCount });
  } catch (error) {
    console.error("getNotifications:", error);
    return res.status(500).json({
      message: "Could not load notifications.",
    });
  }
};

// GET /api/notifications/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: currentUserId(req),
      isRead: false,
    });

    return res.json({ unreadCount });
  } catch (error) {
    console.error("getUnreadCount:", error);
    return res.status(500).json({
      message: "Could not count unread notifications.",
    });
  }
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        recipient: currentUserId(req),
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.json({
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error("markAsRead:", error);
    return res.status(500).json({
      message: "Could not update notification.",
    });
  }
};

// PATCH /api/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: currentUserId(req),
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    return res.json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("markAllAsRead:", error);
    return res.status(500).json({
      message: "Could not update notifications.",
    });
  }
};