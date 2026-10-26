
const mongoose = require("mongoose");
const AuditLog = require("../models/AuditLog");

async function getAuditLogs(req, res) {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 25)
    );

    const filter = {};

    if (req.query.action) {
      filter.action = String(req.query.action).trim().toUpperCase();
    }

    if (req.query.entityType) {
      const allowedTypes = [
        "grievance",
        "user",
        "department",
        "assignment",
        "system",
      ];

      if (!allowedTypes.includes(req.query.entityType)) {
        return res.status(400).json({
          message: "Invalid entityType filter.",
          allowedTypes,
        });
      }

      filter.entityType = req.query.entityType;
    }

    if (req.query.grievanceId) {
      if (!mongoose.isValidObjectId(req.query.grievanceId)) {
        return res.status(400).json({
          message: "Invalid grievanceId.",
        });
      }

      filter.grievance = req.query.grievanceId;
    }

    if (req.query.actorId) {
      if (!mongoose.isValidObjectId(req.query.actorId)) {
        return res.status(400).json({ message: "Invalid actorId." });
      }

      filter.actor = req.query.actorId;
    }

    if (req.query.from || req.query.to) {
      filter.timestamp = {};

      if (req.query.from) {
        const from = new Date(req.query.from);
        if (Number.isNaN(from.getTime())) {
          return res.status(400).json({ message: "Invalid from date." });
        }
        filter.timestamp.$gte = from;
      }

      if (req.query.to) {
        const to = new Date(req.query.to);
        if (Number.isNaN(to.getTime())) {
          return res.status(400).json({ message: "Invalid to date." });
        }
        filter.timestamp.$lte = to;
      }

      if (
        filter.timestamp.$gte &&
        filter.timestamp.$lte &&
        filter.timestamp.$gte > filter.timestamp.$lte
      ) {
        return res.status(400).json({
          message: "'from' must be earlier than or equal to 'to'.",
        });
      }
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("actor", "name email role")
        .populate("grievance", "ticketId title status")
        .sort({ timestamp: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      AuditLog.countDocuments(filter),
    ]);

    return res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Audit log retrieval error:", error);
    return res.status(500).json({
      message: "Could not retrieve audit logs.",
    });
  }
}

module.exports = { getAuditLogs };
