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

export function ConversationProvider({ children }) {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all conversations for the user
  const fetchConversations = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/chat/sessions?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  // Fetch messages for current conversation
  const fetchMessages = async (sessionId) => {
    if (!sessionId) {
      setMessages([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      setError('Failed to load conversation')
    } finally {
      setLoading(false)
    }
  }

  // Create a new conversation
  const createConversation = async (initialMessage, assistantType = 'general') => {
    if (!user?.id) return null

    try {
      const response = await fetch(`/api/chat/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          assistantType,
          initialMessage: initialMessage?.substring(0, 100), // Use first 100 chars as title
        })
      })

      if (response.ok) {
        const data = await response.json()
        const newConversation = data.chatSession

        // Update conversations list
        setConversations(prev => [newConversation, ...prev])
        setCurrentConversation(newConversation)

        // Navigate to the new conversation URL
        navigate(`/dashboard/${newConversation.id}`)

        return newConversation
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
      setError('Failed to create conversation')
    }

    return null
  }

  // Save a message to the current conversation
  const saveMessage = async (role, content, metadata = {}) => {
    if (!currentConversation?.id) return null

    try {
      const response = await fetch(`/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: currentConversation.id,
          role,
          content,
          metadata,
        })
      })

      if (response.ok) {
        const data = await response.json()
        const newMessage = data.message

        // Update messages list
        setMessages(prev => [...prev, newMessage])

        // Update conversation's last message timestamp
        setConversations(prev => prev.map(conv =>
          conv.id === currentConversation.id
            ? { ...conv, last_message_at: new Date().toISOString() }
            : conv
        ))

        return newMessage
      }
    } catch (error) {
      console.error('Failed to save message:', error)
    }

    return null
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

  // Load conversations on mount and user change
  useEffect(() => {
    fetchConversations()
  }, [user?.id])

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