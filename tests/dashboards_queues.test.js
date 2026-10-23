const assert = require('node:assert');
const http = require('node:http');
const mongoose = require('mongoose');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Grievance = require('../src/models/Grievance');
const AuditEvent = require('../src/models/AuditEvent');

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

async function runTests() {
  console.log('--- Starting NIVARAN Dashboards & Case Queues Test Suite ---\n');

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

  // --- Setup / Authentication ---
  // Student
  const studentEmail = `dashboard_student_${Date.now()}@nivaran.edu`;
  const regStudent = await makeRequest('POST', '/api/auth/register', {
    name: 'Dashboard Student',
    email: studentEmail,
    password: 'Student@123',
    role: 'student'
  });
  const studentToken = regStudent.data.token;
  const studentId = regStudent.data.user.id;

  // Admin
  const adminLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@nivaran.edu',
    password: 'Admin@123'
  });
  const adminToken = adminLogin.data.token;

  // Department: Hostel
  let hostelDept = await Department.findOne({ code: 'HOSTEL' });
  if (!hostelDept) {
    hostelDept = await Department.create({
      name: 'Hostel Affairs',
      code: 'HOSTEL',
      description: 'Hostel facilities'
    });
  }

  // Officer for Hostel
  let hostelOfficerUser = await User.findOne({ email: 'hostel_officer@nivaran.edu' });
  if (!hostelOfficerUser) {
    const regOfficer = await makeRequest('POST', '/api/auth/register', {
      name: 'Hostel Officer',
      email: 'hostel_officer@nivaran.edu',
      password: 'Officer@123',
      role: 'officer'
    });
    hostelOfficerUser = await User.findById(regOfficer.data.user.id);
  }
  hostelOfficerUser.status = 'active';
  hostelOfficerUser.department = hostelDept._id;
  await hostelOfficerUser.save();

  const officerLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'hostel_officer@nivaran.edu',
    password: 'Officer@123'
  });
  const officerToken = officerLogin.data.token;

  // =========================================================================
  // 1. Page 04: Student Dashboard & Complaints Queue
  // =========================================================================

  await test('Page 04: Student Dashboard returns real status counts, announcements, and SLA metrics', async () => {
    // Initial student dashboard before any submissions
    const res = await makeRequest('GET', '/api/student/dashboard', null, studentToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.portal, 'student');
    assert(res.data.statusCounts !== undefined, 'statusCounts object must be present');
    assert.strictEqual(res.data.statusCounts.total, 0);
    assert.strictEqual(res.data.statusCounts.active, 0);
    assert(Array.isArray(res.data.recentGrievances));
    assert(Array.isArray(res.data.announcements));
  });

  let createdTicket1;
  let createdTicket2;

  await test('Page 04: Student submits grievances with different priorities and verifies SLA deadline derivation', async () => {
    // Submit Urgent complaint
    const res1 = await makeRequest('POST', '/api/student/complaints', {
      title: 'Water pipe burst in corridor',
      category: 'Infrastructure',
      department: hostelDept._id.toString(),
      description: 'Major flooding on 3rd floor hallway due to pipe rupture.',
      priority: 'Urgent'
    }, studentToken);
    assert.strictEqual(res1.status, 201);
    createdTicket1 = res1.data.confirmation.ticketId;
    assert(res1.data.confirmation.slaDeadline, 'Urgent ticket must have slaDeadline calculated');

    // Submit Medium complaint
    const res2 = await makeRequest('POST', '/api/student/complaints', {
      title: 'Study room table wobble',
      category: 'Facilities',
      department: hostelDept._id.toString(),
      description: 'Table 4 in quiet study room wobbles significantly.',
      priority: 'Medium'
    }, studentToken);
    assert.strictEqual(res2.status, 201);
    createdTicket2 = res2.data.confirmation.ticketId;

    // Fetch dashboard again
    const dashRes = await makeRequest('GET', '/api/student/dashboard', null, studentToken);
    assert.strictEqual(dashRes.status, 200);
    assert.strictEqual(dashRes.data.statusCounts.total, 2);
    assert.strictEqual(dashRes.data.statusCounts.submitted, 2);
    assert.strictEqual(dashRes.data.statusCounts.active, 2);
    assert.strictEqual(dashRes.data.recentGrievances.length, 2);

    // Verify SLA metrics populated in recent complaints
    const urgentItem = dashRes.data.recentGrievances.find((g) => g.ticketId === createdTicket1);
    assert(urgentItem, 'Urgent grievance must appear in recent complaints');
    assert(urgentItem.slaDeadline, 'slaDeadline must be present');
    assert(urgentItem.remainingHours > 0, 'remainingHours must be calculated');
    assert.strictEqual(urgentItem.slaStatus, 'nearing_deadline'); // <= 24h for Urgent
  });

  await test('Page 04: Student complaints queue supports search, filter, and pagination', async () => {
    // 1. Search by title keyword
    const searchRes = await makeRequest('GET', '/api/student/complaints?search=flooding', null, studentToken);
    assert.strictEqual(searchRes.status, 200);
    assert.strictEqual(searchRes.data.count, 1);
    assert.strictEqual(searchRes.data.complaints[0].ticketId, createdTicket1);

    // 2. Filter by priority
    const filterRes = await makeRequest('GET', '/api/student/complaints?priority=Urgent', null, studentToken);
    assert.strictEqual(filterRes.status, 200);
    assert.strictEqual(filterRes.data.count, 1);
    assert.strictEqual(filterRes.data.complaints[0].priority, 'Urgent');

    // 3. Pagination
    const pageRes = await makeRequest('GET', '/api/student/complaints?page=1&limit=1', null, studentToken);
    assert.strictEqual(pageRes.status, 200);
    assert.strictEqual(pageRes.data.count, 1);
    assert.strictEqual(pageRes.data.totalCount, 2);
    assert.strictEqual(pageRes.data.totalPages, 2);
    assert.strictEqual(pageRes.data.page, 1);
  });

  // =========================================================================
  // 2. Page 08: Officer Dashboard & Workload Charts
  // =========================================================================

  await test('Page 08: Officer Dashboard provides department status counts and workload charts', async () => {
    const res = await makeRequest('GET', '/api/officer/dashboard', null, officerToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.portal, 'officer');
    assert(res.data.statusCounts !== undefined, 'statusCounts must be present');
    assert(res.data.statusCounts.total >= 2);
    assert(res.data.statusCounts.pendingReview >= 2);

    // Workload charts
    const charts = res.data.workloadCharts;
    assert(charts, 'workloadCharts object must exist');
    assert(Array.isArray(charts.byStatus), 'byStatus chart array must exist');
    assert(Array.isArray(charts.byPriority), 'byPriority chart array must exist');
    assert(Array.isArray(charts.byCategory), 'byCategory chart array must exist');
    assert(charts.slaComplianceRate !== undefined, 'slaComplianceRate must exist');

    // Urgent action queue
    assert(Array.isArray(res.data.urgentActionQueue));
    assert(res.data.urgentActionQueue.some((g) => g.priority === 'Urgent'));
  });

  // =========================================================================
  // 3. Page 10: Assigned Grievances Case Queue (Search, Filters, Deadlines, Pagination)
  // =========================================================================

  await test('Page 10: Assigned Complaints Queue supports search, status/priority filtering, deadlines, and pagination', async () => {
    // 1. Full queue
    const queueRes = await makeRequest('GET', '/api/officer/assigned-complaints?page=1&limit=5', null, officerToken);
    assert.strictEqual(queueRes.status, 200);
    assert(Array.isArray(queueRes.data.assignedComplaints));
    assert(queueRes.data.totalCount >= 2);
    assert(queueRes.data.assignedComplaints[0].slaDeadline, 'Every grievance must contain computed SLA deadline');

    // 2. Search by ticketId
    const searchRes = await makeRequest('GET', `/api/officer/assigned-complaints?search=${createdTicket1}`, null, officerToken);
    assert.strictEqual(searchRes.status, 200);
    assert.strictEqual(searchRes.data.count, 1);
    assert.strictEqual(searchRes.data.assignedComplaints[0].ticketId, createdTicket1);

    // 3. Filter by priority
    const priorityRes = await makeRequest('GET', '/api/officer/assigned-complaints?priority=Urgent', null, officerToken);
    assert.strictEqual(priorityRes.status, 200);
    assert(priorityRes.data.assignedComplaints.every((g) => g.priority === 'Urgent'));

    // 4. Filter by status
    const statusRes = await makeRequest('GET', '/api/officer/assigned-complaints?status=Submitted', null, officerToken);
    assert.strictEqual(statusRes.status, 200);
    assert(statusRes.data.assignedComplaints.every((g) => g.status === 'Submitted'));

    // 5. Deadlines sorting (earliest deadline first)
    const sortedRes = await makeRequest('GET', '/api/officer/assigned-complaints?sort=deadline', null, officerToken);
    assert.strictEqual(sortedRes.status, 200);
    assert(sortedRes.data.assignedComplaints.length >= 2);
    const d1 = new Date(sortedRes.data.assignedComplaints[0].slaDeadline).getTime();
    const d2 = new Date(sortedRes.data.assignedComplaints[1].slaDeadline).getTime();
    assert(d1 <= d2, 'Deadlines sorting must order earliest deadline first');
  });

  // =========================================================================
  // 4. Page 11: Admin Dashboard & Global Grievance Management
  // =========================================================================

  await test('Page 11: Admin Dashboard provides institution-wide counts, department workload, and system activity', async () => {
    const res = await makeRequest('GET', '/api/admin/dashboard', null, adminToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.portal, 'admin');

    // Institution-wide stats & status counts
    assert(res.data.stats.totalUsers > 0);
    assert(res.data.stats.totalGrievances >= 2);
    assert(res.data.statusCounts.submitted >= 2);

    // Workload by Department
    const deptWorkload = res.data.workloadCharts.byDepartment;
    assert(Array.isArray(deptWorkload));
    const hostelData = deptWorkload.find((d) => d.code === 'HOSTEL');
    assert(hostelData, 'Hostel department workload must be computed');
    assert(hostelData.total >= 2);
    assert(hostelData.pending >= 2);

    // Recent system activity
    assert(Array.isArray(res.data.recentActivity));
    assert(res.data.recentActivity.length > 0);
    assert(res.data.recentActivity[0].ticketId, 'Audit events must populate recent activity');
  });

  await test('Page 11: Admin Master Complaints Queue supports search and multi-department filtering', async () => {
    const res = await makeRequest('GET', `/api/admin/complaints?department=${hostelDept.code}&priority=Urgent`, null, adminToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.portal, 'admin');
    assert(Array.isArray(res.data.complaints));
    assert(res.data.complaints.every((c) => c.priority === 'Urgent'));
  });

  // =========================================================================
  // 5. CHECKPOINT: Submitting a grievance updates student dashboard, officer queue,
  //    and admin institution-wide counts automatically without manual changes.
  // =========================================================================

  await test('CHECKPOINT: Submitting a grievance dynamically propagates to Student Dashboard, Officer Queue, and Admin Dashboard', async () => {
    // Step A: Baseline counts before submission
    const studentBefore = await makeRequest('GET', '/api/student/dashboard', null, studentToken);
    const officerBefore = await makeRequest('GET', '/api/officer/dashboard', null, officerToken);
    const adminBefore = await makeRequest('GET', '/api/admin/dashboard', null, adminToken);

    const studentTotalBefore = studentBefore.data.statusCounts.total;
    const studentSubmittedBefore = studentBefore.data.statusCounts.submitted;

    const officerSubmittedBefore = officerBefore.data.statusCounts.submitted;
    const officerPendingBefore = officerBefore.data.statusCounts.pendingReview;

    const adminTotalBefore = adminBefore.data.stats.totalGrievances;
    const adminSubmittedBefore = adminBefore.data.statusCounts.submitted;
    const adminHostelTotalBefore = adminBefore.data.workloadCharts.byDepartment.find((d) => d.code === 'HOSTEL').total;

    // Step B: Student creates new grievance
    const submitRes = await makeRequest('POST', '/api/student/complaints', {
      title: 'Elevator power failure in Block D',
      category: 'Safety',
      department: hostelDept._id.toString(),
      description: 'Elevator stuck between floor 2 and 3 with electrical tripping sound.',
      priority: 'Urgent'
    }, studentToken);

    assert.strictEqual(submitRes.status, 201);
    const newTicket = submitRes.data.confirmation.ticketId;

    // Step C: Verify Student Dashboard updated immediately
    const studentAfter = await makeRequest('GET', '/api/student/dashboard', null, studentToken);
    assert.strictEqual(studentAfter.data.statusCounts.total, studentTotalBefore + 1, 'Student total count must increment by 1');
    assert.strictEqual(studentAfter.data.statusCounts.submitted, studentSubmittedBefore + 1, 'Student submitted count must increment by 1');
    assert.strictEqual(studentAfter.data.recentGrievances[0].ticketId, newTicket, 'New ticket must appear at top of student recent list');

    // Step D: Verify Assigned Officer Queue & Dashboard updated immediately
    const officerAfter = await makeRequest('GET', '/api/officer/dashboard', null, officerToken);
    assert.strictEqual(officerAfter.data.statusCounts.submitted, officerSubmittedBefore + 1, 'Officer department submitted count must increment by 1');
    assert.strictEqual(officerAfter.data.statusCounts.pendingReview, officerPendingBefore + 1, 'Officer pending review count must increment by 1');

    const officerQueueRes = await makeRequest('GET', `/api/officer/assigned-complaints?search=${newTicket}`, null, officerToken);
    assert.strictEqual(officerQueueRes.data.count, 1, 'New ticket must appear in officer case queue');
    assert.strictEqual(officerQueueRes.data.assignedComplaints[0].ticketId, newTicket);
    assert(officerQueueRes.data.assignedComplaints[0].slaDeadline, 'New ticket in officer queue must have SLA deadline');

    // Step E: Verify Admin Dashboard institution-wide counts updated immediately
    const adminAfter = await makeRequest('GET', '/api/admin/dashboard', null, adminToken);
    assert.strictEqual(adminAfter.data.stats.totalGrievances, adminTotalBefore + 1, 'Admin total grievances must increment by 1');
    assert.strictEqual(adminAfter.data.statusCounts.submitted, adminSubmittedBefore + 1, 'Admin submitted count must increment by 1');

    const adminHostelAfter = adminAfter.data.workloadCharts.byDepartment.find((d) => d.code === 'HOSTEL');
    assert.strictEqual(adminHostelAfter.total, adminHostelTotalBefore + 1, 'Admin department workload for HOSTEL must increment by 1');
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

