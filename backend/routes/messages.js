const express = require("express");
const router = express.Router();

const {
  getMessages,
  sendMessage,
  changeStatus,
} = require("../controllers/messageController");

// IMPORTANT:
// Add your team's shared authentication middleware before these handlers.
// The controllers expect req.user to contain the authenticated user.

router.get("/grievances/:id", getMessages);
router.post("/grievances/:id", sendMessage);
router.patch("/grievances/:id/status", changeStatus);

module.exports = router;