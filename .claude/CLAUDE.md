# Motia Framework Development Assistant

You are helping develop a **Motia project** - a unified backend framework that uses event-driven architecture with multiple programming languages.

> **Documentation Source**: This documentation is based on the official Motia documentation at https://motia.dev and has been updated to reflect the framework's native streaming capabilities and best practices.

## 🚫 CRITICAL SECURITY RULES

### NO DUMMY KEYS OR FALLBACK CREDENTIALS
- **NEVER** add dummy, fallback, or placeholder API keys/credentials in code
- **NEVER** commit any real or fake credentials to the repository
- Always require proper environment variables without fallbacks
- If credentials are missing, the app should fail gracefully with clear error messages

### MOCK DATA MUST BE CLEARLY LABELED
- Any mock data or mock authentication MUST be clearly labeled as "MOCK" or "TEST"
- Mock implementations should include comments like `// MOCK: Replace with actual API`
- Mock data variables should include "mock" in their names (e.g., `mockUser`, `mockAuthResponse`)
- UI using mock data should display warnings to users (e.g., "Using mock data - not connected to real backend")

## ⚠️ IMPORTANT: Setup Instructions for New Clones

When cloning this repository on a new machine, you MUST run the following steps:

```bash
# 1. Install dependencies from root
pnpm install

# 2. CRITICAL: Run Motia postinstall in backend
cd apps/backend
pnpm run postinstall
# OR manually run:
../../node_modules/.pnpm/node_modules/.bin/motia install

# 3. Create .env file (NEVER in source control!)
cp .env.example .env
# Then add your REAL API keys - at least one LLM provider is REQUIRED
```

### 🔑 Critical: About .env Files

**The `/apps/backend/.env` file:**
- **EXISTS locally** with real API keys when properly configured
- **NEVER checked into GitHub** - this is intentional for security
- **MUST be created on each machine** from `.env.example` template
- **REQUIRED for chat/LLM features** - the app will not work without it

**When working across different machines:**
- You will NOT have `.env` when you first clone - this is expected
- Check backend logs to see which providers are configured
- If chat isn't working, first verify `.env` exists and has valid keys
- Look for these diagnostic messages in logs:
  ```
  [LLMService] Initializing LLM clients {
    hasGroqKey: true,     // ← Shows current configuration
    hasOpenAIKey: false,
    hasAzureKey: false
  }
  ```

### Why This Is Necessary

- **pnpm workspace limitation**: Running `pnpm install` from root does NOT automatically execute postinstall scripts in workspace packages
- **Motia requires initialization**: The `motia install` command creates the `.motia` directory needed for the workbench UI
- **Without this step**: You'll see errors like "Cannot read properties of undefined (reading 'recentlyCreatedOwnerStacks')" on localhost:3000

### Alternative Solutions

1. **Add to root package.json** (one-time fix):
```json
"scripts": {
  "postinstall": "pnpm --filter backend run postinstall"
}
```

2. **Use recursive install** (slower):
```bash
pnpm install --recursive
```

## Core Motia Concepts

### Steps Architecture

- **Steps** are the fundamental building blocks - each has `config` and `handler`
- **API Steps**: HTTP endpoints (`type: 'api'`)
- **Event Steps**: Event processors (`type: 'event'`)
- **Cron Steps**: Scheduled tasks (`type: 'cron'`)
- **NOOP Steps**: Workflow routing (`type: 'noop'`)

**⚠️ IMPORTANT LIMITATION**: Stream Steps (`type: 'stream'`) are NOT supported in the current Motia version

### Event-Driven Communication

- Steps communicate via `emit({ topic: 'event-name', data: {...} })`
- Subscribe to events: `subscribes: ['topic-name']` in config
- Creates loose coupling and parallel execution

### State Management

- Persistent state via `state.set(group, key, value)` and `state.get(group, key)`
- State is scoped by groups ('orders', 'users', etc.) and keys
- Supports trace-scoped and global persistence

## File Structure

```
steps/              # All step implementations
├── *.step.ts      # Step files (config + handler)
├── *-features.json # Tutorial/workbench metadata
services/          # Shared business logic
types.d.ts         # Auto-generated types from step configs
motia-workbench.json # Visual flow configuration
```

## Step Implementation Patterns

Motia supports **multiple programming languages** in the same project. Choose the best language for each task:

- **TypeScript/JavaScript**: APIs, web logic, real-time features
- **Python**: AI/ML, data science, image processing, analytics
- **Ruby**: Reports, data exports, file processing, templating

### TypeScript API Step

