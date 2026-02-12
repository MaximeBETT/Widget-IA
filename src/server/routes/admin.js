const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Get all conversations
router.get('/conversations/:siteId', adminController.getAllConversations);

// Mark response as incorrect
router.post('/corrections/report', adminController.reportIncorrect);

// Submit correction
router.post('/corrections/submit', adminController.submitCorrection);

// Get corrections history
router.get('/corrections/:siteId', adminController.getCorrectionHistory);

// Validate response as correct
router.post('/response/validate', adminController.validateResponse);

module.exports = router;
