#!/bin/bash

# Script to verify Azure Service Principal credentials are working

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Azure Service Principal Verification ===${NC}"
echo ""

# Function to test credentials
test_azure_credentials() {
    local CLIENT_ID=$1
    local CLIENT_SECRET=$2
    local TENANT_ID=$3
    local SUBSCRIPTION_ID=$4
    
    echo -e "${CYAN}Testing credentials...${NC}"
    
    # Test 1: Login with service principal
    echo -n "1. Testing Azure login... "
    if az login --service-principal \
        --username "$CLIENT_ID" \
        --password "$CLIENT_SECRET" \
        --tenant "$TENANT_ID" \
        --output none 2>/dev/null; then
        echo -e "${GREEN}✓ Login successful${NC}"
        LOGIN_SUCCESS=true
    else
        echo -e "${RED}✗ Login failed${NC}"
        LOGIN_SUCCESS=false
        return 1
    fi
    
    # Test 2: Set subscription
    echo -n "2. Testing subscription access... "
    if az account set --subscription "$SUBSCRIPTION_ID" 2>/dev/null; then
        echo -e "${GREEN}✓ Subscription access confirmed${NC}"
    else
        echo -e "${RED}✗ Cannot access subscription${NC}"
        return 1
    fi
    
    # Test 3: List resource groups (tests read permissions)
    echo -n "3. Testing resource group listing... "
    if RG_COUNT=$(az group list --query "length(@)" -o tsv 2>/dev/null); then
        echo -e "${GREEN}✓ Can list resource groups (found: $RG_COUNT)${NC}"
    else
        echo -e "${RED}✗ Cannot list resource groups${NC}"
        return 1
    fi
    
    # Test 4: Check role assignments
    echo -n "4. Checking role assignments... "
    ROLES=$(az role assignment list \
        --assignee "$CLIENT_ID" \
        --query "[].roleDefinitionName" \
        -o tsv 2>/dev/null | tr '\n' ', ' | sed 's/,$//')
    
    if [ ! -z "$ROLES" ]; then
        echo -e "${GREEN}✓ Roles: $ROLES${NC}"
    else
        echo -e "${YELLOW}⚠ No roles found (might still be propagating)${NC}"
    fi
    
    # Test 5: Test creating a resource group (tests write permissions)
    echo -n "5. Testing write permissions... "
    TEST_RG="test-sp-verify-$(date +%s)"
    TEST_LOCATION="eastus"
    
    if az group create \
        --name "$TEST_RG" \
        --location "$TEST_LOCATION" \
        --output none 2>/dev/null; then
        echo -e "${GREEN}✓ Can create resources${NC}"
        
        # Clean up test resource group
        echo -n "   Cleaning up test resource... "
        if az group delete --name "$TEST_RG" --yes --no-wait --output none 2>/dev/null; then
            echo -e "${GREEN}✓ Cleanup initiated${NC}"
        fi
    else
        echo -e "${RED}✗ Cannot create resources (check Contributor role)${NC}"
        WRITE_FAILED=true
    fi
    
    # Test 6: Check expiration
    echo -n "6. Checking secret expiration... "
    EXPIRY=$(az ad sp credential list \
        --id "$CLIENT_ID" \
        --query "[0].endDateTime" \
        -o tsv 2>/dev/null)
    
    if [ ! -z "$EXPIRY" ]; then
        echo -e "${GREEN}✓ Secret expires: $EXPIRY${NC}"
    else
        echo -e "${YELLOW}⚠ Could not check expiration${NC}"
    fi
    
    return 0
}

# Function to test GitHub secret
test_github_secret() {
    echo ""
    echo -e "${CYAN}Testing GitHub Secret AZURE_CREDENTIALS...${NC}"
    
    if [ -z "$REPO" ]; then
        echo -e "${YELLOW}Enter your GitHub repository (format: owner/repo):${NC}"
        read -r REPO
    fi
    
    # Get the secret from GitHub (we can't see the value, but we can verify it exists)
    echo -n "Checking if secret exists in GitHub... "
    if gh secret list --repo "$REPO" | grep -q "AZURE_CREDENTIALS"; then
        echo -e "${GREEN}✓ Secret exists${NC}"
        
        # Trigger a workflow to test (if workflow exists)
        echo ""
        echo -e "${YELLOW}To fully test GitHub Actions:${NC}"
        echo "1. Push a change to trigger your workflow"
        echo "2. Or manually trigger a workflow:"
        echo "   gh workflow run YOUR_WORKFLOW.yml --repo $REPO"
        echo "3. Check the Actions tab in GitHub"
    else
        echo -e "${RED}✗ Secret not found${NC}"
    fi
}

