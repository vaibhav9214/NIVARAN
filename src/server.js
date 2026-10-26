const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { initSocket, getIO } = require('./services/socketService');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const officerRoutes = require('./routes/officerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Root Status
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NIVARAN Auth & RBAC API Server with Real-Time WebSockets',
    database: 'MongoDB',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      student: '/api/student',
      officer: '/api/officer',
      admin: '/api/admin',
      messages: '/api/messages',
      notifications: '/api/notifications'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Catch-all for unknown API endpoints
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // Catch client parser errors and 4xx errors cleanly (e.g. malformed JSON)
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({
      success: false,
      message: err.type === 'entity.parse.failed' ? 'Malformed JSON in request body.' : (err.message || 'Invalid request payload.')
    });
  }

  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.'
  });
});

// Attach Socket.IO to HTTP server automatically on listen
app.listen = function(...args) {
  const server = http.createServer(app);
  initSocket(server);
  return server.listen(...args);
};

app.initSocket = initSocket;
app.getIO = getIO;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`   NIVARAN Real-Time Server is running`);
      console.log(`   Database: MongoDB`);
      console.log(`   Port: http://localhost:${PORT}`);
      console.log(`   WebSockets: Active`);
      console.log(`===============================================`);
    });
  }).catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

module.exports = app;
