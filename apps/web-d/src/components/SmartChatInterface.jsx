import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { apiService } from '../services/api.service'
import { useAuth } from '../contexts/AuthContext'

function SmartChatInterface({ assistant }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [suggestions] = useState([
    { text: 'Market Analysis', query: 'What\'s the current market outlook for tech stocks?' },
    { text: 'Trading Signal', query: 'Should I buy or sell AAPL today?' },
    { text: 'Risk Assessment', query: 'What are the major risks in my portfolio?' },
    { text: 'Economic Update', query: 'How will Fed decisions impact my investments?' },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = useCallback(async (e, customInput = null) => {
    e?.preventDefault()
    const messageText = customInput || input
    if (!messageText.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    if (!customInput) setInput('')
    setIsLoading(true)

    try {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        guide: assistant.name,
      }

      setMessages(prev => [...prev, assistantMessage])

      // Build conversation history for context
      const history = messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))

      // Since Motia doesn't support streaming, simulate it with typing effect
      const response = await apiService.sendMessage(
        messageText,
        assistant.id,
        {
          userId: user?.id || `user-${Date.now()}`,
          history,
          context: {
            symbols: extractSymbols(messageText),
            timeframe: '1d',
            riskTolerance: 'moderate'
          }
        }
      )

      // Extract the response content
      const responseContent = response.response || response.message || response.content || 'No response received'

      // Simulate streaming effect by typing out the response
      let currentIndex = 0
      const typingSpeed = 10 // milliseconds per character

      const typeInterval = setInterval(() => {
        if (currentIndex < responseContent.length) {
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            lastMessage.content = responseContent.substring(0, currentIndex + 1)
            return newMessages
          })
          currentIndex++
        } else {
          clearInterval(typeInterval)

          // Add chart if present after text is fully typed
          if (response.chartHtml) {
            setMessages(prev => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              lastMessage.chartHtml = response.chartHtml
              lastMessage.hasChart = true
              return newMessages
            })
          }
        }
      }, typingSpeed)

    } catch (error) {
      console.error('Error sending message:', error)

      // If streaming fails, try regular API call
      try {
        const response = await apiService.sendMessage(
          messageText,
          assistant.id,
          {
            userId: user?.id || `user-${Date.now()}`,
            history: messages,
            context: {
              symbols: extractSymbols(messageText),
              timeframe: '1d',
              riskTolerance: 'moderate'
            }
          }
        )

        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          lastMessage.content = response.response || response.message || response.content || 'No response received'
          if (response.chartHtml) {
            lastMessage.chartHtml = response.chartHtml
            lastMessage.hasChart = true
          }
          return newMessages
        })
      } catch (fallbackError) {
        console.error('Fallback API call failed:', fallbackError)
        const errorMessage = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to the server. Please check your connection and try again.',
          timestamp: new Date().toISOString(),
          isError: true,
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, assistant, user, messages])

  const handleSuggestionClick = (query) => {
    setInput(query)
    handleSubmit(null, query)
  }

  // Extract stock symbols from message
  const extractSymbols = (text) => {
    const symbols = text.match(/\b[A-Z]{1,5}\b/g) || []
    return symbols.filter(s => s.length >= 2 && s.length <= 5)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-purple-100/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-12 rounded-md bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 96" className="w-7 h-9">
                <rect x="8" y="8" width="48" height="80" rx="9" fill="none" stroke="#F2B807" strokeWidth="1.4" opacity=".9"/>
                <circle cx="32" cy="52" r="12" fill="none" stroke="#A78BFA" strokeWidth="2"/>
                <circle cx="32" cy="52" r="7" fill="none" stroke="#E9D5FF" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold">{assistant.name}</h3>
              <p className="text-xs text-purple-100/70">{assistant.tone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-purple-100/70">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="relative w-16 h-20 rounded-md bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 96" className="w-full h-full p-2">
                  <rect x="8" y="8" width="48" height="80" rx="9" fill="none" stroke="#F2B807" strokeWidth="1.4" opacity=".9"/>
                  <path d="M20 60 L30 45 L40 50 L50 35" stroke="#A78BFA" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-semibold mb-2">Ask {assistant.name}</h4>
            <p className="text-sm text-purple-100/70 mb-6">
              Get expert financial analysis and insights instantly
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion.query)}
                  className="chip rounded-full px-3 py-1.5 text-xs"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'user' ? (
                <div className="max-w-3xl guide-card px-4 py-3 rounded-2xl">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              ) : (
                <div className="max-w-3xl">
                  <div className={`relative overflow-hidden rounded-2xl border ${message.isError ? 'border-red-500/25 bg-red-500/5' : 'border-yellow-200/25 bg-gradient-to-b from-white/5 to-white/0'} p-4`}>
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent"></div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-10 rounded-md bg-gradient-to-b from-yellow-100/20 to-yellow-300/10 border border-yellow-200/50 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 96" className="w-5 h-7">
                          <rect x="8" y="8" width="48" height="80" rx="9" fill="none" stroke="#F2B807" strokeWidth="1.4" opacity=".9"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-purple-100/70 mb-2">{message.guide || assistant.name}</div>
                        <div className="prose prose-sm max-w-none text-purple-100/90">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content || ''}
                          </ReactMarkdown>
                        </div>
                        {message.chartHtml && (
                          <div className="mt-4">
                            <div
                              className="w-full min-h-[400px] bg-white/5 rounded-lg overflow-hidden"
                              dangerouslySetInnerHTML={{ __html: message.chartHtml }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="relative overflow-hidden rounded-2xl border border-yellow-200/25 bg-gradient-to-b from-white/5 to-white/0 p-4">
              <div className="flex items-center gap-3">
                <div className="spinner"></div>
                <span className="text-sm text-purple-100/70">{assistant.name} is analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-purple-100/10 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${assistant.name} about markets, trading, or your portfolio...`}
              className="input w-full px-4 py-3 pr-20 text-sm placeholder-purple-100/50"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-purple-100/60 hover:text-purple-100/80"
              disabled={!input || isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-100/60">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-gold rounded-xl px-4 py-3 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            )}
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between text-xs text-purple-100/60">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by AI • Real-time analysis</span>
        </div>
      </div>
    </div>
  )
}

export default SmartChatInterface