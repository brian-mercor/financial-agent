import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
      timestamp: new Date(),
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

      // Use streaming API
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
              if (chunk.response) {
                fullContent = chunk.response
              }
            }
          }
        }
      )

      // Final update with complete response
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? {
              ...msg,
              content: fullContent || response?.response || response?.message || response?.content || 'No response received',
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

  // Welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `SYSTEM: ${assistant.name.toUpperCase()} INITIALIZED\n\nCapabilities: ${assistant.expertise.join(' | ')}\n\nReady for analysis.`,
      timestamp: new Date(),
    }])
  }, [assistant])

  return (
    <div className="flex flex-col h-full bg-brutal-bg">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scanline">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'brutal-card bg-brutal-red text-brutal-bg'
                  : 'brutal-card'
              } p-4`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="text-xs font-mono uppercase mb-2">
                    {message.role === 'user' ? '> USER INPUT' : '< AI RESPONSE'}
                  </div>
                  {message.role === 'user' ? (
                    <p className="font-mono text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <>
                      <div className="font-mono text-sm whitespace-pre-wrap">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content || (message.isStreaming ? '...' : '')}
                        </ReactMarkdown>
                        {message.isStreaming && (
                          <span className="inline-block ml-1 animate-pulse">▊</span>
                        )}
                      </div>
                    </>
                  )}
                  <div className="text-xs font-mono mt-2 opacity-50">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="brutal-card p-4">
              <div className="flex items-center gap-3">
                <div className="animate-pulse text-brutal-red font-mono">█</div>
                <span className="font-mono text-sm">PROCESSING...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t-4 border-brutal-line bg-brutal-ink p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ENTER QUERY..."
            className="flex-1 bg-brutal-bg border-2 border-brutal-line px-4 py-3 font-mono text-sm focus:outline-none focus:border-brutal-red transition-colors uppercase placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-brutal px-6 py-3 font-mono text-xs uppercase font-bold disabled:opacity-50"
          >
            {isLoading ? 'SENDING...' : 'EXECUTE'}
          </button>
        </form>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setInput('ANALYZE AAPL')}
            className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 font-mono text-xs uppercase hover:border-brutal-red transition-colors"
          >
            [AAPL]
          </button>
          <button
            onClick={() => setInput('PORTFOLIO RISK ASSESSMENT')}
            className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 font-mono text-xs uppercase hover:border-brutal-red transition-colors"
          >
            [RISK]
          </button>
          <button
            onClick={() => setInput('SHOW TRENDING STOCKS')}
            className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 font-mono text-xs uppercase hover:border-brutal-red transition-colors"
          >
            [TRENDING]
          </button>
          <button
            onClick={() => setInput('MARKET STATUS')}
            className="bg-brutal-bg border-2 border-brutal-line px-3 py-2 font-mono text-xs uppercase hover:border-brutal-red transition-colors"
          >
            [STATUS]
          </button>
        </div>
      </div>
    </div>
  )
}