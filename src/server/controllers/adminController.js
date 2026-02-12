const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data');

const getPath = (filename) => path.join(DATA_DIR, filename);

const loadConversations = (siteId) => {
  const file = getPath(`conversations_${siteId}.json`);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return [];
};

const loadCorrections = (siteId) => {
  const file = getPath(`corrections_${siteId}.json`);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return [];
};

const saveCorrections = (siteId, corrections) => {
  const file = getPath(`corrections_${siteId}.json`);
  fs.writeFileSync(file, JSON.stringify(corrections, null, 2));
};

const saveConversations = (siteId, conversations) => {
  const file = getPath(`conversations_${siteId}.json`);
  fs.writeFileSync(file, JSON.stringify(conversations, null, 2));
};

const adminController = {
  // Get all conversations
  getAllConversations: (req, res) => {
    try {
      const { siteId } = req.params;
      const conversations = loadConversations(siteId);

      // Return with corrections applied
      const withCorrections = conversations.map(conv => ({
        ...conv,
        messageCount: conv.messages.length,
        lastMessage: conv.messages[conv.messages.length - 1]?.timestamp
      }));

      res.json({ success: true, data: withCorrections });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Report response as incorrect
  reportIncorrect: (req, res) => {
    try {
      const { siteId, messageId, conversationId, reason } = req.body;
      const corrections = loadCorrections(siteId);

      const correction = {
        id: uuidv4(),
        messageId,
        conversationId,
        reportedReason: reason,
        status: 'reported',
        createdAt: new Date(),
        correctedAnswer: null
      };

      corrections.push(correction);
      saveCorrections(siteId, corrections);

      res.json({ success: true, correction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Submit correction
  submitCorrection: (req, res) => {
    try {
      const { siteId, correctionId, originalQuestion, correctedAnswer } = req.body;
      const corrections = loadCorrections(siteId);
      const conversations = loadConversations(siteId);

      const correction = corrections.find(c => c.id === correctionId);
      if (!correction) {
        return res.status(404).json({ error: 'Correction not found' });
      }

      correction.originalQuestion = originalQuestion;
      correction.correctedAnswer = correctedAnswer;
      correction.status = 'corrected';
      correction.correctedAt = new Date();

      // Mark message as corrected in conversations
      conversations.forEach(conv => {
        const msg = conv.messages.find(m => m.id === correction.messageId);
        if (msg) {
          msg.corrected = true;
          msg.correctionId = correctionId;
        }
      });

      saveCorrections(siteId, corrections);
      saveConversations(siteId, conversations);

      res.json({ success: true, correction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get corrections history
  getCorrectionHistory: (req, res) => {
    try {
      const { siteId } = req.params;
      const corrections = loadCorrections(siteId);

      const history = corrections.map(c => ({
        ...c,
        status: c.status,
        hasCorrection: !!c.correctedAnswer
      }));

      res.json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Validate response as correct
  validateResponse: (req, res) => {
    try {
      const { siteId, messageId } = req.body;
      const conversations = loadConversations(siteId);

      conversations.forEach(conv => {
        const msg = conv.messages.find(m => m.id === messageId);
        if (msg) {
          msg.validated = true;
          msg.validatedAt = new Date();
        }
      });

      saveConversations(siteId, conversations);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = adminController;
