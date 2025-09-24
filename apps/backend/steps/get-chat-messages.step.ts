import { z } from 'zod';
import type { ApiRouteConfig, Handlers } from 'motia';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client lazily to avoid initialization errors
let supabase: any = null;

const getSupabase = () => {
  if (!supabase && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabase;
};

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'GetChatMessages',
  method: 'GET',
  path: '/api/chat/messages',
  emits: [],
};

export const handler: Handlers['GetChatMessages'] = async (req, { logger }) => {
  try {
    // Manually parse and validate query parameters
    const query = req.query || {};
    const sessionId = query.sessionId as string;
    const threadId = query.threadId as string | undefined;
    const limit = query.limit ? parseInt(query.limit as string) : 50;
    const offset = query.offset ? parseInt(query.offset as string) : 0;

    if (!sessionId) {
      return {
        status: 400,
        body: { error: 'sessionId is required' }
      };
    }
    
    logger.info('Fetching chat messages', { sessionId, threadId, limit, offset });

    const db = getSupabase();
    if (!db) {
      logger.error('Supabase not configured');
      return {
        status: 503,
        body: { error: 'Database service not configured' },
      };
    }

    // First verify the session exists
    const { data: session, error: sessionError } = await db
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      logger.error('Chat session not found', { sessionId });
      return {
        status: 404,
        body: { error: 'Chat session not found' },
      };
    }

    // Build messages query
    let dbQuery = db
      .from('chat_messages')
      .select('*')
      .eq('chat_session_id', sessionId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    // Filter by thread if specified
    if (threadId) {
      dbQuery = dbQuery.eq('thread_id', threadId);
    }

    const { data: messages, error: messagesError, count } = await dbQuery;

    if (messagesError) {
      logger.error('Failed to fetch messages', { error: messagesError });
      return {
        status: 500,
        body: { error: 'Failed to fetch messages', details: messagesError.message },
      };
    }

    // Get thread information if messages have threads
    const threadIds = [...new Set(messages?.filter(m => m.thread_id).map(m => m.thread_id))];
    let threads: any[] = [];
    
    if (threadIds.length > 0) {
      // Get thread starter messages
      const { data: threadStarters } = await db
        .from('chat_messages')
        .select('thread_id, content, created_at')
        .in('thread_id', threadIds)
        .eq('parent_message_id', null)
        .order('created_at');

      threads = threadStarters || [];
    }

    logger.info('Chat messages fetched successfully', { 
      sessionId, 
      messageCount: messages?.length || 0 
    });

    return {
      status: 200,
      body: {
        session,
        messages: messages || [],
        threads,
        total: count || 0,
        limit,
        offset,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to fetch chat messages', { error: errorMessage });
    
    return {
      status: 500,
      body: { error: 'Failed to fetch chat messages', message: errorMessage },
    };
  }
};