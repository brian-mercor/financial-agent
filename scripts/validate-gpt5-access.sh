#!/bin/bash

# Comprehensive GPT-5 Access Validation Script
# This script validates that we have actual working access to GPT-5 via Azure OpenAI

echo "=========================================="
echo "GPT-5 Access Validation & Integration Test"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check current environment configuration
echo "📋 Step 1: Checking Environment Configuration"
echo "---------------------------------------------"

# Read current configuration
if [ -f "apps/backend/.env.local" ]; then
    AZURE_ENDPOINT=$(grep "^AZURE_OPENAI_ENDPOINT=" apps/backend/.env.local | cut -d'=' -f2)
    AZURE_KEY=$(grep "^AZURE_OPENAI_API_KEY=" apps/backend/.env.local | cut -d'=' -f2)
    DEPLOYMENT_NAME=$(grep "^AZURE_OPENAI_DEPLOYMENT_NAME=" apps/backend/.env.local | cut -d'=' -f2)
    API_VERSION=$(grep "^AZURE_OPENAI_API_VERSION=" apps/backend/.env.local | cut -d'=' -f2)
    LLM_PROVIDER=$(grep "^LLM_PROVIDER=" apps/backend/.env.local | cut -d'=' -f2)
    LLM_MODEL=$(grep "^LLM_MODEL=" apps/backend/.env.local | cut -d'=' -f2)
    
    echo "Current settings in apps/backend/.env.local:"
    echo "  AZURE_OPENAI_ENDPOINT: ${AZURE_ENDPOINT:-❌ NOT SET}"
    echo "  AZURE_OPENAI_API_KEY: ${AZURE_KEY:0:10}...${AZURE_KEY: -4}"
    echo "  DEPLOYMENT_NAME: ${DEPLOYMENT_NAME:-❌ NOT SET}"
    echo "  API_VERSION: ${API_VERSION:-❌ NOT SET}"
    echo "  LLM_PROVIDER: ${LLM_PROVIDER:-❌ NOT SET}"
    echo "  LLM_MODEL: ${LLM_MODEL:-❌ NOT SET}"
else
    echo -e "${RED}❌ apps/backend/.env.local not found!${NC}"
    exit 1
fi

echo ""

# Step 2: Test Azure OpenAI API connectivity
echo "🔌 Step 2: Testing Azure OpenAI API Connectivity"
echo "------------------------------------------------"

if [ -z "$AZURE_ENDPOINT" ] || [ -z "$AZURE_KEY" ]; then
    echo -e "${RED}❌ Azure OpenAI credentials are not configured${NC}"
    echo "Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in apps/backend/.env.local"
    exit 1
fi

# Test API with a simple request
echo "Testing endpoint: $AZURE_ENDPOINT"
echo "Testing with key: ${AZURE_KEY:0:10}..."

TEST_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
    "${AZURE_ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}" \
    -H "Content-Type: application/json" \
    -H "api-key: $AZURE_KEY" \
    -d '{
        "messages": [
            {"role": "system", "content": "You are a helpful assistant. State your model name and version clearly."},
            {"role": "user", "content": "What is your exact model name and version? Are you GPT-5?"}
        ],
        "max_tokens": 100,
        "temperature": 0
    }' 2>/dev/null)

HTTP_STATUS=$(echo "$TEST_RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$TEST_RESPONSE" | sed '/HTTP_STATUS:/d')

echo ""

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ API Connection successful!${NC}"
    
    # Extract model information
    MODEL_NAME=$(echo "$RESPONSE_BODY" | grep -o '"model":"[^"]*"' | cut -d'"' -f4)
    CONTENT=$(echo "$RESPONSE_BODY" | grep -o '"content":"[^"]*"' | cut -d'"' -f4)
    
    echo "Response details:"
    echo "  Model reported: $MODEL_NAME"
    echo "  Response excerpt: ${CONTENT:0:100}..."
    
    # Check if it's actually GPT-5
    if [[ "$MODEL_NAME" == *"gpt-5"* ]] || [[ "$MODEL_NAME" == *"gpt5"* ]]; then
        echo -e "${GREEN}✅ GPT-5 CONFIRMED! Model: $MODEL_NAME${NC}"
        GPT5_AVAILABLE=true
    elif [[ "$MODEL_NAME" == *"gpt-4"* ]]; then
        echo -e "${YELLOW}⚠️  Model is GPT-4, not GPT-5: $MODEL_NAME${NC}"
        GPT5_AVAILABLE=false
    else
        echo -e "${YELLOW}⚠️  Unknown model: $MODEL_NAME${NC}"
        GPT5_AVAILABLE=unknown
    fi
    
elif [ "$HTTP_STATUS" == "401" ]; then
    echo -e "${RED}❌ Authentication failed (401)${NC}"
    echo "The API key appears to be invalid or rotated."
    echo ""
    echo "To fix this:"
    echo "1. Go to Azure AI Studio: https://ai.azure.com"
    echo "2. Navigate to your AI Hub: ai-hubjan31758181607127"
    echo "3. Go to 'Settings' -> 'Keys and Endpoints'"
    echo "4. Copy a new API key"
    echo "5. Update AZURE_OPENAI_API_KEY in apps/backend/.env.local"
    exit 1
    
