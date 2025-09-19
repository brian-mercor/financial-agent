#!/bin/bash

# Deploy Motia to Azure Container Apps
# Fast, modern deployment with auto-scaling

set -e

# Configuration
RESOURCE_GROUP="finagent-rg"
LOCATION="eastus"
ACR_NAME="finagentacrbe3f98"
CONTAINER_APP_NAME="motia-backend"
ENVIRONMENT_NAME="finagent-env"
IMAGE_NAME="motia-backend:latest"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Deploying Motia to Azure Container Apps${NC}"

# Create Container Apps environment if not exists
echo -e "${BLUE}Setting up Container Apps environment...${NC}"
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  2>/dev/null || echo "Environment already exists"

# Get ACR credentials
echo -e "${BLUE}Getting registry credentials...${NC}"
ACR_SERVER=$(az acr show --name $ACR_NAME --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

# Deploy Container App
echo -e "${BLUE}Deploying Motia application...${NC}"
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $ACR_SERVER/$IMAGE_NAME \
  --target-port 8080 \
  --ingress external \
  --registry-server $ACR_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 1 \
  --memory 2 \
  --min-replicas 1 \
  --max-replicas 10 \
  --env-vars \
    NODE_ENV=production \
    PORT=8080 \
    AZURE_OPENAI_ENDPOINT="${AZURE_OPENAI_ENDPOINT}" \
    AZURE_OPENAI_KEY="${AZURE_OPENAI_KEY}" \
    GROQ_API_KEY="${GROQ_API_KEY}" \
    SUPABASE_URL="${SUPABASE_URL}" \
    SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY}" \
  --query properties.configuration.ingress.fqdn \
  -o tsv

# Get the URL
APP_URL=$(az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  -o tsv)

echo -e "${GREEN}✅ Motia deployed successfully!${NC}"
echo -e "${GREEN}URL: https://$APP_URL${NC}"
echo -e "${GREEN}Health check: https://$APP_URL/health${NC}"

# Show logs
echo -e "${BLUE}Streaming logs (Ctrl+C to exit)...${NC}"
az containerapp logs show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --follow