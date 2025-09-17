#!/bin/bash

# Hybrid Azure Deployment Script
# Backend (Motia) → Azure App Service
# Frontend Apps → Azure Container Instance with Nginx
#
# Usage: ./deploy-hybrid.sh [options]
# Options:
#   --skip-build       Skip the build step
#   --backend-only     Deploy only the backend
#   --frontend-only    Deploy only the frontend container
#   --use-acr          Use Azure Container Registry (otherwise Docker Hub)
#   --verbose          Enable verbose output

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="finagent-rg"
LOCATION="eastus"

# Backend App Service
BACKEND_APP="finagent-backend-pps457j4wjrc6"
APP_SERVICE_PLAN="finagent-app-plan"

# Frontend Container
CONTAINER_GROUP="finagent-frontend"
CONTAINER_REGISTRY="finagentacr"
FRONTEND_IMAGE="finagent-frontend"
DNS_LABEL="finagent-app"

# Parse command line arguments
SKIP_BUILD=false
DEPLOY_BACKEND=true
DEPLOY_FRONTEND=true
USE_ACR=false
VERBOSE=false
DOCKER_REGISTRY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --backend-only)
            DEPLOY_FRONTEND=false
            shift
            ;;
        --frontend-only)
            DEPLOY_BACKEND=false
            shift
            ;;
        --use-acr)
            USE_ACR=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Hybrid Azure Deployment Script"
            echo "Backend (Motia) → Azure App Service"
            echo "Frontend Apps → Azure Container Instance"
            echo ""
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --skip-build       Skip the build step"
            echo "  --backend-only     Deploy only the backend"
            echo "  --frontend-only    Deploy only the frontend container"
            echo "  --use-acr          Use Azure Container Registry (default: Docker Hub)"
            echo "  --verbose          Enable verbose output"
            echo "  --help             Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if Azure CLI is installed
check_azure_cli() {
    if ! command -v az &> /dev/null; then
        print_message "$RED" "Azure CLI is not installed. Please install it first."
        exit 1
    fi
}

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_message "$RED" "Docker is not installed. Please install it first."
        exit 1
    fi
}

# Function to check Azure login
check_azure_login() {
    if ! az account show &> /dev/null; then
        print_message "$YELLOW" "Not logged in to Azure. Logging in..."
        az login
    fi
}

# Function to create resource group if it doesn't exist
create_resource_group() {
    print_message "$BLUE" "Checking resource group..."

    if ! az group exists -n $RESOURCE_GROUP | grep -q true; then
        print_message "$YELLOW" "Creating resource group $RESOURCE_GROUP..."
        az group create --name $RESOURCE_GROUP --location $LOCATION
    else
        print_message "$GREEN" "Resource group $RESOURCE_GROUP already exists"
    fi
}

# Function to create App Service Plan for backend
create_app_service_plan() {
    print_message "$BLUE" "Checking App Service Plan for backend..."

    if ! az appservice plan show --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP &> /dev/null; then
        print_message "$YELLOW" "Creating App Service Plan $APP_SERVICE_PLAN..."
        az appservice plan create \
            --name $APP_SERVICE_PLAN \
            --resource-group $RESOURCE_GROUP \
            --sku B2 \
            --is-linux
    else
        print_message "$GREEN" "App Service Plan $APP_SERVICE_PLAN already exists"
    fi
}

# Function to create Azure Container Registry
create_container_registry() {
    if [ "$USE_ACR" = true ]; then
        print_message "$BLUE" "Checking Azure Container Registry..."

        if ! az acr show --name $CONTAINER_REGISTRY --resource-group $RESOURCE_GROUP &> /dev/null; then
            print_message "$YELLOW" "Creating Azure Container Registry $CONTAINER_REGISTRY..."
            az acr create \
                --name $CONTAINER_REGISTRY \
                --resource-group $RESOURCE_GROUP \
                --sku Basic \
                --admin-enabled true
        else
            print_message "$GREEN" "Container Registry $CONTAINER_REGISTRY already exists"
        fi

        # Get registry credentials
        ACR_SERVER=$(az acr show --name $CONTAINER_REGISTRY --query loginServer -o tsv)
        ACR_USERNAME=$(az acr credential show --name $CONTAINER_REGISTRY --query username -o tsv)
        ACR_PASSWORD=$(az acr credential show --name $CONTAINER_REGISTRY --query "passwords[0].value" -o tsv)

        DOCKER_REGISTRY="$ACR_SERVER/"

        # Login to ACR
        print_message "$BLUE" "Logging in to Azure Container Registry..."
        echo $ACR_PASSWORD | docker login $ACR_SERVER -u $ACR_USERNAME --password-stdin
    else
        print_message "$YELLOW" "Using Docker Hub. Make sure you're logged in: docker login"
        read -p "Enter your Docker Hub username (or press Enter to skip): " DOCKER_HUB_USER
        if [ -n "$DOCKER_HUB_USER" ]; then
            DOCKER_REGISTRY="$DOCKER_HUB_USER/"
        fi
    fi
}

