import { useParams, Navigate } from 'react-router-dom'
import { SmartChatInterface } from '../components/SmartChatInterface'
import { assistants } from '../config/assistants'

export default function ChatPage() {
  const { assistantId } = useParams()
  const assistant = assistants.find(a => a.id === assistantId)

  if (!assistant) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="gradient-bg text-white px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`${assistant.color} w-10 h-10 rounded-full flex items-center justify-center`}>
              <assistant.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{assistant.name}</h1>
              <p className="text-sm opacity-90">{assistant.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <SmartChatInterface assistant={assistant} />
      </div>
    </div>
  )
}