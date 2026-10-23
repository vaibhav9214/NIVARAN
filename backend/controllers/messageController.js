const mongoose = require("mongoose");
const Message = require("../models/Message");
const Grievance = require("../models/Grievance");
const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");

function currentUserId(req) {
  return req.user?._id || req.user?.id;
}

async function canAccessGrievance(user, grievance) {
  if (!user || !grievance) return false;

  if (user.role === "admin") return true;

  if (
    user.role === "student" &&
    String(grievance.student) === String(user._id)
  ) {
    return true;
  }

  if (user.role === "officer") {
    const assignment = await Assignment.findOne({
      grievance: grievance._id,
      officer: user._id,
      isCurrent: true,
    });

    return Boolean(assignment);
  }

  return false;
}

// GET /api/grievances/:id/messages
exports.getMessages = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid grievance ID." });
    }

    const grievance = await Grievance.findById(id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found." });
    }

    if (!(await canAccessGrievance(user, grievance))) {
      return res.status(403).json({ message: "Access denied." });
    }

    const filter = { grievance: grievance._id };

    // Students must never receive internal staff notes.
    if (user.role === "student") {
      filter.visibility = "public";
    }

    const messages = await Message.find(filter)
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    return res.json({ messages });
  } catch (error) {
    console.error("getMessages:", error);
    return res.status(500).json({ message: "Could not load messages." });
  }
};

// POST /api/grievances/:id/messages
exports.sendMessage = async (req, res) => {
  try {
    const user = req.user;
    const senderId = currentUserId(req);
    const { id } = req.params;
    const { message, visibility = "public", requestInformation = false } =
      req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid grievance ID." });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }

    if (message.trim().length > 5000) {
      return res.status(400).json({ message: "Message is too long." });
    }

    if (!["public", "internal"].includes(visibility)) {
      return res.status(400).json({ message: "Invalid message visibility." });
    }

    const grievance = await Grievance.findById(id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found." });
    }

    if (!(await canAccessGrievance(user, grievance))) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Only officers and admins can create internal notes.
    if (visibility === "internal" && !["officer", "admin"].includes(user.role)) {
      return res.status(403).json({
        message: "Only authorized staff can create internal notes.",
      });
    }

    // Information requests must be student-visible and sent by staff.
    if (requestInformation) {
      if (!["officer", "admin"].includes(user.role)) {
        return res.status(403).json({
          message: "Only staff can request additional information.",
        });
      }

      if (visibility !== "public") {
        return res.status(400).json({
          message: "Information requests must be public messages.",
        });
      }
    }

    const savedMessage = await Message.create({
      grievance: grievance._id,
      sender: senderId,
      message: message.trim(),
      visibility,
      attachments: [],
    });

    let recipientId;

    if (user.role === "student") {
      // Notify the currently assigned officer.
      const assignment = await Assignment.findOne({
        grievance: grievance._id,
        isCurrent: true,
      });

      if (assignment) recipientId = assignment.officer;
    } else {
      recipientId = grievance.student;
    }

    // An information request updates the grievance status.
    if (requestInformation) {
      grievance.status = "awaiting_student";
      await grievance.save();

      await AuditLog.create({
        actor: senderId,
        action: "INFORMATION_REQUESTED",
        entityType: "grievance",
        grievance: grievance._id,
        metadata: { messageId: savedMessage._id },
        ipAddress: req.ip,
      });
    }

    if (recipientId && String(recipientId) !== String(senderId)) {
      await Notification.create({
        recipient: recipientId,
        type: requestInformation ? "status_changed" : "new_message",
        title: requestInformation
          ? "Additional information requested"
          : "New grievance message",
        message: requestInformation
          ? `Please provide additional information for ticket ${grievance.ticketId}.`
          : `You have a new message regarding ticket ${grievance.ticketId}.`,
        grievance: grievance._id,
        isRead: false,
        readAt: null,
      });
    }

    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("sender", "name role");

    return res.status(201).json({
      message: "Message sent successfully.",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("sendMessage:", error);
    return res.status(500).json({ message: "Could not send message." });
  }
};

// PATCH /api/grievances/:id/status
exports.changeStatus = async (req, res) => {
  try {
    const user = req.user;
    const actorId = currentUserId(req);
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "submitted",
      "under_review",
      "in_progress",
      "awaiting_student",
      "resolved",
      "rejected",
      "escalated",
      "closed",
    ];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid grievance ID." });
    }

    if (!["officer", "admin"].includes(user.role)) {
      return res.status(403).json({
        message: "Only staff can change grievance status.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid grievance status." });
    }

    const grievance = await Grievance.findById(id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found." });
    }

    if (!(await canAccessGrievance(user, grievance))) {
      return res.status(403).json({ message: "Access denied." });
    }

    const previousStatus = grievance.status;
    grievance.status = status;

    if (status === "escalated") {
      grievance.isEscalated = true;
      grievance.escalatedAt = new Date();
    }

    if (status === "resolved") {
      grievance.resolvedAt = new Date();
    }

    if (status === "closed") {
      grievance.closedAt = new Date();
      if (!grievance.resolvedAt) grievance.resolvedAt = new Date();
    }

    await grievance.save();

    await Notification.create({
      recipient: grievance.student,
      type: status === "resolved" ? "grievance_resolved" : "status_changed",
      title: "Grievance status updated",
      message: `Ticket ${grievance.ticketId} changed from ${previousStatus} to ${status}.`,
      grievance: grievance._id,
      isRead: false,
      readAt: null,
    });

    await AuditLog.create({
      actor: actorId,
      action: "GRIEVANCE_STATUS_CHANGED",
      entityType: "grievance",
      grievance: grievance._id,
      metadata: { previousStatus, newStatus: status },
      ipAddress: req.ip,
    });

    return res.json({
      message: "Status updated and student notified.",
      grievance,
    });
  } catch (error) {
    console.error("changeStatus:", error);
    return res.status(500).json({ message: "Could not update status." });
  }
};