elif [ "$HTTP_STATUS" == "404" ]; then
    echo -e "${RED}❌ Deployment not found (404)${NC}"
    echo "The deployment '$DEPLOYMENT_NAME' does not exist."
    echo "Please check your Azure AI Studio deployments."
    exit 1
    
else
    echo -e "${RED}❌ Unexpected response: HTTP $HTTP_STATUS${NC}"
    echo "Response body:"
    echo "$RESPONSE_BODY" | head -20
    exit 1
fi

echo ""

# Step 3: Test with the LLM Router Service
echo "🔄 Step 3: Testing LLM Router Service Integration"
echo "-------------------------------------------------"

# Create a test script for the LLM router
cat > test-llm-router.js << 'EOF'
const { llmRouter } = require('./apps/backend/services/llm-router.service');

async function testLLMRouter() {
    console.log('Testing LLM Router configuration...');
    
    const config = llmRouter.getConfiguration();
    console.log('Current configuration:', JSON.stringify(config, null, 2));
    
    if (!llmRouter.isConfigured()) {
        console.log('❌ LLM Router is not configured');
        return false;
    }
    
    try {
        console.log('Attempting to send a test message...');
        const response = await llmRouter.createChatCompletion(
            [
                { role: 'system', content: 'You are a test assistant. Identify your model.' },
                { role: 'user', content: 'What model are you?' }
            ],
            {
                provider: 'azure-openai',
                model: 'gpt-5',
                temperature: 0,
                maxTokens: 50
            }
        );
        
        if (response && response.choices && response.choices[0]) {
            console.log('✅ LLM Router test successful!');
            console.log('Model:', response.model);
            console.log('Response:', response.choices[0].message.content);
            return true;
        }
    } catch (error) {
        console.log('❌ LLM Router test failed:', error.message);
        return false;
    }
}

testLLMRouter().then(success => {
    process.exit(success ? 0 : 1);
});
EOF

# Run the router test
echo "Running LLM Router test..."
node test-llm-router.js 2>/dev/null || echo -e "${YELLOW}⚠️  LLM Router test could not be executed (service may need to be running)${NC}"

# Clean up test file
rm -f test-llm-router.js

echo ""

# Step 4: Integration Test via API
echo "🧪 Step 4: Full Integration Test"
echo "--------------------------------"

# Check if backend server is running
if curl -s -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server is running${NC}"
    
    # Test the chat endpoint
    echo "Testing chat endpoint with GPT-5..."
    CHAT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/chat \
        -H "Content-Type: application/json" \
        -d '{
            "message": "What AI model are you using? Please specify the exact version.",
            "assistantType": "general",
            "userId": "test-user"
        }' 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "Chat response received:"
        echo "$CHAT_RESPONSE" | grep -o '"response":"[^"]*"' | cut -d'"' -f4 | head -c 200
        echo "..."
        
        # Check which provider was used
        PROVIDER_USED=$(echo "$CHAT_RESPONSE" | grep -o '"llmProvider":"[^"]*"' | cut -d'"' -f4)
        MODEL_USED=$(echo "$CHAT_RESPONSE" | grep -o '"model":"[^"]*"' | cut -d'"' -f4)
        
        echo ""
        echo "Provider used: $PROVIDER_USED"
        echo "Model used: $MODEL_USED"
    else
        echo -e "${YELLOW}⚠️  Chat endpoint test failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backend server is not running. Start with: pnpm dev${NC}"
fi

echo ""

# Step 5: Summary and Recommendations
echo "📊 Summary"
echo "----------"

if [ "$HTTP_STATUS" == "200" ]; then
    if [ "$GPT5_AVAILABLE" == "true" ]; then
        echo -e "${GREEN}✅ GPT-5 is available and working via Azure OpenAI!${NC}"
        echo "   Model: $MODEL_NAME"
        echo ""
        echo "✨ You can now use GPT-5 in your application!"
    else
        echo -e "${YELLOW}⚠️  Azure OpenAI is working but GPT-5 may not be available${NC}"
        echo "   Current model: $MODEL_NAME"
        echo ""
        echo "Recommendations:"
        echo "1. Check if GPT-5 is deployed in your Azure AI Studio"
        echo "2. The model router may be using GPT-4 as fallback"
        echo "3. Contact Azure support to confirm GPT-5 availability"
    fi
else
    echo -e "${RED}❌ Azure OpenAI is not working${NC}"
    echo ""
    echo "Required actions:"
    echo "1. Get a new API key from Azure AI Studio"
    echo "2. Update AZURE_OPENAI_API_KEY in apps/backend/.env.local"
    echo "3. Restart the development server: pnpm dev"
    echo "4. Run this validation script again"
fi

echo ""
echo "For detailed logs, check:"
echo "  - Backend logs: Check terminal running 'pnpm dev'"
echo "  - Test results: See output above"
echo ""