#!/bin/bash

# Script to set Azure credentials as GitHub secret
# Usage: ./set-azure-credentials.sh

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Azure Credentials GitHub Secret Setup ===${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub${NC}"
    echo "Please run: gh auth login"
    exit 1
fi

# Repository
REPO="brianyang/fin-agent2"

echo -e "${YELLOW}Setting up AZURE_CREDENTIALS secret for repository: $REPO${NC}"
echo ""

# Create the Azure credentials JSON
# Replace these placeholders with your actual values
cat << 'EOF' > /tmp/azure_creds.json
{
  "clientId": "YOUR_CLIENT_ID_HERE",
  "clientSecret": "YOUR_CLIENT_SECRET_HERE",
  "subscriptionId": "YOUR_SUBSCRIPTION_ID_HERE",
  "tenantId": "YOUR_TENANT_ID_HERE",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
EOF

echo -e "${YELLOW}Please edit /tmp/azure_creds.json and replace the placeholder values:${NC}"
echo "  - YOUR_CLIENT_ID_HERE"
echo "  - YOUR_CLIENT_SECRET_HERE"
echo "  - YOUR_SUBSCRIPTION_ID_HERE"
echo "  - YOUR_TENANT_ID_HERE"
echo ""
echo -e "${GREEN}Opening editor...${NC}"

# Open in default editor
${EDITOR:-nano} /tmp/azure_creds.json

# Verify the file was edited
if grep -q "YOUR_.*_HERE" /tmp/azure_creds.json; then
    echo -e "${RED}Error: Placeholder values still exist in the file${NC}"
    echo "Please replace all placeholder values"
    exit 1
fi

# Validate JSON
if ! jq empty /tmp/azure_creds.json 2>/dev/null; then
    echo -e "${RED}Error: Invalid JSON format${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}JSON is valid. Setting GitHub secret...${NC}"

# Set the secret
gh secret set AZURE_CREDENTIALS --repo="$REPO" < /tmp/azure_creds.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ AZURE_CREDENTIALS secret has been set successfully${NC}"

    # Clean up
    rm -f /tmp/azure_creds.json

    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Set AZURE_RESOURCE_GROUP secret (if different from 'finagent-rg'):"
    echo "   gh secret set AZURE_RESOURCE_GROUP --repo='$REPO' --body='finagent-rg'"
    echo ""
    echo "2. Set the Azure Webapp Publish Profile:"
    echo "   - Go to Azure Portal → App Service → finagent-backend-pps457j4wjrc6"
    echo "   - Download Publish Profile"
    echo "   - Set as secret: gh secret set AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND --repo='$REPO' < publish-profile.xml"
    echo ""
    echo "3. Configure App Service environment variables in Azure Portal"
    echo ""
    echo -e "${GREEN}Done!${NC}"
else
    echo -e "${RED}Failed to set GitHub secret${NC}"
    exit 1
fi