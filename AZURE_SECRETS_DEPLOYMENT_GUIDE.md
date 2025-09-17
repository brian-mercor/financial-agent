# Azure Secrets Management for Deployment

## The Problem
- Cannot commit `.env.production` with real secrets to Git
- Azure deployment needs access to secrets
- Must maintain security while enabling automated deployment

## Solution Options

### Option 1: Azure Key Vault (Recommended for Production)

Store all secrets in Azure Key Vault and reference them in deployment:

```bash
# Create Key Vault
az keyvault create \
  --name finagent-keyvault \
  --resource-group finagent-rg \
  --location eastus

# Add secrets to Key Vault
az keyvault secret set \
  --vault-name finagent-keyvault \
  --name "supabase-url" \
  --value "YOUR_SUPABASE_URL"

az keyvault secret set \
  --vault-name finagent-keyvault \
  --name "supabase-anon-key" \
  --value "YOUR_SUPABASE_ANON_KEY"

# Add all other secrets similarly...
```

Then modify ARM template to reference Key Vault:
```json
{
  "type": "Microsoft.KeyVault/vaults/secrets",
  "name": "[concat(parameters('keyVaultName'), '/supabase-url')]",
  "apiVersion": "2019-09-01"
}
```

### Option 2: Azure CLI Parameters (Quick Solution)

Pass secrets directly via Azure CLI without any file:

```bash
# Deploy with inline parameters
az deployment group create \
  --resource-group finagent-rg \
  --template-file azure-deploy.json \
  --parameters \
    supabaseUrl="$SUPABASE_URL" \
    supabaseAnonKey="$SUPABASE_ANON_KEY" \
    supabaseServiceKey="$SUPABASE_SERVICE_KEY" \
    plaidClientId="$PLAID_CLIENT_ID" \
    plaidSecret="$PLAID_SECRET" \
    polygonApiKey="$POLYGON_API_KEY" \
    alpacaApiKey="$ALPACA_API_KEY" \
    alpacaSecretKey="$ALPACA_SECRET_KEY" \
    openaiApiKey="$OPENAI_API_KEY" \
    anthropicApiKey="$ANTHROPIC_API_KEY" \
    groqApiKey="$GROQ_API_KEY" \
    mem0ApiKey="$MEM0_API_KEY"
```

### Option 3: GitHub Secrets + Actions (CI/CD)

Store secrets in GitHub repository settings, then deploy via GitHub Actions:

1. Add secrets to GitHub repo:
   - Go to Settings → Secrets and variables → Actions
   - Add each secret (SUPABASE_URL, etc.)

2. Create `.github/workflows/deploy-azure.yml`:
```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Login to Azure
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Deploy to Azure
        run: |
          az deployment group create \
            --resource-group finagent-rg \
            --template-file azure-deploy.json \
            --parameters \
              supabaseUrl="${{ secrets.SUPABASE_URL }}" \
              supabaseAnonKey="${{ secrets.SUPABASE_ANON_KEY }}" \
              supabaseServiceKey="${{ secrets.SUPABASE_SERVICE_KEY }}" \
              plaidClientId="${{ secrets.PLAID_CLIENT_ID }}" \
              plaidSecret="${{ secrets.PLAID_SECRET }}" \
              polygonApiKey="${{ secrets.POLYGON_API_KEY }}" \
              alpacaApiKey="${{ secrets.ALPACA_API_KEY }}" \
              alpacaSecretKey="${{ secrets.ALPACA_SECRET_KEY }}" \
              openaiApiKey="${{ secrets.OPENAI_API_KEY }}" \
              anthropicApiKey="${{ secrets.ANTHROPIC_API_KEY }}" \
              groqApiKey="${{ secrets.GROQ_API_KEY }}" \
              mem0ApiKey="${{ secrets.MEM0_API_KEY }}"
```

### Option 4: Local Environment Variables (Manual Deployment)

Keep secrets in your local environment and deploy manually:

1. Create `.env.production.example` (commit this):
```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
PLAID_CLIENT_ID=
PLAID_SECRET=
POLYGON_API_KEY=
ALPACA_API_KEY=
ALPACA_SECRET_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GROQ_API_KEY=
MEM0_API_KEY=
```

2. Create local `.env.production` (never commit):
```bash
cp .env.production.example .env.production
# Fill in actual values
```

