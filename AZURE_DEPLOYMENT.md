# Azure Deployment Guide

## 🚀 Manual Deployment (Bypasses GitHub Actions)

When GitHub Actions billing limits are exceeded or you need to deploy immediately, use these manual deployment scripts.

### Prerequisites

1. **Install Azure CLI**
   ```bash
   # macOS
   brew install azure-cli

   # Ubuntu/Debian
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

   # Windows
   winget install Microsoft.AzureCLI
   ```

2. **Login to Azure**
   ```bash
   az login
   ```

3. **Verify subscription**
   ```bash
   az account show
   ```

## 📦 Deployment Options

### Option 1: Full Deployment (Recommended)
Comprehensive deployment with all checks and validations:

```bash
chmod +x deploy-azure-manual.sh
./deploy-azure-manual.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Install dependencies and run Motia postinstall
- ✅ Build the application
- ✅ Create deployment package with .motia directory
- ✅ Configure Azure App Service settings
- ✅ Deploy and verify health endpoint
- ✅ Stream application logs

### Option 2: Quick Deployment
For emergency deployments when you need to push changes fast:

```bash
chmod +x deploy-quick.sh
./deploy-quick.sh
```

## 🔐 Environment Variables

### Setting API Keys
Edit and run the environment setup script:

```bash
chmod +x set-azure-env.sh
# Edit the file and add your API keys
nano set-azure-env.sh
# Run it
./set-azure-env.sh
```

Required environment variables:
- `GROQ_API_KEY` - From https://console.groq.com
- `AZURE_OPENAI_API_KEY` - From Azure Portal
- `AZURE_OPENAI_ENDPOINT` - Your Azure OpenAI endpoint
- `PLAID_CLIENT_ID` & `PLAID_SECRET` - From Plaid dashboard
- `SUPABASE_SERVICE_KEY` - From Supabase project settings

### View Current Settings
```bash
az webapp config appsettings list \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --query '[].name' -o table
```

## 🔧 Troubleshooting

### Run Diagnostics
```bash
chmod +x azure-troubleshoot.sh
./azure-troubleshoot.sh
```

### Common Issues

#### 503 Service Unavailable
- **Cause**: App hasn't started or crashed during startup
- **Fix**:
  ```bash
  # Check logs
  az webapp log tail --name finagent-backend-pps457j4wjrc6 --resource-group finagent-rg

  # Restart app
  az webapp restart --name finagent-backend-pps457j4wjrc6 --resource-group finagent-rg
  ```

#### Motia Not Found Error
- **Cause**: .motia directory not included in deployment
- **Fix**: Ensure `npm run postinstall` runs during build

#### Application Won't Start
- **Cause**: Missing environment variables or build issues
- **Fix**:
  ```bash
  # SSH into the container
  az webapp ssh --name finagent-backend-pps457j4wjrc6 --resource-group finagent-rg

  # Inside container, check files
  ls -la
  ls -la .motia
  npm run postinstall
  npm run build
  ```

## 📊 Monitoring

### Live Logs
```bash
az webapp log tail \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg
```

### Health Check
```bash
curl https://finagent-backend-pps457j4wjrc6.azurewebsites.net/health | jq
```

### SSH Access
```bash
az webapp ssh \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg
```

## 🔄 Deployment Workflow

1. **Local Build** → Dependencies installed, Motia postinstall runs
2. **Package Creation** → Includes node_modules and .motia directory
3. **Upload to Azure** → ZIP deployment via Azure CLI
4. **Startup** → startup.sh script initializes and runs Motia
5. **Health Check** → Verify /health endpoint returns 200

## 📝 Important Notes

- **Always run `npm run postinstall`** - Creates the critical .motia directory
- **Include node_modules in deployment** - Avoids npm install on Azure
- **Set WEBSITES_PORT=3001** - Tells Azure which port to monitor
- **Use startup.sh** - Provides proper initialization sequence

## 🆘 Emergency Deployment Checklist

If deployment is urgent:

1. ✅ Run `az login`
2. ✅ Navigate to project root
3. ✅ Run `./deploy-quick.sh`
4. ✅ Wait 2-3 minutes for startup
5. ✅ Check health: `curl https://finagent-backend-pps457j4wjrc6.azurewebsites.net/health`

## 📚 Resources

- [Azure App Service Docs](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/)
- [Motia Framework Docs](https://motia.dev/docs)

---

**Current App Service Details:**
- Name: `finagent-backend-pps457j4wjrc6`
- Resource Group: `finagent-rg`
- URL: https://finagent-backend-pps457j4wjrc6.azurewebsites.net
- Region: (Check Azure Portal)
- Plan: (Check Azure Portal)