import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Loader2, User, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChartRenderer } from './ChartRenderer'
import { apiService } from '../services/api.service'

export function SmartChatInterface({ assistant }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
      isStreaming: true,
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      const history = messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))

      let fullContent = ''
      let chartHtml = null
      let hasChart = false

      // Use streaming API with enhanced chunk handling
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
        }
      )

      // Final update with complete response and chart
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? {
              ...msg,
              content: fullContent || response?.response || response?.message || response?.content || 'No response received',
              chartHtml: chartHtml || response?.chartHtml,
              hasChart: hasChart || response?.hasChart,
              isStreaming: false
            }
          : msg
      ))
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
  }, [input, isLoading, assistant.id, messages])

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                  : 'bg-white shadow-md'
              } rounded-2xl px-6 py-4`}
            >
              <div className="flex items-start gap-3">
                {message.role === 'assistant' && (
                  <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content || (message.isStreaming ? '...' : '')}
                        </ReactMarkdown>
                        {message.isStreaming && (
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
                  <User className="h-5 w-5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${assistant.name} anything...`}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="gradient-bg text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}