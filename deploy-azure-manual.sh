#!/bin/bash
set -e

# Manual Azure Deployment Script for Fin Agent Backend
# This bypasses GitHub Actions and deploys directly via Azure CLI

echo "🚀 Starting manual Azure deployment for Fin Agent Backend..."
echo "================================================"

# Configuration
AZURE_WEBAPP_NAME="finagent-backend-pps457j4wjrc6"
RESOURCE_GROUP="finagent-rg"
NODE_VERSION="20"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
echo ""
echo "📋 Checking prerequisites..."
echo "----------------------------"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed"
    echo "Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi
print_status "Azure CLI found"

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    print_warning "Not logged in to Azure"
    echo "Please run: az login"
    exit 1
fi
print_status "Azure CLI authenticated"

# Show current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
print_status "Using subscription: $SUBSCRIPTION"

# Navigate to backend directory
cd apps/backend || {
    print_error "Backend directory not found"
    exit 1
}

echo ""
echo "📦 Preparing deployment package..."
echo "----------------------------------"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf deploy.zip .motia/build 2>/dev/null || true

# Install dependencies
print_status "Installing dependencies..."
npm ci || npm install

# CRITICAL: Run Motia postinstall to create .motia directory
print_status "Running Motia postinstall..."
npm run postinstall

# Verify .motia directory exists
if [ ! -d ".motia" ]; then
    print_error ".motia directory not found after postinstall!"
    exit 1
fi
print_status ".motia directory created successfully"

# Build Motia application
print_status "Building Motia application..."
npx motia build || {
    print_warning "Motia build had issues, but continuing..."
}

# Create startup script for Azure
print_status "Creating Azure startup script..."
cat > startup.sh << 'STARTUP_EOF'
#!/bin/bash
set -e
echo "Starting Motia backend application..."
cd /home/site/wwwroot

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "ERROR: node_modules not found - running npm install..."
    npm ci --no-audit --no-fund || npm install --no-audit --no-fund
    npm run postinstall
fi

# Check for .motia directory
if [ ! -d ".motia" ]; then
    echo "ERROR: .motia directory not found - running postinstall"
    npm run postinstall || echo "Failed to run postinstall"
fi

# Build if not already built
if [ ! -f ".motia/build.json" ]; then
    echo "Building Motia application..."
    npx motia build || echo "Build may have failed, attempting to start anyway"
fi

# Start application
echo "Starting Motia on port ${PORT:-3001}..."
export NODE_OPTIONS="--max-old-space-size=2048"
exec PORT=${PORT:-3001} npx motia start --host 0.0.0.0
STARTUP_EOF

chmod +x startup.sh
print_status "Startup script created"

# Create deployment package
print_status "Creating deployment package..."
zip -r deploy.zip . \
    -x "*.git*" \
    -x "*.env.local" \
    -x "*test*" \
    -x "*.md" \
    -x ".DS_Store" \
    -x "node_modules/.cache/*" \
    -x "coverage/*" \
    -x "*.log" \
    -q

# Check package size
PACKAGE_SIZE=$(du -h deploy.zip | cut -f1)
print_status "Deployment package created: deploy.zip ($PACKAGE_SIZE)"

echo ""
echo "🔧 Configuring Azure App Service..."
echo "-----------------------------------"

# Stop the web app to ensure clean deployment
print_status "Stopping web app..."
az webapp stop \
    --name "$AZURE_WEBAPP_NAME" \
    --resource-group "$RESOURCE_GROUP" || {
    print_warning "Could not stop web app, continuing..."
}

# Configure app settings
print_status "Configuring app settings..."
az webapp config appsettings set \
    --name "$AZURE_WEBAPP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --settings \
    NODE_ENV=production \
    WEBSITE_NODE_DEFAULT_VERSION="~$NODE_VERSION" \
    WEBSITE_STARTUP_FILE=startup.sh \
    SCM_DO_BUILD_DURING_DEPLOYMENT=false \
    ENABLE_ORYX_BUILD=false \
    WEBSITE_RUN_FROM_PACKAGE=0 \
    WEBSITES_PORT=3001 \
    WEBSITES_CONTAINER_START_TIME_LIMIT=600 \
    ALLOWED_ORIGINS="*" \
    --output none || {
    print_error "Failed to set app settings"
    exit 1
}

print_status "App settings configured"

echo ""
echo "📤 Deploying to Azure..."
echo "------------------------"

# Deploy the package
print_status "Uploading deployment package (this may take a few minutes)..."
az webapp deployment source config-zip \
    --resource-group "$RESOURCE_GROUP" \
    --name "$AZURE_WEBAPP_NAME" \
    --src deploy.zip \
    --timeout 900 || {
    print_error "Deployment failed"
    exit 1
}

print_status "Package uploaded successfully"

# Start the web app
print_status "Starting web app..."
az webapp start \
    --name "$AZURE_WEBAPP_NAME" \
    --resource-group "$RESOURCE_GROUP" || {
    print_warning "Could not start web app"
}

echo ""
echo "🔍 Checking deployment status..."
echo "--------------------------------"

# Wait for app to start
print_status "Waiting for application to start (30 seconds)..."
sleep 30

# Check health endpoint
APP_URL="https://${AZURE_WEBAPP_NAME}.azurewebsites.net"
HEALTH_URL="${APP_URL}/health"

print_status "Checking health endpoint: $HEALTH_URL"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    print_status "Application is healthy! ✨"
    echo ""
    echo "📊 Health check response:"
    curl -s "$HEALTH_URL" | jq '.' 2>/dev/null || curl -s "$HEALTH_URL"
else
    print_warning "Health check returned HTTP $HTTP_STATUS"
    echo "The application may still be starting up."
fi

echo ""
echo "📺 Viewing application logs..."
echo "------------------------------"
echo "Streaming logs for 20 seconds..."
timeout 20 az webapp log tail \
    --name "$AZURE_WEBAPP_NAME" \
    --resource-group "$RESOURCE_GROUP" 2>/dev/null || {
    print_warning "Could not stream logs"
}

echo ""
echo "================================================"
echo "🎉 Deployment complete!"
echo ""
echo "📌 Application URLs:"
echo "   Main:   $APP_URL"
echo "   Health: $HEALTH_URL"
echo "   Kudu:   https://${AZURE_WEBAPP_NAME}.scm.azurewebsites.net"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    az webapp log tail --name $AZURE_WEBAPP_NAME --resource-group $RESOURCE_GROUP"
echo "   SSH console:  az webapp ssh --name $AZURE_WEBAPP_NAME --resource-group $RESOURCE_GROUP"
echo "   Restart:      az webapp restart --name $AZURE_WEBAPP_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo "================================================"