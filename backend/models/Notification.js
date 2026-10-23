
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "grievance_submitted",
        "status_changed",
        "officer_assigned",
        "new_message",
        "deadline_reminder",
        "grievance_escalated",
        "grievance_resolved",
        "system",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grievance",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Fetch a user's notifications, newest first.
notificationSchema.index({ recipient: 1, createdAt: -1 });

// Efficiently fetch unread notifications.
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
