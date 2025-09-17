#!/bin/bash

# Azure Deployment Script with Secret Management
# This script deploys to Azure using local environment variables
# WITHOUT committing secrets to Git

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Azure Secure Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"

# Check for Azure CLI
command -v az >/dev/null 2>&1 || {
    echo -e "${RED}Azure CLI is required but not installed.${NC}" >&2
    echo "Install: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

# Configuration
RESOURCE_GROUP=${AZURE_RESOURCE_GROUP:-"finagent-rg"}
LOCATION=${AZURE_LOCATION:-"eastus"}
ENV_FILE=".env.production"
TEMPLATE_FILE="azure-deploy.json"

# Check for environment file
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: $ENV_FILE not found!${NC}"
    echo ""
    echo "Please create $ENV_FILE with your secrets:"
    echo "  1. cp .env.production.example .env.production"
    echo "  2. Edit .env.production with your actual values"
    echo ""
    echo -e "${YELLOW}Remember: NEVER commit .env.production to Git!${NC}"

    # Create example file if it doesn't exist
    if [ ! -f ".env.production.example" ]; then
        echo -e "${YELLOW}Creating .env.production.example...${NC}"
        cat > .env.production.example <<'EOF'
# Azure Deployment Environment Variables
# Copy this file to .env.production and fill in your actual values
# NEVER commit .env.production with real secrets!

# Required - Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional - Financial APIs (leave empty if not using)
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
POLYGON_API_KEY=
ALPACA_API_KEY=
ALPACA_SECRET_KEY=

# Optional - AI/LLM APIs (leave empty if not using)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
MEM0_API_KEY=
MEM0_ENDPOINT=https://api.mem0.ai

# Azure Configuration (optional overrides)
AZURE_RESOURCE_GROUP=finagent-rg
AZURE_LOCATION=eastus
EOF
        echo -e "${GREEN}Created .env.production.example${NC}"
    fi

    exit 1
fi

# Load environment variables
echo -e "${YELLOW}Loading secrets from $ENV_FILE...${NC}"
set -a
source "$ENV_FILE"
set +a

# Validate required variables
echo -e "${YELLOW}Validating required secrets...${NC}"
MISSING_REQUIRED=0

if [ -z "$SUPABASE_URL" ]; then
    echo -e "${RED}✗ SUPABASE_URL is required${NC}"
    MISSING_REQUIRED=$((MISSING_REQUIRED + 1))
fi

if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}✗ SUPABASE_ANON_KEY is required${NC}"
    MISSING_REQUIRED=$((MISSING_REQUIRED + 1))
fi

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo -e "${RED}✗ SUPABASE_SERVICE_KEY is required${NC}"
    MISSING_REQUIRED=$((MISSING_REQUIRED + 1))
fi

if [ $MISSING_REQUIRED -gt 0 ]; then
    echo -e "${RED}Error: Missing $MISSING_REQUIRED required variables${NC}"
    echo "Please update $ENV_FILE with all required values"
    exit 1
fi

echo -e "${GREEN}✓ All required secrets loaded${NC}"

# Check Azure login
echo -e "${YELLOW}Checking Azure login status...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged into Azure. Please login:${NC}"
    az login
fi

SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${GREEN}✓ Using Azure subscription: $SUBSCRIPTION${NC}"

# Create resource group
echo -e "${YELLOW}Creating/updating resource group: $RESOURCE_GROUP...${NC}"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none
echo -e "${GREEN}✓ Resource group ready${NC}"

# Generate deployment name
DEPLOYMENT_NAME="finagent-deployment-$(date +%Y%m%d-%H%M%S)"
echo -e "${BLUE}Deployment name: $DEPLOYMENT_NAME${NC}"

# Deploy using parameters directly (no parameter file)
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting Azure deployment...${NC}"
echo -e "${BLUE}This may take 5-10 minutes...${NC}"
echo -e "${BLUE}========================================${NC}"