```typescript
import { z } from 'zod'
import type { ApiRouteConfig, Handlers } from '@motia/core'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'CreateOrder',
  method: 'POST',
  path: '/orders',
  bodySchema: z.object({
    productId: z.string(),
    quantity: z.number(),
  }),
  emits: ['order.created'],
  flows: ['ecommerce'],
}

export const handler: Handlers['CreateOrder'] = async (req, { logger, emit, state, traceId }) => {
  const order = { id: crypto.randomUUID(), ...req.body, createdAt: new Date() }
  await state.set('orders', order.id, order)
  await emit({ topic: 'order.created', data: order })
  return { status: 201, body: order }
}
```

### JavaScript Event Step

```javascript
// steps/process-payment.step.js
exports.config = {
  type: 'event',
  name: 'ProcessPayment',
  subscribes: ['order.created'],
  emits: ['payment.processed', 'payment.failed'],
  input: {
    id: 'string',
    amount: 'number',
    currency: 'string',
  },
}

exports.handler = async (order, { logger, emit, state }) => {
  try {
    logger.info('Processing payment', { orderId: order.id })

    // Simulate payment processing
    const paymentResult = await processPayment(order)

    await state.set('payments', order.id, paymentResult)
    await emit({
      topic: 'payment.processed',
      data: { orderId: order.id, paymentId: paymentResult.id },
    })
  } catch (error) {
    logger.error('Payment failed', { orderId: order.id, error: error.message })
    await emit({ topic: 'payment.failed', data: { orderId: order.id, error: error.message } })
  }
}
```

### Python AI/ML Event Step

```python
# steps/analyze_sentiment.step.py
import asyncio
from transformers import pipeline

config = {
    "type": "event",
    "name": "AnalyzeSentiment",
    "subscribes": ["review.submitted"],
    "emits": ["sentiment.analyzed"],
    "input": {
        "reviewId": "string",
        "text": "string",
        "userId": "string"
    }
}

# Initialize ML model
sentiment_analyzer = pipeline("sentiment-analysis")

async def handler(review_data, context):
    logger = context["logger"]
    emit = context["emit"]
    state = context["state"]

    try:
        logger.info(f"Analyzing sentiment for review {review_data['reviewId']}")

        # Run sentiment analysis
        result = sentiment_analyzer(review_data["text"])
        sentiment_score = result[0]["score"]
        sentiment_label = result[0]["label"]

        analysis = {
            "reviewId": review_data["reviewId"],
            "sentiment": sentiment_label,
            "confidence": sentiment_score,
            "analyzedAt": datetime.now().isoformat()
        }

        await state.set("sentiment_analyses", review_data["reviewId"], analysis)
        await emit({
            "topic": "sentiment.analyzed",
            "data": analysis
        })

    except Exception as error:
        logger.error(f"Sentiment analysis failed: {str(error)}")
        await emit({
            "topic": "analysis.failed",
            "data": {"reviewId": review_data["reviewId"], "error": str(error)}
        })
```

### Python Data Processing Step

```python
# steps/generate_analytics.step.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

config = {
    "type": "cron",
    "name": "GenerateAnalytics",
    "cron": "0 0 * * 1",  # Weekly on Monday
    "emits": ["analytics.generated"]
}

async def handler(context):
    logger = context["logger"]
    emit = context["emit"]
    state = context["state"]

    try:
        # Fetch all orders from state
        orders_data = await state.get_group("orders")

        if not orders_data:
            logger.info("No orders data available")
            return

        # Convert to pandas DataFrame for analysis
        df = pd.DataFrame(list(orders_data.values()))
        df['createdAt'] = pd.to_datetime(df['createdAt'])

        # Generate analytics
        last_week = datetime.now() - timedelta(days=7)
        recent_orders = df[df['createdAt'] >= last_week]

        analytics = {
            "totalOrders": len(df),
            "weeklyOrders": len(recent_orders),
            "averageOrderValue": float(df['amount'].mean()) if 'amount' in df else 0,
            "topProducts": df['productId'].value_counts().head(5).to_dict(),
            "generatedAt": datetime.now().isoformat()
        }

        await state.set("analytics", "weekly", analytics)
        await emit({"topic": "analytics.generated", "data": analytics})

        logger.info("Analytics generated successfully")

    except Exception as error:
        logger.error(f"Analytics generation failed: {str(error)}")
```

### Ruby Report Generation Step

