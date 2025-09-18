# Azure Backend Diagnostics Guide

## Issue
Backend fails to start with "Application Error" on https://finagent-backend-pps457j4wjrc6.azurewebsites.net/

## How to Access Logs

### Option 1: Azure Portal Logs
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service: `finagent-backend-pps457j4wjrc6`
3. In the left menu, find **"Monitoring"** → **"Log stream"**
4. This will show real-time logs

### Option 2: Kudu Console (Advanced Tools)
1. Visit: https://finagent-backend-pps457j4wjrc6.scm.azurewebsites.net/
2. Go to **Debug Console** → **CMD** or **Bash**
3. Navigate to `/home/LogFiles/`
4. Check these log files:
   - `Application/` - Application logs
   - `2025_09_*_docker.log` - Container logs
   - `eventlog.xml` - Event logs

### Option 3: Azure CLI (if installed locally)
```bash
# Login to Azure
az login

# Stream logs
az webapp log tail \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg

# Download logs
az webapp log download \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --log-file ./logs.zip
```

## Likely Issues Based on Configuration

### 1. Missing Environment Variables
The backend requires these environment variables (check in Azure Portal → Configuration → Application Settings):
- `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_SERVICE_KEY`
- `GROQ_API_KEY` (optional but may cause issues if missing)
- `AZURE_OPENAI_API_KEY` (optional)

### 2. Motia Installation Issue
The startup script expects Motia to be available. The deployment might be missing the `.motia` directory.

### 3. Node Module Issues
The deployment might be missing critical node_modules or the Motia CLI.

## Quick Fixes to Try

### Fix 1: Add Missing Environment Variables
In Azure Portal:
1. Go to your App Service
2. Navigate to **Configuration** → **Application settings**
3. Ensure these are set:
   ```
   SUPABASE_URL = https://fuaogvgmdgndldimnnrs.supabase.co
   SUPABASE_SERVICE_KEY = [your service key]
   NODE_ENV = production
   PORT = 3001
   ```

### Fix 2: Restart the App Service
```bash
# Using Azure CLI
az webapp restart \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg
```

Or in Azure Portal:
1. Go to your App Service
2. Click **"Restart"** in the top menu

### Fix 3: Check Deployment Status
In Azure Portal:
1. Go to **Deployment Center**
2. Check the deployment logs
3. Look for any build or deployment errors

## Diagnostic Commands to Run in Kudu

Once in Kudu console, run these commands:

```bash
# Check if node_modules exists
ls -la /home/site/wwwroot/node_modules

# Check if Motia is installed
ls -la /home/site/wwwroot/node_modules/@motia

# Check if .motia directory exists
ls -la /home/site/wwwroot/.motia

# Check startup script
cat /home/site/wwwroot/startup.sh

# Check environment variables (sensitive data will be hidden)
env | grep -E "(NODE|SUPABASE|PORT|AZURE)"

# Try running Motia directly
cd /home/site/wwwroot
npx motia --version

# Check recent error logs
tail -100 /home/LogFiles/2025_09_*_default_docker.log
```

## Updated Startup Script with Better Error Handling

Save this as `startup-debug.sh` for better error visibility:

```bash
#!/bin/bash
echo "=== Starting Motia Backend Debug Mode ==="
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo ""
echo "=== Environment Check ==="
echo "NODE_ENV: ${NODE_ENV}"
echo "PORT: ${PORT:-3001}"
echo "SUPABASE_URL set: $([ -n "$SUPABASE_URL" ] && echo "YES" || echo "NO")"
echo "SUPABASE_SERVICE_KEY set: $([ -n "$SUPABASE_SERVICE_KEY" ] && echo "YES" || echo "NO")"

echo ""
echo "=== Node.js Check ==="
node --version
npm --version

echo ""
echo "=== Motia Check ==="
if npx motia --version 2>/dev/null; then
    echo "Motia is installed"
else
    echo "ERROR: Motia not found, attempting to install..."
    npm install @motia/core @motia/cli --no-save
fi

echo ""
echo "=== .motia Directory Check ==="
if [ -d ".motia" ]; then
    echo ".motia directory exists"
    ls -la .motia/
else
    echo "WARNING: .motia directory not found, running motia install..."
    npx motia install || echo "ERROR: Failed to run motia install"
fi

echo ""
echo "=== Starting Application ==="
echo "Running: PORT=${PORT:-3001} npx motia start --host 0.0.0.0"
PORT=${PORT:-3001} npx motia start --host 0.0.0.0 2>&1 || {
    echo "ERROR: Failed to start Motia"
    echo "Trying with more verbose output..."
    PORT=${PORT:-3001} node node_modules/@motia/cli/dist/index.js start --host 0.0.0.0 --verbose
}
```

## Next Steps

1. Access the logs using one of the methods above
2. Look for specific error messages
3. Check if environment variables are properly set
4. Share the error logs so we can identify the exact issue

The most common issues are:
- Missing SUPABASE environment variables
- Motia not being properly installed during deployment
- Port binding issues (Azure expects the app to listen on the PORT env variable)