#!/bin/bash
# Azure App Service Startup Script for Motia
# This script handles the specific requirements of running Motia in Azure App Service

echo "=========================================="
echo "MOTIA AZURE APP SERVICE STARTUP"
echo "=========================================="
echo "Timestamp: $(date)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Python version: $(python3 --version 2>&1 || echo 'Python not found')"

# Azure App Service Environment
echo ""
echo "[ENVIRONMENT] Azure App Service Configuration:"
echo "PORT: ${PORT:-8080}"
echo "WEBSITES_PORT: ${WEBSITES_PORT:-8080}"
echo "NODE_ENV: ${NODE_ENV:-production}"
echo "HOME: ${HOME}"
echo "WEBSITE_INSTANCE_ID: ${WEBSITE_INSTANCE_ID}"
echo "WEBSITE_SITE_NAME: ${WEBSITE_SITE_NAME}"

# Check if running in Azure App Service
if [ ! -z "$WEBSITE_INSTANCE_ID" ]; then
    echo "[AZURE] Running in Azure App Service environment"

    # Set production environment
    export NODE_ENV=production

    # Use Azure's port or default to 8080
    export PORT=${WEBSITES_PORT:-${PORT:-8080}}

    # Set Motia specific environment variables for Azure
    export MOTIA_HOST="0.0.0.0"
    export MOTIA_PORT=$PORT
    export MOTIA_LOG_LEVEL="info"

    # Ensure proper file permissions
    if [ -w "/home/site/wwwroot" ]; then
        echo "[PERMISSIONS] Setting file permissions..."
        chmod -R 755 /home/site/wwwroot/steps 2>/dev/null || true
        chmod -R 755 /home/site/wwwroot/dist 2>/dev/null || true
    fi
else
    echo "[LOCAL] Running in local/container environment"
    export PORT=${PORT:-3001}
fi

# Check for required files
echo ""
echo "[VALIDATION] Checking required files:"
[ -f "package.json" ] && echo "✓ package.json found" || echo "✗ package.json missing!"
[ -f "motia-workbench.json" ] && echo "✓ motia-workbench.json found" || echo "✗ motia-workbench.json missing!"
[ -d "steps" ] && echo "✓ steps directory found" || echo "✗ steps directory missing!"
[ -d "node_modules" ] && echo "✓ node_modules found" || echo "✗ node_modules missing!"

# CRITICAL FIX: Check if Motia AND its dependencies are properly installed
echo ""
echo "[MOTIA] Checking Motia installation:"

# Function to test if Motia can actually run
test_motia() {
    if [ -f "node_modules/.bin/motia" ]; then
        # Try to run motia --version, capture both stdout and stderr
        output=$(node node_modules/.bin/motia --version 2>&1)
        if echo "$output" | grep -q "Cannot find module"; then
            echo "✗ Motia found but missing dependencies: $output"
            return 1
        elif echo "$output" | grep -q "motia"; then
            echo "✓ Motia is properly installed"
            return 0
        else
            echo "✗ Motia test failed: $output"
            return 1
        fi
    else
        echo "✗ Motia binary not found"
        return 1
    fi
}

# Test if Motia works
if ! test_motia; then
    echo ""
    echo "[FIX] Installing/Reinstalling Motia and dependencies..."

    # Check if we have a package-lock.json for faster install
    if [ -f "package-lock.json" ]; then
        echo "Running npm ci to ensure all dependencies are installed..."
        npm ci --production --no-audit --no-fund
    else
        echo "Running npm install to ensure all dependencies are installed..."
        npm install --production --no-audit --no-fund
    fi

    # If Motia still doesn't work, try installing it specifically
    if ! test_motia; then
        echo "Installing Motia packages specifically..."
        npm install motia @motia/core @motia/cli commander --no-audit --no-fund
    fi

    # Final check
    if ! test_motia; then
        echo "ERROR: Failed to install Motia properly"
        echo "Attempting to list what's in node_modules/.bin:"
        ls -la node_modules/.bin/ | head -20
        echo ""
        echo "Attempting to see Motia package info:"
        npm list motia @motia/core @motia/cli commander 2>&1 | head -20
        exit 1
    fi
fi

# Python environment check (for multi-language support)
echo ""
echo "[PYTHON] Checking Python environment:"
if [ -d "python_modules" ]; then
    echo "✓ Python modules directory found"
    if [ -f "python_modules/bin/activate" ]; then
        echo "✓ Python virtual environment found"
        source python_modules/bin/activate
        echo "✓ Python virtual environment activated"
    fi
else
    echo "ℹ No Python modules directory (TypeScript-only mode)"
fi

# Build check
echo ""
echo "[BUILD] Checking build status:"
if [ -d "dist" ] || [ -d ".motia/build" ]; then
    echo "✓ Build directory exists"
    if [ -d "dist" ]; then
        file_count=$(find dist -type f -name "*.js" 2>/dev/null | wc -l)
        echo "  Found $file_count JavaScript files in dist"
    fi
    if [ -d ".motia/build" ]; then
        file_count=$(find .motia/build -type f -name "*.js" 2>/dev/null | wc -l)
        echo "  Found $file_count JavaScript files in .motia/build"
    fi
else
    echo "⚠ Build directory missing, running build..."
    npm run build || npx motia build
fi

# Initialize Motia if needed
if [ ! -d ".motia" ]; then
    echo ""
    echo "[MOTIA] Initializing Motia project..."
    npx motia install
fi

# Network configuration for Azure
echo ""
echo "[NETWORK] Configuring network settings:"
echo "Binding to 0.0.0.0:$PORT for Azure App Service"

# Health check endpoint test
echo ""
echo "[HEALTH] Setting up health check monitoring..."
(sleep 30 && curl -s http://localhost:$PORT/health > /dev/null 2>&1 && echo "[HEALTH] ✓ Health check passed" || echo "[HEALTH] ⚠ Health check failed") &

# Start Motia server
echo ""
echo "=========================================="
echo "STARTING MOTIA SERVER"
echo "=========================================="
echo "Command: npx motia start --port $PORT --host 0.0.0.0"
echo ""

# Use exec to replace shell process with Motia
# This ensures proper signal handling in Azure App Service
exec npx motia start --port $PORT --host 0.0.0.0