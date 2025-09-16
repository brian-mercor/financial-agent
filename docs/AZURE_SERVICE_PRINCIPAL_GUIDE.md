# Azure Service Principal Creation Guide

## Method 1: Azure CLI (Fastest)

### Prerequisites
```bash
# Install Azure CLI if not installed
brew install azure-cli

# Login to Azure
az login
```

### Quick Creation
```bash
# Run the automated script
./create-azure-service-principal.sh
```

### Manual CLI Commands
```bash
# 1. Create Service Principal with Contributor role
az ad sp create-for-rbac \
  --name "finagent2-sp-prod" \
  --role Contributor \
  --scopes /subscriptions/YOUR-SUBSCRIPTION-ID \
  --sdk-auth

# This outputs JSON credentials like:
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}

# 2. List existing service principals
az ad sp list --display-name finagent2 --query '[].{name:displayName, id:appId}' -o table

# 3. Delete old service principal (after confirming new one works)
az ad sp delete --id OLD-CLIENT-ID
```

## Method 2: Azure Portal (UI)

### Step 1: Create App Registration
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **"+ New registration"**
4. Fill in:
   - Name: `finagent2-sp-prod` (or your preferred name)
   - Account types: "Single tenant"
   - Click **Register**

### Step 2: Get Client ID and Tenant ID
1. After creation, you'll see the app overview
2. Copy these values:
   - **Application (client) ID** = `clientId`
   - **Directory (tenant) ID** = `tenantId`

### Step 3: Create Client Secret
1. In your app registration, go to **Certificates & secrets**
2. Click **"+ New client secret"**
3. Add description: "GitHub Actions Secret"
4. Choose expiration (recommend: 24 months)
5. Click **Add**
6. **IMMEDIATELY COPY** the secret value (you can't see it again!)
   - This is your `clientSecret`

### Step 4: Get Subscription ID
1. Go to **Subscriptions** in Azure Portal
2. Click on your subscription
3. Copy the **Subscription ID** = `subscriptionId`

### Step 5: Assign Permissions
1. Go to your **Subscription** → **Access control (IAM)**
2. Click **"+ Add"** → **"Add role assignment"**
3. Role: Select **"Contributor"**
4. Members: Search for your app name (`finagent2-sp-prod`)
5. Click **Review + assign**

### Step 6: Format Credentials
Create JSON with your values:
```json
{
  "clientId": "YOUR-APP-CLIENT-ID",
  "clientSecret": "YOUR-CLIENT-SECRET",
  "subscriptionId": "YOUR-SUBSCRIPTION-ID",
  "tenantId": "YOUR-TENANT-ID"
}
```

## Update GitHub Secret

### Using GitHub CLI
```bash
# Set the repository
export REPO="brianyang/fin-agent2"

# Update the secret (paste JSON when prompted)
gh secret set AZURE_CREDENTIALS --repo $REPO
```

### Using GitHub UI
1. Go to your repo Settings → Secrets and variables → Actions
2. Edit `AZURE_CREDENTIALS`
3. Paste the JSON credentials
4. Save

## Managing Multiple Service Principals

### Keep Old SP Active During Testing
1. Create NEW service principal (don't delete old one yet)
2. Update GitHub secret with NEW credentials
3. Run your GitHub Actions to test
4. Once confirmed working, delete OLD service principal

### List All Service Principals
```bash
# List all SPs for your app
az ad sp list --all --query "[?contains(displayName, 'finagent')].{name:displayName, created:createdDateTime, id:appId}" -o table
```

### Delete Old Service Principal
```bash
# After confirming new one works
az ad sp delete --id OLD-CLIENT-ID
```

## Security Best Practices

1. **Rotate Regularly**: Change service principal secrets every 3-6 months
2. **Use Least Privilege**: Only grant necessary permissions
3. **Set Expiration**: Always set secret expiration dates
4. **Audit Access**: Regularly review who has access
5. **Never Commit Secrets**: Always use GitHub Secrets or environment variables

## Troubleshooting

### "Insufficient privileges"
- You need Owner or User Access Administrator role on the subscription

### "Service principal not found"
- Wait 1-2 minutes after creation for propagation
- Check if you're in the right tenant/subscription

### GitHub Actions failing with new credentials
- Verify JSON format is correct
- Check service principal has Contributor role
- Ensure subscription ID matches your resources