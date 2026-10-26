
const Grievance = require("../models/Grievance");
const Department = require("../models/Department");
const AuditLog = require("../models/AuditLog");

const FINAL_STATUSES = ["resolved", "closed"];
const DAY_MS = 24 * 60 * 60 * 1000;

function isAdmin(req) {
  return req.user?.role === "admin";
}

function escapeCsv(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function sendCsv(res, filename, headers, rows) {
  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\r\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  return res.status(200).send("\uFEFF" + csv);
}

// Admin: overview and department-level statistics.
async function getReportSummary(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const now = new Date();

    const [statusCounts, departmentCounts, timing] = await Promise.all([
      Grievance.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Grievance.aggregate([
        {
          $group: {
            _id: "$department",
            total: { $sum: 1 },
            resolved: {
              $sum: {
                $cond: [{ $in: ["$status", FINAL_STATUSES] }, 1, 0],
              },
            },
          },
        },
        {
          $lookup: {
            from: Department.collection.name,
            localField: "_id",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $project: {
            _id: 0,
            departmentId: "$_id",
            departmentName: {
              $ifNull: [
                { $arrayElemAt: ["$department.name", 0] },
                "Unassigned",
              ],
            },
            total: 1,
            resolved: 1,
          },
        },
        { $sort: { departmentName: 1 } },
      ]),
      Grievance.aggregate([
        {
          $match: {
            status: { $in: FINAL_STATUSES },
            resolvedAt: { $type: "date" },
          },
        },
        {
          $project: {
            duration: { $subtract: ["$resolvedAt", "$createdAt"] },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            averageResolutionMs: { $avg: "$duration" },
          },
        },
      ]),
    ]);

    const total = statusCounts.reduce((sum, item) => sum + item.count, 0);
    const overdue = await Grievance.countDocuments({
      deadline: { $lt: now },
      status: { $nin: FINAL_STATUSES },
    });

    const avgMs = timing[0]?.averageResolutionMs ?? null;

    // Count official actions recorded in the append-only audit collection.
    const auditEvents = await AuditLog.countDocuments();

    return res.json({
      totalGrievances: total,
      statusCounts: Object.fromEntries(
        statusCounts.map((item) => [item._id, item.count])
      ),
      overdueOpenGrievances: overdue,
      averageResolutionHours:
        avgMs === null ? null : Math.round((avgMs / 3600000) * 100) / 100,
      resolvedGrievancesMeasured: timing[0]?.count ?? 0,
      departmentCounts,
      auditEvents,
      generatedAt: now,
    });
  } catch (error) {
    console.error("Report summary error:", error);
    return res.status(500).json({ message: "Could not generate report." });
  }
}

// Admin: export grievance-level operational data.
// Intentionally excludes student name, email, and grievance description.
async function exportGrievanceReport(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const grievances = await Grievance.find()
      .select("ticketId category priority status department createdAt deadline resolvedAt")
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      "Ticket ID",
      "Category",
      "Priority",
      "Status",
      "Department",
      "Department Code",
      "Created At",
      "Deadline",
      "Resolved At",
    ];

    const rows = grievances.map((g) => [
      g.ticketId,
      g.category,
      g.priority,
      g.status,
      g.department?.name || "Unassigned",
      g.department?.code || "",
      g.createdAt?.toISOString() || "",
      g.deadline?.toISOString() || "",
      g.resolvedAt?.toISOString() || "",
    ]);

    return sendCsv(
      res,
      `nivaran-grievances-${new Date().toISOString().slice(0, 10)}.csv`,
      headers,
      rows
    );
  } catch (error) {
    console.error("Grievance CSV export error:", error);
    return res.status(500).json({ message: "Could not export report." });
  }
}

// Public: aggregate-only statistics.
// Suppress small groups to reduce the risk of identifying individuals.
async function getPublicTransparency(req, res) {
  try {
    const MIN_GROUP_SIZE = 5;

    const [total, statusCounts, departmentCounts, resolvedTiming] =
      await Promise.all([
        Grievance.countDocuments(),
        Grievance.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Grievance.aggregate([
          { $group: { _id: "$department", count: { $sum: 1 } } },
          {
            $lookup: {
              from: Department.collection.name,
              localField: "_id",
              foreignField: "_id",
              as: "department",
            },
          },
          {
            $project: {
              _id: 0,
              name: {
                $ifNull: [
                  { $arrayElemAt: ["$department.name", 0] },
                  "Unassigned",
                ],
              },
              count: 1,
            },
          },
        ]),
        Grievance.aggregate([
          {
            $match: {
              status: { $in: FINAL_STATUSES },
              resolvedAt: { $type: "date" },
            },
          },
          {
            $project: {
              duration: { $subtract: ["$resolvedAt", "$createdAt"] },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              averageMs: { $avg: "$duration" },
            },
          },
        ]),
      ]);

    const visibleStatuses = statusCounts
      .filter((item) => item.count >= MIN_GROUP_SIZE)
      .map(({ _id, count }) => ({ status: _id, count }));

    const visibleDepartments = departmentCounts
      .filter((item) => item.count >= MIN_GROUP_SIZE)
      .map(({ name, count }) => ({ department: name, count }));

    const avgMs = resolvedTiming[0]?.averageMs ?? null;

    return res.json({
      totalGrievances: total >= MIN_GROUP_SIZE ? total : null,
      statusCounts: visibleStatuses,
      departmentCounts: visibleDepartments,
      averageResolutionDays:
        avgMs === null
          ? null
          : Math.round((avgMs / DAY_MS) * 100) / 100,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Public transparency error:", error);
    return res.status(500).json({
      message: "Transparency statistics are temporarily unavailable.",
    });
  }
}

module.exports = {
  getReportSummary,
  exportGrievanceReport,
  getPublicTransparency,
};
