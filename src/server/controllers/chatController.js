const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');

const DATA_DIR = path.join(__dirname, '../../data');

// Verify API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY not found in environment variables!');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log('✅ OpenAI client initialized');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getPath = (filename) => path.join(DATA_DIR, filename);

// Load or initialize conversation storage
const loadConversations = (siteId) => {
  const file = getPath(`conversations_${siteId}.json`);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return [];
};

// Save conversations
const saveConversations = (siteId, conversations) => {
  const file = getPath(`conversations_${siteId}.json`);
  fs.writeFileSync(file, JSON.stringify(conversations, null, 2));
};

// Load corrections
const loadCorrections = (siteId) => {
  const file = getPath(`corrections_${siteId}.json`);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return [];
};

// Save corrections
const saveCorrections = (siteId, corrections) => {
  const file = getPath(`corrections_${siteId}.json`);
  fs.writeFileSync(file, JSON.stringify(corrections, null, 2));
};

// Chat controller methods
const chatController = {
  getConversations: (req, res) => {
    try {
      const { siteId } = req.params;
      const conversations = loadConversations(siteId);
      res.json({ success: true, data: conversations });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  sendMessage: (req, res) => {
    try {
      const { siteId, visitorId, message } = req.body;
      const conversations = loadConversations(siteId);

      let conversation = conversations.find(c => c.visitorId === visitorId);
      if (!conversation) {
        conversation = {
          id: uuidv4(),
          siteId,
          visitorId,
          messages: [],
          createdAt: new Date()
        };
        conversations.push(conversation);
      }

      // Add visitor message
      conversation.messages.push({
        id: uuidv4(),
        type: 'visitor',
        content: message,
        timestamp: new Date(),
        corrected: false
      });

      saveConversations(siteId, conversations);

      res.json({ success: true, conversationId: conversation.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  askAI: async (req, res) => {
    try {
      const { siteId, visitorId, question } = req.body;

      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const conversations = loadConversations(siteId);
      const corrections = loadCorrections(siteId);

      // Get AI response
      const aiResponse = await generateAIResponse(question, corrections);

      let conversation = conversations.find(c => c.visitorId === visitorId);
      if (!conversation) {
        conversation = {
          id: uuidv4(),
          siteId,
          visitorId,
          messages: [],
          createdAt: new Date()
        };
        conversations.push(conversation);
      }

      // Add both visitor and AI messages
      conversation.messages.push({
        id: uuidv4(),
        type: 'visitor',
        content: question,
        timestamp: new Date(),
        corrected: false
      });

      conversation.messages.push({
        id: uuidv4(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        corrected: false
      });

      saveConversations(siteId, conversations);

      res.json({
        success: true,
        response: aiResponse
      });
    } catch (error) {
      console.error('Chat Error:', error);
      res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
  }
};

// Helper to generate AI response
const generateAIResponse = async (question, corrections) => {
  try {
    // Check if there's a correction for similar question
    const relevantCorrection = corrections.find(c =>
      c.originalQuestion && c.originalQuestion.toLowerCase().includes(question.substring(0, 20).toLowerCase())
    );

    if (relevantCorrection && relevantCorrection.correctedAnswer) {
      console.log('✅ Using cached correction');
      return relevantCorrection.correctedAnswer;
    }

    console.log('🔄 Calling OpenAI API...');
    
    // Call OpenAI API
    const message = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant IA utile et concis. Réponds en français.'
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const response = message.choices[0].message.content;
    console.log('✅ OpenAI response received:', response.substring(0, 50) + '...');
    return response;
  } catch (error) {
    console.error('❌ OpenAI API Error:', {
      message: error.message,
      code: error.code,
      status: error.status,
      type: error.type
    });
    throw error; // Re-throw so the caller can handle it
  }
};

module.exports = chatController;
