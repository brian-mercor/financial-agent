import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Loader2, User, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AgentStatusPanel } from './AgentStatusPanel'
import { ChartRenderer } from './ChartRenderer'

export function SmartChatInterface({ assistant }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeWorkflow, setActiveWorkflow] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

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

    try {
      // Add assistant message placeholder for streaming
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      }
      setMessages(prev => [...prev, assistantMessage])

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          assistantType: assistant.id,
          history: messages,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Check if response is streaming
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('text/event-stream')) {
        // Handle SSE streaming
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let fullContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                // Update message to mark as complete
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, isStreaming: false }
                    : msg
                ))
                break
              }
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullContent += parsed.content
                  // Update message with accumulated content
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: fullContent }
                      : msg
                  ))
                }
                if (parsed.chartHtml) {
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, chartHtml: parsed.chartHtml, hasChart: true }
                      : msg
                  ))
                }
                if (parsed.workflowId) {
                  setActiveWorkflow({
                    workflowId: parsed.workflowId,
                    agents: parsed.agents || [],
                    estimatedTime: parsed.estimatedTime || 30,
                  })
                }
              } catch (e) {
                console.error('Failed to parse SSE data:', e)
              }
            }
          }
        }
      } else {
        // Handle regular JSON response (fallback)
        const data = await response.json()
        
        if (data.workflowId) {
          setActiveWorkflow({
            workflowId: data.workflowId,
            agents: data.agents || [],
            estimatedTime: data.estimatedTime || 30,
          })
        }

        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { 
                ...msg, 
                content: data.message || data.content || 'I understand. How can I help you further?',
                workflowId: data.workflowId,
                chartHtml: data.chartHtml,
                hasChart: data.hasChart,
                isStreaming: false 
              }
            : msg
        ))
      }
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
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
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
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                    : 'bg-white shadow-md'
                } rounded-2xl px-6 py-4`}
              >
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <div className={`p-2 rounded-lg ${assistant.color} flex-shrink-0`}>
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
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
                          {message.isStreaming && message.content && (
                            <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
                          )}
                        </div>
                        {message.isStreaming && !message.content && (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                            <span className="text-gray-500 text-sm">Thinking...</span>
                          </div>
                        )}
                      </>
                    )}
                    {message.chartHtml && (
                      <div className="mt-4">
                        <ChartRenderer 
                          chartHtml={message.chartHtml}
                          height="400px"
                        />
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <User className="h-5 w-5 flex-shrink-0" />
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
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition"
            rows="1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="gradient-bg text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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