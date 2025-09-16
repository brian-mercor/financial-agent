#!/bin/bash

# Generate new Azure OpenAI API key for GPT-5 access
# This script helps set up Azure OpenAI with the model router for GPT-5

echo "=================================="
echo "Azure OpenAI Key Generation Guide"
echo "=================================="
echo ""
echo "To use GPT-5 via Azure OpenAI, you need to:"
echo ""
echo "1. Go to Azure AI Studio: https://ai.azure.com"
echo "2. Navigate to your AI Hub: ai-hubjan31758181607127"
echo "3. Go to 'Settings' -> 'Keys and Endpoints'"
echo "4. Copy the API key (Key 1 or Key 2)"
echo ""
echo "Current configuration in backend/.env.local:"
echo "---------------------------------------------"
grep -E "AZURE_OPENAI|LLM_" apps/backend/.env.local | grep -v "#"
echo ""
echo "Required environment variables:"
echo "---------------------------------------------"
echo "AZURE_OPENAI_ENDPOINT=https://ai-hubjan31758181607127.openai.azure.com/"
echo "AZURE_OPENAI_API_KEY=<your-new-key-here>"
echo "AZURE_OPENAI_DEPLOYMENT_NAME=finagent2-model-router"
echo "AZURE_OPENAI_API_VERSION=2025-01-01-preview"
echo "LLM_PROVIDER=azure-openai"
echo "LLM_MODEL=gpt-5"
echo ""
echo "Testing current Azure configuration..."
echo "---------------------------------------------"

# Test the current endpoint and key
ENDPOINT="https://ai-hubjan31758181607127.openai.azure.com/"
CURRENT_KEY=$(grep "^AZURE_OPENAI_API_KEY=" apps/backend/.env.local | cut -d'=' -f2)

if [ -z "$CURRENT_KEY" ] || [ "$CURRENT_KEY" == "your-azure-api-key-here" ]; then
    echo "❌ No valid Azure OpenAI key found in .env.local"
else
    echo "Testing key: ${CURRENT_KEY:0:10}..."
    
    # Test the API
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
        "${ENDPOINT}openai/deployments/finagent2-model-router/chat/completions?api-version=2025-01-01-preview" \
        -H "Content-Type: application/json" \
        -H "api-key: $CURRENT_KEY" \
        -d '{
            "messages": [{"role": "user", "content": "test"}],
            "max_tokens": 5
        }')
    
    if [ "$RESPONSE" == "200" ]; then
        echo "✅ Azure OpenAI key is valid and working!"
    elif [ "$RESPONSE" == "401" ]; then
        echo "❌ Azure OpenAI key is invalid (401 Unauthorized)"
        echo "   Please get a new key from Azure AI Studio"
    elif [ "$RESPONSE" == "404" ]; then
        echo "❌ Deployment 'finagent2-model-router' not found"
        echo "   You may need to create the deployment in Azure AI Studio"
    else
        echo "❌ Unexpected response: HTTP $RESPONSE"
    fi
fi

echo ""
echo "Next steps:"
echo "-----------"
echo "1. Get your Azure OpenAI key from Azure AI Studio"
echo "2. Update apps/backend/.env.local with the new key"
echo "3. Restart the development server: pnpm dev"
echo "4. Test the chat at http://localhost:3001"
echo ""
echo "Alternative: Use Azure CLI"
echo "---------------------------"
echo "If you have Azure CLI installed:"
echo "  az cognitiveservices account keys list \\"
echo "    --name ai-hubjan31758181607127 \\"
echo "    --resource-group <your-resource-group>"
echo ""