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
      const response = await apiService.sendMessage(
        input,
        assistant.id,
        messages
      )

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || response.message || response.content || 'I understand your request. Let me analyze that for you.',
        timestamp: new Date(),
        chartHtml: response.chartHtml,
        hasChart: response.hasChart,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an issue connecting to the server. Please make sure the backend is running on port 3000.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, assistant.id, messages])

  // Welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your ${assistant.name}. I specialize in ${assistant.expertise.join(', ')}. How can I help you today?`,
      timestamp: new Date(),
    }])
  }, [assistant])

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
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
            <div className="bg-white shadow-md rounded-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                <span className="text-gray-500">Analyzing markets...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${assistant.name} about markets, trading, or your portfolio...`}
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
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setInput('Analyze AAPL stock')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition"
          >
            Analyze AAPL
          </button>
          <button
            onClick={() => setInput('Show my portfolio risk')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition"
          >
            Portfolio Risk
          </button>
          <button
            onClick={() => setInput('What are trending stocks today?')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition"
          >
            Trending Stocks
          </button>
        </div>
      </div>
    </div>
  )
}