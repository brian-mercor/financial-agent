#!/bin/bash
echo "======================================="
echo "Motia Backend Startup - Fixed Version"
echo "======================================="
echo "Starting at: $(date '+%Y-%m-%d %H:%M:%S')"

cd /home/site/wwwroot || exit 1

# CRITICAL FIX: Always ensure Motia is installed
echo "Installing Motia dependencies..."
if [ ! -d "node_modules" ]; then
    echo "node_modules not found, running full install..."
    npm install --production --no-audit --no-fund
else
    echo "node_modules exists, ensuring Motia is installed..."
    # Force install Motia packages even if node_modules exists
    npm install motia @motia/core @motia/cli --no-audit --no-fund
fi

# Verify Motia is now available
echo "Verifying Motia installation..."
if [ -f "node_modules/.bin/motia" ]; then
    echo "✓ Motia found at node_modules/.bin/motia"
elif [ -f "node_modules/motia/dist/cli.js" ]; then
    echo "✓ Motia CLI found in node_modules"
else
    echo "ERROR: Motia still not found after install"
    echo "Attempting alternative installation method..."
    npx motia@latest --version || npm install -g motia
fi

# Initialize Motia project if needed
if [ ! -d ".motia" ]; then
    echo "Initializing Motia project..."
    npx motia install || node node_modules/.bin/motia install
fi

# Start the application
echo "Starting Motia on port ${PORT:-3001}..."
export NODE_OPTIONS="--max-old-space-size=2048"
PORT=${PORT:-3001} npx motia start --host 0.0.0.0