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
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  const simulateStreaming = (text, onComplete) => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        const chunkSize = Math.min(3 + Math.floor(Math.random() * 5), text.length - index)
        const chunk = text.slice(index, index + chunkSize)
        setStreamingMessage(prev => prev + chunk)
        index += chunkSize
      } else {
        clearInterval(interval)
        onComplete()
      }
    }, 30)
    return interval
  }

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
    setIsStreaming(true)
    setStreamingMessage('')

    try {
      const messageHistory = messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))

      const response = await apiService.sendMessage(
        input,
        assistant.id,
        { history: messageHistory }
      )

      const responseText = response.response || response.message || response.content || 'I apologize, but I encountered an issue processing your request.'

      simulateStreaming(responseText, () => {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          chartHtml: response.chartHtml,
          hasChart: response.hasChart,
        }

        setMessages(prev => [...prev, assistantMessage])
        setStreamingMessage('')
        setIsStreaming(false)
        setIsLoading(false)
      })
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
      setStreamingMessage('')
      setIsStreaming(false)
      setIsLoading(false)
    }
  }, [input, isLoading, assistant.id, messages])

  return (
    <div className="flex flex-col h-full handdrawn-bg">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'outsider-button bg-accent'
                  : 'folk-card'
              } px-6 py-4`}
            >
              <div className="flex items-start gap-3">
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-secondary border-3 border-dark flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="h-5 w-5 text-dark" />
                  </div>
                )}
                <div className="flex-1">
                  {message.role === 'user' ? (
                    <p className="folk-text text-lg font-bold text-dark">{message.content}</p>
                  ) : (
                    <>
                      <div className="prose prose-sm max-w-none folk-text text-lg">
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
                  <div className="w-10 h-10 rounded-full bg-primary border-3 border-dark flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isStreaming && streamingMessage && (
          <div className="flex justify-start animate-fadeInUp">
            <div className="folk-card px-6 py-4 max-w-3xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary border-3 border-dark flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="h-5 w-5 text-dark" />
                </div>
                <div className="flex-1 folk-text text-lg">
                  {streamingMessage}
                  <span className="inline-block w-2 h-5 bg-dark ml-1 animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && !isStreaming && (
          <div className="flex justify-start">
            <div className="folk-card px-6 py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-secondary" />
                <span className="folk-text text-lg">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t-4 border-dashed border-dark bg-white p-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${assistant.name} anything...`}
            className="flex-1 px-4 py-3 rounded-xl border-3 border-dark folk-text text-lg focus:ring-4 focus:ring-secondary focus:border-secondary outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="outsider-button px-6 py-3 disabled:opacity-50"
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