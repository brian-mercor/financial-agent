import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Loader2, User, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AgentStatusPanel } from './AgentStatusPanel'
import { ChartRenderer } from './ChartRenderer'
import apiService from '../services/api.service'
import { useSettings } from '../contexts/SettingsContext'

export function ClassicChatInterface({ assistant }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeWorkflow, setActiveWorkflow] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const { settings } = useSettings()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      assistantType: assistant.id,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Create assistant message placeholder for streaming
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      let fullContent = ''
      let chartHtml = null
      let hasChart = false

      // Pass response style preference to API
      const response = await apiService.streamMessage(
        userMessage.content,
        assistant.id || 'general',
        messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        (chunk) => {
          // Handle streaming chunks
          if (typeof chunk === 'string') {
            fullContent += chunk
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg
            ))
          } else if (chunk && typeof chunk === 'object') {
            if (chunk.type === 'token' && chunk.chunk) {
              fullContent += chunk.chunk
              setMessages(prev => prev.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, content: fullContent }
                  : msg
              ))
            } else if (chunk.type === 'complete') {
              // Handle complete response with chart
              if (chunk.chartHtml) {
                chartHtml = chunk.chartHtml
                hasChart = true
              }
              if (chunk.response) {
                fullContent = chunk.response
              }
            }
          }
        },
        settings.responseStyle // Pass the response style preference
      )

      // Final update with complete response
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? {
              ...msg,
              content: fullContent || response?.response || response?.message || response?.content || 'No response received',
              chartHtml: settings.enableCharts ? (chartHtml || response?.chartHtml) : null,
              hasChart: settings.enableCharts ? (hasChart || response?.hasChart) : false,
              isStreaming: false
            }
          : msg
      ))

      // Handle workflow if present
      if (response?.workflowId) {
        setActiveWorkflow({
          workflowId: response.workflowId,
          agents: response.agents || [],
          estimatedTime: response.estimatedTime || 30,
        })
      }

    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? {
              ...msg,
              content: 'Sorry, I encountered an error. Please try again.',
              isStreaming: false
            }
          : msg
      ))
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, assistant.id, messages, settings.responseStyle, settings.enableCharts])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeWorkflow && <AgentStatusPanel workflow={activeWorkflow} />}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`w-20 h-20 rounded-full ${assistant.color} flex items-center justify-center mb-4`}>
              <assistant.icon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-2">
              Hi! I'm your {assistant.name}
            </h3>
            <p className="text-gray-600 max-w-md">
              {assistant.description}. How can I help you today?
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {assistant.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white'
                    : 'bg-white shadow-md'
                } rounded-2xl px-6 py-4 ${settings.compactMode ? 'text-sm' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <div className={`p-2 rounded-lg ${assistant.color} flex-shrink-0`}>
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    {settings.showTimestamps && (
                      <p className={`text-xs mb-1 ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content || (message.isStreaming ? '...' : '')}
                          </ReactMarkdown>
                          {message.isStreaming && settings.streamingEnabled && (
                            <span className="inline-block ml-1 animate-pulse">▊</span>
                          )}
                        </div>
                        {message.chartHtml && !message.isStreaming && (
                          <div className="mt-4">
                            <ChartRenderer
                              chartHtml={message.chartHtml}
                              height="400px"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${assistant.name} anything...`}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none transition"
            rows="1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            {isLoading ? 'Processing...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}