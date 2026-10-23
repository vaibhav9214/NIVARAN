
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grievance",
      required: true,
      immutable: true,
      index: true,
    },

    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    unassignedAt: {
      type: Date,
      default: null,
    },

    isCurrent: {
      type: Boolean,
      default: true,
      index: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: [1000, "Assignment note cannot exceed 1000 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Efficiently find an officer's current workload.
assignmentSchema.index({ officer: 1, isCurrent: 1 });

// Efficiently retrieve a grievance's assignment history.
assignmentSchema.index({ grievance: 1, assignedAt: -1 });

// Prevent duplicate active assignments to the same officer
// for the same grievance.
assignmentSchema.index(
  { grievance: 1 },
  {
    unique: true,
    partialFilterExpression: { isCurrent: true },
  }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
