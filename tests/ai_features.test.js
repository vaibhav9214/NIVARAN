const assert = require('node:assert');
const http = require('node:http');
const mongoose = require('mongoose');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Grievance = require('../src/models/Grievance');
const aiService = require('../src/services/aiService');

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

async function loginUser(email, password) {
  const res = await makeRequest('POST', '/api/auth/login', { email, password });
  assert.strictEqual(res.status, 200, `Login failed for ${email}`);
  return res.data.token;
}

async function runAiTests() {
  console.log('\n--- Starting NIVARAN AI Features Test Suite (Gemini gemini-3.5-flash) ---');

  let passedCount = 0;
  let failedCount = 0;

  function pass(desc) {
    passedCount++;
    console.log(`[PASS] ${desc}`);
  }

  function fail(desc, err) {
    failedCount++;
    console.error(`[FAIL] ${desc}`, err);
  }

  await connectDB();

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  try {
    const studentToken = await loginUser('student@nivaran.edu', 'Student@123');
    const adminToken = await loginUser('admin@nivaran.edu', 'Admin@123');

    // Ensure a test department exists
    let testDept = await Department.findOne({ code: 'CS_AI' });
    if (!testDept) {
      testDept = await Department.create({
        name: 'Computer Science & AI',
        code: 'CS_AI',
        description: 'CS and Artificial Intelligence Department'
      });
    }

    // Ensure an active officer exists
    let officerUser = await User.findOne({ email: 'ai_officer@nivaran.edu' });
    if (!officerUser) {
      const reg = await makeRequest('POST', '/api/auth/register', {
        name: 'AI Grievance Officer',
        email: 'ai_officer@nivaran.edu',
        password: 'Officer@123',
        role: 'officer'
      });
      officerUser = await User.findById(reg.data.user.id);
    }
    officerUser.role = 'officer';
officerUser.status = 'active';
    officerUser.department = testDept._id;
    officerUser.caseAccessConfig = { accessScope: 'all' };
    await officerUser.save();

    const officerToken = await loginUser('ai_officer@nivaran.edu', 'Officer@123');

    // ------------------------------------------------------------------------
    // Sequence 1: Summarize long grievance descriptions
    // ------------------------------------------------------------------------
    try {
      const longDescription = `
        On Monday morning around 9:30 AM, I visited the 3rd floor Computer Science Lab B for our scheduled Distributed Systems practical exam.
        Upon attempting to boot workstation PC-14, the monitor repeatedly flashed an electrical error message and failed to connect to the campus LAN network.
        I reported this immediately to the lab assistant, Mr. Verma, who informed me that the switch port on Rack 2 has had intermittent voltage fluctuations for three weeks.
        As a direct consequence, I was unable to compile and submit my practical assignment before the 11:00 AM hard deadline, which severely impacted my mid-semester grading.
        I request the department to service the faulty switch, verify the lab power stability, and grant me a legitimate makeup test opportunity.
      `;

      const summaryRes = await aiService.summarizeDescription('CS Lab Workstation Breakdown during Exam', longDescription);
      assert(summaryRes.summary && summaryRes.summary.length > 10, 'Should generate non-empty summary');
      assert(Array.isArray(summaryRes.key_points) && summaryRes.key_points.length > 0, 'Should extract key bullet points');
      assert.strictEqual(summaryRes.model, 'gemini-3.5-flash', 'Model must be gemini-3.5-flash');
      assert(summaryRes.word_count_summary < summaryRes.word_count_original, 'Summary should be more concise than original');
      pass('Sequence 1: Summarize long grievance descriptions into executive summary & bullet points');
    } catch (err) {
      fail('Sequence 1: Summarize long grievance descriptions', err);
    }

    // ------------------------------------------------------------------------
    // Sequence 2: Suggest categories and departments
    // ------------------------------------------------------------------------
    try {
      const classificationRes = await aiService.suggestClassification(
        'Severe Water Leakage and Cold Water in Hostel B Geyser',
        'In Boys Hostel Block B Room 204, the hot water geyser in bathroom 3 is completely burned out and leaking rusty water across the corridor floor.'
      );
      assert.strictEqual(classificationRes.suggested_category, 'Hostel', 'Category should match Hostel');
      assert.strictEqual(classificationRes.suggested_department, 'Hostel Affairs', 'Department should match Hostel Affairs');
      assert(classificationRes.confidence >= 0.7, 'Confidence should be reasonably high');
      assert(classificationRes.reasoning && classificationRes.reasoning.length > 5, 'Should include classification reasoning');
      assert.strictEqual(classificationRes.model, 'gemini-3.5-flash');
      pass('Sequence 2: Suggest categories and departments with confidence and reasoning');
    } catch (err) {
      fail('Sequence 2: Suggest categories and departments', err);
    }

    // ------------------------------------------------------------------------
    // Sequence 3: Identify potentially missing information
    // ------------------------------------------------------------------------
    try {
      // Vague grievance missing date, room, transaction ID
      const vagueRes = await aiService.identifyMissingInfo(
        'My fee refund is pending',
        'I paid extra money for semester fees and someone in the office said I would get a refund but I have not received it yet.'
      );
      assert.strictEqual(vagueRes.is_information_complete, false, 'Vague grievance should be flagged as incomplete');
      assert(vagueRes.missing_information.length >= 2, 'Should detect multiple missing information items');
      assert(Array.isArray(vagueRes.suggested_questions_for_student), 'Should provide suggested questions');
      assert(vagueRes.completeness_score < 0.8, 'Completeness score should be lower for incomplete info');

      // Specific grievance with dates, room, course code
      const specificRes = await aiService.identifyMissingInfo(
        'Course CS301 Attendance Correction',
        'On 15/10/2026, my attendance for CS301 lecture in Room 204 with Prof Sharma was marked absent despite physical presence.'
      );
      assert(specificRes.completeness_score >= 0.7, 'Specific grievance should have high completeness score');
      pass('Sequence 3: Identify potentially missing information and construct clarifying questions');
    } catch (err) {
      fail('Sequence 3: Identify potentially missing information', err);
    }

    // ------------------------------------------------------------------------
    // Sequence 4: Generate officer-facing follow-up suggestions
    // ------------------------------------------------------------------------
    try {
      const followUpRes = await aiService.generateOfficerSuggestions(
        'Urgent: Open live electric wire hanging near Hostel C entrance',
        'There is an uninsulated live wire sparking near the main entrance steps of Hostel Block C following heavy rains.',
        'Infrastructure',
        'Campus Facilities',
        'Submitted'
      );

      assert.strictEqual(followUpRes.recommended_priority, 'Urgent', 'Dangerous hazard should recommend Urgent priority');
      assert(followUpRes.suggested_sla_hours <= 24, 'Urgent issue should recommend SLA <= 24 hours');
      assert(Array.isArray(followUpRes.recommended_actions) && followUpRes.recommended_actions.length >= 2, 'Should provide actionable investigation steps');
      assert(followUpRes.checkpoint_notice.includes('non-binding'), 'Should emphasize checkpoint disclaimer');
      assert.strictEqual(followUpRes.model, 'gemini-3.5-flash');
      pass('Sequence 4: Generate officer-facing follow-up suggestions (investigation steps, SLA, questions)');
    } catch (err) {
      fail('Sequence 4: Generate officer-facing follow-up suggestions', err);
    }

    // ------------------------------------------------------------------------
    // Student Pre-Submission AI Assistant Endpoint (Draft Assistance)
    // ------------------------------------------------------------------------
    try {
      const assistRes = await makeRequest('POST', '/api/student/ai/assist', {
        title: 'Mess food quality issue',
        description: 'The dinner served in dining hall was stale and caused several hostelites stomach cramps.'
      }, studentToken);

      assert.strictEqual(assistRes.status, 200);
      assert(assistRes.data.success);
      assert(assistRes.data.draftPreview.summary);
      assert(assistRes.data.classificationSuggestion.suggestedCategory);
      assert(assistRes.data.completenessAudit);
      assert.strictEqual(assistRes.data.model, 'gemini-3.5-flash');
      pass('Student Pre-Submission Assistant: Provides preview, categorization, and missing info checklist');
    } catch (err) {
      fail('Student Pre-Submission Assistant', err);
    }

    // ------------------------------------------------------------------------
    // Checkpoint Verification: AI suggestions appear alongside complaint
    // AND never silently change official statuses or decisions
    // ------------------------------------------------------------------------
    let testGrievanceId;
    try {
      // 1. Student creates an ordinary grievance
      const submitRes = await makeRequest('POST', '/api/student/complaints', {
        title: 'Wi-Fi disconnects constantly during online exams in Room 302',
        category: 'IT Services',
        department: testDept._id.toString(),
        description: 'The 5GHz campus access point in Room 302 drops connection every 5 minutes during our online exams.',
        priority: 'Medium'
      }, studentToken);

      assert.strictEqual(submitRes.status, 201);
      const createdGrievance = submitRes.data.grievance || submitRes.data.complaint;
      testGrievanceId = createdGrievance._id;
      const initialStatus = createdGrievance.status;
      assert.strictEqual(initialStatus, 'Submitted');

      // 2. Officer requests AI insights
      const insightsRes = await makeRequest('GET', `/api/officer/complaints/${testGrievanceId}/ai-insights`, null, officerToken);
      assert.strictEqual(insightsRes.status, 200);
      assert(insightsRes.data.success);
      assert(insightsRes.data.aiInsights.summary, 'AI insights should generate summary');
      assert(insightsRes.data.aiInsights.keyPoints.length > 0, 'AI insights should generate keyPoints');
      assert.strictEqual(insightsRes.data.aiInsights.model, 'gemini-3.5-flash');

      // 3. CHECKPOINT CHECK: Official status MUST remain strictly 'Submitted'
      const updatedGrievance = await Grievance.findById(testGrievanceId);
      assert.strictEqual(
        updatedGrievance.status,
        'Submitted',
        'CHECKPOINT FAILED: AI generation must NEVER change official grievance status!'
      );
      assert.strictEqual(updatedGrievance.aiInsights.isReviewedByHuman, false, 'Must be marked as pending human review');
      assert.strictEqual(updatedGrievance.aiInsights.humanDecision, 'Pending Review');
      pass('CHECKPOINT: AI suggestions appear alongside original complaint and NEVER silently change official status');
    } catch (err) {
      fail('CHECKPOINT: Status preservation during AI generation', err);
    }

    // ------------------------------------------------------------------------
    // Human Review Workflow: Officer reviews AI suggestions
    // ------------------------------------------------------------------------
    try {
      const reviewRes = await makeRequest('PATCH', `/api/officer/complaints/${testGrievanceId}/ai-review`, {
        humanDecision: 'Accepted',
        humanReviewNotes: 'Verified with IT helpdesk; access point AP-302 will be inspected today.',
        applySuggestedPriority: true
      }, officerToken);

      assert.strictEqual(reviewRes.status, 200);
      assert(reviewRes.data.success);
      assert.strictEqual(reviewRes.data.aiInsights.humanDecision, 'Accepted');
      assert.strictEqual(reviewRes.data.aiInsights.isReviewedByHuman, true);
      assert.strictEqual(reviewRes.data.officialStatus, 'Submitted', 'Official lifecycle status still unchanged');

      const savedGrievance = await Grievance.findById(testGrievanceId);
      assert.strictEqual(savedGrievance.aiInsights.humanDecision, 'Accepted');
      assert(savedGrievance.aiInsights.reviewedBy, 'Officer ID must be recorded on human review');
      assert.strictEqual(savedGrievance.status, 'Submitted', 'Official status remains strictly untouched by AI review');
      pass('Human Review Workflow: Officer explicitly records human review decision (Accepted/Modified/Rejected)');
    } catch (err) {
      fail('Human Review Workflow', err);
    }

    // ------------------------------------------------------------------------
    // Sequence 5: Identify trends in aggregate grievance data (Gemini)
    // ------------------------------------------------------------------------
    try {
      const studentUser = await User.findOne({ email: 'student@nivaran.edu' });
      await Grievance.create([
        {
          ticketId: `GRV-TR1-${Date.now()}`,
          student: studentUser._id,
          title: 'Wi-Fi router dead in Lab 1',
          category: 'IT Services',
          department: testDept._id,
          description: 'Access point completely unreachable in Lab 1.',
          status: 'In Progress'
        },
        {
          ticketId: `GRV-TR2-${Date.now()}`,
          student: studentUser._id,
          title: 'Wi-Fi connection fails in Lab 2',
          category: 'IT Services',
          department: testDept._id,
          description: 'Students cannot authenticate onto eduroam network in Lab 2.',
          status: 'Submitted'
        },
        {
          ticketId: `GRV-TR3-${Date.now()}`,
          student: studentUser._id,
          title: 'Hostel geyser not heating in Block A',
          category: 'Hostel',
          department: testDept._id,
          description: 'Geyser element burnt out in Block A 2nd floor.',
          status: 'Submitted'
        }
      ]);

      const trendsRes = await makeRequest('GET', '/api/admin/ai/trends', null, adminToken);
      assert.strictEqual(trendsRes.status, 200);
      assert(trendsRes.data.success);
      assert(trendsRes.data.totalGrievancesAnalyzed >= 3);
      assert(Array.isArray(trendsRes.data.trends.top_recurring_issues), 'Should return recurring issue clusters');
      assert(Array.isArray(trendsRes.data.trends.hotspot_departments), 'Should return hotspot departments');
      assert(Array.isArray(trendsRes.data.trends.emerging_patterns), 'Should return emerging patterns');
      assert(Array.isArray(trendsRes.data.trends.actionable_recommendations), 'Should return actionable recommendations');
      assert.strictEqual(trendsRes.data.model, 'gemini-3.5-flash');
      pass('Sequence 5: Identify trends in aggregate grievance data (Hotspots, recurring clusters, recommendations)');
    } catch (err) {
      fail('Sequence 5: Aggregate trend analysis', err);
    }

    // ------------------------------------------------------------------------
    // RBAC Security: Students cannot access Admin trends or Officer reviews
    // ------------------------------------------------------------------------
    try {
      const studentTrendRes = await makeRequest('GET', '/api/admin/ai/trends', null, studentToken);
      assert.strictEqual(studentTrendRes.status, 403, 'Student should be blocked from admin trends (403)');

      const studentReviewRes = await makeRequest('PATCH', `/api/officer/complaints/${testGrievanceId}/ai-review`, {
        humanDecision: 'Accepted'
      }, studentToken);
      assert.strictEqual(studentReviewRes.status, 403, 'Student should be blocked from officer review (403)');
      pass('RBAC: Unauthorized roles are strictly blocked from AI administration & review endpoints');
    } catch (err) {
      fail('RBAC on AI endpoints', err);
    }

    // ------------------------------------------------------------------------
    // Admin AI Status Check
    // ------------------------------------------------------------------------
    try {
      const statusRes = await makeRequest('GET', '/api/admin/ai/status', null, adminToken);
      assert.strictEqual(statusRes.status, 200);
      assert.strictEqual(statusRes.data.model, 'gemini-3.5-flash');
      assert('gemini_api_key_configured' in statusRes.data);
      pass('AI Service Status: Reports model (gemini-3.5-flash) and API key configuration status');
    } catch (err) {
      fail('AI Service Status', err);
    }

  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }

  console.log(`\n--- Test Results: ${passedCount} passed, ${failedCount} failed ---`);
  if (failedCount > 0) {
    process.exit(1);
  }
  process.exit(0);
}

if (require.main === module) {
  runAiTests().catch((err) => {
    console.error('Unhandled test failure:', err);
    process.exit(1);
  });
}

module.exports = { runAiTests };

