const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Get conversation history
router.get('/conversations/:siteId', chatController.getConversations);

// Send message (visitor)
router.post('/message', chatController.sendMessage);

// Get AI response
router.post('/ask', chatController.askAI);

module.exports = router;
