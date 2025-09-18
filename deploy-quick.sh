#!/bin/bash
# Quick Azure deployment script - minimal steps for emergency deployment

set -e

echo "🚀 Quick Azure Deployment"
echo "========================="

# Configuration
WEBAPP="finagent-backend-pps457j4wjrc6"
RG="finagent-rg"

# Login check
az account show > /dev/null 2>&1 || { echo "Run 'az login' first"; exit 1; }

# Build and deploy
cd apps/backend

echo "📦 Building package..."
npm ci
npm run postinstall
npx motia build || true

# Create minimal startup script
echo '#!/bin/bash
cd /home/site/wwwroot
npm run postinstall 2>/dev/null || true
PORT=${PORT:-3001} npx motia start --host 0.0.0.0' > startup.sh
chmod +x startup.sh

# Package
zip -qr deploy.zip . -x "*.git*" "*.env*" "*test*" "*.md" "node_modules/.cache/*"

echo "📤 Deploying..."
az webapp deployment source config-zip \
    --resource-group "$RG" \
    --name "$WEBAPP" \
    --src deploy.zip \
    --timeout 600

echo "✅ Deployed! Check: https://${WEBAPP}.azurewebsites.net/health"
echo "📺 View logs: az webapp log tail --name $WEBAPP --resource-group $RG"