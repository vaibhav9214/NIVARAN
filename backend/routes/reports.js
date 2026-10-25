
const express = require("express");
const router = express.Router();

const {
  getReportSummary,
  exportGrievanceReport,
  getPublicTransparency,
} = require("../controllers/reportController");

// Public endpoint: aggregated, privacy-filtered statistics.
router.get("/public", getPublicTransparency);

// These handlers enforce admin role checks in the controller.
router.get("/summary", getReportSummary);
router.get("/export.csv", exportGrievanceReport);

module.exports = router;
