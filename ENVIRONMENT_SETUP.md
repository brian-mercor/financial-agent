# Environment Setup Guide

## Required Environment Variables

### 1. LLM Providers (At least one required)

#### Azure OpenAI (Recommended for model-router)
```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=model-router
```

#### Groq (Optional - for fast Llama models)
```bash
GROQ_API_KEY=your-groq-api-key-here
```
**Note:** Get your free API key from https://console.groq.com/keys

#### OpenAI (Optional fallback)
```bash
OPENAI_API_KEY=your-openai-api-key-here
```

### 2. Database (Required for chat history)
```bash
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### 3. Redis (Optional - for pub/sub)
```bash
# Leave empty to disable Redis
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
```

## Priority Order for LLM Providers

When streaming is enabled, the system tries providers in this order:

1. **Azure OpenAI** (if deployment name contains "model-router")
2. **Groq** (if API key is configured)
3. **Azure OpenAI** (as fallback)
4. **OpenAI** (final fallback)

## Fixing Common Errors

### "Invalid API Key" for Groq
- Sign up for a free account at https://groq.com/
- Get your API key from https://console.groq.com/keys
- Add `GROQ_API_KEY=your-key-here` to `/apps/backend/.env`

### "streams.set is not a function"
- This has been fixed. The workflow-updates stream is now properly configured.

### "Unrecognized key(s) in object: 'querySchema'"
- This has been fixed. Motia doesn't support querySchema for GET requests.

## Quick Start

1. Copy the example environment file:
```bash
cd apps/backend
cp .env.example .env
```

2. Add your API keys to `.env`:
```bash
# At minimum, add one LLM provider
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT_NAME=model-router
```

3. Start the backend:
```bash
pnpm run dev
```

## Testing the Configuration

Once configured, test with this curl command:
```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the price of AAPL?",
    "assistantType": "analyst",
    "userId": "test-user",
    "stream": true
  }'
```

You should receive a response with stock information about Apple.