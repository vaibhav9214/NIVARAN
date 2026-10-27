const assert = require('node:assert');
const http = require('node:http');
const mongoose = require('mongoose');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

let server;
let baseUrl;

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

async function runTests() {
  console.log('--- Starting NIVARAN Auth & RBAC Test Suite (MongoDB) ---\n');

  // Connect to MongoDB
  await connectDB();

  // Start test server on ephemeral port
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

  // 1. Seeded accounts validation
  await test('Default seeded accounts exist in MongoDB and passwords are validly hashed', async () => {
    const adminUser = await User.findOne({ email: 'admin@nivaran.edu' });
    assert(adminUser, 'Admin user should be seeded');
    assert(adminUser.password !== 'Admin@123', 'Password must NOT be stored in plain text');
    assert(adminUser.password.startsWith('$2'), 'Password must be a bcrypt hash');
    assert(bcrypt.compareSync('Admin@123', adminUser.password), 'Password hash must verify with bcrypt');
  });

  // 2. Registration
  const testStudentEmail = `test_student_${Date.now()}@nivaran.edu`;
  let studentToken = null;
  let studentUser = null;

  await test('User registration creates user in MongoDB and returns JWT token', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'Test Student',
      email: testStudentEmail,
      password: 'Password@123',
      role: 'student'
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert(res.data.token, 'Token must be returned');
    assert.strictEqual(res.data.user.role, 'student');
    studentToken = res.data.token;
    studentUser = res.data.user;
  });

  await test('SECURITY: Public registration strictly ignores client-supplied role: admin and creates student account', async () => {
    const maliciousEmail = `attacker_${Date.now()}@test.edu`;
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'Attacker User',
      email: maliciousEmail,
      password: 'Password@123',
      role: 'admin' // Attempting to self-register as admin
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.user.role, 'student', 'Role MUST be forced to student');
    assert.strictEqual(res.data.user.status, 'active');

    // Verify token issued is for student role
    const attackerToken = res.data.token;
    const adminApiCheck = await makeRequest('GET', '/api/admin/dashboard', null, attackerToken);
    assert.strictEqual(adminApiCheck.status, 403, 'Attacker cannot access admin API');
  });

  await test('Duplicate registration is rejected with 409', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'Duplicate Student',
      email: testStudentEmail,
      password: 'Password@123'
    });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  // 3. Login
  await test('Student login with valid credentials succeeds and returns JWT', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: testStudentEmail,
      password: 'Password@123'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.token, 'Token returned on login');
    assert.strictEqual(res.data.user.email, testStudentEmail);
  });

  await test('Login with incorrect password fails with 401 Unauthorized', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: testStudentEmail,
      password: 'WrongPassword'
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  // 4. Unauthenticated access to protected routes
  await test('Accessing protected route without token returns 401 Unauthorized', async () => {
    const res = await makeRequest('GET', '/api/student/dashboard');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  // 5. Checkpoint: Student role permissions & access restriction
  await test('Student can access student portal APIs', async () => {
    const res = await makeRequest('GET', '/api/student/dashboard', null, studentToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.portal, 'student');
  });

  await test('CHECKPOINT: Student CANNOT access Officer API (403 Forbidden)', async () => {
    const res = await makeRequest('GET', '/api/officer/dashboard', null, studentToken);
    assert.strictEqual(res.status, 403, 'Must return 403 Forbidden for student accessing officer API');
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Insufficient permissions'), 'Error message specifies permission failure');
  });

  await test('CHECKPOINT: Student CANNOT access Admin API (403 Forbidden)', async () => {
    const res = await makeRequest('GET', '/api/admin/dashboard', null, studentToken);
    assert.strictEqual(res.status, 403, 'Must return 403 Forbidden for student accessing admin API');
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Insufficient permissions'), 'Error message specifies permission failure');
  });

  // 6. Officer role permissions & access restriction
  let officerToken = null;
  await test('Officer login succeeds', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'officer@nivaran.edu',
      password: 'Officer@123'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.user.role, 'officer');
    officerToken = res.data.token;
  });

  await test('Officer can access Officer API', async () => {
    const res = await makeRequest('GET', '/api/officer/dashboard', null, officerToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.portal, 'officer');
  });

  await test('CHECKPOINT: Officer CANNOT access Admin API (403 Forbidden)', async () => {
    const res = await makeRequest('GET', '/api/admin/dashboard', null, officerToken);
    assert.strictEqual(res.status, 403, 'Must return 403 Forbidden for officer accessing admin API');
    assert.strictEqual(res.data.success, false);
  });

  // 7. Administrator role permissions
  let adminToken = null;
  await test('Administrator login succeeds', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@nivaran.edu',
      password: 'Admin@123'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.user.role, 'admin');
    adminToken = res.data.token;
  });

  await test('Administrator can access Admin dashboard and user management in MongoDB', async () => {
    const res = await makeRequest('GET', '/api/admin/dashboard', null, adminToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.portal, 'admin');
    assert.strictEqual(res.data.stats.database, 'MongoDB');

    const usersRes = await makeRequest('GET', '/api/admin/users', null, adminToken);
    assert.strictEqual(usersRes.status, 200);
    assert(Array.isArray(usersRes.data.users), 'Users list returned');
  });

  await test('SECURITY: Unauthenticated or student users cannot access POST /api/admin/admins', async () => {
    const unauthRes = await makeRequest('POST', '/api/admin/admins', {
      name: 'Hacked Admin',
      email: 'hacked_admin@test.edu',
      password: 'Password@123'
    });
    assert.strictEqual(unauthRes.status, 401, 'Must require authentication');

    const studentAttemptRes = await makeRequest('POST', '/api/admin/admins', {
      name: 'Hacked Admin',
      email: 'hacked_admin@test.edu',
      password: 'Password@123'
    }, studentToken);
    assert.strictEqual(studentAttemptRes.status, 403, 'Student must be rejected with 403 Forbidden');
  });

  await test('SECURITY: Administrator can create a new admin through protected administrative process', async () => {
    const newAdminEmail = `sec_admin_${Date.now()}@nivaran.edu`;
    const res = await makeRequest('POST', '/api/admin/admins', {
      name: 'Second Admin',
      email: newAdminEmail,
      password: 'Admin@123'
    }, adminToken);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.admin.role, 'admin');

    // Verify newly created admin can log in and access admin routes
    const newAdminLogin = await makeRequest('POST', '/api/auth/login', {
      email: newAdminEmail,
      password: 'Admin@123'
    });
    assert.strictEqual(newAdminLogin.status, 200);
    const newAdminCheck = await makeRequest('GET', '/api/admin/dashboard', null, newAdminLogin.data.token);
    assert.strictEqual(newAdminCheck.status, 200);
  });

  await test('SECURITY: Administrator can assign admin role to an existing user through protected process', async () => {
    const promoRes = await makeRequest('PATCH', `/api/admin/users/${studentUser.id}/role`, {
      role: 'admin'
    }, adminToken);
    assert.strictEqual(promoRes.status, 200);
    assert.strictEqual(promoRes.data.user.role, 'admin');

    // Demote back to student to preserve test isolation
    await makeRequest('PATCH', `/api/admin/users/${studentUser.id}/role`, {
      role: 'student'
    }, adminToken);
  });

  // 8. Security tampering test: Client modifying token payload (forgery)
  await test('Tampered JWT token with forged admin role is rejected (401 Unauthorized)', async () => {
    const parts = studentToken.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    payload.role = 'admin'; // Attacker attempts to modify role in JWT
    const forgedPayloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const forgedToken = `${parts[0]}.${forgedPayloadBase64}.${parts[2]}`;

    const res = await makeRequest('GET', '/api/admin/dashboard', null, forgedToken);
    assert.strictEqual(res.status, 401, 'Tampered token signature must fail verification');
    assert.strictEqual(res.data.success, false);
  });

  // 9. Single-device Logout vs All-devices Logout
  await test('Single-device logout revokes only the current device token in MongoDB', async () => {
    // Generate two sessions for student (Device A and Device B)
    const loginA = await makeRequest('POST', '/api/auth/login', {
      email: testStudentEmail,
      password: 'Password@123'
    });
    const loginB = await makeRequest('POST', '/api/auth/login', {
      email: testStudentEmail,
      password: 'Password@123'
    });

    const tokenA = loginA.data.token;
    const tokenB = loginB.data.token;

    // Both work initially
    const checkA1 = await makeRequest('GET', '/api/student/dashboard', null, tokenA);
    const checkB1 = await makeRequest('GET', '/api/student/dashboard', null, tokenB);
    assert.strictEqual(checkA1.status, 200, 'Device A initial access');
    assert.strictEqual(checkB1.status, 200, 'Device B initial access');

    // Logout from Device A only
    const logoutRes = await makeRequest('POST', '/api/auth/logout', null, tokenA);
    assert.strictEqual(logoutRes.status, 200);
    assert.strictEqual(logoutRes.data.success, true);
    assert(logoutRes.data.message.includes('this device'));

    // Token A should now be revoked (401)
    const checkA2 = await makeRequest('GET', '/api/student/dashboard', null, tokenA);
    assert.strictEqual(checkA2.status, 401, 'Device A token must be revoked');
    assert(checkA2.data.message.includes('revoked'));

    // Token B on Device B must STILL work
    const checkB2 = await makeRequest('GET', '/api/student/dashboard', null, tokenB);
    assert.strictEqual(checkB2.status, 200, 'Device B token must remain active after single logout');
  });

  await test('Logout from all devices invalidates all existing sessions across every device in MongoDB', async () => {
    // Login to get Device 1 and Device 2 tokens
    const login1 = await makeRequest('POST', '/api/auth/login', {
      email: testStudentEmail,
      password: 'Password@123'
    });
    const login2 = await makeRequest('POST', '/api/auth/login', {
      email: testStudentEmail,
      password: 'Password@123'
    });

    const token1 = login1.data.token;
    const token2 = login2.data.token;

    // Call logout-all using Device 1
    const logoutAllRes = await makeRequest('POST', '/api/auth/logout-all', null, token1);
    assert.strictEqual(logoutAllRes.status, 200);
    assert.strictEqual(logoutAllRes.data.success, true);
    assert(logoutAllRes.data.message.includes('all devices'));

    // Both Token 1 and Token 2 must now be rejected
    const check1 = await makeRequest('GET', '/api/student/dashboard', null, token1);
    assert.strictEqual(check1.status, 401, 'Device 1 token must be invalid after logout-all');

    const check2 = await makeRequest('GET', '/api/student/dashboard', null, token2);
    assert.strictEqual(check2.status, 401, 'Device 2 token must be invalid after logout-all');

    // New login after logout-all receives updated tokenVersion and works normally
    const freshLogin = await makeRequest('POST', '/api/auth/login', {
      email: testStudentEmail,
      password: 'Password@123'
    });
    assert.strictEqual(freshLogin.status, 200);
    const freshToken = freshLogin.data.token;
    const freshCheck = await makeRequest('GET', '/api/student/dashboard', null, freshToken);
    assert.strictEqual(freshCheck.status, 200, 'Fresh token after logout-all works');
  });

  // Cleanup
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
