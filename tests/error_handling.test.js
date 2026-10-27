const assert = require('node:assert');
const http = require('node:http');
const mongoose = require('mongoose');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Grievance = require('../src/models/Grievance');

let server;
let baseUrl;

function makeRawRequest(method, reqPath, rawBody = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(reqPath, baseUrl);
    const finalHeaders = { ...headers };

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

    if (rawBody) {
      req.write(rawBody);
    }
    req.end();
  });
}

function makeRequest(method, reqPath, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return makeRawRequest(method, reqPath, body ? JSON.stringify(body) : null, headers);
}

async function runErrorHandlingAudit() {
  console.log('===============================================================');
  console.log('   NIVARAN COMPREHENSIVE ERROR HANDLING & SECURITY AUDIT       ');
  console.log('===============================================================\n');

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
      console.error('       Error:', err.message);
      failed++;
    }
  }

  // Helper logins
  const studentLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'student@nivaran.edu',
    password: 'Student@123'
  });
  assert.strictEqual(studentLogin.status, 200);
  const studentToken = studentLogin.data.token;

  const officerLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'officer@nivaran.edu',
    password: 'Officer@123'
  });
  assert.strictEqual(officerLogin.status, 200);
  const officerToken = officerLogin.data.token;

  const adminLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@nivaran.edu',
    password: 'Admin@123'
  });
  assert.strictEqual(adminLogin.status, 200);
  const adminToken = adminLogin.data.token;

  // ------------------------------------------------------------------------
  // 1. ROUTING & CATCH-ALL 404 ERRORS
  // ------------------------------------------------------------------------
  await test('Error 404: Unknown root API route returns clean JSON 404', async () => {
    const res = await makeRequest('GET', '/api/non-existent-endpoint');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('not found'));
  });

  await test('Error 404: Authenticated user accessing unknown nested subpath returns clean 404', async () => {
    const res = await makeRequest('POST', '/api/student/invalid/subpath/action', {}, studentToken);
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('not found'));
  });

  await test('Error 401: Unauthenticated request to protected nested subpath is blocked with 401', async () => {
    const res = await makeRequest('POST', '/api/student/invalid/subpath/action', {});
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  // ------------------------------------------------------------------------
  // 2. PARSER & MALFORMED PAYLOAD (400) ERRORS
  // ------------------------------------------------------------------------
  await test('Error 400: Malformed JSON syntax in request body is caught and returns 400', async () => {
    const res = await makeRawRequest('POST', '/api/auth/login', '{"email": "broken-json', {
      'Content-Type': 'application/json'
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Malformed JSON') || res.data.message.includes('JSON'));
  });

  // ------------------------------------------------------------------------
  // 3. AUTHENTICATION (401) ERRORS
  // ------------------------------------------------------------------------
  await test('Error 401: Accessing protected student endpoint with no token', async () => {
    const res = await makeRequest('GET', '/api/student/complaints');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.message, 'Authentication required. No token provided.');
  });

  await test('Error 401: Accessing protected route with completely invalid token string', async () => {
    const res = await makeRequest('GET', '/api/student/complaints', null, 'this-is-not-a-valid-jwt');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Invalid or expired authentication token'));
  });

  await test('Error 401: Accessing protected route with forged signature token', async () => {
    const forgedToken = studentToken.slice(0, -6) + 'ABCDEF';
    const res = await makeRequest('GET', '/api/student/dashboard', null, forgedToken);
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Invalid or expired'));
  });

  await test('Error 400: Login fails when email is missing', async () => {
    const res = await makeRequest('POST', '/api/auth/login', { password: 'SomePassword123' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.message, 'Email and password are required.');
  });

  await test('Error 400: Login fails when password is missing', async () => {
    const res = await makeRequest('POST', '/api/auth/login', { email: 'student@nivaran.edu' });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.message, 'Email and password are required.');
  });

  await test('Error 401: Login fails with non-existent user email', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'nonexistent_user_99999@test.edu',
      password: 'Password@123'
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.message, 'Invalid email or password.');
  });

  await test('Error 401: Login fails with wrong password for existing user', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'student@nivaran.edu',
      password: 'IncorrectPassword!@#'
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.message, 'Invalid email or password.');
  });

  await test('Error 401: Revoked token on single-device logout cannot be reused', async () => {
    const freshLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'student@nivaran.edu',
      password: 'Student@123'
    });
    const tempToken = freshLogin.data.token;

    // Logout
    const logoutRes = await makeRequest('POST', '/api/auth/logout', null, tempToken);
    assert.strictEqual(logoutRes.status, 200);

    // Reuse logged-out token
    const reuseRes = await makeRequest('GET', '/api/student/dashboard', null, tempToken);
    assert.strictEqual(reuseRes.status, 401);
    assert.strictEqual(reuseRes.data.success, false);
    assert(reuseRes.data.message.includes('Token has been revoked'));
  });

  // ------------------------------------------------------------------------
  // 4. REGISTRATION VALIDATION (400 & 409) ERRORS
  // ------------------------------------------------------------------------
  await test('Error 400: Registration missing name field', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      email: `valid_${Date.now()}@test.edu`,
      password: 'Password@123'
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('required fields'));
  });

  await test('Error 400: Registration with invalid email format', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'John Doe',
      email: 'not-an-email',
      password: 'Password@123'
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('valid email'));
  });

  await test('Error 400: Registration with short password (< 6 chars)', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'John Doe',
      email: `valid_${Date.now()}@test.edu`,
      password: '123'
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('at least 6 characters'));
  });

  await test('Error 409: Duplicate email registration returns Conflict 409', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'Duplicate Student',
      email: 'student@nivaran.edu',
      password: 'Password@123'
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('already exists'));
  });

  // ------------------------------------------------------------------------
  // 5. ROLE-BASED ACCESS CONTROL (403) ERRORS
  // ------------------------------------------------------------------------
  await test('Error 403: Student blocked from Officer dashboard', async () => {
    const res = await makeRequest('GET', '/api/officer/dashboard', null, studentToken);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.message, 'Access denied. Insufficient permissions.');
    assert.strictEqual(res.data.currentRole, 'student');
  });

  await test('Error 403: Student blocked from Admin dashboard', async () => {
    const res = await makeRequest('GET', '/api/admin/dashboard', null, studentToken);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.message, 'Access denied. Insufficient permissions.');
  });

  await test('Error 403: Student blocked from Admin user management', async () => {
    const res = await makeRequest('GET', '/api/admin/users', null, studentToken);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.success, false);
  });

  await test('Error 403: Officer blocked from Admin dashboard', async () => {
    const res = await makeRequest('GET', '/api/admin/dashboard', null, officerToken);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.success, false);
    assert.strictEqual(res.data.currentRole, 'officer');
  });

  await test('Error 403: Deactivated account is blocked with 403 Forbidden', async () => {
    const tempEmail = `deact_${Date.now()}@test.edu`;
    const regRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Temp User',
      email: tempEmail,
      password: 'Password@123'
    });
    const tempUserToken = regRes.data.token;
    const tempUserId = regRes.data.user.id;

    await makeRequest('PATCH', `/api/admin/users/${tempUserId}/status`, { status: 'inactive' }, adminToken);

    const checkRes = await makeRequest('GET', '/api/student/dashboard', null, tempUserToken);
    assert([401, 403].includes(checkRes.status), 'Deactivated user token must be denied');

    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: tempEmail,
      password: 'Password@123'
    });
    assert.strictEqual(loginRes.status, 403);
    assert(loginRes.data.message.includes('deactivated'));
  });

  // ------------------------------------------------------------------------
  // 6. GRIEVANCE & DEPARTMENT VALIDATION (400, 404, 409) ERRORS
  // ------------------------------------------------------------------------
  await test('Error 400: Grievance submission with short title', async () => {
    const res = await makeRequest('POST', '/api/student/complaints', {
      title: 'Hi',
      category: 'General',
      department: 'HOSTEL',
      description: 'Valid description that is longer than ten characters'
    }, studentToken);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Title is required and must be at least 5 characters'));
  });

  await test('Error 400: Grievance submission with missing category', async () => {
    const res = await makeRequest('POST', '/api/student/complaints', {
      title: 'Valid Grievance Title',
      category: '',
      department: 'HOSTEL',
      description: 'Valid description that is longer than ten characters'
    }, studentToken);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Category is required'));
  });

  await test('Error 400: Grievance submission with invalid department identifier', async () => {
    const res = await makeRequest('POST', '/api/student/complaints', {
      title: 'Valid Grievance Title',
      category: 'Infrastructure',
      department: 'NON_EXISTENT_DEPT_XYZ',
      description: 'Valid description that is longer than ten characters'
    }, studentToken);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('department does not exist'));
  });

  await test('Error 400: Grievance submission with short description (< 10 chars)', async () => {
    const res = await makeRequest('POST', '/api/student/complaints', {
      title: 'Valid Grievance Title',
      category: 'Infrastructure',
      department: 'HOSTEL',
      description: 'Short'
    }, studentToken);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Description is required and must be at least 10 characters'));
  });

  await test('Error 404: Querying non-existent grievance ticket ID returns 404', async () => {
    const res = await makeRequest('GET', '/api/student/complaints/NIV-99999999-XXXX', null, studentToken);
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('not found'));
  });

  await test('Error 409: Duplicate department code creation is rejected with 409', async () => {
    const res = await makeRequest('POST', '/api/admin/departments', {
      name: `Duplicate Dept ${Date.now()}`,
      code: 'HOSTEL',
      description: 'Attempting duplicate code'
    }, adminToken);
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('already exists'));
  });

  await test('Error 400: Updating department with malformed ObjectId returns 400', async () => {
    const res = await makeRequest('PATCH', '/api/admin/departments/not-a-valid-object-id', {
      description: 'Updated'
    }, adminToken);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Invalid department ID'));
  });

  await test('Error 404: Updating non-existent department returns 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await makeRequest('PATCH', `/api/admin/departments/${fakeId}`, {
      description: 'Updated'
    }, adminToken);
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('not found'));
  });

  server.close();
  await mongoose.connection.close();

  console.log(`\n===============================================================`);
  console.log(`   ERROR AUDIT RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`===============================================================`);
  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runErrorHandlingAudit().catch(async (err) => {
  console.error('Fatal audit failure:', err);
  if (server) server.close();
  try {
    await mongoose.connection.close();
  } catch {}
  process.exit(1);
});

