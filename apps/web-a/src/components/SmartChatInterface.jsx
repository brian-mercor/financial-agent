import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Loader2, User, Sparkles, FileText, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import apiService from '../services/api.service'
import { useSettings } from '../contexts/SettingsContext'
import { useConversation } from '../contexts/ConversationContext'

export function SmartChatInterface({ assistant }) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const { settings } = useSettings()
  const {
    messages,
    setMessages,
    currentConversation,
    createConversation,
    saveMessage
  } = useConversation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-select the latest assistant report on desktop (if enabled in settings)
  useEffect(() => {
    if (settings.autoSelectLatestReport) {
      const assistantMessages = messages.filter(m => m.role === 'assistant')
      if (assistantMessages.length > 0 && window.innerWidth >= 1024) {
        setSelectedReport(assistantMessages[assistantMessages.length - 1])
      }
    }
  }, [messages, settings.autoSelectLatestReport])

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

    // Create conversation if this is the first message
    let conversation = currentConversation
    if (!conversation) {
      conversation = await createConversation(input, assistant.id)
      if (!conversation) {
        console.error('Failed to create conversation')
        return
      }
    }

    // Save the user message to the database
    await saveMessage('user', input, { assistantType: assistant.id })

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

      // Use apiService.streamMessage for proper streaming
      // Note: Split view always uses report style
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
        'report' // Split view always uses report style
      )

      // Final update with complete response
      const finalContent = fullContent || response?.response || response?.message || response?.content || 'No response received'
      const finalMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: finalContent,
        chartHtml: chartHtml || response?.chartHtml,
        hasChart: hasChart || response?.hasChart,
        isStreaming: false,
        timestamp: new Date(),
      }

      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId ? finalMessage : msg
      ))

      // Save assistant response to conversation
      await saveMessage('assistant', finalContent, {
        assistantType: assistant.id,
        workflowId: response?.workflowId
      })

      // Auto-select this report on desktop
      if (window.innerWidth >= 1024) {
        setSelectedReport(finalMessage)
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
  }, [input, isLoading, assistant.id, messages, currentConversation, createConversation, saveMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const assistantReports = messages.filter(m => m.role === 'assistant')

  return (
    <div className="flex h-full bg-gray-50">
      {/* Desktop Layout - Two columns */}
      <div className="hidden lg:flex flex-1">
        {/* Left Panel - Reports */}
        <div className="flex-1 flex flex-col border-r bg-white">
          {selectedReport ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 max-w-4xl mx-auto">
                {/* Report Header */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${assistant.color} flex-shrink-0`}>
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Analysis Report</h2>
                      <p className="text-sm text-gray-500">
                        {new Date(selectedReport.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Markdown Content - Enhanced Styling */}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({children}) => (
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({children}) => (
                        <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">
                          {children}
                        </h3>
                      ),
                      ul: ({children}) => (
                        <ul className="my-4 space-y-2">
                          {children}
                        </ul>
                      ),
                      ol: ({children}) => (
                        <ol className="my-4 space-y-2">
                          {children}
                        </ol>
                      ),
                      li: ({children}) => (
                        <li className="ml-6 text-gray-700">
                          {children}
                        </li>
                      ),
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 bg-blue-50 py-2 pr-4 rounded-r">
                          {children}
                        </blockquote>
                      ),
                      table: ({children}) => (
                        <div className="overflow-x-auto my-6">
                          <table className="min-w-full border-collapse border border-gray-300">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({children}) => (
                        <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
                          {children}
                        </th>
                      ),
                      td: ({children}) => (
                        <td className="border border-gray-300 px-4 py-2">
                          {children}
                        </td>
                      ),
                      code: ({inline, children}) => (
                        inline
                          ? <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-blue-800">{children}</code>
                          : <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">{children}</code>
                      ),
                      hr: () => (
                        <hr className="my-8 border-t-2 border-gray-200" />
                      ),
                      strong: ({children}) => (
                        <strong className="font-bold text-blue-800">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {selectedReport.content || (selectedReport.isStreaming ? 'Generating report...' : '')}
                  </ReactMarkdown>
                  {selectedReport.isStreaming && (
                    <span className="inline-block ml-1 animate-pulse text-blue-800">▊</span>
                  )}
                </div>

                {/* Chart if present */}
                {selectedReport.chartHtml && !selectedReport.isStreaming && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: selectedReport.chartHtml }} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No reports yet</p>
                <p className="text-sm mt-2">Start a conversation to generate analysis reports</p>
              </div>
            </div>
          )}

          {/* Report Selector */}
          {assistantReports.length > 1 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex gap-2 overflow-x-auto">
                {assistantReports.map((report, index) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                      selectedReport?.id === report.id
                        ? 'bg-blue-700 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Report {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Chat */}
        <div className="w-96 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-700 to-blue-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <assistant.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{assistant.name}</h3>
                <p className="text-white/80 text-sm">Chat Assistant</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Start a conversation...</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div className={`flex items-start gap-2 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    <div className={`p-1.5 rounded-full flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-blue-700'
                        : assistant.color
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-3.5 w-3.5 text-white" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>
                    <div className={`px-3 py-2 rounded-lg max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-blue-700 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.role === 'user' ? (
                        <p className="text-sm">{message.content}</p>
                      ) : (
                        <p className="text-sm">
                          {message.content ? 'Report generated. View in main panel.' : 'Generating report...'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t p-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                rows="2"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`px-3 py-2 rounded-lg transition ${
                  input.trim() && !isLoading
                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout - Single column */}
      <div className="lg:hidden flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-3 sm:p-4">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${assistant.color} flex items-center justify-center mb-3 sm:mb-4`}>
                <assistant.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold gradient-text mb-2">
                Hi! I'm your {assistant.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-xs sm:max-w-md px-2">
                {assistant.description}. How can I help you today?
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 justify-center px-2">
                {assistant.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 sm:px-3 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 max-w-3xl mx-auto w-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex flex-col"
                >
                  {/* Message Header */}
                  <div className="flex items-center gap-2 sm:gap-3 w-full mb-2">
                    <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-blue-700'
                        : assistant.color
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                        {message.role === 'user' ? 'You' : assistant.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`w-full rounded-xl p-3 sm:p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-white shadow-md border border-gray-200'
                  }`}>
                    {message.role === 'user' ? (
                      <p className="text-sm sm:text-base text-gray-800 break-words">{message.content}</p>
                    ) : (
                      <>
                        <div className="prose prose-sm max-w-none
                          prose-headings:text-base sm:prose-headings:text-lg
                          prose-p:text-sm sm:prose-p:text-base
                          prose-li:text-sm sm:prose-li:text-base
                          prose-ul:pl-4 sm:prose-ul:pl-6
                          prose-ol:pl-4 sm:prose-ol:pl-6
                          prose-blockquote:text-sm sm:prose-blockquote:text-base
                          prose-code:text-xs sm:prose-code:text-sm
                          prose-pre:text-xs sm:prose-pre:text-sm
                          prose-table:text-xs sm:prose-table:text-sm">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h2: ({children}) => (
                                <h2 className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-2 sm:mb-3 text-gray-900 border-b pb-1 sm:pb-2">
                                  {children}
                                </h2>
                              ),
                              h3: ({children}) => (
                                <h3 className="text-base sm:text-lg font-semibold mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-gray-800">
                                  {children}
                                </h3>
                              ),
                              ul: ({children}) => (
                                <ul className="my-2 sm:my-3 space-y-1 sm:space-y-1.5 list-disc pl-4 sm:pl-6">
                                  {children}
                                </ul>
                              ),
                              ol: ({children}) => (
                                <ol className="my-2 sm:my-3 space-y-1 sm:space-y-1.5 list-decimal pl-4 sm:pl-6">
                                  {children}
                                </ol>
                              ),
                              li: ({children}) => (
                                <li className="text-sm sm:text-base text-gray-700">
                                  {children}
                                </li>
                              ),
                              p: ({children}) => (
                                <p className="text-sm sm:text-base text-gray-700 my-2 sm:my-3">
                                  {children}
                                </p>
                              ),
                              blockquote: ({children}) => (
                                <blockquote className="border-l-3 sm:border-l-4 border-blue-500 pl-3 sm:pl-4 my-2 sm:my-3 italic text-gray-700 bg-blue-50 py-1.5 sm:py-2 pr-3 sm:pr-4 rounded-r text-sm sm:text-base">
                                  {children}
                                </blockquote>
                              ),
                              table: ({children}) => (
                                <div className="overflow-x-auto my-3 sm:my-4 -mx-3 sm:mx-0">
                                  <div className="inline-block min-w-full px-3 sm:px-0">
                                    <table className="min-w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                                      {children}
                                    </table>
                                  </div>
                                </div>
                              ),
                              th: ({children}) => (
                                <th className="border border-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 font-semibold text-left text-xs sm:text-sm">
                                  {children}
                                </th>
                              ),
                              td: ({children}) => (
                                <td className="border border-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
                                  {children}
                                </td>
                              ),
                              code: ({inline, children}) => (
                                inline
                                  ? <code className="bg-gray-100 px-1 py-0.5 rounded text-xs sm:text-sm font-mono text-blue-800">{children}</code>
                                  : <div className="overflow-x-auto -mx-3 sm:mx-0 my-2 sm:my-3">
                                      <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm">
                                        <code>{children}</code>
                                      </pre>
                                    </div>
                              ),
                              hr: () => (
                                <hr className="my-4 sm:my-6 border-t-2 border-gray-200" />
                              ),
                              strong: ({children}) => (
                                <strong className="font-bold text-blue-800">
                                  {children}
                                </strong>
                              ),
                            }}
                          >
                            {message.content || (message.isStreaming ? '...' : '')}
                          </ReactMarkdown>
                          {message.isStreaming && (
                            <span className="inline-block ml-1 animate-pulse text-blue-800">▊</span>
                          )}
                        </div>
                        {message.chartHtml && !message.isStreaming && (
                          <div className="mt-3 sm:mt-4 -mx-3 sm:mx-0">
                            <div className="overflow-x-auto">
                              <div dangerouslySetInnerHTML={{ __html: message.chartHtml }} />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-3 sm:p-4">
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 max-w-3xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${assistant.name}...`}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none transition text-sm sm:text-base"
              rows="1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium flex items-center justify-center transition min-w-[44px] ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:shadow-lg sm:transform sm:hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              <span className="hidden sm:inline-block ml-2">
                {isLoading ? '' : ''}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}