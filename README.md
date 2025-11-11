# Fin Agent – Multi-Agent Orchestration Platform

An open-source multi-agent orchestration backend system built on event-driven architecture, designed to enable developers to build custom financial AI interfaces.

## What is Fin Agent?

Fin Agent is a **plug-and-play multi-agent orchestration backend** that provides a flexible foundation for AI-powered applications. Built on [Motia](https://motia.dev), it leverages event-driven architecture to coordinate multiple AI agents and services seamlessly.

### Key Features

- **🔌 Plug-and-Play Architecture**: Connect any frontend to the backend via standardized APIs
- **🤖 Multi-Agent Orchestration**: Coordinate multiple AI agents working together on complex tasks
- **⚡ Event-Driven Design**: Built on Motia's event-driven framework for scalable, loosely-coupled services
- **🎨 Multiple Reference UIs**: Includes 10+ example interfaces demonstrating different use cases
- **🛠️ Build Your Own**: Open-source foundation for creating custom AI-powered interfaces
- **🔄 Real-time Streaming**: Native WebSocket support for live AI responses and updates

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Custom UIs (Build Your Own) + Reference UIs (10+)     │
│  ├─ Next.js Dashboard    ├─ Vite App A ... ├─ Vite App J  │
└─────────────────────┬───────────────────────────────────┘
                      │ REST APIs / WebSockets
┌─────────────────────▼───────────────────────────────────┐
│         Fin Agent Backend (Motia Framework)             │
│  ├─ Multi-Agent Orchestration                          │
│  ├─ Event-Driven Step Architecture                     │
│  ├─ Real-time Streaming (WebSocket)                    │
│  └─ State Management & Persistence                     │
└─────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- At least one LLM API key (OpenAI, Groq, or Azure OpenAI)

### Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up backend (CRITICAL)
cd apps/backend
pnpm run postinstall
cp .env.example .env
# Add your API keys to .env

# 3. Run with any UI
pnpm turbo run dev --filter=web --filter=backend
```

Visit http://localhost:3001 for the Next.js dashboard or see port map below for other UIs.

## Monorepo Structure

```
fin-agent2/
├── apps/
│   ├── backend/          # Motia-based orchestration backend
│   ├── web/              # Next.js reference UI (primary)
│   ├── web-a/            # Vite reference UI A
│   ├── web-b/            # Vite reference UI B
│   └── ... (web-c through web-j)
├── packages/             # Shared packages
└── scripts/              # Development scripts
```

## Building Your Own UI

The backend exposes standardized REST APIs and WebSocket streams, making it easy to build custom interfaces:

### API Integration

```javascript
// Example: Send a chat message
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Analyze this financial data...',
    userId: 'user-123'
  })
})
```

### Real-time Streaming

```javascript
// Example: Connect to live AI responses
const ws = new WebSocket('ws://localhost:3000/streams/chat-messages/user:123')
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Handle streaming tokens
}
```

### Reference Implementations

Explore the included UIs (`apps/web`, `apps/web-a` through `apps/web-j`) to see different implementation approaches:
- REST API integration patterns
- WebSocket streaming handling
- State management strategies
- Authentication flows

## Development Guide

### Apps and Ports

- Backend (Motia): http://localhost:3000
- Next.js app (apps/web): http://localhost:3001
- Vite apps (apps/web-[a–j]):
  - web-a: http://localhost:5174
  - web-b: http://localhost:5175
  - web-c: http://localhost:5176
  - web-d: http://localhost:5177
  - web-e: http://localhost:5178
  - web-f: http://localhost:5179
  - web-g: http://localhost:5180
  - web-h: http://localhost:5181
  - web-i: http://localhost:5182
  - web-j: http://localhost:5183
- Astro landing apps (if running):
  - fin-welcome: http://localhost:3010
  - finagent-landing: http://localhost:4321

## Starting Apps

- Run Next.js (apps/web) + backend:
  - `UI_APP=web ./scripts/start-dev.sh`
  - Or: `pnpm turbo run dev --filter=web --filter=backend`
  - Next.js dashboard: http://localhost:3001/dashboard

- Run a specific Vite UI + backend (example: web-a):
  - `pnpm turbo run dev --filter=web-a --filter=backend`
  - Then open the corresponding port from the list above.

- Run all UIs (not recommended unless needed):
  - `pnpm run dev:all`

## Chat History (apps/web)

- The history-enabled Chat UI is in the Next.js app (apps/web):
  - Dashboard: `/dashboard` (uses ChatInterface with history sidebar)
  - Chat routes: `/chat` and `/chat/[sessionId]`
- API proxy routes are provided under `/app/api/chat/*` and forward to the backend (localhost:3000).
- In development, a mock chat history service is enabled when no production host is detected; it prepopulates sessions for user `user-123`.

### Tips

- If you see the wrong UI on a port, confirm which app actually owns that port using the map above.
- To avoid confusion, prefer running only the UI you're testing together with the backend.
- `BACKEND_URL` (for API proxies) defaults to `http://localhost:3000` in dev.

## Use Cases

The Fin Agent platform is designed for building AI-powered applications across various domains:

### Financial Applications
- Portfolio analysis and recommendations
- Market data analysis and insights
- Financial document processing
- Automated trading strategy evaluation

### General AI Applications
- Multi-step reasoning and planning
- Document analysis and summarization
- Research and data aggregation
- Conversational AI with context awareness

### Custom Workflows
- Build domain-specific AI agents
- Orchestrate multiple AI services
- Create specialized tooling and integrations
- Implement custom business logic

## Event-Driven Architecture

Fin Agent is built on Motia's event-driven architecture, enabling:

### Loose Coupling
Steps communicate via events (`emit` and `subscribes`), allowing independent development and scaling of features.

### Parallel Execution
Multiple agents can process events concurrently, improving performance and responsiveness.

### Extensibility
Add new capabilities by creating new steps that subscribe to existing events or emit new ones.

### Example Event Flow

```
User Message → Chat API Step
                  ↓ (emits: chat.message.received)
            Agent Orchestration Step
                  ↓ (emits: agent.task.started)
         [Multiple AI Agents in Parallel]
                  ↓ (emits: agent.response.ready)
           Response Aggregation Step
                  ↓ (streams to client)
              User Interface
```

## Contributing

Contributions are welcome! Whether you're:
- Building a new reference UI
- Adding agent capabilities
- Improving the orchestration backend
- Enhancing documentation

Please feel free to open issues and pull requests.

## License

[Add your license here]

## Learn More

- **Motia Framework**: https://motia.dev
- **Backend Documentation**: See `apps/backend/README.md`
- **API Reference**: Available in the backend's Motia workbench at http://localhost:3000 (when running)