3. Run modified deployment script:
```bash
#!/bin/bash
# Load local env file
source .env.production

# Deploy with environment variables
az deployment group create \
  --resource-group finagent-rg \
  --template-file azure-deploy.json \
  --parameters \
    supabaseUrl="$SUPABASE_URL" \
    supabaseAnonKey="$SUPABASE_ANON_KEY" \
    # ... etc
```

### Option 5: Azure App Configuration

Use Azure App Configuration service for centralized config:

```bash
# Create App Configuration store
az appconfig create \
  --name finagent-config \
  --resource-group finagent-rg \
  --location eastus

# Add configuration values
az appconfig kv set \
  --name finagent-config \
  --key "supabase:url" \
  --value "YOUR_SUPABASE_URL"
```

## Recommended Approach for Your Case

### Immediate Solution (Fastest):

1. **Create a deployment wrapper script** `deploy-with-secrets.sh`:

```bash
#!/bin/bash

# Check if .env.production exists locally
if [ ! -f ".env.production" ]; then
    echo "Error: .env.production not found"
    echo "Create it from .env.production.example"
    exit 1
fi

# Source the environment file
source .env.production

# Deploy using Azure CLI with parameters
az deployment group create \
  --name "finagent-deployment-$(date +%Y%m%d-%H%M%S)" \
  --resource-group finagent-rg \
  --template-file azure-deploy.json \
  --parameters \
    supabaseUrl="$SUPABASE_URL" \
    supabaseAnonKey="$SUPABASE_ANON_KEY" \
    supabaseServiceKey="$SUPABASE_SERVICE_KEY" \
    plaidClientId="${PLAID_CLIENT_ID:-placeholder}" \
    plaidSecret="${PLAID_SECRET:-placeholder}" \
    polygonApiKey="${POLYGON_API_KEY:-placeholder}" \
    alpacaApiKey="${ALPACA_API_KEY:-placeholder}" \
    alpacaSecretKey="${ALPACA_SECRET_KEY:-placeholder}" \
    openaiApiKey="${OPENAI_API_KEY:-placeholder}" \
    anthropicApiKey="${ANTHROPIC_API_KEY:-placeholder}" \
    groqApiKey="${GROQ_API_KEY:-placeholder}" \
    mem0ApiKey="${MEM0_API_KEY:-placeholder}"
```

2. **Add to .gitignore**:
```
.env.production
*.env
!.env.example
!.env.production.example
```

3. **Create .env.production.example** (commit this):
```bash
# Copy this to .env.production and fill in your values
# NEVER commit .env.production with real values!

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
PLAID_CLIENT_ID=
PLAID_SECRET=
POLYGON_API_KEY=
ALPACA_API_KEY=
ALPACA_SECRET_KEY=
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
MEM0_API_KEY=
```

### For Production (Best Practice):

Use **Azure Key Vault** + **Managed Identities**:

1. Store all secrets in Key Vault
2. Grant container instances access via managed identity
3. No secrets in code or parameters
4. Automatic rotation capability

## Quick Deployment Commands

### Step 1: Prepare Secrets Locally
```bash
# Create your local env file (never commit this)
cp .env.production.example .env.production
# Edit and add your real keys
nano .env.production
```

### Step 2: Deploy Using Script
```bash
# Use the wrapper script that reads local env
./scripts/deploy-with-secrets.sh
```

### Step 3: Or Deploy Directly
```bash
# Source your env file
source .env.production

# Run Azure deployment with env vars
az deployment group create \
  --resource-group finagent-rg \
  --template-file azure-deploy.json \
  --parameters supabaseUrl="$SUPABASE_URL" \
              supabaseAnonKey="$SUPABASE_ANON_KEY" \
              # ... add all parameters
```

## Security Best Practices

1. **Never commit** `.env.production` with real values
2. **Always use** `.gitignore` to exclude env files
3. **Rotate secrets** regularly
4. **Use Key Vault** for production
5. **Limit access** to secrets (principle of least privilege)
6. **Audit access** to secrets
7. **Use managed identities** when possible (no keys needed)

## Container-Specific Environment Variables

Once deployed, you can also update container environment variables directly:

```bash
# Update container environment variables
az container update \
  --resource-group finagent-rg \
  --name finagent-container-group \
  --set environmentVariables[0].name=SUPABASE_URL \
        environmentVariables[0].secureValue="YOUR_NEW_VALUE"
```

## Summary

For your immediate needs:
1. Keep `.env.production` local only
2. Pass secrets as CLI parameters during deployment
3. Never commit secrets to Git
4. Consider Key Vault for production