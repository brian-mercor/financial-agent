#!/bin/bash

# Azure Deployment Script for Fin Agent Platform
# This script deploys the application to Azure App Service
# Usage: ./deploy-azure.sh [options]
# Options:
#   --skip-build    Skip the build step
#   --backend-only  Deploy only the backend
#   --frontend-only Deploy only the frontend
#   --verbose       Enable verbose output

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="finagent-rg"
LOCATION="eastus"
BACKEND_APP="finagent-backend-pps457j4wjrc6"
FRONTEND_APP="finagent-web-pps457j4wjrc6"
APP_SERVICE_PLAN="finagent-app-plan"

# Parse command line arguments
SKIP_BUILD=false
DEPLOY_BACKEND=true
DEPLOY_FRONTEND=true
VERBOSE=false

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
        --verbose)
            VERBOSE=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
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

# Function to create App Service Plan if it doesn't exist
create_app_service_plan() {
    print_message "$BLUE" "Checking App Service Plan..."

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

# Function to build backend
build_backend() {
    print_message "$BLUE" "Building backend..."

    cd apps/backend

    # Install dependencies
    npm ci || npm install

    # Run postinstall to initialize Motia
    npm run postinstall || {
        print_message "$YELLOW" "Postinstall failed, running Motia install manually..."
        ../../node_modules/.pnpm/node_modules/.bin/motia install || npx motia install
    }

    # Build Motia application
    npx motia build || echo "Motia build completed or not required"

    # Create startup script
    cat > startup.sh << 'EOF'
#!/bin/bash
set -e
echo "Starting Motia backend application..."
cd /home/site/wwwroot

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci --only=production --no-audit --no-fund || npm install --only=production --no-audit --no-fund
fi

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

# Function to build frontend
build_frontend() {
    print_message "$BLUE" "Building frontend..."

    cd apps/web

    # Install dependencies
    npm ci || npm install

    # Build Next.js application
    npm run build

    # Create startup script
    cat > startup.sh << 'EOF'
#!/bin/bash
set -e
echo "Starting Next.js frontend application..."
cd /home/site/wwwroot

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci --only=production --no-audit --no-fund || npm install --only=production --no-audit --no-fund
fi

# Start application
echo "Starting Next.js on port ${PORT:-3000}..."
export NODE_OPTIONS="--max-old-space-size=2048"
PORT=${PORT:-3000} npm start
EOF

    chmod +x startup.sh

    # Create deployment package
    print_message "$BLUE" "Creating frontend deployment package..."
    zip -r frontend-deploy.zip . \
        -x "*.git*" \
        -x "*.env*" \
        -x "*.log" \
        -x ".turbo/*" \
        -x "coverage/*" \
        -x "src/*" \
        -x "*.test.*" \
        -x "*.spec.*"

    cd ../..
}

# Function to deploy backend
deploy_backend() {
    print_message "$BLUE" "Deploying backend to Azure..."

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

    # Deploy the package
    print_message "$YELLOW" "Uploading backend deployment package..."
    az webapp deployment source config-zip \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --src apps/backend/backend-deploy.zip

    # Restart the app
    print_message "$BLUE" "Restarting backend app..."
    az webapp restart --name $BACKEND_APP --resource-group $RESOURCE_GROUP

    print_message "$GREEN" "Backend deployed successfully!"
    print_message "$GREEN" "Backend URL: https://${BACKEND_APP}.azurewebsites.net"
}

# Function to deploy frontend
deploy_frontend() {
    print_message "$BLUE" "Deploying frontend to Azure..."

    # Check if web app exists
    if ! az webapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP &> /dev/null; then
        print_message "$YELLOW" "Creating frontend web app $FRONTEND_APP..."
        az webapp create \
            --name $FRONTEND_APP \
            --resource-group $RESOURCE_GROUP \
            --plan $APP_SERVICE_PLAN \
            --runtime "NODE:20-lts" \
            --startup-file "startup.sh"
    fi

    # Configure app settings
    print_message "$BLUE" "Configuring frontend app settings..."
    az webapp config appsettings set \
        --name $FRONTEND_APP \
        --resource-group $RESOURCE_GROUP \
        --settings \
        NODE_ENV=production \
        PORT=8080 \
        WEBSITE_NODE_DEFAULT_VERSION="~20" \
        WEBSITES_PORT=3000 \
        WEBSITE_RUN_FROM_PACKAGE=0 \
        NEXT_PUBLIC_API_URL="https://${BACKEND_APP}.azurewebsites.net" \
        --output none

    # Deploy the package
    print_message "$YELLOW" "Uploading frontend deployment package..."
    az webapp deployment source config-zip \
        --name $FRONTEND_APP \
        --resource-group $RESOURCE_GROUP \
        --src apps/web/frontend-deploy.zip

    # Restart the app
    print_message "$BLUE" "Restarting frontend app..."
    az webapp restart --name $FRONTEND_APP --resource-group $RESOURCE_GROUP

    print_message "$GREEN" "Frontend deployed successfully!"
    print_message "$GREEN" "Frontend URL: https://${FRONTEND_APP}.azurewebsites.net"
}

# Main execution
main() {
    print_message "$BLUE" "========================================="
    print_message "$BLUE" "Azure Deployment Script for Fin Agent"
    print_message "$BLUE" "========================================="

    # Check prerequisites
    check_azure_cli
    check_azure_login

    # Create Azure resources
    create_resource_group
    create_app_service_plan

    # Build applications
    if [ "$SKIP_BUILD" = false ]; then
        if [ "$DEPLOY_BACKEND" = true ]; then
            build_backend
        fi

        if [ "$DEPLOY_FRONTEND" = true ]; then
            build_frontend
        fi
    else
        print_message "$YELLOW" "Skipping build step..."
    fi

    # Deploy applications
    if [ "$DEPLOY_BACKEND" = true ]; then
        deploy_backend
    fi

    if [ "$DEPLOY_FRONTEND" = true ]; then
        deploy_frontend
    fi

    print_message "$GREEN" "========================================="
    print_message "$GREEN" "Deployment completed successfully!"
    print_message "$GREEN" "========================================="

    if [ "$DEPLOY_BACKEND" = true ] && [ "$DEPLOY_FRONTEND" = true ]; then
        print_message "$GREEN" "Backend: https://${BACKEND_APP}.azurewebsites.net"
        print_message "$GREEN" "Frontend: https://${FRONTEND_APP}.azurewebsites.net"
        print_message "$YELLOW" ""
        print_message "$YELLOW" "IMPORTANT: Run ./set-azure-secrets.sh to configure environment variables"
    fi
}

# Run main function
main