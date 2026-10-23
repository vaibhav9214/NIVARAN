
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    action: {
      type: String,
      required: [true, "Audit action is required"],
      trim: true,
      maxlength: [100, "Action cannot exceed 100 characters"],
      uppercase: true,
    },

    entityType: {
      type: String,
      enum: ["grievance", "user", "department", "assignment", "system"],
      required: true,
      index: true,
    },

    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grievance",
      default: null,
      index: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    ipAddress: {
      type: String,
      maxlength: 45,
      default: null,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Useful for viewing a grievance's complete history.
auditLogSchema.index({ grievance: 1, timestamp: 1 });

// Useful for admin audit reports.
auditLogSchema.index({ entityType: 1, action: 1, timestamp: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
