import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ConversationContext = createContext({})

export const useConversation = () => {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider')
  }
  return context
}

// MOCK: This is a mock implementation for testing without backend
export function ConversationProvider({ children }) {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize with mock data
  useEffect(() => {
    // MOCK: Sample conversations for demonstration
    const mockConversations = [
      {
        id: 'mock-conv-1',
        title: 'Market Analysis Request',
        created_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
        user_id: user?.id,
        assistant_type: 'analyst'
      },
      {
        id: 'mock-conv-2',
        title: 'Portfolio Review',
        created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        last_message_at: new Date(Date.now() - 86400000).toISOString(),
        user_id: user?.id,
        assistant_type: 'advisor'
      },
      {
        id: 'mock-conv-3',
        title: 'Trading Strategy Discussion',
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        last_message_at: new Date(Date.now() - 172800000).toISOString(),
        user_id: user?.id,
        assistant_type: 'trader'
      }
    ]

    if (user?.id && conversations.length === 0) {
      setConversations(mockConversations)
    }
  }, [user?.id])

  // MOCK: Fetch messages for current conversation
  const fetchMessages = async (sessionId) => {
    if (!sessionId) {
      setMessages([])
      return
    }

    setLoading(true)

    // MOCK: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // MOCK: Sample messages based on conversation ID
    const mockMessages = sessionId === 'mock-conv-1'
      ? [
          { id: '1', role: 'user', content: 'What is the current market outlook for tech stocks?', created_at: new Date().toISOString() },
          { id: '2', role: 'assistant', content: 'Based on recent trends, tech stocks are showing strong momentum...', created_at: new Date().toISOString() }
        ]
      : []

    setMessages(mockMessages)
    setLoading(false)
  }

  // MOCK: Create a new conversation
  const createConversation = async (initialMessage, assistantType = 'general') => {
    if (!user?.id) return null

    // MOCK: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const newConversation = {
      id: `conv-${Date.now()}`,
      title: initialMessage?.substring(0, 100) || 'New conversation',
      created_at: new Date().toISOString(),
      last_message_at: new Date().toISOString(),
      user_id: user.id,
      assistant_type: assistantType
    }

    // Update conversations list
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversation(newConversation)

    // Navigate to the new conversation URL
    navigate(`/dashboard/${newConversation.id}`)

    console.log('MOCK: Created conversation', newConversation)
    return newConversation
  }

  // MOCK: Save a message to the current conversation
  const saveMessage = async (role, content, metadata = {}) => {
    if (!currentConversation?.id) return null

    // MOCK: Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const newMessage = {
      id: `msg-${Date.now()}`,
      chat_session_id: currentConversation.id,
      role,
      content,
      created_at: new Date().toISOString(),
      metadata
    }

    // Update messages list
    setMessages(prev => [...prev, newMessage])

    // Update conversation's last message timestamp
    setConversations(prev => prev.map(conv =>
      conv.id === currentConversation.id
        ? { ...conv, last_message_at: new Date().toISOString() }
        : conv
    ))

    console.log('MOCK: Saved message', newMessage)
    return newMessage
  }

  // Start a new conversation
  const startNewConversation = () => {
    setCurrentConversation(null)
    setMessages([])
    navigate('/dashboard')
  }

  // Load conversation when ID changes
  useEffect(() => {
    if (conversationId) {
      // Find conversation in list or set placeholder
      const conversation = conversations.find(c => c.id === conversationId)
      setCurrentConversation(conversation || { id: conversationId })
      fetchMessages(conversationId)
    } else {
      setCurrentConversation(null)
      setMessages([])
    }
  }, [conversationId, conversations])

  // MOCK: Fetch conversations on mount (already done in initialization)
  const fetchConversations = async () => {
    console.log('MOCK: Conversations already loaded')
  }

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    createConversation,
    saveMessage,
    startNewConversation,
    fetchConversations,
    setMessages,
  }

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}