```ruby
# steps/generate_report.step.rb
require 'csv'
require 'json'

def config
  {
    type: 'event',
    name: 'GenerateReport',
    subscribes: ['analytics.generated'],
    emits: ['report.generated'],
    input: {
      totalOrders: 'number',
      weeklyOrders: 'number',
      topProducts: 'object'
    }
  }
end

def handler(analytics_data, context)
  logger = context[:logger]
  emit = context[:emit]
  state = context[:state]

  begin
    logger.info("Generating CSV report from analytics")

    # Generate CSV report
    csv_data = CSV.generate do |csv|
      csv << ['Metric', 'Value']
      csv << ['Total Orders', analytics_data['totalOrders']]
      csv << ['Weekly Orders', analytics_data['weeklyOrders']]
      csv << ['Average Order Value', analytics_data['averageOrderValue']]

      # Add top products
      analytics_data['topProducts'].each do |product, count|
        csv << ["Product #{product}", count]
      end
    end

    # Generate HTML report
    html_report = generate_html_template(analytics_data)

    report = {
      id: SecureRandom.uuid,
      csv_data: csv_data,
      html_report: html_report,
      generated_at: Time.now.iso8601
    }

    state.set('reports', report[:id], report)
    emit.call(topic: 'report.generated', data: report)

    logger.info("Report generated successfully", report_id: report[:id])

  rescue => error
    logger.error("Report generation failed", error: error.message)
    emit.call(topic: 'report.failed', data: { error: error.message })
  end
end

private

def generate_html_template(data)
  <<~HTML
    <html>
    <head><title>Analytics Report</title></head>
    <body>
      <h1>Weekly Analytics Report</h1>
      <p>Total Orders: #{data['totalOrders']}</p>
      <p>Weekly Orders: #{data['weeklyOrders']}</p>
      <p>Generated: #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}</p>
    </body>
    </html>
  HTML
end
```

## 🚀 Motia Streaming Capabilities

Motia natively supports real-time streaming as a core feature, providing WebSocket-based streams for live data flow from backend to client applications.

### How Motia Streams Work

1. **Stream Configuration**: Define stream schemas in `steps/streams/*.stream.ts`
2. **WebSocket Endpoints**: Motia exposes streams at `ws://host:port/streams/{streamName}/{streamId}`
3. **Stream Context**: Use `streams` context in handlers to push data to connected clients
4. **Client Libraries**: Motia provides client packages (`@motiadev/stream-client-browser`, `@motiadev/stream-client-react`)

### Stream Implementation Pattern

#### 1. Define Stream Schema
```typescript
// steps/streams/chat-messages.stream.ts
import { StreamConfig } from 'motia'
import { z } from 'zod'

export const chatMessageSchema = z.object({
  id: z.string(),
  type: z.enum(['token', 'complete', 'error']),
  userId: z.string(),
  traceId: z.string(),
  content: z.string().optional(),
  timestamp: z.string(),
})

export const config: StreamConfig = {
  name: 'chat-messages',
  schema: chatMessageSchema,
  baseConfig: {
    storageType: 'default',
    ttl: 3600, // 1 hour
    maxItems: 100, // Keep last 100 messages per stream
  },
}
```

#### 2. Push Data to Streams
```typescript
// In any step handler
export const handler: Handlers['YourStep'] = async (req, { streams, logger }) => {
  // Push data to a specific stream
  await streams['chat-messages'].set(
    `user:${userId}`,  // Stream ID
    messageId,          // Message ID
    {
      id: messageId,
      type: 'token',
      userId,
      traceId,
      content: token,
      timestamp: new Date().toISOString(),
    }
  )
}
```

#### 3. Client Connection
```javascript
// Frontend WebSocket connection
const ws = new WebSocket('ws://localhost:3000/streams/chat-messages/user:123')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Handle streaming data
}
```

### What DOES Work
- **Native WebSocket Streams**: Real-time bidirectional communication via `streams` context
- **Event-driven architecture**: With `emit()` and `subscribes`
- **Multi-step workflows**: Via event chains
- **State management**: For storing progress/results
- **Stream-based real-time updates**: Push notifications, live chat, collaborative features

### What Does NOT Work
- **ReadableStream from API handlers**: API routes must return JSON, not ReadableStream objects
- **Server-Sent Events (SSE)**: Use WebSocket streams instead
- **Direct HTTP streaming**: Use Motia's WebSocket streams for real-time data

### Best Practices for Streaming

1. **Use Motia Streams for Real-time Features**
   - Chat applications with live message streaming
   - Real-time notifications and updates
   - Collaborative editing and live synchronization
   - Dashboard with live metrics

2. **Fallback Strategies**
   - Implement polling as fallback if WebSocket connection fails
   - Store state for recovery after disconnections
   - Use event-driven updates for non-real-time features

3. **Stream Management**
   - Clean up old stream data with TTL settings
   - Limit stream size with maxItems configuration
   - Use stream IDs to segment data (e.g., `user:${userId}`, `room:${roomId}`)

### Implementation in This Project

The chat streaming feature uses Motia's native streams:

1. **Backend**: `steps/chat-stream.step.ts` publishes tokens to `streams['chat-messages']`
2. **Stream Config**: `steps/streams/chat-messages.stream.ts` defines the schema
3. **Frontend**: `src/services/motia-stream-client.js` connects via WebSocket
4. **API Service**: Falls back to polling if WebSocket fails

