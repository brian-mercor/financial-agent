#!/bin/bash
# Script to set environment variables for Azure App Service
# Update the values before running!

set -e

echo "🔐 Setting Azure App Service Environment Variables"
echo "=================================================="

# Configuration
WEBAPP="finagent-backend-pps457j4wjrc6"
RG="finagent-rg"

# Check Azure CLI login
az account show > /dev/null 2>&1 || { echo "Run 'az login' first"; exit 1; }

# IMPORTANT: Update these values with your actual keys!
# You can get these from your respective service dashboards

cat << 'ENV_NOTICE'
⚠️  IMPORTANT: Edit this script and add your API keys before running!

Replace the placeholder values below with your actual keys:
- GROQ_API_KEY: Get from https://console.groq.com
- AZURE_OPENAI_API_KEY: Get from Azure Portal
- AZURE_OPENAI_ENDPOINT: Get from Azure Portal
- PLAID_CLIENT_ID & PLAID_SECRET: Get from https://dashboard.plaid.com
- SUPABASE_SERVICE_KEY: Get from Supabase dashboard

ENV_NOTICE

# Uncomment and update these values:
# az webapp config appsettings set \
#     --name "$WEBAPP" \
#     --resource-group "$RG" \
#     --settings \
#     GROQ_API_KEY="your-groq-api-key-here" \
#     AZURE_OPENAI_API_KEY="your-azure-openai-key-here" \
#     AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/" \
#     PLAID_CLIENT_ID="your-plaid-client-id" \
#     PLAID_SECRET="your-plaid-secret" \
#     PLAID_ENV="sandbox" \
#     SUPABASE_SERVICE_KEY="your-supabase-service-key" \
#     NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co" \
#     NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key" \
#     --output table

echo ""
echo "📝 To set environment variables:"
echo "1. Edit this script and uncomment the az webapp config command"
echo "2. Replace all placeholder values with your actual API keys"
echo "3. Run this script again"
echo ""
echo "🔍 To view current settings (without values):"
echo "az webapp config appsettings list --name $WEBAPP --resource-group $RG --query '[].name' -o table"