export function AssistantCard({ assistant, isSelected, onClick }) {
  const Icon = assistant.icon

  return (
    <button
      onClick={onClick}
      className={`folk-card p-6 w-full text-left transition-all ${
        isSelected ? 'transform -translate-y-2 shadow-xl' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`feature-icon ${assistant.color}`}
          style={{ backgroundColor: isSelected ? 'var(--accent)' : 'var(--secondary)' }}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <h3 className="folk-title text-xl font-bold mb-2">{assistant.name}</h3>
          <p className="text-sm mb-3">{assistant.description}</p>
          <div className="flex flex-wrap gap-2">
            {assistant.expertise.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full border-2 border-dark bg-background"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}