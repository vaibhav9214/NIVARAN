const mongoose = require('mongoose');

const auditEventSchema = new mongoose.Schema(
  {
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grievance',
      required: true,
      index: true
    },
    ticketId: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'SUBMITTED',
        'STATUS_CHANGE',
        'FORWARDED',
        'AWAITING_STUDENT_RESPONSE',
        'STUDENT_RESPONDED',
        'RESOLVED',
        'FEEDBACK_OR_RECONSIDERATION',
        'REJECTED',
        'WITHDRAWN',
        'CLOSED'
      ],
      index: true
    },
    fromStatus: {
      type: String,
      default: null
    },
    toStatus: {
      type: String,
      required: true,
      index: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    performedByRole: {
      type: String,
      required: true,
      enum: ['student', 'officer', 'admin', 'system']
    },
    performedByName: {
      type: String,
      default: ''
    },
    remarks: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and audit verification
auditEventSchema.index({ grievance: 1, timestamp: -1 });
auditEventSchema.index({ ticketId: 1, timestamp: -1 });

module.exports = mongoose.model('AuditEvent', auditEventSchema);

