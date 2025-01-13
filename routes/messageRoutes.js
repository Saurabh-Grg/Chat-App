const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// POST route to send a message
router.post('/send', messageController.sendMessage);

module.exports = router;
