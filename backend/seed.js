require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Department = require("./models/Department");
const Grievance = require("./models/Grievance");
const Assignment = require("./models/Assignment");
const Message = require("./models/Message");
const AuditLog = require("./models/AuditLog");
const Notification = require("./models/Notification");

const PASSWORD = "1234";
const ago = (days) => new Date(Date.now() - days * 86400000);
const future = (days) => new Date(Date.now() + days * 86400000);
const pad = (n) => String(n).padStart(4, "0");

async function main() {
  // Safety checks: require two explicit confirmations.
  if (process.env.CONFIRM_RESET !== "yes") {
    throw new Error(
      'Reset blocked. Run: $env:CONFIRM_RESET="yes"'
    );
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing from backend/.env");
  }

  const parsed = new URL(process.env.MONGO_URI);
  const dbName = parsed.pathname.replace(/^\/+/, "").split("/")[0];

  if (!dbName) {
    throw new Error("Add the database name to MONGO_URI.");
  }

  if (/prod|production|live/i.test(dbName)) {
    throw new Error(`Refusing to erase database "${dbName}".`);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to database: ${dbName}`);

  try {
    if (process.env.CONFIRM_DATABASE !== dbName) {
      throw new Error(
        `Second confirmation required. Set $env:CONFIRM_DATABASE="${dbName}"`
      );
    }

    // DELETE existing data from all seven collections.
    console.log("Clearing existing collections...");

    for (const Model of [
      Notification,
      AuditLog,
      Message,
      Assignment,
      Grievance,
      User,
      Department,
    ]) {
      await Model.deleteMany({});
    }

    // 1. DEPARTMENTS
    const departmentData = [
      {
        code: "CSE",
        name: "Computer Science and Engineering",
        description:
          "Handles academic concerns, computing facilities, course delivery, and laboratory support.",
      },
      {
        code: "EEE",
        name: "Electrical and Electronics Engineering",
        description:
          "Handles electrical laboratories, equipment maintenance, course delivery, and examination support.",
      },
      {
        code: "MECH",
        name: "Mechanical Engineering",
        description:
          "Handles workshop access, laboratory equipment, course delivery, and student support.",
      },
      {
        code: "SWA",
        name: "Student Welfare and Administration",
        description:
          "Handles hostel, fees, campus infrastructure, welfare, and general administration.",
      },
    ];

    const departments = {};

    for (const d of departmentData) {
      departments[d.code] = await Department.create({
        name: d.name,
        code: d.code,
        description: d.description,
        head: null,
        isActive: true,
        createdBy: null,
      });
    }

    // 2. USERS — 12 students, 4 officers, 1 admin.
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    const users = {};

    const studentData = [
      ["Aarav Sharma", "CSE"],
      ["Ananya Verma", "EEE"],
      ["Rohan Singh", "MECH"],
      ["Ishita Gupta", "SWA"],
      ["Kabir Patel", "CSE"],
      ["Meera Joshi", "EEE"],
      ["Aditya Kumar", "MECH"],
      ["Sana Khan", "SWA"],
      ["Vihaan Mishra", "CSE"],
      ["Priya Nair", "EEE"],
      ["Arjun Das", "MECH"],
      ["Kavya Reddy", "SWA"],
    ];

    for (let i = 0; i < studentData.length; i++) {
      const [name, dept] = studentData[i];
      const key = `student${i + 1}`;

      users[key] = await User.create({
        name,
        email: `${key}@nivaran-test.example`,
        passwordHash,
        role: "student",
        accountStatus: i === 11 ? "pending" : "active",
        department: departments[dept]._id,
        studentId: `NIV-STU-${pad(i + 1)}`,
        mustChangePassword: false,
        passwordChangedAt: null,
      });
    }

    const officerData = [
      ["officer1", "Dr. Neha Kapoor", "CSE"],
      ["officer2", "Er. Rahul Menon", "EEE"],
      ["officer3", "Prof. Simran Kaur", "MECH"],
      ["officer4", "Mr. Dev Malhotra", "SWA"],
    ];

    for (const [key, name, dept] of officerData) {
      users[key] = await User.create({
        name,
        email: `${key}@nivaran-test.example`,
        passwordHash,
        role: "officer",
        accountStatus: "active",
        department: departments[dept]._id,
        studentId: null,
        mustChangePassword: false,
        passwordChangedAt: null,
      });
    }

    users.admin1 = await User.create({
      name: "NIVARAN Development Admin",
      email: "admin@nivaran-test.example",
      passwordHash,
      role: "admin",
      accountStatus: "active",
      department: departments.SWA._id,
      studentId: null,
      mustChangePassword: false,
      passwordChangedAt: null,
    });

    // Set department heads and creators.
    for (const [code, officer] of [
      ["CSE", "officer1"],
      ["EEE", "officer2"],
      ["MECH", "officer3"],
      ["SWA", "officer4"],
    ]) {
      await Department.updateOne(
        { _id: departments[code]._id },
        {
          $set: {
            head: users[officer]._id,
            createdBy: users.admin1._id,
          },
        }
      );
    }

    // 3. GRIEVANCES
    // Fields: student, department, category, priority, status,
    // title, description, resolution.
    const grievanceData = [
      [
        1, "CSE", "academic", "medium", "submitted",
        "Clarification needed on course assessment",
        "The assessment rubric for the programming course is not visible on the student portal. Please publish the rubric and clarify grading criteria before the next assessment.",
        "",
      ],
      [
        2, "SWA", "hostel", "high", "under_review",
        "Repeated water supply interruption in hostel",
        "Water supply has been interrupted several times this week in the east hostel block. Residents request an inspection and a repair timeline.",
        "",
      ],
      [
        3, "EEE", "infrastructure", "medium", "in_progress",
        "Electrical laboratory equipment needs repair",
        "Two benches in the electrical measurements laboratory have faulty connections and cannot be used reliably during practical sessions. Please arrange an inspection.",
        "",
      ],
      [
        4, "SWA", "fees", "high", "awaiting_student",
        "Fee payment receipt not reflected",
        "The online fee portal shows a successful payment, but the receipt is unavailable in my account. I can provide the transaction reference through the secure portal.",
        "",
      ],
      [
        5, "CSE", "examination", "medium", "resolved",
        "Correction requested for examination timetable",
        "The timetable lists two examinations at overlapping times for my registered courses. Please verify the schedule and confirm the correct examination slot.",
        "The examination office verified the schedule and corrected the overlapping entry. The updated timetable is available on the student portal.",
      ],
      [
        6, "MECH", "infrastructure", "low", "closed",
        "Request for additional workshop lighting",
        "Lighting near the rear workstations in the mechanical workshop is dim during afternoon practical sessions. Please assess whether additional lighting can be installed.",
        "Additional lighting was installed and verified by the workshop supervisor. The student was informed and the grievance was closed.",
      ],
      [
        7, "SWA", "administration", "medium", "escalated",
        "Delay in student identity card replacement",
        "I submitted the required form for a replacement identity card several weeks ago and have not received an update. Please confirm processing status and expected collection date.",
        "",
      ],
      [
        8, "CSE", "academic", "urgent", "in_progress",
        "Accessibility issue with online learning material",
        "Required course materials are posted as scanned documents that do not work with screen-reading software. Please provide accessible versions before the upcoming assessment.",
        "",
      ],
      [
        9, "SWA", "hostel", "medium", "submitted",
        "Inspect hostel common-room facilities",
        "Several shared facilities in the north hostel common room are not functioning consistently. Please inspect the room and share a maintenance plan.",
        "",
      ],
      [
        10, "EEE", "examination", "high", "resolved",
        "Verify internal assessment entry",
        "The internal assessment score shown on the portal differs from the score communicated after the practical examination. Please verify the entry against the official record.",
        "The department checked the signed assessment record and corrected the portal entry. The updated score is now visible.",
      ],
      [
        11, "MECH", "other", "low", "rejected",
        "Request for exception to workshop attendance rule",
        "I am requesting an exception to the workshop attendance requirement for a missed session. Please review the request and advise whether policy allows an exception.",
        "The request was reviewed against the published attendance policy. The requested exception is not permitted; the student was advised about submitting supporting documentation if applicable.",
      ],
      [
        12, "SWA", "ragging", "urgent", "under_review",
        "Confidential request for student safety support",
        "I would like to report repeated intimidating behaviour and request a confidential review by appropriate student safety officials. Please contact me through the platform and avoid public disclosure.",
        "",
      ],
    ];

    const grievances = [];

    for (let i = 0; i < grievanceData.length; i++) {
      const [
        studentNo,
        dept,
        category,
        priority,
        status,
        title,
        description,
        resolution,
      ] = grievanceData[i];

      const isEscalated = status === "escalated";
      const isResolved = ["resolved", "closed"].includes(status);
      const createdAt = ago(14 - i);

      grievances.push(
        await Grievance.create({
          ticketId: `NIV-SEED-${pad(i + 1)}`,
          student: users[`student${studentNo}`]._id,
          title,
          description,
          category,
          priority,
          status,
          department: departments[dept]._id,
          deadline: ["resolved", "closed", "rejected"].includes(status)
            ? ago(1)
            : future(
                priority === "urgent" ? 1 : priority === "high" ? 3 : 7
              ),
          isEscalated,
          escalatedAt: isEscalated ? ago(1) : null,
          resolution,
          resolvedAt: isResolved ? ago(3) : null,
          closedAt: status === "closed" ? ago(2) : null,
          createdAt,
          updatedAt:
            isResolved || status === "rejected" ? ago(2) : createdAt,
        })
      );
    }

    // 4. ASSIGNMENTS
    const officerFor = {
      CSE: "officer1",
      EEE: "officer2",
      MECH: "officer3",
      SWA: "officer4",
    };

    for (let i = 0; i < grievanceData.length; i++) {
      const [, dept, , , status] = grievanceData[i];

      if (status === "submitted") continue;

      const isFinished = ["resolved", "closed", "rejected"].includes(status);
      const assignedAt = ago(12 - (i % 5));

      await Assignment.create({
        grievance: grievances[i]._id,
        officer: users[officerFor[dept]]._id,
        assignedBy: users.admin1._id,
        assignedAt,
        unassignedAt: isFinished ? ago(3) : null,
        isCurrent: !isFinished,
        note: `Assigned to ${dept} team for review and documented follow-up.`,
        createdAt: assignedAt,
        updatedAt: assignedAt,
      });
    }

    // 5. MESSAGES
    const messageData = [
      [1, "student2", "public", "Thank you for reviewing this issue. Please let residents know when the water supply is expected to return."],
      [2, "officer2", "public", "The laboratory issue has been logged for inspection. We will update this grievance after the equipment check."],
      [3, "officer4", "public", "Please provide the payment transaction reference through the official portal so the finance team can reconcile the payment."],
      [7, "officer1", "public", "The accessible-material request is being coordinated with the course team. We will post an update here."],
      [4, "admin1", "internal", "Internal note: verify the revised timetable is published before notifying the student."],
      [5, "officer3", "public", "The lighting repair has been completed and checked by the workshop supervisor."],
      [6, "admin1", "internal", "Internal note: route this confidential report only to authorized student safety staff."],
      [9, "student10", "public", "Thank you for checking the signed record. I can now see the corrected score on the portal."],
    ];

    for (let i = 0; i < messageData.length; i++) {
      const [grievanceIndex, sender, visibility, message] = messageData[i];
      const createdAt = ago(8 - (i % 4));

      await Message.create({
        grievance: grievances[grievanceIndex]._id,
        sender: users[sender]._id,
        message,
        visibility,
        attachments:
          i === 2
            ? [
                {
                  fileName: "payment-receipt-sample.pdf",
                  fileUrl:
                    "https://example.com/nivaran-test/payment-receipt-sample.pdf",
                  mimeType: "application/pdf",
                  sizeBytes: 184320,
                },
              ]
            : [],
        createdAt,
        updatedAt: createdAt,
      });
    }

    // 6. AUDIT LOGS
    const auditData = [
      ["admin1", "SEED_DEPARTMENTS_CREATED", "department", null, { count: 4 }],
      ["admin1", "SEED_USERS_CREATED", "user", null, { count: 17 }],
      ["student1", "GRIEVANCE_SUBMITTED", "grievance", 0, { category: "academic" }],
      ["admin1", "OFFICER_ASSIGNED", "assignment", 1, { officer: "officer4" }],
      ["officer1", "GRIEVANCE_STATUS_UPDATED", "grievance", 4, { status: "resolved" }],
      ["admin1", "GRIEVANCE_ESCALATED", "grievance", 6, { reason: "Response timeline exceeded" }],
      ["officer2", "GRIEVANCE_RESOLVED", "grievance", 9, { status: "resolved" }],
    ];

    for (let i = 0; i < auditData.length; i++) {
      const [actor, action, entityType, grievanceIndex, metadata] =
        auditData[i];

      await AuditLog.create({
        actor: users[actor]._id,
        action,
        entityType,
        grievance:
          grievanceIndex === null ? null : grievances[grievanceIndex]._id,
        metadata: { seed: "NIVARAN-DEVELOPMENT-SEED", ...metadata },
        ipAddress: `192.0.2.${10 + i}`,
        timestamp: ago(10 - i),
      });
    }

    // 7. NOTIFICATIONS
    const notificationData = [
      ["student1", "grievance_submitted", "Grievance received", "Your academic grievance was submitted successfully.", 0, true],
      ["student2", "officer_assigned", "Officer assigned", "An officer has been assigned to review your hostel grievance.", 1, false],
      ["student3", "status_changed", "Grievance in progress", "Your laboratory equipment grievance is being investigated.", 2, false],
      ["student4", "new_message", "Information requested", "Please provide the payment transaction reference through the official portal.", 3, true],
      ["student5", "grievance_resolved", "Grievance resolved", "Your examination timetable concern has been resolved.", 4, true],
      ["student7", "grievance_escalated", "Grievance escalated", "Your identity card grievance has been escalated for further review.", 6, false],
      ["officer1", "officer_assigned", "New grievance assigned", "A student accessibility grievance has been assigned to your department.", 7, false],
      ["admin1", "system", "Development seed completed", "NIVARAN development sample data was inserted successfully.", null, true],
      ["student10", "grievance_resolved", "Assessment entry verified", "Your internal assessment entry has been checked and corrected.", 9, true],
      ["student12", "status_changed", "Confidential report under review", "Your report is under review by the appropriate team. Updates will appear here.", 11, false],
    ];

    for (let i = 0; i < notificationData.length; i++) {
      const [recipient, type, title, message, grievanceIndex, isRead] =
        notificationData[i];
      const createdAt = ago(6 - (i % 4));

      await Notification.create({
        recipient: users[recipient]._id,
        type,
        title,
        message,
        grievance:
          grievanceIndex === null ? null : grievances[grievanceIndex]._id,
        isRead,
        readAt: isRead ? ago(2) : null,
        createdAt,
        updatedAt: createdAt,
      });
    }

    // Final counts.
    console.log("\nSEED COMPLETED");
    for (const [name, Model] of [
      ["Departments", Department],
      ["Users", User],
      ["Grievances", Grievance],
      ["Assignments", Assignment],
      ["Messages", Message],
      ["Audit logs", AuditLog],
      ["Notifications", Notification],
    ]) {
      console.log(`${name}: ${await Model.countDocuments()}`);
    }

    console.log(`\nPassword for all seeded accounts: ${PASSWORD}`);
    console.log("Seeded account emails use @nivaran-test.example");
    console.log("mustChangePassword=false for development accounts.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("\nSEED FAILED:", error.message);
  mongoose.disconnect().finally(() => process.exit(1));
});