# Main execution
echo -e "${YELLOW}How would you like to provide credentials?${NC}"
echo "1. From a JSON file"
echo "2. From GitHub secret (current)"
echo "3. Enter manually"
echo "4. Test the last created SP (from backup file)"
read -r CHOICE

case $CHOICE in
    1)
        echo "Enter path to JSON file:"
        read -r JSON_FILE
        if [ -f "$JSON_FILE" ]; then
            CLIENT_ID=$(jq -r '.clientId' "$JSON_FILE")
            CLIENT_SECRET=$(jq -r '.clientSecret' "$JSON_FILE")
            TENANT_ID=$(jq -r '.tenantId' "$JSON_FILE")
            SUBSCRIPTION_ID=$(jq -r '.subscriptionId' "$JSON_FILE")
        else
            echo -e "${RED}File not found${NC}"
            exit 1
        fi
        ;;
    
    2)
        echo -e "${YELLOW}Note: We'll test by using the Azure CLI with the values${NC}"
        echo "GitHub secrets are encrypted and can't be read directly."
        echo ""
        echo "You'll need to provide the credentials to test them."
        echo "Check your backup file or Azure Portal for the values."
        echo ""
        echo "Enter the credentials from your GitHub secret:"
        echo -n "Client ID: "
        read -r CLIENT_ID
        echo -n "Client Secret: "
        read -rs CLIENT_SECRET
        echo ""
        echo -n "Tenant ID: "
        read -r TENANT_ID
        echo -n "Subscription ID: "
        read -r SUBSCRIPTION_ID
        ;;
    
    3)
        echo -n "Client ID: "
        read -r CLIENT_ID
        echo -n "Client Secret: "
        read -rs CLIENT_SECRET
        echo ""
        echo -n "Tenant ID: "
        read -r TENANT_ID
        echo -n "Subscription ID: "
        read -r SUBSCRIPTION_ID
        ;;
    
    4)
        # Find the most recent backup file
        LATEST_BACKUP=$(ls -t azure-sp-backup-*.json 2>/dev/null | head -1)
        if [ -f "$LATEST_BACKUP" ]; then
            echo -e "${GREEN}Found backup: $LATEST_BACKUP${NC}"
            CLIENT_ID=$(jq -r '.clientId' "$LATEST_BACKUP")
            CLIENT_SECRET=$(jq -r '.clientSecret' "$LATEST_BACKUP")
            TENANT_ID=$(jq -r '.tenantId' "$LATEST_BACKUP")
            SUBSCRIPTION_ID=$(jq -r '.subscriptionId' "$LATEST_BACKUP")
        else
            echo -e "${RED}No backup files found${NC}"
            exit 1
        fi
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}Testing Service Principal:${NC}"
echo "Client ID: $CLIENT_ID"
echo "Tenant ID: $TENANT_ID"
echo "Subscription: $SUBSCRIPTION_ID"
echo ""

# Run tests
if test_azure_credentials "$CLIENT_ID" "$CLIENT_SECRET" "$TENANT_ID" "$SUBSCRIPTION_ID"; then
    echo ""
    echo -e "${GREEN}✅ All tests passed! The service principal is working correctly.${NC}"
    
    # Offer to test GitHub integration
    echo ""
    echo -e "${YELLOW}Do you want to test GitHub secret integration? (y/n)${NC}"
    read -r TEST_GITHUB
    
    if [[ "$TEST_GITHUB" == "y" || "$TEST_GITHUB" == "Y" ]]; then
        test_github_secret
    fi
    
    echo ""
    echo -e "${BLUE}=== Next Steps ===${NC}"
    echo "1. ✅ New service principal is verified and working"
    echo "2. Monitor your GitHub Actions for successful runs"
    echo "3. After confirming everything works, delete old service principals:"
    echo ""
    echo -e "${YELLOW}List all service principals:${NC}"
    echo "az ad sp list --all --query \"[?contains(displayName, 'finagent')].{name:displayName, created:createdDateTime, id:appId}\" -o table"
    echo ""
    echo -e "${YELLOW}Delete old service principal:${NC}"
    echo "az ad sp delete --id OLD-CLIENT-ID"
    
else
    echo ""
    echo -e "${RED}❌ Verification failed! Please check:${NC}"
    echo "1. The credentials are correct"
    echo "2. The service principal has Contributor role"
    echo "3. You're using the right subscription"
    echo ""
    echo -e "${YELLOW}Debug commands:${NC}"
    echo "# Check if SP exists:"
    echo "az ad sp show --id $CLIENT_ID"
    echo ""
    echo "# Check role assignments:"
    echo "az role assignment list --assignee $CLIENT_ID --all"
fi

# Logout from service principal
echo ""
echo -n "Logging out from test session... "
az logout --output none 2>/dev/null
echo -e "${GREEN}✓${NC}"