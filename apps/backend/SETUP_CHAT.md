# Chat Setup Guide - REQUIRED for Dashboard

## ⚠️ CRITICAL: Chat Requires Real API Keys

The dashboard chat functionality **WILL NOT WORK** without configuring at least one LLM provider API key. Mock responses have been intentionally disabled because chat is a critical feature that must be tested with real implementations.

## Quick Setup (Choose ONE provider)

### Option 1: Groq (Recommended - Fast & Free)
1. Go to https://console.groq.com/keys
2. Sign up for a free account
3. Generate an API key
4. Add to `/apps/backend/.env`:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

### Option 2: OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create an API key
3. Add to `/apps/backend/.env`:
   ```
   OPENAI_API_KEY=sk-your_key_here
   ```

### Option 3: Azure OpenAI
1. Set up Azure OpenAI service
2. Add to `/apps/backend/.env`:
   ```
   AZURE_OPENAI_API_KEY=your_key_here
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
   AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment
   ```

## Verification Steps

1. **Add your API key** to `/apps/backend/.env`
2. **Restart the backend**:
   ```bash
   cd apps/backend
   npm run dev
   ```
3. **Test the API**:
   ```bash
   curl -X POST http://localhost:3000/api/chat/stream \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello", "assistantType": "general"}'
   ```

## Expected Response

With a properly configured API key, you should receive:
```json
{
  "traceId": "...",
  "response": "Hello! How can I assist you today?",
  "assistantType": "general",
  "llmProvider": "groq",  // or "openai" or "azure"
  "model": "llama-3.3-70b-versatile"
}
```

## Troubleshooting

If chat is not working:

1. **Check backend logs** for error messages:
   ```
   [LLMService] CRITICAL: No LLM providers configured!
   ```

2. **Verify API key** is correctly set in `.env`

3. **Ensure backend is restarted** after adding the key

4. **Test API directly** using curl (shown above)

## Why No Mock Mode?

As stated in the project requirements:
> "We don't want to add mock servers for simulating chat streams because chat is a critical piece of this application. We always need to be verifying that it works and cannot just verify it works in production if it doesn't work locally."

This ensures that local development always uses real LLM providers, maintaining parity with production behavior.