This approach leverages Motia's built-in streaming without requiring external SSE servers or additional infrastructure.

## Development Commands

```bash
# Start development server with workbench UI
npm run dev

# Run specific step
motia run step-name

# Build for production
motia build
```

## Code Standards

### Multi-Language File Naming

- **TypeScript**: `step-name.step.ts`
- **JavaScript**: `step-name.step.js`
- **Python**: `step_name.step.py`
- **Ruby**: `step-name.step.rb`

### Language-Specific Patterns

#### TypeScript/JavaScript

- Use Zod schemas for validation (TypeScript) or simple objects (JavaScript)
- Leverage auto-generated types from `types.d.ts` (TypeScript only)
- Use `async/await` for all async operations
- Export `config` and `handler` using ES6 modules (TypeScript) or CommonJS (JavaScript)

#### Python

- Use dictionary for config with snake_case keys
- Use `async def handler()` for async operations
- Access context via dictionary: `context["logger"]`, `context["emit"]`
- Use type hints where helpful for clarity
- Follow PEP 8 naming conventions

#### Ruby

- Use method `config` returning a hash
- Use method `handler(input, context)`
- Access context via hash: `context[:logger]`, `context[:emit]`
- Follow Ruby naming conventions (snake_case)
- Use proper exception handling with `rescue`

### Universal Naming Conventions

- Step names: `CamelCase` across all languages
- Topics: `category.action` (e.g., `order.created`, `user.updated`)
- State groups: `plural-noun` (e.g., `orders`, `users`)
- File names follow language conventions but descriptive

### Error Handling by Language

#### TypeScript/JavaScript

```typescript
try {
  // Step logic
} catch (error) {
  logger.error('Operation failed', { error: error.message, traceId })
  // For API steps: return error response
  // For Event steps: emit error event or rethrow
}
```

#### Python

```python
try:
    # Step logic
    pass
except Exception as error:
    logger.error(f"Operation failed: {str(error)}")
    # Emit error event or re-raise
    await emit({"topic": "error.occurred", "data": {"error": str(error)}})
```

#### Ruby

```ruby
begin
  # Step logic
rescue => error
  logger.error("Operation failed", error: error.message)
  # Emit error event or re-raise
  emit.call(topic: 'error.occurred', data: { error: error.message })
end
```

### State Management Best Practices

- Use semantic group names for state organization
- Store complex objects, not just primitives
- Consider trace-scoped vs global state based on use case
- Clean up unused state in cron jobs

## Testing & Debugging

### Workbench Features

- Visual flow representation and editing
- API endpoint testing with real data
- Real-time logging and tracing
- State inspection and management
- Tutorial system integration

### Logging

```typescript
logger.info('Processing started', { userId, traceId })
logger.error('Validation failed', { errors, input, traceId })
```

## Project-Specific Context

This project implements a **pet store ordering system** with:

- API endpoint for pet creation and food orders
- Event processing for order fulfillment
- Notification system for order updates
- Scheduled auditing for overdue orders

When working on this codebase:

- Follow the existing event flow patterns
- Use the established state groups (`orders`, `pets`)
- Maintain the tutorial-friendly structure for the workbench
- Test changes using the development workbench UI

## Multi-Language Workflow Examples

### Complete E-commerce Flow

```
TypeScript API → JavaScript Payment → Python ML → Ruby Reports
```

1. **API Endpoint** (TypeScript): Handle orders with validation
2. **Payment Processing** (JavaScript): Fast payment logic
3. **Recommendation Engine** (Python): ML-based product recommendations
4. **Report Generation** (Ruby): Beautiful HTML/PDF reports

### AI-Powered Content Pipeline

```
JavaScript API → Python AI → Ruby Templates → TypeScript Notifications
```

1. **Content Upload** (JavaScript): Quick file handling
2. **AI Processing** (Python): Image recognition, text analysis
3. **Template Generation** (Ruby): Dynamic content templates
4. **Real-time Updates** (TypeScript): WebSocket notifications

## Common Tasks

- **Adding API endpoints**: Create API step in TypeScript/JavaScript with validation
- **Processing background jobs**: Create event steps in the most suitable language
- **AI/ML tasks**: Use Python steps with appropriate libraries
- **Data processing**: Use Python for analytics, Ruby for reports
- **Scheduled maintenance**: Use cron steps for periodic cleanup and auditing
- **Real-time features**: Use TypeScript/JavaScript for WebSocket handling

## Resources

- Local development: `npm run dev` → http://localhost:5173
- Motia documentation: https://motia.dev/docs
- Workbench tutorials: Available in development mode
