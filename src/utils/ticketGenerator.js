const crypto = require('crypto');
const Grievance = require('../models/Grievance');

/**
 * Generates a unique, human-readable Grievance Ticket ID
 * Format: NIV-YYYYMMDD-XXXX (e.g. NIV-20261022-K9F2)
 */
async function generateUniqueTicketId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  let ticketId;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
    ticketId = `NIV-${dateStr}-${randomSuffix}`;

    const existing = await Grievance.findOne({ ticketId });
    if (!existing) {
      isUnique = true;
    }
  }

  if (!isUnique) {
    ticketId = `NIV-${dateStr}-${Date.now().toString(36).toUpperCase()}`;
  }

  return ticketId;
}

module.exports = { generateUniqueTicketId };

