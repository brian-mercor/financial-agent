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
