# Azure OpenAI Model Deployment Guide

## Objectives
Deploy a new Azure OpenAI model with fresh API keys for the finagent2 application.

## Step-by-Step Deployment Process

### Step 1: Access Azure AI Studio
1. Go to [Azure AI Studio](https://ai.azure.com)
2. Sign in with your Azure account
3. Navigate to your AI Hub: `ai-hubjan31758181607127`

### Step 2: Deploy New Model

#### Option A: Deploy GPT-5 Model
1. Go to **Deployments** → **+ Create deployment**
2. Select model:
   - **Model**: GPT-5 (or GPT-5-mini/nano if available)
   - **Deployment name**: `finagent2-gpt5`
   - **Deployment type**: Standard
3. Configure settings:
   - **Tokens per minute**: 60K (or as needed)
   - **Requests per minute**: 100
4. Click **Deploy**

#### Option B: Deploy GPT-4 Turbo (Fallback)
1. Go to **Deployments** → **+ Create deployment**
2. Select model:
   - **Model**: gpt-4-turbo-2024-04-09
   - **Deployment name**: `finagent2-gpt4-turbo`
   - **Deployment type**: Standard
3. Configure settings:
   - **Tokens per minute**: 60K
   - **Requests per minute**: 100
4. Click **Deploy**

#### Option C: Use Model Router (Recommended)
1. Go to **Deployments** → **+ Create deployment**
2. Select:
   - **Type**: Model Router
   - **Name**: `finagent2-model-router`
   - **Models to include**: GPT-5, GPT-4-Turbo, GPT-4
3. Configure routing:
   - **Primary**: GPT-5 (if available)
   - **Fallback 1**: GPT-4-Turbo
   - **Fallback 2**: GPT-4
4. Click **Deploy**

### Step 3: Generate New API Keys
1. After deployment, go to **Settings** → **Keys and Endpoints**
2. You'll see:
   - **Endpoint**: `https://ai-hubjan31758181607127.openai.azure.com/`
   - **Key 1**: Click "Show" and copy
   - **Key 2**: (Backup key)
3. Save the key securely

### Step 4: Update Application Configuration

Update `/apps/backend/.env.local`:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://ai-hubjan31758181607127.openai.azure.com/
AZURE_OPENAI_API_KEY=<YOUR_NEW_KEY_HERE>
AZURE_OPENAI_DEPLOYMENT_NAME=finagent2-model-router  # or your deployment name
AZURE_OPENAI_API_VERSION=2025-01-01-preview

# LLM Router Configuration
LLM_PROVIDER=azure-openai
LLM_MODEL=gpt-5  # or gpt-4-turbo based on deployment
```

### Step 5: Test the Deployment

Run the validation script:
```bash
./validate-gpt5-access.sh
```

Or test directly:
```bash
curl -X POST "https://ai-hubjan31758181607127.openai.azure.com/openai/deployments/<YOUR_DEPLOYMENT_NAME>/chat/completions?api-version=2025-01-01-preview" \
  -H "Content-Type: application/json" \
  -H "api-key: <YOUR_NEW_KEY>" \
  -d '{
    "messages": [{"role": "user", "content": "Hello, what model are you?"}],
    "max_tokens": 50
  }'
```

### Step 6: Verify in Application

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Test the chat at http://localhost:3001

3. Check logs to confirm the model being used

## Alternative: Using Azure CLI

If you prefer command line:

```bash
# Login to Azure
az login

# List available models
az cognitiveservices account model list \
  --name ai-hubjan31758181607127 \
  --resource-group <your-resource-group>

# Create deployment
az cognitiveservices account deployment create \
  --name ai-hubjan31758181607127 \
  --resource-group <your-resource-group> \
  --deployment-name finagent2-gpt5 \
  --model-name gpt-5 \
  --model-version "2025-08-07" \
  --model-format OpenAI \
  --sku-capacity 1 \
  --sku-name "Standard"

# Get keys
az cognitiveservices account keys list \
  --name ai-hubjan31758181607127 \
  --resource-group <your-resource-group>
```

## Troubleshooting

### If GPT-5 is not available:
- Use GPT-4-Turbo as primary model
- Check Azure region for model availability
- Contact Azure support for GPT-5 access

### If API key doesn't work:
1. Verify key was copied correctly (no extra spaces)
2. Check deployment status in Azure AI Studio
3. Ensure deployment is in "Succeeded" state
4. Verify endpoint URL matches your AI Hub

### If getting 404 errors:
- Double-check deployment name in .env.local
- Ensure deployment is fully provisioned (can take 2-3 minutes)
- Verify the endpoint URL format

## Model Recommendations

Based on your needs:

| Use Case | Recommended Model | Deployment Name |
|----------|------------------|-----------------|
| Best Quality | GPT-5 | finagent2-gpt5 |
| Fast & Good | GPT-4-Turbo | finagent2-gpt4-turbo |
| Cost-Effective | GPT-4 | finagent2-gpt4 |
| Auto-Select | Model Router | finagent2-model-router |

## Next Steps

After successful deployment:
1. ✅ Update .env.local with new credentials
2. ✅ Test with validation script
3. ✅ Restart development server
4. ✅ Verify chat functionality
5. ✅ Monitor usage in Azure portal

---
*Last updated: September 2025*