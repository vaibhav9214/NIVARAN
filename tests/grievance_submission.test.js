const assert = require('node:assert');
const http = require('node:http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Grievance = require('../src/models/Grievance');

let server;
let baseUrl;

function makeRequest(method, reqPath, body = null, token = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(reqPath, baseUrl);
    const finalHeaders = { ...headers };

    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    let payload = body;
    if (body && typeof body === 'object' && !(body instanceof Buffer) && !finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    const req = http.request(
      url,
      {
        method,
        headers: finalHeaders
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

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

/**
 * Helper to construct multipart/form-data payload with file attachments
 */
function makeMultipartRequest(method, reqPath, fields = {}, files = [], token = null) {
  const boundary = `----WebKitFormBoundary${Date.now().toString(16)}`;
  const chunks = [];

  // Add form text fields
  for (const [key, value] of Object.entries(fields)) {
    chunks.push(
      Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="${key}"\r\n\r\n` +
        `${value}\r\n`
      )
    );
  }

  // Add file attachments
  for (const f of files) {
    chunks.push(
      Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="${f.fieldName || 'attachments'}"; filename="${f.filename}"\r\n` +
        `Content-Type: ${f.mimetype}\r\n\r\n`
      )
    );
    chunks.push(Buffer.isBuffer(f.content) ? f.content : Buffer.from(f.content));
    chunks.push(Buffer.from('\r\n'));
  }

  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  const fullBuffer = Buffer.concat(chunks);

  return makeRequest(method, reqPath, fullBuffer, token, {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': fullBuffer.length
  });
}

async function runTests() {
  console.log('--- Starting NIVARAN Grievance Submission Test Suite ---\n');

  await connectDB();

  server = app.listen(0);
  const port = server.address().port;
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
      console.error(err.message);
      failed++;
    }
  }

  // Authenticate student
  let studentToken;
  let studentUser;
  const studentLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'student@nivaran.edu',
    password: 'Student@123'
  });
  assert.strictEqual(studentLogin.status, 200, 'Student login must succeed');
  studentToken = studentLogin.data.token;
  studentUser = studentLogin.data.user;

  // Fetch valid department
  const hostelDept = await Department.findOne({ code: 'HOSTEL' });
  assert(hostelDept, 'Hostel department must exist');

  // 1. Validation tests
  await test('Reject grievance with missing or short title (< 5 characters)', async () => {
    const res = await makeRequest('POST', '/api/student/complaints', {
      title: 'Bad',
      category: 'Infrastructure',
      department: hostelDept._id.toString(),
      description: 'The water cooler in block A is leaking heavily.'
    }, studentToken);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Title is required and must be at least 5 characters'));
  });

  await test('Reject grievance with missing category', async () => {
    const res = await makeRequest('POST', '/api/student/complaints', {
      title: 'Water cooler leaking in hostel',
      category: '',
      department: hostelDept._id.toString(),
      description: 'The water cooler in block A is leaking heavily.'
    }, studentToken);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Category is required'));
  });

  await test('Reject grievance with invalid or non-existent department', async () => {
    const fakeDeptId = new mongoose.Types.ObjectId().toString();
    const res = await makeRequest('POST', '/api/student/complaints', {
      title: 'Water cooler leaking in hostel',
      category: 'Infrastructure',
      department: fakeDeptId,
      description: 'The water cooler in block A is leaking heavily.'
    }, studentToken);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('department does not exist'));
  });

  await test('Reject grievance with short description (< 10 characters)', async () => {
    const res = await makeRequest('POST', '/api/student/complaints', {
      title: 'Water cooler leaking in hostel',
      category: 'Infrastructure',
      department: hostelDept._id.toString(),
      description: 'Too short'
    }, studentToken);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Description is required and must be at least 10 characters'));
  });

  // 2. Secure file upload validation
  await test('Reject dangerous executable file types (.exe, .sh, .bat)', async () => {
    const res = await makeMultipartRequest(
      'POST',
      '/api/student/complaints',
      {
        title: 'Malicious file upload test',
        category: 'Infrastructure',
        department: hostelDept._id.toString(),
        description: 'Attempting to upload executable scripts.'
      },
      [
        {
          filename: 'malware.exe',
          mimetype: 'application/x-msdownload',
          content: 'MZ9000ExecutableMock'
        }
      ],
      studentToken
    );

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('not permitted'));
  });

  // 3. Successful submission with valid supporting files
  let submittedTicketId;
  let submittedGrievanceId;
  await test('Submit grievance with valid fields and secure document upload', async () => {
    const res = await makeMultipartRequest(
      'POST',
      '/api/student/complaints',
      {
        title: 'Broken ceiling fan in room 302',
        category: 'Infrastructure',
        department: hostelDept._id.toString(),
        description: 'The ceiling fan in hostel room 302 makes heavy rattling noise and sparks occasionally.',
        priority: 'High'
      },
      [
        {
          filename: 'photo_evidence.png',
          mimetype: 'image/png',
          content: Buffer.from('FakePNGImageBinaryData12345')
        },
        {
          filename: 'room_report.pdf',
          mimetype: 'application/pdf',
          content: Buffer.from('%PDF-1.4 FakePDFDocumentContents')
        }
      ],
      studentToken
    );

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.message, 'Grievance submitted successfully.');

    // 4. Display a submission confirmation
    const confirmation = res.data.confirmation;
    assert(confirmation, 'Confirmation object must be returned');
    assert(confirmation.ticketId, 'Real ticket ID must be generated');
    assert.strictEqual(confirmation.status, 'Submitted');
    assert.strictEqual(confirmation.title, 'Broken ceiling fan in room 302');
    assert.strictEqual(confirmation.department, hostelDept.name);
    assert.strictEqual(confirmation.attachmentCount, 2);
    assert(confirmation.submittedAt, 'Submission timestamp present');

    // 5. Unique Ticket ID format check
    assert(/^NIV-\d{8}-[A-Z0-9]+$/.test(confirmation.ticketId), `Ticket ID must match NIV-YYYYMMDD-XXXX: ${confirmation.ticketId}`);

    submittedTicketId = confirmation.ticketId;
    submittedGrievanceId = res.data.grievance._id;

    // 6. Verify saved in MongoDB
    const savedInDb = await Grievance.findOne({ ticketId: submittedTicketId });
    assert(savedInDb, 'Grievance record must exist in MongoDB');
    assert.strictEqual(savedInDb.student.toString(), studentUser.id);
    assert.strictEqual(savedInDb.title, 'Broken ceiling fan in room 302');
    assert.strictEqual(savedInDb.attachments.length, 2);
    assert(fs.existsSync(savedInDb.attachments[0].path), 'Uploaded attachment file must exist on disk');
  });

  // 7. Checkpoint: Retrieve the record after submission (retrieving the record)
  await test('CHECKPOINT: Student can retrieve the saved grievance by Ticket ID', async () => {
    const res = await makeRequest('GET', `/api/student/complaints/${submittedTicketId}`, null, studentToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.grievance.ticketId, submittedTicketId);
    assert.strictEqual(res.data.grievance.title, 'Broken ceiling fan in room 302');
    assert.strictEqual(res.data.grievance.status, 'Submitted');
    assert.strictEqual(res.data.grievance.department.code, 'HOSTEL');
  });

  await test('CHECKPOINT: Student can retrieve the grievance in their complaint list', async () => {
    const res = await makeRequest('GET', '/api/student/complaints', null, studentToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(Array.isArray(res.data.complaints));

    const found = res.data.complaints.find((c) => c.ticketId === submittedTicketId);
    assert(found, 'Newly submitted grievance ticket must be present in student complaint list');
    assert.strictEqual(found.title, 'Broken ceiling fan in room 302');
  });

  await test('Another student cannot retrieve this grievance (isolated access)', async () => {
    // Register another student
    const otherEmail = `other_student_${Date.now()}@nivaran.edu`;
    const regRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Other Student',
      email: otherEmail,
      password: 'Password@123',
      role: 'student'
    });
    const otherToken = regRes.data.token;

    const res = await makeRequest('GET', `/api/student/complaints/${submittedTicketId}`, null, otherToken);
    assert.strictEqual(res.status, 404, 'Must return 404 for unpermitted student attempting to view grievance');
  });

  server.close();
  await mongoose.connection.close();

  console.log(`\n--- Test Results: ${passed} passed, ${failed} failed ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(async (err) => {
  console.error('Fatal test error:', err);
  if (server) server.close();
  try {
    await mongoose.connection.close();
  } catch {}
  process.exit(1);
});
