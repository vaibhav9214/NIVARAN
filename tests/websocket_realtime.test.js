const assert = require('node:assert');
const http = require('node:http');
const mongoose = require('mongoose');
const { io: ClientIO } = require('socket.io-client');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Grievance = require('../src/models/Grievance');
const Message = require('../src/models/Message');
const Notification = require('../src/models/Notification');
const RevokedToken = require('../src/models/RevokedToken');
const { JWT_SECRET } = require('../src/middleware/auth');
const jwt = require('jsonwebtoken');

let server;
let baseUrl;
let port;

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      url,
      {
        method,
        headers
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(rawData);
          } catch {
            json = rawData;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: json
          });
        });
      }
    );

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function createClientSocket(token) {
  return ClientIO(`http://127.0.0.1:${port}`, {
    auth: { token },
    reconnection: false,
    transports: ['websocket']
  });
}

function waitForConnect(socket, timeoutMs = 4000) {
  if (socket.connected) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for 'connect' after ${timeoutMs}ms`));
    }, timeoutMs);

    socket.once('connect', () => {
      clearTimeout(timer);
      resolve();
    });

    socket.once('connect_error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function waitForEvent(socket, eventName, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event '${eventName}' after ${timeoutMs}ms`));
    }, timeoutMs);

    socket.once(eventName, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('   NIVARAN REAL-TIME WEBSOCKET & MESSAGING TEST SUITE        ');
  console.log('===============================================================\n');

  await connectDB();

  server = app.listen(0);
  port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(err);
      failed++;
    }
  }

  // Active sockets to clean up
  const activeSockets = [];
  function trackSocket(s) {
    activeSockets.push(s);
    return s;
  }

  try {
    const timestamp = Date.now();

    // 1. Create Department
    const dept = await Department.create({
      name: `Hostel Affairs ${timestamp}`,
      code: `HSTL${timestamp.toString().slice(-4)}`,
      description: 'Hostel and mess administration'
    });

    // 2. Create Users
    const student1 = await User.create({
      name: `Student Alice ${timestamp}`,
      email: `alice_${timestamp}@test.edu`,
      password: 'password123',
      role: 'student',
      status: 'active'
    });

    const student2 = await User.create({
      name: `Student Bob ${timestamp}`,
      email: `bob_${timestamp}@test.edu`,
      password: 'password123',
      role: 'student',
      status: 'active'
    });

    const officer = await User.create({
      name: `Officer Rahul ${timestamp}`,
      email: `officer_${timestamp}@test.edu`,
      password: 'password123',
      role: 'officer',
      status: 'active',
      department: dept._id
    });

    const admin = await User.create({
      name: `Admin Vikram ${timestamp}`,
      email: `admin_${timestamp}@test.edu`,
      password: 'password123',
      role: 'admin',
      status: 'active'
    });

    const inactiveUser = await User.create({
      name: `Inactive User ${timestamp}`,
      email: `inactive_${timestamp}@test.edu`,
      password: 'password123',
      role: 'student',
      status: 'inactive'
    });

    // Generate JWT Tokens
    const student1Token = jwt.sign(
      { id: student1._id.toString(), email: student1.email, role: student1.role, tokenVersion: student1.tokenVersion },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const student2Token = jwt.sign(
      { id: student2._id.toString(), email: student2.email, role: student2.role, tokenVersion: student2.tokenVersion },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const officerToken = jwt.sign(
      { id: officer._id.toString(), email: officer.email, role: officer.role, tokenVersion: officer.tokenVersion },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const adminToken = jwt.sign(
      { id: admin._id.toString(), email: admin.email, role: admin.role, tokenVersion: admin.tokenVersion },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const inactiveToken = jwt.sign(
      { id: inactiveUser._id.toString(), email: inactiveUser.email, role: inactiveUser.role, tokenVersion: inactiveUser.tokenVersion },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const revokedTokenStr = jwt.sign(
      { id: student1._id.toString(), email: student1.email, role: student1.role, tokenVersion: student1.tokenVersion, nonce: 'revoked_token_sample' },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    await RevokedToken.create({ token: revokedTokenStr, expiresAt: new Date(Date.now() + 3600000) });

    // 3. Create a Grievance for Student 1
    const grievance1 = await Grievance.create({
      ticketId: `NIV-WS-${timestamp.toString().slice(-6)}`,
      student: student1._id,
      title: 'Water supply issue in Block C',
      category: 'Infrastructure',
      department: dept._id,
      description: 'Water has not been available in Block C since morning.',
      priority: 'High',
      status: 'Submitted',
      assignedOfficer: officer._id
    });

    // -------------------------------------------------------------
    // TEST 1: WebSocket Authentication - Reject connection with no token
    // -------------------------------------------------------------
    await test('Reject WebSocket connection when no token is provided', async () => {
      const socket = trackSocket(ClientIO(`http://127.0.0.1:${port}`, {
        reconnection: false,
        transports: ['websocket']
      }));

      const err = await waitForEvent(socket, 'connect_error');
      assert.ok(err.message.includes('Token is required'));
    });

    // -------------------------------------------------------------
    // TEST 2: WebSocket Authentication - Reject invalid token
    // -------------------------------------------------------------
    await test('Reject WebSocket connection with forged or invalid token', async () => {
      const socket = trackSocket(ClientIO(`http://127.0.0.1:${port}`, {
        auth: { token: 'invalid.forged.jwt' },
        reconnection: false,
        transports: ['websocket']
      }));

      const err = await waitForEvent(socket, 'connect_error');
      assert.ok(err.message.includes('Authentication error'));
    });

    // -------------------------------------------------------------
    // TEST 3: WebSocket Authentication - Reject revoked token
    // -------------------------------------------------------------
    await test('Reject WebSocket connection with revoked token (logged-out session)', async () => {
      const socket = trackSocket(ClientIO(`http://127.0.0.1:${port}`, {
        auth: { token: revokedTokenStr },
        reconnection: false,
        transports: ['websocket']
      }));

      const err = await waitForEvent(socket, 'connect_error');
      assert.ok(err.message.includes('Token has been revoked'));
    });

    // -------------------------------------------------------------
    // TEST 4: WebSocket Authentication - Reject inactive user
    // -------------------------------------------------------------
    await test('Reject WebSocket connection for inactive user account', async () => {
      const socket = trackSocket(ClientIO(`http://127.0.0.1:${port}`, {
        auth: { token: inactiveToken },
        reconnection: false,
        transports: ['websocket']
      }));

      const err = await waitForEvent(socket, 'connect_error');
      assert.ok(err.message.includes('inactive'));
    });

    // -------------------------------------------------------------
    // TEST 5: Connect active student, officer, and admin sockets
    // -------------------------------------------------------------
    let studentSocket;
    let officerSocket;
    let adminSocket;

    await test('Authenticate and establish WebSocket connections for Student, Officer, and Admin', async () => {
      studentSocket = trackSocket(createClientSocket(student1Token));
      officerSocket = trackSocket(createClientSocket(officerToken));
      adminSocket = trackSocket(createClientSocket(adminToken));

      await Promise.all([
        waitForConnect(studentSocket),
        waitForConnect(officerSocket),
        waitForConnect(adminSocket)
      ]);

      assert.strictEqual(studentSocket.connected, true);
      assert.strictEqual(officerSocket.connected, true);
      assert.strictEqual(adminSocket.connected, true);
    });

    // -------------------------------------------------------------
    // TEST 6: Student joins their own ticket room
    // -------------------------------------------------------------
    await test('Student can join their own grievance ticket room', async () => {
      const res = await new Promise((resolve) => {
        studentSocket.emit('join_ticket', { ticketId: grievance1.ticketId }, resolve);
      });
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.ticketId, grievance1.ticketId);
      assert.strictEqual(res.grievanceId, grievance1._id.toString());
    });

    // -------------------------------------------------------------
    // TEST 7: Unauthorized student cannot join another student's room
    // -------------------------------------------------------------
    await test('Unauthorized student is strictly blocked from joining another student\'s ticket room', async () => {
      const student2Socket = trackSocket(createClientSocket(student2Token));
      await waitForConnect(student2Socket);

      const res = await new Promise((resolve) => {
        student2Socket.emit('join_ticket', { ticketId: grievance1.ticketId }, resolve);
      });
      assert.strictEqual(res.success, false);
      assert.ok(res.message.includes('Access denied'));
      student2Socket.disconnect();
    });

    // -------------------------------------------------------------
    // TEST 8: Officer joins ticket room and user_joined is emitted
    // -------------------------------------------------------------
    await test('Assigned officer joins ticket room and broadcast notifies room members', async () => {
      const userJoinedPromise = waitForEvent(studentSocket, 'user_joined');
      const res = await new Promise((resolve) => {
        officerSocket.emit('join_ticket', { ticketId: grievance1.ticketId }, resolve);
      });
      assert.strictEqual(res.success, true);

      const joinedEvent = await userJoinedPromise;
      assert.strictEqual(joinedEvent.userId, officer._id.toString());
      assert.strictEqual(joinedEvent.name, officer.name);
      assert.strictEqual(joinedEvent.role, 'officer');
    });

    // -------------------------------------------------------------
    // TEST 9: Real-time talking: Student sends message, Officer receives
    // -------------------------------------------------------------
    await test('Real-Time Talking: Student emits message -> Officer receives receive_message in real time', async () => {
      const officerReceivePromise = waitForEvent(officerSocket, 'receive_message');
      const studentMsgText = 'Hello Sir, could you check the water pressure on the 3rd floor as well?';

      const ack = await new Promise((resolve) => {
        studentSocket.emit('send_message', {
          ticketId: grievance1.ticketId,
          message: studentMsgText
        }, resolve);
      });
      assert.strictEqual(ack.success, true);

      const received = await officerReceivePromise;
      assert.strictEqual(received.ticketId, grievance1.ticketId);
      assert.strictEqual(received.message, studentMsgText);
      assert.strictEqual(received.sender.id, student1._id.toString());
      assert.strictEqual(received.sender.role, 'student');
      assert.strictEqual(received.visibility, 'public');

      // Verify message was stored in MongoDB
      const savedDoc = await Message.findById(received._id);
      assert.ok(savedDoc);
      assert.strictEqual(savedDoc.message, studentMsgText);
      assert.strictEqual(savedDoc.visibility, 'public');
    });

    // -------------------------------------------------------------
    // TEST 10: Real-time talking: Officer sends message, Student receives
    // -------------------------------------------------------------
    await test('Real-Time Talking: Officer emits response -> Student receives receive_message in real time', async () => {
      const studentReceivePromise = waitForEvent(studentSocket, 'receive_message');
      const officerMsgText = 'We have dispatched maintenance technicians to inspect the 3rd floor valve.';

      const ack = await new Promise((resolve) => {
        officerSocket.emit('send_message', {
          ticketId: grievance1.ticketId,
          message: officerMsgText
        }, resolve);
      });
      assert.strictEqual(ack.success, true);

      const received = await studentReceivePromise;
      assert.strictEqual(received.ticketId, grievance1.ticketId);
      assert.strictEqual(received.message, officerMsgText);
      assert.strictEqual(received.sender.id, officer._id.toString());
      assert.strictEqual(received.sender.role, 'officer');
    });

    // -------------------------------------------------------------
    // TEST 11: Real-time typing indicators
    // -------------------------------------------------------------
    await test('Real-time typing indicator: typing_start and typing_stop broadcast to ticket room', async () => {
      const typingStartPromise = waitForEvent(officerSocket, 'user_typing');
      studentSocket.emit('typing_start', { ticketId: grievance1.ticketId });

      const typingData = await typingStartPromise;
      assert.strictEqual(typingData.userId, student1._id.toString());
      assert.strictEqual(typingData.ticketId, grievance1.ticketId);

      const typingStopPromise = waitForEvent(officerSocket, 'user_stop_typing');
      studentSocket.emit('typing_stop', { ticketId: grievance1.ticketId });

      const stopData = await typingStopPromise;
      assert.strictEqual(stopData.userId, student1._id.toString());
      assert.strictEqual(stopData.ticketId, grievance1.ticketId);
    });

    // -------------------------------------------------------------
    // TEST 12: Visibility control - Internal staff notes
    // -------------------------------------------------------------
    await test('Visibility Control: Internal staff notes are received by Admin/Officer, NEVER by Student', async () => {
      // Admin joins ticket room
      await new Promise((resolve) => {
        adminSocket.emit('join_ticket', { ticketId: grievance1.ticketId }, resolve);
      });

      let studentReceived = false;
      const studentListener = (msg) => {
        if (msg.message && msg.message.includes('Internal Note')) studentReceived = true;
      };
      studentSocket.on('receive_message', studentListener);

      const adminReceivePromise = waitForEvent(adminSocket, 'receive_message');

      const ack = await new Promise((resolve) => {
        officerSocket.emit('send_message', {
          ticketId: grievance1.ticketId,
          message: 'Internal Note: Plumber confirmed main valve was shut by construction crew.',
          visibility: 'internal'
        }, resolve);
      });
      assert.strictEqual(ack.success, true);

      const adminMsg = await adminReceivePromise;
      assert.strictEqual(adminMsg.visibility, 'internal');
      assert.ok(adminMsg.message.includes('Internal Note'));

      // Give a brief window to confirm student socket never received it
      await new Promise((res) => setTimeout(res, 200));
      studentSocket.off('receive_message', studentListener);
      assert.strictEqual(studentReceived, false, 'Student must not receive internal staff notes!');
    });

    // -------------------------------------------------------------
    // TEST 13: Student cannot post internal notes (forced to public)
    // -------------------------------------------------------------
    await test('Security: Student attempting to post visibility: internal is forced to public', async () => {
      const officerReceivePromise = waitForEvent(officerSocket, 'receive_message');

      const ack = await new Promise((resolve) => {
        studentSocket.emit('send_message', {
          ticketId: grievance1.ticketId,
          message: 'Student trying to hide note',
          visibility: 'internal'
        }, resolve);
      });
      assert.strictEqual(ack.success, true);
      assert.strictEqual(ack.message.visibility, 'public');

      const received = await officerReceivePromise;
      assert.strictEqual(received.visibility, 'public');
    });

    // -------------------------------------------------------------
    // TEST 14: Real-time In-App Notifications
    // -------------------------------------------------------------
    await test('Real-Time Notifications: Recipient receives new_notification event and notification is saved', async () => {
      const notifPromise = waitForEvent(officerSocket, 'new_notification');

      const ack = await new Promise((resolve) => {
        studentSocket.emit('send_message', {
          ticketId: grievance1.ticketId,
          message: 'Can you please provide an estimated time for restoration?'
        }, resolve);
      });
      assert.strictEqual(ack.success, true);

      const notifData = await notifPromise;
      assert.strictEqual(notifData.ticketId, grievance1.ticketId);
      assert.ok(notifData.title.includes(grievance1.ticketId));

      const savedNotif = await Notification.findById(notifData.id);
      assert.ok(savedNotif);
      assert.strictEqual(savedNotif.recipient.toString(), officer._id.toString());
      assert.strictEqual(savedNotif.type, 'new_message');
    });

    // -------------------------------------------------------------
    // TEST 15: REST endpoint GET /api/messages/grievances/:id
    // -------------------------------------------------------------
    await test('REST API: GET /api/messages/grievances/:id returns message history', async () => {
      // Officer queries history
      const officerRes = await makeRequest('GET', `/api/messages/grievances/${grievance1.ticketId}`, null, officerToken);
      assert.strictEqual(officerRes.status, 200);
      assert.strictEqual(officerRes.data.success, true);
      assert.ok(officerRes.data.count >= 4);

      // Student queries history - internal notes should be excluded
      const studentRes = await makeRequest('GET', `/api/messages/grievances/${grievance1.ticketId}`, null, student1Token);
      assert.strictEqual(studentRes.status, 200);
      const studentInternalNotes = studentRes.data.messages.filter((m) => m.visibility === 'internal');
      assert.strictEqual(studentInternalNotes.length, 0, 'Internal notes must be hidden from student in REST endpoint');

      // Student 2 unauthorized access attempt
      const student2Res = await makeRequest('GET', `/api/messages/grievances/${grievance1.ticketId}`, null, student2Token);
      assert.strictEqual(student2Res.status, 403);
    });

    // -------------------------------------------------------------
    // TEST 16: REST endpoint POST /api/messages/grievances/:id broadcasts to sockets
    // -------------------------------------------------------------
    await test('REST API: POST /api/messages/grievances/:id broadcasts message to connected sockets', async () => {
      const studentReceivePromise = waitForEvent(studentSocket, 'receive_message');

      const postRes = await makeRequest(
        'POST',
        `/api/messages/grievances/${grievance1.ticketId}`,
        { message: 'Water tanker has arrived at Block C.' },
        officerToken
      );

      assert.strictEqual(postRes.status, 201);
      assert.strictEqual(postRes.data.success, true);

      const socketReceived = await studentReceivePromise;
      assert.strictEqual(socketReceived.message, 'Water tanker has arrived at Block C.');
    });

    // -------------------------------------------------------------
    // TEST 17: Notification REST endpoints
    // -------------------------------------------------------------
    await test('REST API: Notification endpoints (get, count, read, read-all)', async () => {
      const getRes = await makeRequest('GET', '/api/notifications', null, officerToken);
      assert.strictEqual(getRes.status, 200);
      assert.strictEqual(getRes.data.success, true);
      assert.ok(getRes.data.notifications.length > 0);

      const countRes = await makeRequest('GET', '/api/notifications/unread-count', null, officerToken);
      assert.strictEqual(countRes.status, 200);
      assert.ok(countRes.data.unreadCount > 0);

      const firstNotifId = getRes.data.notifications[0]._id;
      const readRes = await makeRequest('PATCH', `/api/notifications/${firstNotifId}/read`, null, officerToken);
      assert.strictEqual(readRes.status, 200);
      assert.strictEqual(readRes.data.notification.isRead, true);

      const readAllRes = await makeRequest('PATCH', '/api/notifications/read-all', null, officerToken);
      assert.strictEqual(readAllRes.status, 200);

      const afterCountRes = await makeRequest('GET', '/api/notifications/unread-count', null, officerToken);
      assert.strictEqual(afterCountRes.data.unreadCount, 0);
    });

    // -------------------------------------------------------------
    // TEST 18: Leave ticket room cleanly
    // -------------------------------------------------------------
    await test('User can leave ticket room cleanly and disconnect', async () => {
      const userLeftPromise = waitForEvent(studentSocket, 'user_left');
      officerSocket.emit('leave_ticket', { ticketId: grievance1.ticketId });

      const leftEvent = await userLeftPromise;
      assert.strictEqual(leftEvent.userId, officer._id.toString());
    });

  } finally {
    // Disconnect all sockets
    for (const s of activeSockets) {
      if (s.connected) s.disconnect();
    }

    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }

  console.log('\n===============================================================');
  console.log(`   WEBSOCKET & REAL-TIME TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
