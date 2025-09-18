#!/bin/bash
# Azure App Service Troubleshooting Script

set -e

echo "🔧 Azure App Service Troubleshooting"
echo "===================================="

# Configuration
WEBAPP="finagent-backend-pps457j4wjrc6"
RG="finagent-rg"
APP_URL="https://${WEBAPP}.azurewebsites.net"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Azure CLI
az account show > /dev/null 2>&1 || { echo "Run 'az login' first"; exit 1; }

echo ""
echo "1️⃣  App Service Status"
echo "----------------------"
STATUS=$(az webapp show --name "$WEBAPP" --resource-group "$RG" --query state -o tsv 2>/dev/null || echo "UNKNOWN")
if [ "$STATUS" = "Running" ]; then
    echo -e "${GREEN}✓${NC} App Service is running"
else
    echo -e "${RED}✗${NC} App Service status: $STATUS"
fi

echo ""
echo "2️⃣  Health Check"
echo "---------------"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/health" 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} Health endpoint responding (HTTP $HTTP_STATUS)"
    curl -s "$APP_URL/health" | jq '.' 2>/dev/null || curl -s "$APP_URL/health"
else
    echo -e "${RED}✗${NC} Health endpoint returned HTTP $HTTP_STATUS"
fi

echo ""
echo "3️⃣  Recent Deployment"
echo "--------------------"
LAST_DEPLOY=$(az webapp deployment list --name "$WEBAPP" --resource-group "$RG" --query '[0].{status:status, time:end_time, message:message}' 2>/dev/null || echo "No deployment info")
echo "$LAST_DEPLOY"

echo ""
echo "4️⃣  Configuration Check"
echo "----------------------"
echo "Node version:"
az webapp config show --name "$WEBAPP" --resource-group "$RG" --query linuxFxVersion -o tsv 2>/dev/null || echo "Not set"

echo ""
echo "Startup command:"
az webapp config show --name "$WEBAPP" --resource-group "$RG" --query appCommandLine -o tsv 2>/dev/null || echo "Default"

echo ""
echo "5️⃣  Environment Variables"
echo "------------------------"
echo "Configured variables (names only):"
az webapp config appsettings list --name "$WEBAPP" --resource-group "$RG" --query '[].name' -o tsv 2>/dev/null | head -10

echo ""
echo "6️⃣  Recent Logs (last 20 lines)"
echo "-------------------------------"
timeout 5 az webapp log download \
    --name "$WEBAPP" \
    --resource-group "$RG" \
    --log-file temp-logs.zip 2>/dev/null || true

if [ -f temp-logs.zip ]; then
    unzip -q temp-logs.zip
    find . -name "*.txt" -o -name "*.log" | head -1 | xargs tail -20 2>/dev/null || echo "No logs found"
    rm -rf temp-logs.zip LogFiles 2>/dev/null
fi

echo ""
echo "7️⃣  Quick Actions"
echo "----------------"
echo "• Restart app:     az webapp restart --name $WEBAPP --resource-group $RG"
echo "• View live logs:  az webapp log tail --name $WEBAPP --resource-group $RG"
echo "• SSH into app:    az webapp ssh --name $WEBAPP --resource-group $RG"
echo "• Redeploy:        ./deploy-quick.sh"
echo ""

echo ""
echo "8️⃣  Common Issues & Solutions"
echo "-----------------------------"
echo "503 Service Unavailable:"
echo "  → App hasn't started yet (wait 2-3 minutes)"
echo "  → Missing environment variables"
echo "  → Motia not properly initialized"
echo ""
echo "Application Error:"
echo "  → Check logs with: az webapp log tail --name $WEBAPP --resource-group $RG"
echo "  → Verify .motia directory in deployment"
echo "  → Check node_modules included in package"
echo ""