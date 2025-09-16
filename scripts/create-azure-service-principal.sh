#!/bin/bash

# Script to create a new Azure Service Principal and get real credentials

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Azure Service Principal Creation ===${NC}"
echo ""

# Check if az CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed!${NC}"
    echo "Install it with: brew install azure-cli"
    exit 1
fi

# Check if logged in to Azure
echo "Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Azure. Initiating login...${NC}"
    az login
fi

# Get current subscription info
echo -e "${BLUE}Current Azure Subscription:${NC}"
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo "Name: $SUBSCRIPTION_NAME"
echo "ID: $SUBSCRIPTION_ID"
echo ""

# Set the service principal name
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
SP_NAME="finagent2-sp-${TIMESTAMP}"

echo -e "${YELLOW}Creating new Service Principal: $SP_NAME${NC}"
echo "This will have Contributor role on your subscription"
echo ""

# Create the service principal and capture output
SP_OUTPUT=$(az ad sp create-for-rbac \
    --name "$SP_NAME" \
    --role Contributor \
    --scopes "/subscriptions/$SUBSCRIPTION_ID" \
    --sdk-auth)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Service Principal created successfully!${NC}"
    echo ""
    
    # Parse the JSON output
    CLIENT_ID=$(echo "$SP_OUTPUT" | jq -r '.clientId')
    CLIENT_SECRET=$(echo "$SP_OUTPUT" | jq -r '.clientSecret')
    TENANT_ID=$(echo "$SP_OUTPUT" | jq -r '.tenantId')
    
    # Create the credentials JSON in the format GitHub expects
    AZURE_CREDENTIALS=$(cat <<EOF
{
  "clientId": "$CLIENT_ID",
  "clientSecret": "$CLIENT_SECRET",
  "subscriptionId": "$SUBSCRIPTION_ID",
  "tenantId": "$TENANT_ID"
}
EOF
)
    
    echo -e "${BLUE}=== NEW AZURE CREDENTIALS ===${NC}"
    echo "$AZURE_CREDENTIALS" | jq '.'
    echo ""
    
    # Save to file for backup
    BACKUP_FILE="azure-sp-backup-${TIMESTAMP}.json"
    echo "$AZURE_CREDENTIALS" > "$BACKUP_FILE"
    echo -e "${GREEN}Credentials backed up to: $BACKUP_FILE${NC}"
    echo ""
    
    # Offer to update GitHub secret
    echo -e "${YELLOW}Do you want to update the GitHub secret now? (y/n)${NC}"
    read -r UPDATE_GITHUB
    
    if [[ "$UPDATE_GITHUB" == "y" || "$UPDATE_GITHUB" == "Y" ]]; then
        if [ -z "$REPO" ]; then
            echo "Enter your GitHub repository (format: owner/repo):"
            read -r REPO
        fi
        
        echo "$AZURE_CREDENTIALS" | gh secret set AZURE_CREDENTIALS --repo "$REPO"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ GitHub secret AZURE_CREDENTIALS updated!${NC}"
        else
            echo -e "${RED}Failed to update GitHub secret${NC}"
            echo "You can manually update it with:"
            echo "cat $BACKUP_FILE | gh secret set AZURE_CREDENTIALS --repo YOUR_REPO"
        fi
    fi
    
    echo ""
    echo -e "${BLUE}=== IMPORTANT NOTES ===${NC}"
    echo "1. Service Principal Name: $SP_NAME"
    echo "2. Credentials saved to: $BACKUP_FILE"
    echo "3. This SP has Contributor role on subscription: $SUBSCRIPTION_NAME"
    echo ""
    echo -e "${YELLOW}To list all service principals:${NC}"
    echo "az ad sp list --display-name finagent2-sp --query '[].{name:displayName, id:appId}' -o table"
    echo ""
    echo -e "${YELLOW}To delete old service principals later:${NC}"
    echo "az ad sp delete --id <old-client-id>"
    
else
    echo -e "${RED}Failed to create Service Principal${NC}"
    echo "Please check your Azure permissions"
    exit 1
fi