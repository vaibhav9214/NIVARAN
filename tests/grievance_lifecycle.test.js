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
  console.log('--- Starting NIVARAN Grievance Lifecycle & Audit Test Suite ---\n');

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

  // --- Seed / Setup Users & Departments ---
  // 1. Authenticate Student
  const studentLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'student@nivaran.edu',
    password: 'Student@123'
  });
  assert.strictEqual(studentLogin.status, 200, 'Student login should succeed');
  const studentToken = studentLogin.data.token;
  const studentUser = studentLogin.data.user;

  // 2. Authenticate Admin
  const adminLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@nivaran.edu',
    password: 'Admin@123'
  });
  assert.strictEqual(adminLogin.status, 200, 'Admin login should succeed');
  const adminToken = adminLogin.data.token;

  // 3. Departments
  let hostelDept = await Department.findOne({ code: 'HOSTEL' });
  if (!hostelDept) {
    hostelDept = await Department.create({
      name: 'Hostel Affairs',
      code: 'HOSTEL',
      description: 'Hostel accommodation & facilities'
    });
  }

  let acadDept = await Department.findOne({ code: 'ACAD' });
  if (!acadDept) {
    acadDept = await Department.create({
      name: 'Academic Affairs',
      code: 'ACAD',
      description: 'Curriculum & examinations'
    });
  }

  let maintDept = await Department.findOne({ code: 'MAINT' });
  if (!maintDept) {
    maintDept = await Department.create({
      name: 'Maintenance & Works',
      code: 'MAINT',
      description: 'Campus infrastructure maintenance'
    });
  }

  // 4. Officer for Hostel Department
  let hostelOfficerUser = await User.findOne({ email: 'hostel_officer@nivaran.edu' });
  if (!hostelOfficerUser) {
    const regRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Hostel Officer',
      email: 'hostel_officer@nivaran.edu',
      password: 'Officer@123',
      role: 'officer'
    });
    hostelOfficerUser = await User.findById(regRes.data.user.id);
  }
  hostelOfficerUser.role = 'officer';
hostelOfficerUser.status = 'active';
  hostelOfficerUser.department = hostelDept._id;
  hostelOfficerUser.caseAccessConfig = { accessScope: 'department' };
  await hostelOfficerUser.save();

  const officerLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'hostel_officer@nivaran.edu',
    password: 'Officer@123'
  });
  assert.strictEqual(officerLogin.status, 200);
  const hostelOfficerToken = officerLogin.data.token;

  // 5. Officer for Academic Department (disjoint department)
  let acadOfficerUser = await User.findOne({ email: 'acad_officer@nivaran.edu' });
  if (!acadOfficerUser) {
    const regRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Acad Officer',
      email: 'acad_officer@nivaran.edu',
      password: 'Officer@123',
      role: 'officer'
    });
    acadOfficerUser = await User.findById(regRes.data.user.id);
  }
  acadOfficerUser.role = 'officer';
