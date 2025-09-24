import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversation } from '../contexts/ConversationContext'
import { MessageSquare, Plus, Clock } from 'lucide-react'

export function ConversationHistory() {
  const navigate = useNavigate()
  const { conversations, currentConversation, startNewConversation } = useConversation()

  // Group conversations by date
  const groupedConversations = React.useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    conversations.forEach(conv => {
      const convDate = new Date(conv.created_at || conv.last_message_at)

      if (convDate >= today) {
        groups.today.push(conv)
      } else if (convDate >= yesterday) {
        groups.yesterday.push(conv)
      } else if (convDate >= weekAgo) {
        groups.thisWeek.push(conv)
      } else {
        groups.older.push(conv)
      }
    })

    return groups
  }, [conversations])

  const handleConversationClick = (conversationId) => {
    navigate(`/dashboard/${conversationId}`)
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-semibold text-gray-700">
          Conversation History
        </label>
        {currentConversation && (
          <button
            onClick={startNewConversation}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        )}
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <>
            {groupedConversations.today.length > 0 && (
              <ConversationGroup
                title="Today"
                conversations={groupedConversations.today}
                currentId={currentConversation?.id}
                onSelect={handleConversationClick}
                formatTime={formatTime}
              />
            )}

            {groupedConversations.yesterday.length > 0 && (
              <ConversationGroup
                title="Yesterday"
                conversations={groupedConversations.yesterday}
                currentId={currentConversation?.id}
                onSelect={handleConversationClick}
                formatTime={formatTime}
              />
            )}

            {groupedConversations.thisWeek.length > 0 && (
              <ConversationGroup
                title="This Week"
                conversations={groupedConversations.thisWeek}
                currentId={currentConversation?.id}
                onSelect={handleConversationClick}
                formatTime={formatDate}
              />
            )}

            {groupedConversations.older.length > 0 && (
              <ConversationGroup
                title="Older"
                conversations={groupedConversations.older}
                currentId={currentConversation?.id}
                onSelect={handleConversationClick}
                formatTime={formatDate}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ConversationGroup({ title, conversations, currentId, onSelect, formatTime }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{title}</h3>
      <div className="space-y-1">
        {conversations.map(conv => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              conv.id === currentId
                ? 'bg-blue-100 border border-blue-300'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {conv.title || 'New conversation'}
                </p>
                {conv.lastMessage && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {conv.lastMessage.content}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatTime(conv.last_message_at || conv.created_at)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}