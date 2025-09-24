const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Create a new chat session
app.post('/api/chat/sessions', async (req, res) => {
  try {
    const { userId, assistantType, initialMessage } = req.body;

    console.log('Creating chat session for:', { userId, assistantType });

    // Create session in database
    const { data: chatSession, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        assistant_type: assistantType || 'general',
        title: initialMessage ? initialMessage.substring(0, 100) : 'New conversation',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Created session:', chatSession);
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

    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ sessions: sessions || [] });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save a chat message
app.post('/api/chat/messages', async (req, res) => {
  try {
    const { sessionId, role, content, metadata } = req.body;

    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        chat_session_id: sessionId,
        role,
        content,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

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

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ messages: messages || [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Simple backend server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/chat/sessions - Create a session');
  console.log('  GET  /api/chat/sessions - Get sessions for user');
  console.log('  POST /api/chat/messages - Save a message');
  console.log('  GET  /api/chat/messages - Get messages for session');
});