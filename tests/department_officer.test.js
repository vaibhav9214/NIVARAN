const assert = require('node:assert');
const http = require('node:http');
const mongoose = require('mongoose');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Department = require('../src/models/Department');

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
  console.log('--- Starting NIVARAN Department & Officer Management Test Suite ---\n');

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

  // Get Admin Token for administrative actions
  let adminToken;
  const adminLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@nivaran.edu',
    password: 'Admin@123'
  });
  assert.strictEqual(adminLogin.status, 200, 'Admin login must succeed');
  adminToken = adminLogin.data.token;

  // 1. Create and edit departments
  let createdDeptId;
  const uniqueCode = `LIB_${Date.now()}`;
  await test('Admin can create a new department', async () => {
    const res = await makeRequest('POST', '/api/admin/departments', {
      name: `Library & Digital Services ${Date.now()}`,
      code: uniqueCode,
      description: 'Central library, e-resources, and study rooms.'
    }, adminToken);

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert(res.data.department._id, 'Department ID returned');
    assert.strictEqual(res.data.department.code, uniqueCode);
    createdDeptId = res.data.department._id;
  });

  await test('Reject duplicate department code', async () => {
    const res = await makeRequest('POST', '/api/admin/departments', {
      name: `Another Library ${Date.now()}`,
      code: uniqueCode,
      description: 'Duplicate code test.'
    }, adminToken);

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.data.success, false);
  });

  await test('Admin can edit an existing department', async () => {
    const res = await makeRequest('PATCH', `/api/admin/departments/${createdDeptId}`, {
      description: 'Updated description: 24/7 central library access.'
    }, adminToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.department.description, 'Updated description: 24/7 central library access.');
  });

  // 2. Create officer accounts directly by Admin
  let adminCreatedOfficerId;
  const officerEmail = `officer_lib_${Date.now()}@nivaran.edu`;
  await test('Admin can directly create an active officer assigned to a department', async () => {
    const res = await makeRequest('POST', '/api/admin/officers', {
      name: 'Library In-Charge Officer',
      email: officerEmail,
      password: 'Officer@123',
      department: createdDeptId,
      status: 'active',
      caseAccessConfig: {
        accessScope: 'department',
        assignedCategories: ['Books', 'WiFi'],
        canHandleEscalated: true
      }
    }, adminToken);

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.officer.role, 'officer');
    assert.strictEqual(res.data.officer.status, 'active');
    assert.strictEqual(res.data.officer.department.toString(), createdDeptId.toString());
    adminCreatedOfficerId = res.data.officer.id;
  });

  // 3. Officer registration & Admin approval workflow
  const selfOfficerEmail = `pending_officer_${Date.now()}@nivaran.edu`;
  let pendingOfficerId;

  await test('Self-registered officer account is set to pending approval', async () => {
    const regRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Dr. Ramesh Kumar',
      email: selfOfficerEmail,
      password: 'Password@123',
      role: 'officer'
    });

    assert.strictEqual(regRes.status, 201);
    assert.strictEqual(regRes.data.user.status, 'pending');
    pendingOfficerId = regRes.data.user.id;
  });

  await test('Pending officer cannot log in until approved', async () => {
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: selfOfficerEmail,
      password: 'Password@123'
    });

    assert.strictEqual(loginRes.status, 403);
    assert(loginRes.data.message.includes('pending administrator approval'));
  });

  await test('Admin can view pending officers and approve the officer account', async () => {
    const pendingListRes = await makeRequest('GET', '/api/admin/officers/pending', null, adminToken);
    assert.strictEqual(pendingListRes.status, 200);
    assert(Array.isArray(pendingListRes.data.pendingOfficers));

    const approveRes = await makeRequest('PATCH', `/api/admin/officers/${pendingOfficerId}/approve`, {
      departmentId: createdDeptId
    }, adminToken);

    assert.strictEqual(approveRes.status, 200);
    assert.strictEqual(approveRes.data.officer.status, 'active');
    assert.strictEqual(approveRes.data.officer.department.toString(), createdDeptId.toString());

    // Officer can now successfully log in
    const approvedLogin = await makeRequest('POST', '/api/auth/login', {
      email: selfOfficerEmail,
      password: 'Password@123'
    });
    assert.strictEqual(approvedLogin.status, 200);
    assert(approvedLogin.data.token, 'Token issued to approved officer');
  });

  // 4. Assign officers to departments
  await test('Admin can assign an officer to a department and verify persistence', async () => {
    // Get another department
    const acadDept = await Department.findOne({ code: 'ACAD' });
    assert(acadDept, 'ACAD department must exist');

    const assignRes = await makeRequest('PATCH', `/api/admin/officers/${pendingOfficerId}/department`, {
      departmentId: acadDept._id.toString()
    }, adminToken);

    assert.strictEqual(assignRes.status, 200);
    assert.strictEqual(assignRes.data.officer.department.toString(), acadDept._id.toString());

    // Verify in MongoDB
    const officerDoc = await User.findById(pendingOfficerId);
    assert.strictEqual(officerDoc.department.toString(), acadDept._id.toString());
  });

  // 5. Activate or deactivate accounts
  let officerSessionToken;
  await test('Admin can deactivate an account, immediately invalidating active tokens', async () => {
    // Login as the library officer to obtain an active token
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: officerEmail,
      password: 'Officer@123'
    });
    assert.strictEqual(loginRes.status, 200);
    officerSessionToken = loginRes.data.token;

    // Verify token works
    const checkBefore = await makeRequest('GET', '/api/officer/dashboard', null, officerSessionToken);
    assert.strictEqual(checkBefore.status, 200);

    // Deactivate account
    const deactRes = await makeRequest('PATCH', `/api/admin/users/${adminCreatedOfficerId}/status`, {
      status: 'inactive'
    }, adminToken);
    assert.strictEqual(deactRes.status, 200);
    assert.strictEqual(deactRes.data.user.status, 'inactive');

    // Token must now be rejected with 401/403
    const checkAfter = await makeRequest('GET', '/api/officer/dashboard', null, officerSessionToken);
    assert([401, 403].includes(checkAfter.status), 'Deactivated user token must be rejected');

    // Login attempt for deactivated account must be blocked
    const reLogin = await makeRequest('POST', '/api/auth/login', {
      email: officerEmail,
      password: 'Officer@123'
    });
    assert.strictEqual(reLogin.status, 403);
    assert(reLogin.data.message.includes('deactivated'));
  });

  await test('Admin can reactivate account and user can log in again', async () => {
    const reactRes = await makeRequest('PATCH', `/api/admin/users/${adminCreatedOfficerId}/status`, {
      status: 'active'
    }, adminToken);
    assert.strictEqual(reactRes.status, 200);
    assert.strictEqual(reactRes.data.user.status, 'active');

    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: officerEmail,
      password: 'Officer@123'
    });
    assert.strictEqual(loginRes.status, 200);
    assert(loginRes.data.token);
    officerSessionToken = loginRes.data.token;
  });

  // 6. Configure which officer can access which cases
  await test('Configure officer case access and enforce granular case access rules', async () => {
    // 6a: Configure officer with accessScope: 'department'
    const configRes = await makeRequest('PATCH', `/api/admin/officers/${adminCreatedOfficerId}/case-access`, {
      accessScope: 'department',
      canHandleEscalated: false
    }, adminToken);
    assert.strictEqual(configRes.status, 200);
    assert.strictEqual(configRes.data.caseAccessConfig.accessScope, 'department');

    // Test with case matching department -> allowed (200)
    const matchCaseRes = await makeRequest('POST', '/api/officer/verify-case-access', {
      department: createdDeptId.toString(),
      isEscalated: false
    }, officerSessionToken);
    assert.strictEqual(matchCaseRes.status, 200);
    assert.strictEqual(matchCaseRes.data.success, true);

    // Test with case in a different department -> denied (403)
    const acadDept = await Department.findOne({ code: 'ACAD' });
    const diffDeptCaseRes = await makeRequest('POST', '/api/officer/verify-case-access', {
      department: acadDept._id.toString(),
      isEscalated: false
    }, officerSessionToken);
    assert.strictEqual(diffDeptCaseRes.status, 403);
    assert.strictEqual(diffDeptCaseRes.data.success, false);

    // Test with escalated case when canHandleEscalated is false -> denied (403)
    const escalatedCaseRes = await makeRequest('POST', '/api/officer/verify-case-access', {
      department: createdDeptId.toString(),
      isEscalated: true
    }, officerSessionToken);
    assert.strictEqual(escalatedCaseRes.status, 403);
    assert(escalatedCaseRes.data.reason.includes('escalated'));

    // 6b: Configure officer with accessScope: 'custom' categories
    const customConfigRes = await makeRequest('PATCH', `/api/admin/officers/${adminCreatedOfficerId}/case-access`, {
      accessScope: 'custom',
      assignedCategories: ['Digital Library', 'Computers'],
      canHandleEscalated: true
    }, adminToken);
    assert.strictEqual(customConfigRes.status, 200);

    // Test category 'Digital Library' -> allowed (200)
    const allowedCatRes = await makeRequest('POST', '/api/officer/verify-case-access', {
      category: 'Digital Library',
      isEscalated: true
    }, officerSessionToken);
    assert.strictEqual(allowedCatRes.status, 200);

    // Test category 'Hostel Food' -> denied (403)
    const deniedCatRes = await makeRequest('POST', '/api/officer/verify-case-access', {
      category: 'Hostel Food',
      isEscalated: false
    }, officerSessionToken);
    assert.strictEqual(deniedCatRes.status, 403);
  });

  // 7. Checkpoint: Every department exists in the database, and an authorized officer can be associated with it.
  await test('CHECKPOINT: Every department exists in the database and an authorized officer is associated with it', async () => {
    const departments = await Department.find();
    assert(departments.length >= 3, 'All seeded and created departments must exist in MongoDB');

    for (const dept of departments) {
      assert(dept.name, 'Department must have a name');
      assert(dept.code, 'Department must have a unique code');
    }

    // Verify associating an authorized officer with the department
    const officer = await User.findById(adminCreatedOfficerId);
    assert(officer, 'Authorized officer must exist in DB');
    assert.strictEqual(officer.role, 'officer');
    assert.strictEqual(officer.status, 'active');
    assert.strictEqual(officer.department.toString(), createdDeptId.toString(), 'Officer is associated with department');

    // Also verify via the department details API endpoint
    const deptDetailRes = await makeRequest('GET', `/api/admin/departments/${createdDeptId}`, null, adminToken);
    assert.strictEqual(deptDetailRes.status, 200);
    assert(deptDetailRes.data.department._id);
    const assignedIds = deptDetailRes.data.assignedOfficers.map(o => o._id.toString());
    assert(assignedIds.includes(adminCreatedOfficerId.toString()), 'Assigned officers list includes the authorized officer');
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

