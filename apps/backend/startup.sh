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
