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
      enum: [
        'Submitted',
        'Under Review',
        'In Progress',
        'Awaiting Student Response',
        'Resolved',
        'Feedback or Reconsideration',
        'Forwarded',
        'Rejected',
        'Withdrawn',
        'Closed'
      ],
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
    },
    statusHistory: [
      {
        fromStatus: { type: String, default: null },
        toStatus: { type: String, required: true },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String },
        remarks: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    rejectionReason: {
      type: String,
      default: null
    },
    resolutionDetails: {
      resolutionNotes: { type: String, default: null },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      resolvedAt: { type: Date, default: null }
    },
    withdrawalDetails: {
      reason: { type: String, default: null },
      withdrawnAt: { type: Date, default: null }
    },
    forwardingHistory: [
      {
        fromDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        toDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        forwardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String },
        forwardedAt: { type: Date, default: Date.now }
      }
    ],
    studentFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comments: { type: String },
      isReconsiderationRequested: { type: Boolean, default: false },
      reconsiderationReason: { type: String },
      submittedAt: { type: Date }
    },
    studentResponses: [
      {
        message: { type: String, required: true },
        respondedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Grievance', grievanceSchema);

