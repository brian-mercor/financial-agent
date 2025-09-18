# Azure Backend Fix - After Key Rotation

## Context
The backend was working but had to be taken down due to compromised API keys. After changing the service role/user, the app shows "Application Error".

## The Issue
Since the app was already deployed and working, this is NOT a code/dependency issue. It's an **authentication/configuration issue** after the security incident.

## Immediate Fix Checklist

### 1. Check Azure App Service Environment Variables
**These were likely cleared or need updating after the key rotation**

Go to [Azure Portal](https://portal.azure.com) → Your App Service (`finagent-backend-pps457j4wjrc6`) → **Configuration** → **Application Settings**

Verify these are set with the NEW keys:
- [ ] `SUPABASE_SERVICE_KEY` - Must be the NEW service role key from Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Should still be: `https://fuaogvgmdgndldimnnrs.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - The anon key (this one is public, so probably unchanged)
- [ ] `GROQ_API_KEY` - If you rotated this, update it
- [ ] `AZURE_OPENAI_API_KEY` - If you rotated this, update it
- [ ] `PLAID_CLIENT_ID` and `PLAID_SECRET` - If using Plaid

### 2. Update GitHub Secrets (for future deployments)
In your GitHub repository settings → Secrets and variables → Actions:

**Critical for deployment:**
- [ ] `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND` - Download new publish profile from Azure
- [ ] `AZURE_CREDENTIALS` - Update if service principal was changed

**API Keys that need updating:**
- [ ] `SUPABASE_SERVICE_KEY` - NEW service role key
- [ ] `GROQ_API_KEY` - If rotated
- [ ] `AZURE_OPENAI_API_KEY` - If rotated
- [ ] `PLAID_CLIENT_ID` and `PLAID_SECRET` - If rotated

### 3. How to Get New Azure Publish Profile
1. Go to Azure Portal → Your App Service
2. Click **"Get publish profile"** in the top menu
3. Copy the entire XML content
4. Update the GitHub secret `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND`

### 4. Quick Fix Without Redeployment
Since the code is already deployed, you just need to:

1. **Update the environment variables in Azure Portal** (Step 1 above)
2. **Restart the App Service:**
   ```bash
   # In Azure Cloud Shell or local Azure CLI
   az webapp restart --name finagent-backend-pps457j4wjrc6 --resource-group finagent-rg
   ```
   Or in Azure Portal: Click "Restart" button

### 5. Verify the Service is Running
After updating environment variables and restarting:

1. Check the health endpoint: https://finagent-backend-pps457j4wjrc6.azurewebsites.net/health
2. Check logs in Kudu: https://finagent-backend-pps457j4wjrc6.scm.azurewebsites.net/

## Most Likely Culprit
**The `SUPABASE_SERVICE_KEY` in Azure App Service Configuration is either:**
- Missing (was cleared during security incident)
- Still has the OLD compromised key
- Has an incorrectly formatted NEW key

## To Verify This Is The Issue

1. Go to Kudu console: https://finagent-backend-pps457j4wjrc6.scm.azurewebsites.net/
2. Go to Debug Console → CMD
3. Run:
   ```cmd
   cd site\wwwroot
   set | findstr SUPABASE
   ```
4. Check if SUPABASE_SERVICE_KEY is set (it won't show the value for security)

## If Everything Looks Correct But Still Fails

The app might be failing to connect to Supabase with the new service role. Check:

1. **In Supabase Dashboard:**
   - Verify the service role key is active
   - Check if there are any IP restrictions
   - Ensure the project is not paused

2. **Test the connection locally:**
   ```bash
   # Set the new keys locally
   export SUPABASE_URL="https://fuaogvgmdgndldimnnrs.supabase.co"
   export SUPABASE_SERVICE_KEY="your-new-service-key"

   # Test with a simple Node script
   node -e "
   const { createClient } = require('@supabase/supabase-js');
   const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
   client.from('test').select('*').limit(1).then(console.log).catch(console.error);
   "
   ```

## Summary
Since the app was working before the key rotation:
1. **Don't redeploy** - the code is fine
2. **Just update the environment variables** in Azure with the new keys
3. **Restart the service**
4. It should work immediately

The deployment failures in GitHub Actions are likely because the GitHub secrets haven't been updated with the new credentials, but that only affects NEW deployments, not the already-deployed app.