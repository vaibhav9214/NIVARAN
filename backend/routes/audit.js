
const express = require("express");
const router = express.Router();

const { getAuditLogs } = require("../controllers/auditController");

// Admin role check is in the controller.
// Authentication middleware must also be added during team integration.
router.get("/", getAuditLogs);

module.exports = router;
