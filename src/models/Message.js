const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grievance',
      required: true,
      immutable: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      minlength: [1, 'Message cannot be empty'],
      maxlength: [5000, 'Message cannot exceed 5000 characters']
    },
    visibility: {
      type: String,
      enum: ['public', 'internal'],
      default: 'public',
      required: true,
      index: true
    },
    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        mimeType: { type: String, required: true },
        sizeBytes: { type: Number, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Retrieve a grievance conversation in chronological order
messageSchema.index({ grievance: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);

