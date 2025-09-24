const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for mock data
const sessions = new Map();
const messages = new Map();

// Create a new chat session
app.post('/api/chat/sessions', async (req, res) => {
  try {
    const { userId, assistantType, initialMessage } = req.body;

    const sessionId = `session-${Date.now()}`;
    const chatSession = {
      id: sessionId,
      user_id: userId,
      assistant_type: assistantType || 'general',
      title: initialMessage ? initialMessage.substring(0, 100) : 'New conversation',
      created_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
    };

    sessions.set(sessionId, chatSession);

    console.log('MOCK: Created session:', chatSession);
    res.status(201).json({
      sessionId: chatSession.id,
      chatSession
    });

  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get chat sessions for a user
app.get('/api/chat/sessions', async (req, res) => {
  try {
    const { userId } = req.query;

    const userSessions = Array.from(sessions.values())
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    console.log(`MOCK: Found ${userSessions.length} sessions for user ${userId}`);
    res.json({ sessions: userSessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save a chat message
app.post('/api/chat/messages', async (req, res) => {
  try {
    const { sessionId, role, content, metadata } = req.body;

    const messageId = `msg-${Date.now()}`;
    const message = {
      id: messageId,
      chat_session_id: sessionId,
      role,
      content,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    };

    if (!messages.has(sessionId)) {
      messages.set(sessionId, []);
    }
    messages.get(sessionId).push(message);

    // Update session's last_message_at
    const session = sessions.get(sessionId);
    if (session) {
      session.last_message_at = new Date().toISOString();
    }

    console.log('MOCK: Saved message:', message);
    res.status(201).json({ message });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a session
app.get('/api/chat/messages', async (req, res) => {
  try {
    const { sessionId } = req.query;

    const sessionMessages = messages.get(sessionId) || [];

    console.log(`MOCK: Found ${sessionMessages.length} messages for session ${sessionId}`);
    res.json({ messages: sessionMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mock: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MOCK backend server running on port ${PORT}`);
  console.log('⚠️  This is a MOCK server - data is stored in memory only');
  console.log('\nAvailable endpoints:');
  console.log('  POST /api/chat/sessions - Create a session');
  console.log('  GET  /api/chat/sessions - Get sessions for user');
  console.log('  POST /api/chat/messages - Save a message');
  console.log('  GET  /api/chat/messages - Get messages for session');
  console.log('  GET  /health           - Health check');
});