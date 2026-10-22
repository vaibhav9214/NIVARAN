const mongoose = require('mongoose');

const revokedTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL index to auto-delete expired documents
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RevokedToken', revokedTokenSchema);

