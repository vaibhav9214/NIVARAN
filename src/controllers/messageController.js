const mongoose = require('mongoose');
const Message = require('../models/Message');
const Grievance = require('../models/Grievance');
const Notification = require('../models/Notification');
const { getIO, canUserAccessGrievance, resolveGrievance } = require('../services/socketService');

function currentUserId(req) {
  return (req.user?._id || req.user?.id || '').toString();
}

/**
 * GET /api/messages/grievances/:id
 * Retrieve message history for a grievance (ticketId or Mongo _id)
 */
exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const grievance = await resolveGrievance(id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found.'
      });
    }

    const hasAccess = await canUserAccessGrievance(req.user, grievance);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view messages for this grievance.'
      });
    }

    const filter = { grievance: grievance._id };
    // Students can only see public messages
    if (req.user.role === 'student') {
      filter.visibility = 'public';
    }

    const messages = await Message.find(filter)
      .populate('sender', 'name role email')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      ticketId: grievance.ticketId,
      grievanceId: grievance._id,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('getMessages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not load messages.'
    });
  }
};

/**
 * POST /api/messages/grievances/:id
 * Send a message for a grievance and broadcast via Socket.IO
 */
exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, visibility = 'public', attachments = [] } = req.body;
    const senderId = currentUserId(req);

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.'
      });
    }

    if (message.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 5000 characters.'
      });
    }

    const grievance = await resolveGrievance(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found.'
      });
    }

    const hasAccess = await canUserAccessGrievance(req.user, grievance);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to send messages on this grievance.'
      });
    }

    let finalVisibility = visibility;
    if (req.user.role === 'student') {
      finalVisibility = 'public';
    } else if (!['public', 'internal'].includes(visibility)) {
      finalVisibility = 'public';
    }

    const savedMessage = await Message.create({
      grievance: grievance._id,
      sender: senderId,
      message: message.trim(),
      visibility: finalVisibility,
      attachments: Array.isArray(attachments) ? attachments : []
    });

    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name role email');

    // Broadcast via Socket.IO to connected real-time users
    try {
      const io = getIO();
      const roomName = `ticket_${grievance._id.toString()}`;
      const payload = {
        _id: populatedMessage._id.toString(),
        grievanceId: grievance._id.toString(),
        ticketId: grievance.ticketId,
        sender: {
          id: senderId,
          name: req.user.name,
          role: req.user.role,
          email: req.user.email
        },
        message: populatedMessage.message,
        visibility: populatedMessage.visibility,
        attachments: populatedMessage.attachments,
        createdAt: populatedMessage.createdAt
      };

      if (finalVisibility === 'public') {
        io.to(roomName).emit('receive_message', payload);
      } else {
        const socketsInRoom = await io.in(roomName).fetchSockets();
        for (const s of socketsInRoom) {
          if (s.user && ['officer', 'admin'].includes(s.user.role)) {
            s.emit('receive_message', payload);
          }
        }
      }
    } catch (e) {
      // Socket.IO may not be active in some test modes; ignore safely
    }

    // Determine recipient for direct notification
    let recipientId = null;
    if (req.user.role === 'student') {
      recipientId = grievance.assignedOfficer;
    } else {
      recipientId = grievance.student;
    }

    if (recipientId && recipientId.toString() !== senderId && finalVisibility === 'public') {
      try {
        const notification = await Notification.create({
          recipient: recipientId,
          type: 'new_message',
          title: `New message on ${grievance.ticketId}`,
          message: `${req.user.name} (${req.user.role}): ${message.trim().substring(0, 100)}`,
          grievance: grievance._id
        });

        const io = getIO();
        io.to(`user_${recipientId.toString()}`).emit('new_notification', {
          id: notification._id.toString(),
          title: notification.title,
          message: notification.message,
          ticketId: grievance.ticketId,
          grievanceId: grievance._id.toString(),
          createdAt: notification.createdAt
        });
      } catch (e) {
        // Safe fallback
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully.',
      data: populatedMessage
    });
  } catch (error) {
    console.error('sendMessage error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not send message.'
    });
  }
};