# Run deployment with inline parameters
if az deployment group create \
    --name "$DEPLOYMENT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --template-file "$TEMPLATE_FILE" \
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
        mem0ApiKey="${MEM0_API_KEY:-placeholder}" \
    --output json > deployment-output.json; then

    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ Infrastructure deployed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"

    # Get deployment outputs
    echo -e "${YELLOW}Retrieving deployment information...${NC}"

    # Extract URLs from deployment
    CONTAINER_FQDN=$(az deployment group show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$DEPLOYMENT_NAME" \
        --query properties.outputs.containerGroupFqdn.value -o tsv)

    WEB_URL="http://${CONTAINER_FQDN}:3000"
    API_URL="http://${CONTAINER_FQDN}:3001"

    REGISTRY_SERVER=$(az deployment group show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$DEPLOYMENT_NAME" \
        --query properties.outputs.containerRegistryLoginServer.value -o tsv)

    echo -e "${GREEN}✓ Web App URL: $WEB_URL${NC}"
    echo -e "${GREEN}✓ API URL: $API_URL${NC}"
    echo -e "${GREEN}✓ Container Registry: $REGISTRY_SERVER${NC}"

    # Save deployment info
    cat > deployment-info.txt <<EOF
Deployment Information
======================
Date: $(date)
Deployment Name: $DEPLOYMENT_NAME
Resource Group: $RESOURCE_GROUP
Location: $LOCATION

URLs:
-----
Web Application: $WEB_URL
Backend API: $API_URL

Container Registry: $REGISTRY_SERVER

Next Steps:
-----------
1. Build and push Docker images:
   az acr build --registry ${REGISTRY_SERVER%%.*} --image finagent-backend:latest apps/backend
   az acr build --registry ${REGISTRY_SERVER%%.*} --image finagent-web:latest apps/web

2. Restart containers to pull new images:
   az container restart --resource-group $RESOURCE_GROUP --name finagent-container-group

3. Monitor logs:
   az container logs --resource-group $RESOURCE_GROUP --name finagent-container-group --container-name backend
   az container logs --resource-group $RESOURCE_GROUP --name finagent-container-group --container-name web
EOF

    echo -e "${GREEN}Deployment information saved to deployment-info.txt${NC}"

    # Build and push Docker images
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Building and pushing Docker images...${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Login to ACR
    echo -e "${YELLOW}Logging into Container Registry...${NC}"
    az acr login --name ${REGISTRY_SERVER%%.*} --output none
    echo -e "${GREEN}✓ Logged into registry${NC}"

    # Build and push backend
    echo -e "${YELLOW}Building backend Docker image...${NC}"
    if az acr build \
        --registry ${REGISTRY_SERVER%%.*} \
        --image finagent-backend:latest \
        apps/backend \
        --output none; then
        echo -e "${GREEN}✓ Backend image built and pushed${NC}"
    else
        echo -e "${RED}✗ Backend image build failed${NC}"
    fi

    # Build and push frontend
    echo -e "${YELLOW}Building frontend Docker image...${NC}"
    if az acr build \
        --registry ${REGISTRY_SERVER%%.*} \
        --image finagent-web:latest \
        apps/web \
        --output none; then
        echo -e "${GREEN}✓ Frontend image built and pushed${NC}"
    else
        echo -e "${RED}✗ Frontend image build failed${NC}"
    fi

    # Restart containers to pull new images
    echo -e "${YELLOW}Restarting containers to use new images...${NC}"
    az container restart \
        --resource-group "$RESOURCE_GROUP" \
        --name finagent-container-group \
        --output none
    echo -e "${GREEN}✓ Containers restarted${NC}"

    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}🎉 Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Your applications are available at:${NC}"
    echo -e "  Web App: ${GREEN}$WEB_URL${NC}"
    echo -e "  API:     ${GREEN}$API_URL${NC}"
    echo ""
    echo -e "${YELLOW}Note: Containers may take 2-3 minutes to be fully ready${NC}"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo "  View logs:    az container logs --resource-group $RESOURCE_GROUP --name finagent-container-group --follow"
    echo "  Show status:  az container show --resource-group $RESOURCE_GROUP --name finagent-container-group --query instanceView.state"
    echo "  Restart:      az container restart --resource-group $RESOURCE_GROUP --name finagent-container-group"

else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ Deployment failed!${NC}"
    echo -e "${RED}========================================${NC}"
    echo -e "${YELLOW}Check the Azure Portal for more details${NC}"
    echo -e "${YELLOW}Resource Group: $RESOURCE_GROUP${NC}"

    # Clean up deployment output file
    rm -f deployment-output.json

    exit 1
fi

# Clean up
rm -f deployment-output.json

echo ""
echo -e "${GREEN}Script completed successfully!${NC}"