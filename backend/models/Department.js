
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      maxlength: [100, "Department name cannot exceed 100 characters"],
    },

    code: {
      type: String,
      required: [true, "Department code is required"],
      trim: true,
      uppercase: true,
      maxlength: [20, "Department code cannot exceed 20 characters"],
      match: [
        /^[A-Z0-9_-]+$/,
        "Department code can contain only letters, numbers, underscores, and hyphens",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique department names and codes in MongoDB.
departmentSchema.index({ name: 1 }, { unique: true });
departmentSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model("Department", departmentSchema);
