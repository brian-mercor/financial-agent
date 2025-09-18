#!/bin/bash
set -e
echo "Starting Motia backend application..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
cd /home/site/wwwroot

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "ERROR: node_modules not found - running npm install..."
    npm ci --production --no-audit --no-fund || npm install --production --no-audit --no-fund
fi

# Ensure Motia CLI is available
if ! command -v motia &> /dev/null && [ ! -f "node_modules/.bin/motia" ]; then
    echo "Installing Motia CLI..."
    npm install motia @motiadev/cli --no-save --no-audit --no-fund
fi

# Check for .motia directory
if [ ! -d ".motia" ]; then
    echo "ERROR: .motia directory not found - initializing Motia"
    npx motia install || echo "Failed to initialize Motia"
fi

# Build if not already built
if [ ! -f ".motia/build.json" ]; then
    echo "Building Motia application..."
    npx motia build || echo "Build may have failed, attempting to start anyway"
fi

# Start application
PORT=${WEBSITES_PORT:-${PORT:-8080}}
echo "Starting Motia on port $PORT..."
export NODE_OPTIONS="--max-old-space-size=2048"

# Use exec to replace the shell process for proper signal handling
exec npx motia start --port $PORT --host 0.0.0.0
