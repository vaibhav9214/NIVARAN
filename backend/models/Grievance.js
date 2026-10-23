
const mongoose = require("mongoose");
const { randomBytes } = require("crypto");

const GRIEVANCE_CATEGORIES = [
  "academic",
  "examination",
  "hostel",
  "infrastructure",
  "fees",
  "harassment",
  "ragging",
  "administration",
  "other",
];

const GRIEVANCE_STATUSES = [
  "submitted",
  "under_review",
  "in_progress",
  "awaiting_student",
  "resolved",
  "rejected",
  "escalated",
  "closed",
];

const GRIEVANCE_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
];

const grievanceSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      default: () =>
        `NIV-${Date.now().toString(36).toUpperCase()}-${randomBytes(4)
          .toString("hex")
          .toUpperCase()}`,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      immutable: true,
    },

    title: {
      type: String,
      required: [true, "Grievance title is required"],
      trim: true,
      minlength: [5, "Title must contain at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Grievance description is required"],
      trim: true,
      minlength: [20, "Description must contain at least 20 characters"],
      maxlength: [10000, "Description cannot exceed 10000 characters"],
    },

    category: {
      type: String,
      required: true,
      enum: GRIEVANCE_CATEGORIES,
      index: true,
    },

    priority: {
      type: String,
      enum: GRIEVANCE_PRIORITIES,
      default: "medium",
      index: true,
    },

    status: {
      type: String,
      enum: GRIEVANCE_STATUSES,
      default: "submitted",
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
      index: true,
    },

    deadline: {
      type: Date,
      default: null,
    },

    isEscalated: {
      type: Boolean,
      default: false,
    },

    escalatedAt: {
      type: Date,
      default: null,
    },

    resolution: {
      type: String,
      trim: true,
      maxlength: [5000, "Resolution cannot exceed 5000 characters"],
      default: "",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Useful for student grievance history and officer queues.
grievanceSchema.index({ student: 1, createdAt: -1 });
grievanceSchema.index({ department: 1, status: 1, createdAt: -1 });
grievanceSchema.index({ status: 1, deadline: 1 });

module.exports = mongoose.model("Grievance", grievanceSchema);

module.exports.GRIEVANCE_CATEGORIES = GRIEVANCE_CATEGORIES;
module.exports.GRIEVANCE_STATUSES = GRIEVANCE_STATUSES;
module.exports.GRIEVANCE_PRIORITIES = GRIEVANCE_PRIORITIES;