acadOfficerUser.status = 'active';
  acadOfficerUser.department = acadDept._id;
  acadOfficerUser.caseAccessConfig = { accessScope: 'department' };
  await acadOfficerUser.save();

  const acadOfficerLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'acad_officer@nivaran.edu',
    password: 'Officer@123'
  });
  assert.strictEqual(acadOfficerLogin.status, 200);
  const acadOfficerToken = acadOfficerLogin.data.token;

  // =========================================================================
  // 1. Core Lifecycle Progression (01 Submitted -> 02 Under Review -> 03 In Progress -> 04 Awaiting Student Response -> In Progress -> 05 Resolved -> 06 Feedback / Reconsideration)
  // =========================================================================

  let coreTicketId;
  let coreGrievanceId;

  await test('01. Student submits a new grievance (Initial status: Submitted + SUBMITTED audit event)', async () => {
    const res = await makeRequest('POST', '/api/student/complaints', {
      title: 'Water filter malfunction in Block C',
      category: 'Infrastructure',
      department: hostelDept._id.toString(),
      description: 'The drinking water filter in Block C 2nd floor is dispensing muddy water.',
      priority: 'High'
    }, studentToken);

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.confirmation.status, 'Submitted');
    coreTicketId = res.data.confirmation.ticketId;
    coreGrievanceId = res.data.grievance._id;

    // Check AuditEvent
    const auditEvent = await AuditEvent.findOne({ ticketId: coreTicketId, action: 'SUBMITTED' });
    assert(auditEvent, 'Initial SUBMITTED audit event must be generated');
    assert.strictEqual(auditEvent.toStatus, 'Submitted');
    assert.strictEqual(auditEvent.performedByRole, 'student');
  });

  await test('02. Officer moves grievance to Under Review', async () => {
    const res = await makeRequest('PATCH', `/api/officer/complaints/${coreTicketId}/status`, {
      status: 'Under Review',
      remarks: 'Hostel warden initiated preliminary inspection.'
    }, hostelOfficerToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'Under Review');

    // Verify AuditEvent
    const auditEvent = await AuditEvent.findOne({
      ticketId: coreTicketId,
      fromStatus: 'Submitted',
      toStatus: 'Under Review'
    });
    assert(auditEvent, 'Audit event for Under Review transition must exist');
    assert.strictEqual(auditEvent.performedByRole, 'officer');
  });

  await test('03. Officer moves grievance to In Progress (Case accepted for investigation and handling)', async () => {
    const res = await makeRequest('PATCH', `/api/officer/complaints/${coreTicketId}/status`, {
      status: 'In Progress',
      remarks: 'Plumbing contractor dispatched to inspect water pipeline and filters.'
    }, hostelOfficerToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'In Progress');

    // Verify AuditEvent
    const auditEvent = await AuditEvent.findOne({
      ticketId: coreTicketId,
      fromStatus: 'Under Review',
      toStatus: 'In Progress'
    });
    assert(auditEvent, 'Audit event for In Progress transition must exist');
  });

  await test('04. Officer requests student info -> moves to Awaiting Student Response', async () => {
    const res = await makeRequest('POST', `/api/officer/complaints/${coreTicketId}/request-info`, {
      query: 'Please confirm if the water issue is restricted to the water cooler or taps as well.'
    }, hostelOfficerToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'Awaiting Student Response');

    // Verify AuditEvent
    const auditEvent = await AuditEvent.findOne({
      ticketId: coreTicketId,
      toStatus: 'Awaiting Student Response',
      action: 'AWAITING_STUDENT_RESPONSE'
    });
    assert(auditEvent, 'Audit event for Awaiting Student Response must exist');
    assert(auditEvent.remarks.includes('restricted to the water cooler'));
  });

  await test('04b. Student responds to inquiry -> transitions back to In Progress', async () => {
    const res = await makeRequest('POST', `/api/student/complaints/${coreTicketId}/respond`, {
      message: 'The issue is only with the water cooler outlet filter, regular bathroom taps are clear.'
    }, studentToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'In Progress');

    // Verify Grievance updated with student response
    const grievance = await Grievance.findOne({ ticketId: coreTicketId });
    assert.strictEqual(grievance.studentResponses.length, 1);
    assert(grievance.studentResponses[0].message.includes('only with the water cooler outlet filter'));

    // Verify AuditEvent
    const auditEvent = await AuditEvent.findOne({
      ticketId: coreTicketId,
      action: 'STUDENT_RESPONDED',
      toStatus: 'In Progress'
    });
    assert(auditEvent, 'Audit event for student response must exist');
  });

  await test('05. Officer records resolution -> moves to Resolved', async () => {
    const res = await makeRequest('POST', `/api/officer/complaints/${coreTicketId}/resolve`, {
      resolutionNotes: 'Water filter cartridge replaced and water purity tested. Water is completely safe and clear.'
    }, hostelOfficerToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'Resolved');

    // Verify Grievance resolution details
    const grievance = await Grievance.findOne({ ticketId: coreTicketId });
    assert(grievance.resolutionDetails.resolutionNotes.includes('Water filter cartridge replaced'));

    // Verify AuditEvent
    const auditEvent = await AuditEvent.findOne({
      ticketId: coreTicketId,
      action: 'RESOLVED',
      toStatus: 'Resolved'
    });
    assert(auditEvent, 'Audit event for Resolved transition must exist');
  });

  await test('06. Student provides feedback or requests reconsideration (Reconsideration flow)', async () => {
    const res = await makeRequest('POST', `/api/student/complaints/${coreTicketId}/feedback`, {
      isReconsiderationRequested: true,
      reconsiderationReason: 'The water flow rate is now extremely slow after cartridge replacement.'
    }, studentToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'Feedback or Reconsideration');

    // Verify Grievance reconsideration details
    const grievance = await Grievance.findOne({ ticketId: coreTicketId });
    assert.strictEqual(grievance.studentFeedback.isReconsiderationRequested, true);
    assert(grievance.studentFeedback.reconsiderationReason.includes('water flow rate is now extremely slow'));

    // Verify AuditEvent
    const auditEvent = await AuditEvent.findOne({
      ticketId: coreTicketId,
      action: 'FEEDBACK_OR_RECONSIDERATION',
      toStatus: 'Feedback or Reconsideration'
    });
    assert(auditEvent, 'Audit event for Feedback or Reconsideration must exist');
  });

  await test('06b. Officer reopens case after reconsideration appeal -> moves to In Progress', async () => {
    const res = await makeRequest('PATCH', `/api/officer/complaints/${coreTicketId}/status`, {
      status: 'In Progress',
      remarks: 'Reopened following student reconsideration request. Technician dispatched to adjust pressure valve.'
    }, hostelOfficerToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'In Progress');
  });

  // =========================================================================
  // 2. Forwarding (Institutional Policy)
  // =========================================================================

  let forwardTicketId;
  await test('Forward grievance to another department (Hostel -> Maintenance)', async () => {
    // Student submits complaint to Hostel
    const submitRes = await makeRequest('POST', '/api/student/complaints', {
      title: 'Power line sparking in hostel corridor',
      category: 'Infrastructure',
      department: hostelDept._id.toString(),
      description: 'Hostel corridor junction box has loose wiring and sparks intermittently.'
    }, studentToken);
    forwardTicketId = submitRes.data.confirmation.ticketId;

    // Hostel officer reviews and forwards to Maintenance Department
    const forwardRes = await makeRequest('POST', `/api/officer/complaints/${forwardTicketId}/forward`, {
      targetDepartment: maintDept._id.toString(),
      reason: 'Requires electrical engineer from Campus Maintenance division.'
    }, hostelOfficerToken);

    assert.strictEqual(forwardRes.status, 200);
    assert.strictEqual(forwardRes.data.status, 'Forwarded');

    // Verify department updated on Grievance
    const grievance = await Grievance.findOne({ ticketId: forwardTicketId });
    assert.strictEqual(grievance.department.toString(), maintDept._id.toString());
    assert.strictEqual(grievance.forwardingHistory.length, 1);
    assert.strictEqual(grievance.forwardingHistory[0].fromDepartment.toString(), hostelDept._id.toString());
    assert.strictEqual(grievance.forwardingHistory[0].toDepartment.toString(), maintDept._id.toString());

    // Verify AuditEvent
    const auditEvent = await AuditEvent.findOne({
      ticketId: forwardTicketId,
      action: 'FORWARDED',
      toStatus: 'Forwarded'
    });
    assert(auditEvent, 'Audit event for Forwarded action must exist');
    assert.strictEqual(auditEvent.metadata.previousDepartment.toString(), hostelDept._id.toString());
    assert.strictEqual(auditEvent.metadata.targetDepartment.toString(), maintDept._id.toString());
  });

  await test('Reject forwarding with missing target department or reason', async () => {
    // Missing reason
    const res1 = await makeRequest('POST', `/api/officer/complaints/${forwardTicketId}/forward`, {
      targetDepartment: acadDept._id.toString(),
      reason: ''
    }, adminToken);
    assert.strictEqual(res1.status, 400);

    // Non-existent target department
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res2 = await makeRequest('POST', `/api/officer/complaints/${forwardTicketId}/forward`, {
      targetDepartment: fakeId,
      reason: 'Forwarding to non-existent department'
    }, adminToken);
    assert.strictEqual(res2.status, 400);
  });

  // =========================================================================
  // 3. Rejection (Institutional Policy)
  // =========================================================================

  let rejectTicketId;
  await test('Reject grievance with documented reason (Policy enforcement)', async () => {
    const submitRes = await makeRequest('POST', '/api/student/complaints', {
      title: 'Request personal air conditioning unit',
      category: 'General',
      department: hostelDept._id.toString(),
      description: 'Requesting personal split air conditioner installation in dorm room.'
    }, studentToken);
    rejectTicketId = submitRes.data.confirmation.ticketId;

    // Reject without reason must fail
    const failRes = await makeRequest('POST', `/api/officer/complaints/${rejectTicketId}/reject`, {
      reason: ''
    }, hostelOfficerToken);
    assert.strictEqual(failRes.status, 400);

    // Reject with documented justification
    const rejectRes = await makeRequest('POST', `/api/officer/complaints/${rejectTicketId}/reject`, {
      reason: 'Institutional hostel guidelines Section 4.2 strictly prohibit individual AC installations.'
    }, hostelOfficerToken);

    assert.strictEqual(rejectRes.status, 200);
    assert.strictEqual(rejectRes.data.status, 'Rejected');

    // Check Grievance document
    const grievance = await Grievance.findOne({ ticketId: rejectTicketId });
    assert.strictEqual(grievance.status, 'Rejected');
    assert(grievance.rejectionReason.includes('Section 4.2 strictly prohibit'));

    // Check AuditEvent
    const auditEvent = await AuditEvent.findOne({
      ticketId: rejectTicketId,
      action: 'REJECTED',
      toStatus: 'Rejected'
    });
    assert(auditEvent, 'Audit event for REJECTED must exist');
    assert(auditEvent.remarks.includes('hostel guidelines'));
  });

  // =========================================================================
  // 4. Withdrawal (Institutional Policy)
  // =========================================================================

  let withdrawTicketId;
  await test('Student withdraws own grievance (Withdrawal policy)', async () => {
    const submitRes = await makeRequest('POST', '/api/student/complaints', {
      title: 'Misplaced bicycle in hostel porch',
      category: 'Security',
      department: hostelDept._id.toString(),
      description: 'Cannot locate my blue cycle near Block B.'
    }, studentToken);
    withdrawTicketId = submitRes.data.confirmation.ticketId;

    // Student withdraws
    const withdrawRes = await makeRequest('POST', `/api/student/complaints/${withdrawTicketId}/withdraw`, {
      reason: 'Bicycle was borrowed by roommate and has been returned safely.'
    }, studentToken);

    assert.strictEqual(withdrawRes.status, 200);
    assert.strictEqual(withdrawRes.data.status, 'Withdrawn');

    // Verify Grievance withdrawal details
    const grievance = await Grievance.findOne({ ticketId: withdrawTicketId });
    assert.strictEqual(grievance.status, 'Withdrawn');
    assert(grievance.withdrawalDetails.reason.includes('borrowed by roommate'));

    // Verify AuditEvent
    const auditEvent = await AuditEvent.findOne({
      ticketId: withdrawTicketId,
      action: 'WITHDRAWN',
      toStatus: 'Withdrawn'
    });
    assert(auditEvent, 'Audit event for WITHDRAWN must exist');
    assert.strictEqual(auditEvent.performedByRole, 'student');
  });

  await test('Officer cannot withdraw student grievance', async () => {
    // Attempting withdrawal using officer token on student endpoint
    const res = await makeRequest('POST', `/api/student/complaints/${forwardTicketId}/withdraw`, {
      reason: 'Officer attempting withdrawal'
    }, hostelOfficerToken);
    assert.strictEqual(res.status, 403, 'Officer should be blocked with 403 on student route');
  });

  // =========================================================================
  // 5. CHECKPOINT: Invalid Transitions Are Rejected By Backend
  // =========================================================================

  await test('CHECKPOINT: Reject illegal skip transition (Submitted directly to Resolved)', async () => {
    const submitRes = await makeRequest('POST', '/api/student/complaints', {
      title: 'Noise from library renovation',
      category: 'Academic',
      department: acadDept._id.toString(),
      description: 'Loud drilling sounds during library self-study hours.'
    }, studentToken);
    const testTicket = submitRes.data.confirmation.ticketId;

    const res = await makeRequest('PATCH', `/api/officer/complaints/${testTicket}/status`, {
      status: 'Resolved',
      resolutionNotes: 'Skipping investigation and resolving directly.'
    }, adminToken);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Invalid status transition'));
  });

  await test('CHECKPOINT: Reject transitioning a Withdrawn grievance (Terminal state enforcement)', async () => {
    const res = await makeRequest('PATCH', `/api/officer/complaints/${withdrawTicketId}/status`, {
      status: 'Under Review',
      remarks: 'Attempting to reopen withdrawn ticket.'
    }, adminToken);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('Invalid status transition') || res.data.message.includes('Cannot transition'));
  });

  await test('CHECKPOINT: Reject unauthorized officer case access across departments', async () => {
    // Grievance belongs to Academic department
    const submitRes = await makeRequest('POST', '/api/student/complaints', {
      title: 'Lab grade calculation error',
      category: 'Academic',
      department: acadDept._id.toString(),
      description: 'Midterm lab assessment grades are incorrectly entered.'
    }, studentToken);
    const acadTicket = submitRes.data.confirmation.ticketId;

    // Hostel officer (assigned only to HOSTEL) attempts to transition Academic complaint
    const res = await makeRequest('PATCH', `/api/officer/complaints/${acadTicket}/status`, {
      status: 'Under Review',
      remarks: 'Unauthorized review'
    }, hostelOfficerToken);

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.success, false);
    assert(res.data.message.includes('denied') || res.data.reason.includes('department'));
  });

  // =========================================================================
  // 6. CHECKPOINT: Every Official Status Change Generates An Audit Event
  // =========================================================================

  await test('CHECKPOINT: Audit trail endpoint returns complete chronological history', async () => {
    const res = await makeRequest('GET', `/api/officer/complaints/${coreTicketId}/audit-trail`, null, hostelOfficerToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(Array.isArray(res.data.auditTrail));
    assert(res.data.auditTrail.length >= 6, `Expected at least 6 audit events, got ${res.data.auditTrail.length}`);

    // Verify chronological ordering
    for (let i = 1; i < res.data.auditTrail.length; i++) {
      const prev = new Date(res.data.auditTrail[i - 1].timestamp).getTime();
      const curr = new Date(res.data.auditTrail[i].timestamp).getTime();
      assert(curr >= prev, 'Audit trail must be in ascending chronological order');
    }

    // Verify actions sequence
    const actions = res.data.auditTrail.map((e) => e.action);
    assert(actions.includes('SUBMITTED'));
    assert(actions.includes('STATUS_CHANGE'));
    assert(actions.includes('AWAITING_STUDENT_RESPONSE'));
    assert(actions.includes('STUDENT_RESPONDED'));
    assert(actions.includes('RESOLVED'));
    assert(actions.includes('FEEDBACK_OR_RECONSIDERATION'));
  });

  await test('CHECKPOINT: Admin can query system-wide audit events', async () => {
    const res = await makeRequest('GET', '/api/admin/audit-events', null, adminToken);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert(res.data.total > 0);
    assert(Array.isArray(res.data.auditEvents));

    // Filter by ticketId
    const filteredRes = await makeRequest('GET', `/api/admin/audit-events?ticketId=${coreTicketId}`, null, adminToken);
    assert.strictEqual(filteredRes.status, 200);
    assert(filteredRes.data.auditEvents.every((e) => e.ticketId === coreTicketId));
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

