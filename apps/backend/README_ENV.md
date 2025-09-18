# Backend Environment Configuration

## Critical Issue: Missing .env File

The backend is failing because there is no `.env` file in `/apps/backend/`.

## Quick Fix

1. Create the `.env` file:
```bash
cd apps/backend
cp .env.example .env
```

2. Add your Azure OpenAI credentials to the `.env` file:
```
# Azure OpenAI (REQUIRED for model-router)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=model-router
AZURE_OPENAI_API_VERSION=2024-08-01-preview

# Optional: Groq for fallback
GROQ_API_KEY=your-groq-api-key

# Optional: OpenAI for fallback
OPENAI_API_KEY=your-openai-api-key
```

3. Restart the backend:
```bash
pnpm run dev
```

## Why This Happened

The backend services are trying to load environment variables from `.env`, but this file doesn't exist. The services are failing to initialize because:

1. No `.env` file exists in `/apps/backend/`
2. The LLM service can't find Azure credentials
3. It falls back to Groq, which also fails with invalid API key
4. The system has no working LLM provider

## Verification

After creating the `.env` file, you should see these logs:
```
[LLMService] Initializing LLM clients
  hasAzureKey: true
  hasAzureEndpoint: true
  azureDeployment: model-router
[LLMService] Azure client initialized
[LLMService] Using Azure model-router for streaming
```

## Current Status

The code has been updated to:
1. ✅ Prioritize Azure model-router over other providers
2. ✅ Properly load environment variables with dotenv
3. ✅ Add detailed logging for debugging
4. ✅ Fix the streaming message history bug

**The only remaining issue is the missing `.env` file with your actual API credentials.**