import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AssistantCard({ assistant }) {
  const Icon = assistant.icon

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
      <div className={`${assistant.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{assistant.name}</h3>
      <p className="text-gray-600 mb-4">{assistant.description}</p>
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Expertise:</p>
        <div className="flex flex-wrap gap-2">
          {assistant.expertise.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <Link
        to={assistant.route}
        className="inline-flex items-center gap-2 gradient-bg text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
      >
        Chat Now
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}