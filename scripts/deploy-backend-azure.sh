#!/bin/bash

# Azure Backend Deployment Script (for Vercel Frontend)
# This script deploys only the backend to Azure App Service
# Frontend is deployed to Vercel separately
#
# Usage: ./deploy-backend-azure.sh [options]
# Options:
#   --skip-build       Skip the build step
#   --set-cors         Configure CORS for Vercel domains
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
BACKEND_APP="finagent-backend-pps457j4wjrc6"
APP_SERVICE_PLAN="finagent-app-plan"

# Parse command line arguments
SKIP_BUILD=false
SET_CORS=true
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --set-cors)
            SET_CORS=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Azure Backend Deployment Script (for Vercel Frontend)"
            echo ""
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --skip-build       Skip the build step"
            echo "  --set-cors         Configure CORS for Vercel domains"
            echo "  --verbose          Enable verbose output"
            echo "  --help             Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  VERCEL_DOMAINS     Comma-separated list of Vercel domains"
            echo "                     Default: finagent.vercel.app,finagent-landing.vercel.app"
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

# Function to create App Service Plan
create_app_service_plan() {
    print_message "$BLUE" "Checking App Service Plan..."

    if ! az appservice plan show --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP &> /dev/null; then
        print_message "$YELLOW" "Creating App Service Plan $APP_SERVICE_PLAN..."
        az appservice plan create \
            --name $APP_SERVICE_PLAN \
            --resource-group $RESOURCE_GROUP \
            --sku B1 \
            --is-linux
    else
        print_message "$GREEN" "App Service Plan $APP_SERVICE_PLAN already exists"
    fi
}

# Function to build backend
build_backend() {
    print_message "$BLUE" "Building backend for Azure App Service..."

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

    # Create startup script with CORS configuration
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

# Set CORS origins for Vercel deployments if not already set
if [ -z "$ALLOWED_ORIGINS" ]; then
    export ALLOWED_ORIGINS="https://*.vercel.app,https://*.vercel.app,http://localhost:3000,http://localhost:3001"
fi

# Start application
echo "Starting Motia on port ${PORT:-3001}..."
echo "CORS allowed origins: ${ALLOWED_ORIGINS}"
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

# Function to deploy backend
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

    # Stop the app before deployment
    print_message "$BLUE" "Stopping backend app..."
    az webapp stop --name $BACKEND_APP --resource-group $RESOURCE_GROUP

    # Deploy the package
    print_message "$YELLOW" "Uploading backend deployment package..."
    az webapp deployment source config-zip \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --src apps/backend/backend-deploy.zip

    print_message "$GREEN" "Backend deployed successfully!"
}

# Function to configure CORS for Vercel
configure_cors() {
    print_message "$BLUE" "Configuring CORS for Vercel deployments..."

    # Get Vercel domains from environment or use defaults
    VERCEL_DOMAINS=${VERCEL_DOMAINS:-"finagent.vercel.app,finagent-landing.vercel.app,finagent-staging.vercel.app"}

    # Convert comma-separated to proper format
    ALLOWED_ORIGINS=""
    IFS=',' read -ra DOMAINS <<< "$VERCEL_DOMAINS"
    for domain in "${DOMAINS[@]}"; do
        domain=$(echo $domain | xargs) # Trim whitespace
        if [ -n "$ALLOWED_ORIGINS" ]; then
            ALLOWED_ORIGINS="${ALLOWED_ORIGINS},"
        fi
        ALLOWED_ORIGINS="${ALLOWED_ORIGINS}https://${domain}"
    done

    # Add localhost for development
    ALLOWED_ORIGINS="${ALLOWED_ORIGINS},http://localhost:3000,http://localhost:3001"

    print_message "$YELLOW" "Setting CORS allowed origins:"
    print_message "$YELLOW" "  ${ALLOWED_ORIGINS}"

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
        ALLOWED_ORIGINS="${ALLOWED_ORIGINS}" \
        --output none

    # Enable CORS in Azure App Service as well (belt and suspenders)
    print_message "$BLUE" "Enabling CORS in Azure App Service..."
    az webapp cors add \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --allowed-origins https://*.vercel.app http://localhost:3000 http://localhost:3001 \
        || true  # Don't fail if CORS is already configured

    print_message "$GREEN" "CORS configuration completed"
}

# Function to get backend URL and display setup instructions
display_setup_instructions() {
    BACKEND_URL="https://${BACKEND_APP}.azurewebsites.net"

    print_message "$GREEN" "========================================="
    print_message "$GREEN" "Backend Deployment Completed!"
    print_message "$GREEN" "========================================="
    print_message "$GREEN" "Backend URL: ${BACKEND_URL}"
    print_message "$GREEN" ""
    print_message "$BLUE" "Next Steps for Vercel:"
    print_message "$BLUE" "========================================="
    print_message "$YELLOW" "1. Set environment variables in Vercel Dashboard:"
    print_message "$YELLOW" "   NEXT_PUBLIC_API_URL=${BACKEND_URL}"
    print_message "$YELLOW" "   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url"
    print_message "$YELLOW" "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    print_message "$YELLOW" ""
    print_message "$YELLOW" "2. Deploy to Vercel:"
    print_message "$YELLOW" "   cd apps/web"
    print_message "$YELLOW" "   vercel --prod"
    print_message "$YELLOW" ""
    print_message "$YELLOW" "   cd apps/finagent-landing"
    print_message "$YELLOW" "   vercel --prod"
    print_message "$YELLOW" ""
    print_message "$YELLOW" "3. Configure backend secrets:"
    print_message "$YELLOW" "   ./scripts/set-azure-secrets.sh --backend-only"
    print_message "$YELLOW" ""
    print_message "$BLUE" "Or use the Vercel GitHub integration for automatic deployments"
}

# Main execution
main() {
    print_message "$BLUE" "========================================="
    print_message "$BLUE" "Azure Backend Deployment (for Vercel Frontend)"
    print_message "$BLUE" "========================================="

    # Check prerequisites
    check_azure_cli
    check_azure_login

    # Create Azure resources
    create_resource_group
    create_app_service_plan

    # Build backend
    if [ "$SKIP_BUILD" = false ]; then
        build_backend
    else
        print_message "$YELLOW" "Skipping build step..."
    fi

    # Deploy backend
    deploy_backend

    # Configure CORS
    if [ "$SET_CORS" = true ]; then
        configure_cors
    fi

    # Start the app
    print_message "$BLUE" "Starting backend app..."
    az webapp start --name $BACKEND_APP --resource-group $RESOURCE_GROUP

    # Show setup instructions
    display_setup_instructions

    # Test the deployment
    print_message "$BLUE" "Testing backend deployment..."
    HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://${BACKEND_APP}.azurewebsites.net/health || echo "Failed")

    if [ "$HEALTH_CHECK" = "200" ]; then
        print_message "$GREEN" "✓ Backend is healthy and responding"
    else
        print_message "$YELLOW" "⚠ Backend health check returned: $HEALTH_CHECK"
        print_message "$YELLOW" "  The app may still be starting up. Check logs with:"
        print_message "$YELLOW" "  az webapp log tail --name $BACKEND_APP --resource-group $RESOURCE_GROUP"
    fi
}

# Run main function
main