# Function to build backend for App Service
build_backend() {
    print_message "$BLUE" "Building backend for App Service..."

    cd apps/backend

    # Install dependencies
    npm ci || npm install

    # Run postinstall to initialize Motia
    npm run postinstall || {
        print_message "$YELLOW" "Postinstall failed, running Motia install manually..."
        npx motia install
    }

    # Build Motia application
    npx motia build || echo "Motia build completed or not required"

    # Create startup script
    cat > startup.sh << 'EOF'
#!/bin/bash
set -e
echo "Starting Motia backend application..."
cd /home/site/wwwroot

# Check if .motia directory exists
if [ ! -d ".motia" ]; then
    echo "Initializing Motia..."
    npx motia install
fi

# Start application
echo "Starting Motia on port ${PORT:-3001}..."
export NODE_OPTIONS="--max-old-space-size=2048"
PORT=${PORT:-3001} npx motia start --host 0.0.0.0
EOF

    chmod +x startup.sh

    # Create deployment package
    print_message "$BLUE" "Creating backend deployment package..."
    zip -r backend-deploy.zip . \
        -x "*.git*" \
        -x "*.env*" \
        -x "*.log" \
        -x "dist/*" \
        -x ".turbo/*" \
        -x "coverage/*" \
        -x ".next/*" \
        -x "*.test.*" \
        -x "*.spec.*"

    cd ../..
}

# Function to build frontend container
build_frontend_container() {
    print_message "$BLUE" "Building frontend container with all apps..."

    # Build the multi-app frontend container
    docker-compose -f docker-compose.frontend.yml build

    # Tag the images
    docker tag finagent_nginx:latest ${DOCKER_REGISTRY}${FRONTEND_IMAGE}:latest
    docker tag finagent_nginx:latest ${DOCKER_REGISTRY}${FRONTEND_IMAGE}:$(git rev-parse --short HEAD)

    if [ "$USE_ACR" = true ]; then
        print_message "$BLUE" "Pushing frontend container to Azure Container Registry..."
        docker push ${DOCKER_REGISTRY}${FRONTEND_IMAGE}:latest
        docker push ${DOCKER_REGISTRY}${FRONTEND_IMAGE}:$(git rev-parse --short HEAD)
    else
        print_message "$YELLOW" "Push the image to your registry:"
        print_message "$YELLOW" "docker push ${DOCKER_REGISTRY}${FRONTEND_IMAGE}:latest"
    fi
}

# Function to deploy backend to App Service
deploy_backend() {
    print_message "$BLUE" "Deploying backend to Azure App Service..."

    # Check if web app exists
    if ! az webapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP &> /dev/null; then
        print_message "$YELLOW" "Creating backend web app $BACKEND_APP..."
        az webapp create \
            --name $BACKEND_APP \
            --resource-group $RESOURCE_GROUP \
            --plan $APP_SERVICE_PLAN \
            --runtime "NODE:20-lts" \
            --startup-file "startup.sh"
    fi

    # Configure app settings
    print_message "$BLUE" "Configuring backend app settings..."
    az webapp config appsettings set \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --settings \
        NODE_ENV=production \
        PORT=8080 \
        WEBSITE_NODE_DEFAULT_VERSION="~20" \
        WEBSITES_PORT=3001 \
        WEBSITE_RUN_FROM_PACKAGE=0 \
        --output none

    # Stop the app before deployment
    print_message "$BLUE" "Stopping backend app..."
    az webapp stop --name $BACKEND_APP --resource-group $RESOURCE_GROUP

    # Deploy the package
    print_message "$YELLOW" "Uploading backend deployment package..."
    az webapp deployment source config-zip \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --src apps/backend/backend-deploy.zip

    # Start the app
    print_message "$BLUE" "Starting backend app..."
    az webapp start --name $BACKEND_APP --resource-group $RESOURCE_GROUP

    print_message "$GREEN" "Backend deployed successfully!"
    print_message "$GREEN" "Backend URL: https://${BACKEND_APP}.azurewebsites.net"
}

