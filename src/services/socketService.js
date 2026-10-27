const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Grievance = require('../models/Grievance');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const RevokedToken = require('../models/RevokedToken');
const { JWT_SECRET } = require('../middleware/auth');

let io = null;

/**
 * Check if a user is authorized to access a given grievance conversation
 */
async function canUserAccessGrievance(user, grievance) {
  if (!user || !grievance) return false;
  if (user.role === 'admin') return true;

  if (user.role === 'student') {
    return grievance.student.toString() === user.id.toString();
  }

  if (user.role === 'officer') {
    if (grievance.assignedOfficer && grievance.assignedOfficer.toString() === user.id.toString()) {
      return true;
    }
    if (user.department && grievance.department) {
      return grievance.department.toString() === user.department.toString();
    }
  }

  return false;
}

/**
 * Resolve grievance by Mongo _id or alphanumeric ticketId (e.g. NIV-20261022-XXXX)
 */
async function resolveGrievance(identifier) {
  if (!identifier) return null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return Grievance.findById(identifier);
  }
  return Grievance.findOne({ ticketId: identifier.toUpperCase() });
}

/**
 * Initialize Socket.IO with WebSocket authentication and event handlers
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // WebSocket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth?.token;
      if (!token && socket.handshake.headers?.authorization) {
        const parts = socket.handshake.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          token = parts[1];
        }
      }

      if (!token) {
        return next(new Error('Authentication error: Token is required.'));
      }

      const isRevoked = await RevokedToken.findOne({ token });
      if (isRevoked) {
        return next(new Error('Authentication error: Token has been revoked.'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || user.status === 'inactive') {
        return next(new Error('Authentication error: User account is inactive or not found.'));
      }

      if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
        return next(new Error('Authentication error: Session has expired.'));
      }

      socket.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department ? user.department.toString() : null
      };

      next();
    } catch (err) {
      next(new Error(`Authentication error: ${err.message}`));
    }
  });

  io.on('connection', (socket) => {
    // Automatically join personal notification room
    const userRoom = `user_${socket.user.id}`;
    socket.join(userRoom);

    // ----------------------------------------------------------------------
    // 1. Join Grievance Ticket Chat Room
    // ----------------------------------------------------------------------
    socket.on('join_ticket', async (payload, callback) => {
      try {
        const identifier = typeof payload === 'string' ? payload : (payload?.ticketId || payload?.grievanceId);
        const grievance = await resolveGrievance(identifier);

        if (!grievance) {
          const errMsg = 'Grievance not found.';
          socket.emit('error_message', { message: errMsg });
          if (callback) callback({ success: false, message: errMsg });
          return;
        }

        const hasAccess = await canUserAccessGrievance(socket.user, grievance);
        if (!hasAccess) {
          const errMsg = 'Access denied: You are not authorized to access this grievance conversation.';
          socket.emit('error_message', { message: errMsg });
          if (callback) callback({ success: false, message: errMsg });
          return;
        }

        const roomName = `ticket_${grievance._id.toString()}`;
        socket.join(roomName);

        // Notify other room participants
        socket.to(roomName).emit('user_joined', {
          userId: socket.user.id,
          name: socket.user.name,
          role: socket.user.role,
          timestamp: new Date()
        });

        const successData = {
          success: true,
          ticketId: grievance.ticketId,
          grievanceId: grievance._id.toString(),
          room: roomName
        };

        socket.emit('joined_ticket', successData);
        if (callback) callback(successData);
      } catch (err) {
        console.error('Socket join_ticket error:', err);
        socket.emit('error_message', { message: 'Internal error joining ticket room.' });
      }
    });

    // ----------------------------------------------------------------------
    // 2. Leave Grievance Ticket Chat Room
    // ----------------------------------------------------------------------
    socket.on('leave_ticket', async (payload, callback) => {
      try {
        const identifier = typeof payload === 'string' ? payload : (payload?.ticketId || payload?.grievanceId);
        const grievance = await resolveGrievance(identifier);

        if (grievance) {
          const roomName = `ticket_${grievance._id.toString()}`;
          socket.leave(roomName);
          socket.to(roomName).emit('user_left', {
            userId: socket.user.id,
            name: socket.user.name,
            role: socket.user.role,
            timestamp: new Date()
          });
        }
        if (callback) callback({ success: true });
      } catch (err) {
        console.error('Socket leave_ticket error:', err);
      }
    });

    // ----------------------------------------------------------------------
    // 3. Real-Time Talking: Send & Broadcast Message
    // ----------------------------------------------------------------------
    socket.on('send_message', async (data, callback) => {
      try {
        const { ticketId, grievanceId, message, visibility = 'public', attachments = [] } = data || {};
        const identifier = ticketId || grievanceId;

        if (!message || typeof message !== 'string' || !message.trim()) {
          const errMsg = 'Message content is required.';
          socket.emit('error_message', { message: errMsg });
          if (callback) callback({ success: false, message: errMsg });
          return;
        }

        if (message.trim().length > 5000) {
          const errMsg = 'Message cannot exceed 5000 characters.';
          socket.emit('error_message', { message: errMsg });
          if (callback) callback({ success: false, message: errMsg });
          return;
        }

        const grievance = await resolveGrievance(identifier);
        if (!grievance) {
          const errMsg = 'Grievance not found.';
          socket.emit('error_message', { message: errMsg });
          if (callback) callback({ success: false, message: errMsg });
          return;
        }

        const hasAccess = await canUserAccessGrievance(socket.user, grievance);
        if (!hasAccess) {
          const errMsg = 'Access denied: You cannot send messages to this grievance.';
          socket.emit('error_message', { message: errMsg });
          if (callback) callback({ success: false, message: errMsg });
          return;
        }

        // Students can only post public messages
        let finalVisibility = visibility;
        if (socket.user.role === 'student') {
          finalVisibility = 'public';
        } else if (!['public', 'internal'].includes(visibility)) {
          finalVisibility = 'public';
        }

        // Save Message in MongoDB
        const savedMessage = await Message.create({
          grievance: grievance._id,
          sender: socket.user.id,
          message: message.trim(),
          visibility: finalVisibility,
          attachments: Array.isArray(attachments) ? attachments : []
        });

        const populatedMessage = await Message.findById(savedMessage._id)
          .populate('sender', 'name role email');

        const messagePayload = {
          _id: populatedMessage._id.toString(),
          grievanceId: grievance._id.toString(),
          ticketId: grievance.ticketId,
          sender: {
            id: socket.user.id,
            name: socket.user.name,
            role: socket.user.role,
            email: socket.user.email
          },
          message: populatedMessage.message,
          visibility: populatedMessage.visibility,
          attachments: populatedMessage.attachments,
          createdAt: populatedMessage.createdAt
        };

        const roomName = `ticket_${grievance._id.toString()}`;

        // Broadcast to clients in the room
        if (finalVisibility === 'public') {
          // Public message: Everyone in the ticket room receives it
          io.to(roomName).emit('receive_message', messagePayload);
        } else {
          // Internal staff note: Only officers and admins receive it
          const socketsInRoom = await io.in(roomName).fetchSockets();
          for (const s of socketsInRoom) {
            if (s.user && ['officer', 'admin'].includes(s.user.role)) {
              s.emit('receive_message', messagePayload);
            }
          }
        }

        // Determine recipient for direct notification
        let recipientId = null;
        if (socket.user.role === 'student') {
          recipientId = grievance.assignedOfficer;
        } else {
          recipientId = grievance.student;
        }

        // If recipient is not the sender, create notification and emit real-time event
        if (recipientId && recipientId.toString() !== socket.user.id.toString() && finalVisibility === 'public') {
          const notification = await Notification.create({
            recipient: recipientId,
            type: 'new_message',
            title: `New message on ${grievance.ticketId}`,
            message: `${socket.user.name} (${socket.user.role}): ${message.trim().substring(0, 100)}`,
            grievance: grievance._id
          });

          io.to(`user_${recipientId.toString()}`).emit('new_notification', {
            id: notification._id.toString(),
            title: notification.title,
            message: notification.message,
            ticketId: grievance.ticketId,
            grievanceId: grievance._id.toString(),
            createdAt: notification.createdAt
          });
        }

        if (callback) {
          callback({ success: true, message: messagePayload });
        }
      } catch (err) {
        console.error('Socket send_message error:', err);
        socket.emit('error_message', { message: 'Internal error sending message.' });
        if (callback) callback({ success: false, message: 'Internal server error.' });
      }
    });

    // ----------------------------------------------------------------------
    // 4. Real-Time Typing Indicators
    // ----------------------------------------------------------------------
    socket.on('typing_start', async (payload) => {
      try {
        const identifier = typeof payload === 'string' ? payload : (payload?.ticketId || payload?.grievanceId);
        const grievance = await resolveGrievance(identifier);
        if (grievance) {
          const roomName = `ticket_${grievance._id.toString()}`;
          socket.to(roomName).emit('user_typing', {
            ticketId: grievance.ticketId,
            userId: socket.user.id,
            name: socket.user.name,
            role: socket.user.role
          });
        }
      } catch (err) {
        console.error('Socket typing_start error:', err);
      }
    });

    socket.on('typing_stop', async (payload) => {
      try {
        const identifier = typeof payload === 'string' ? payload : (payload?.ticketId || payload?.grievanceId);
        const grievance = await resolveGrievance(identifier);
        if (grievance) {
          const roomName = `ticket_${grievance._id.toString()}`;
          socket.to(roomName).emit('user_stop_typing', {
            ticketId: grievance.ticketId,
            userId: socket.user.id
          });
        }
      } catch (err) {
        console.error('Socket typing_stop error:', err);
      }
    });

    socket.on('disconnect', () => {
      // Cleanly handled by socket.io
    });
  });

  return io;
}

/**
 * Access the initialized Socket.IO server
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initSocket(server) first.');
  }
  return io;
}

/**
 * Helper to emit a notification to a specific user's live WebSocket session
 */
function emitToUser(userId, event, payload) {
  if (io && userId) {
    io.to(`user_${userId.toString()}`).emit(event, payload);
  }
}

/**
 * Helper to emit a message/event to a grievance ticket room
 */
function emitToTicket(grievanceId, event, payload) {
  if (io && grievanceId) {
    io.to(`ticket_${grievanceId.toString()}`).emit(event, payload);
  }
}

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToTicket,
  canUserAccessGrievance,
  resolveGrievance
};

