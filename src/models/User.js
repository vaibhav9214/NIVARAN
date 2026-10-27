const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'officer', 'admin'],
      default: 'student'
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'inactive'],
      default: 'active'
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null
    },
    caseAccessConfig: {
      accessScope: {
        type: String,
        enum: ['department', 'all', 'custom'],
        default: 'department'
      },
      assignedCategories: {
        type: [String],
        default: []
      },
      canHandleEscalated: {
        type: Boolean,
        default: false
      }
    },
    tokenVersion: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