# Function to deploy frontend container to Azure Container Instances
deploy_frontend_container() {
    print_message "$BLUE" "Deploying frontend container to Azure Container Instances..."

    # Prepare environment variables
    BACKEND_URL="https://${BACKEND_APP}.azurewebsites.net"

    if [ "$USE_ACR" = true ]; then
        # Deploy with ACR credentials
        az container create \
            --name $CONTAINER_GROUP \
            --resource-group $RESOURCE_GROUP \
            --image ${DOCKER_REGISTRY}${FRONTEND_IMAGE}:latest \
            --registry-login-server $ACR_SERVER \
            --registry-username $ACR_USERNAME \
            --registry-password $ACR_PASSWORD \
            --dns-name-label $DNS_LABEL \
            --ports 80 443 \
            --cpu 2 \
            --memory 4 \
            --environment-variables \
                BACKEND_URL=$BACKEND_URL \
                NODE_ENV=production \
            --restart-policy Always \
            --location $LOCATION
    else
        # Deploy with public registry
        az container create \
            --name $CONTAINER_GROUP \
            --resource-group $RESOURCE_GROUP \
            --image ${DOCKER_REGISTRY}${FRONTEND_IMAGE}:latest \
            --dns-name-label $DNS_LABEL \
            --ports 80 443 \
            --cpu 2 \
            --memory 4 \
            --environment-variables \
                BACKEND_URL=$BACKEND_URL \
                NODE_ENV=production \
            --restart-policy Always \
            --location $LOCATION
    fi

    # Get the FQDN
    FRONTEND_URL=$(az container show \
        --name $CONTAINER_GROUP \
        --resource-group $RESOURCE_GROUP \
        --query ipAddress.fqdn \
        --output tsv)

    print_message "$GREEN" "Frontend container deployed successfully!"
    print_message "$GREEN" "Frontend URL: http://${FRONTEND_URL}"
}

# Main execution
main() {
    print_message "$BLUE" "========================================="
    print_message "$BLUE" "Hybrid Azure Deployment Script"
    print_message "$BLUE" "Backend → App Service | Frontend → Container"
    print_message "$BLUE" "========================================="

    # Check prerequisites
    check_azure_cli
    check_docker
    check_azure_login

    # Create Azure resources
    create_resource_group

    # Backend deployment
    if [ "$DEPLOY_BACKEND" = true ]; then
        create_app_service_plan

        if [ "$SKIP_BUILD" = false ]; then
            build_backend
        fi

        deploy_backend
    fi

    # Frontend deployment
    if [ "$DEPLOY_FRONTEND" = true ]; then
        create_container_registry

        if [ "$SKIP_BUILD" = false ]; then
            build_frontend_container
        fi

        deploy_frontend_container
    fi

    print_message "$GREEN" "========================================="
    print_message "$GREEN" "Hybrid deployment completed successfully!"
    print_message "$GREEN" "========================================="

    if [ "$DEPLOY_BACKEND" = true ]; then
        print_message "$GREEN" "Backend (App Service): https://${BACKEND_APP}.azurewebsites.net"
    fi

    if [ "$DEPLOY_FRONTEND" = true ]; then
        FRONTEND_URL=$(az container show \
            --name $CONTAINER_GROUP \
            --resource-group $RESOURCE_GROUP \
            --query ipAddress.fqdn \
            --output tsv 2>/dev/null || echo "pending")
        print_message "$GREEN" "Frontend (Container): http://${FRONTEND_URL}"
    fi

    print_message "$YELLOW" ""
    print_message "$YELLOW" "Next steps:"
    print_message "$YELLOW" "1. Run ./scripts/set-azure-secrets.sh to configure backend secrets"
    print_message "$YELLOW" "2. Configure custom domain and SSL for frontend container"
    print_message "$YELLOW" "3. Set up monitoring and alerts"
}

# Run main function
main