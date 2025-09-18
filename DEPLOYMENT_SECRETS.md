# 🔐 Deployment Secrets Configuration Guide

## GitHub Secrets Required

### 1. AZURE_CREDENTIALS (Required)
This is the complete Azure service principal JSON. Set the entire JSON object as one secret:

```json
{
  "clientId": "<YOUR_APP_CLIENT_ID>",
  "clientSecret": "<YOUR_APP_CLIENT_SECRET>",
  "subscriptionId": "<YOUR_AZURE_SUBSCRIPTION_ID>",
  "tenantId": "<YOUR_AZURE_AD_TENANT_ID>",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

**To set this secret:**
```bash
# Use the provided script
./scripts/set-azure-credentials.sh

# Or manually:
gh secret set AZURE_CREDENTIALS --repo="brianyang/fin-agent2" < azure_creds.json
```

### 2. AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND (Required)
Download from Azure Portal:
1. Go to Azure Portal
2. Navigate to App Service: `finagent-backend-pps457j4wjrc6`
3. Click "Download Publish Profile"
4. Set as secret:
```bash
gh secret set AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND --repo="brianyang/fin-agent2" < *.PublishSettings
```

### 3. AZURE_RESOURCE_GROUP (Optional)
Default is "finagent-rg". Only set if different:
```bash
gh secret set AZURE_RESOURCE_GROUP --repo="brianyang/fin-agent2" --body="finagent-rg"
```

## Azure App Service Environment Variables

These need to be set in Azure Portal → App Service → Configuration → Application Settings:

### Core Application
- `NODE_ENV`: `production`
- `PORT`: `8080` (or leave default)

### Supabase (Required)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key

### Financial APIs (At least one required)
- `PLAID_CLIENT_ID`: Plaid client ID
- `PLAID_SECRET`: Plaid secret
- `PLAID_ENV`: `sandbox` or `development` or `production`
- `POLYGON_API_KEY`: Polygon.io API key
- `ALPACA_API_KEY`: Alpaca API key
- `ALPACA_SECRET_KEY`: Alpaca secret key
- `YAHOO_FINANCE_API_KEY`: Yahoo Finance API key (optional)

### AI/LLM Providers (At least one required)
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic Claude API key
- `GROQ_API_KEY`: Groq API key

### Infrastructure (Optional but recommended)
- `REDIS_URL`: Redis connection URL
- `MEM0_API_KEY`: Mem0 API key (if using)
- `MEM0_ENDPOINT`: Mem0 endpoint URL

## Quick Setup Commands

### 1. Set Azure Credentials
```bash
# Edit and run the setup script
./scripts/set-azure-credentials.sh
```

### 2. Set Publish Profile
```bash
# Download from Azure Portal first, then:
gh secret set AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND \
  --repo="brianyang/fin-agent2" \
  < finagent-backend-*.PublishSettings
```

### 3. Set App Service Environment Variables (Azure CLI)
```bash
# Example for setting Supabase variables
az webapp config appsettings set \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --settings \
    SUPABASE_URL="your-supabase-url" \
    SUPABASE_ANON_KEY="your-anon-key" \
    SUPABASE_SERVICE_KEY="your-service-key"
```

### 4. Trigger Deployment
```bash
# After setting all secrets, trigger deployment
gh workflow run "Deploy to Azure App Service" --repo="brianyang/fin-agent2"
```

## Verify Deployment

1. Check workflow status:
```bash
gh run list --workflow="Deploy to Azure App Service" --repo="brianyang/fin-agent2" --limit=1
```

2. Check app health:
```bash
curl https://finagent-backend-pps457j4wjrc6.azurewebsites.net/health
```

## Troubleshooting

If deployment fails:
1. Check GitHub Actions logs for specific errors
2. Ensure all required secrets are set
3. Verify Azure service principal has correct permissions
4. Check App Service logs in Azure Portal

## Security Notes

- Never commit secrets to the repository
- Use GitHub Secrets for all sensitive values
- Rotate credentials regularly
- Use separate credentials for dev/staging/production