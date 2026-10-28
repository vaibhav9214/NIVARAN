import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected with ID:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('[Socket] Connection error:', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    return this.socket;
  }

  joinGrievance(grievanceId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_grievance', { grievanceId });
    }
  }

  leaveGrievance(grievanceId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave_grievance', { grievanceId });
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onStatusUpdated(callback) {
    if (this.socket) {
      this.socket.on('status_updated', callback);
    }
  }

  onNewNotification(callback) {
    if (this.socket) {
      this.socket.on('new_notification', callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService;

