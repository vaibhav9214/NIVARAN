const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const grievanceSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },
    attachments: {
      type: [attachmentSchema],
      default: []
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Submitted',
      index: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isEscalated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Grievance', grievanceSchema);

