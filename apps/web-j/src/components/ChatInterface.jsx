import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, User, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import apiService from '../services/api.service'

export function ChatInterface({ assistant }) {
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

  const handleSubmit = async (e) => {
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

    try {
      // For streaming support
      let fullResponse = ''
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      await apiService.streamMessage(
        input,
        assistant?.id || 'general',
        messages.map(m => ({ role: m.role, content: m.content })),
        (chunk) => {
          // Handle streaming chunks
          if (typeof chunk === 'string') {
            fullResponse += chunk
            setMessages(prev => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage.role === 'assistant') {
                lastMessage.content = fullResponse
              }
              return newMessages
            })
          } else if (chunk && typeof chunk === 'object') {
            if (chunk.type === 'token' && chunk.chunk) {
              fullResponse += chunk.chunk
              setMessages(prev => {
                const newMessages = [...prev]
                const lastMessage = newMessages[newMessages.length - 1]
                if (lastMessage.role === 'assistant') {
                  lastMessage.content = fullResponse
                }
                return newMessages
              })
            } else if (chunk.type === 'complete' && chunk.response) {
              fullResponse = chunk.response
              setMessages(prev => {
                const newMessages = [...prev]
                const lastMessage = newMessages[newMessages.length - 1]
                if (lastMessage.role === 'assistant') {
                  lastMessage.content = fullResponse
                }
                return newMessages
              })
            }
          }
        }
      )
    } catch (error) {
      console.error('Error sending message:', error)

      // Fallback to non-streaming if streaming fails
      try {
        const response = await apiService.sendMessage(
          input,
          assistant?.id || 'general',
          messages.map(m => ({ role: m.role, content: m.content }))
        )

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.response || response.message || 'I apologize, but I encountered an error processing your request.',
          timestamp: new Date(),
        }

        setMessages(prev => {
          const newMessages = [...prev]
          if (newMessages[newMessages.length - 1]?.role === 'assistant') {
            newMessages[newMessages.length - 1] = assistantMessage
          } else {
            newMessages.push(assistantMessage)
          }
          return newMessages
        })
      } catch (fallbackError) {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full brand-mark mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-cormorant text-2xl mb-2">Welcome to FinAgent AI</h3>
            <p className="text-muted">Ask me about markets, trading strategies, or portfolio analysis</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'gradient-gold text-ink'
                  : 'glass-card'
              } rounded-2xl px-6 py-4`}
            >
              <div className="flex items-start gap-3">
                {message.role === 'assistant' && (
                  <Sparkles className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <User className="h-5 w-5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-gold" />
                <span className="text-muted">Analyzing markets...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/[0.08] p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about markets, trading strategies, or analysis..."
            className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-text placeholder-dim focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="gradient-gold text-ink px-6 py-3 rounded-xl font-semibold transition-all duration-150 shadow-[0_10px_22px_rgba(210,178,109,.18),inset_0_1px_0_rgba(255,255,255,.4)] hover:translate-y-[-1px] hover:brightness-[1.06] disabled:opacity-50 disabled:cursor-not-allowed"
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