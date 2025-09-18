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
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }

      setMessages(prev => [...prev, assistantMessage])

      await apiService.streamMessage(
        input,
        assistant.id,
        { history: messages },
        (chunk) => {
          if (chunk.content) {
            assistantMessage.content += chunk.content
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessage.id
                ? { ...assistantMessage }
                : msg
            ))
          }
          if (chunk.chartHtml) {
            assistantMessage.chartHtml = chunk.chartHtml
            assistantMessage.hasChart = true
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessage.id
                ? { ...assistantMessage }
                : msg
            ))
          }
        }
      )

      assistantMessage.isStreaming = false
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessage.id
          ? { ...assistantMessage }
          : msg
      ))
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, assistant.id, messages])

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="graffiti-tag street-art-text text-3xl mb-4">Ready to Trade</div>
            <p className="text-gray-400">Ask {assistant.name} anything about markets, trading, or your portfolio</p>
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
                  ? 'interactive-btn text-black'
                  : 'luxury-card'
              } rounded-2xl px-6 py-4`}
            >
              <div className="flex items-start gap-3">
                {message.role === 'assistant' && (
                  <div className="feature-icon" style={{ width: '30px', height: '30px' }}>
                    <Sparkles className="h-4 w-4 text-black" />
                  </div>
                )}
                <div className="flex-1">
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap font-medium">{message.content}</p>
                  ) : (
                    <>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      {message.chartHtml && (
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

        {isLoading && (
          <div className="flex justify-start">
            <div className="luxury-card rounded-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                <span className="text-gray-400">Analyzing markets...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-yellow-500/20 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${assistant.name} about markets, trading, or your portfolio...`}
            className="flex-1 px-4 py-3 bg-black/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-500"
            disabled={isLoading}
          />
          <div className="ornate-border rounded-xl">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="interactive-btn px-6 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}