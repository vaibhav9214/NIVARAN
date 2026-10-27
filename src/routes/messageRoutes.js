const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/grievances/:id', messageController.getMessages);
router.post('/grievances/:id', messageController.sendMessage);

module.exports = router;

