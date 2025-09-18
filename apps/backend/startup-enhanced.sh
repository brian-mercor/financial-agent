#!/bin/bash
# Enhanced startup script for Azure App Service with comprehensive error handling

echo "========================================="
echo "Motia Backend Startup - Enhanced Version"
echo "========================================="
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Function to check and report errors
check_error() {
    if [ $? -ne 0 ]; then
        echo "ERROR: $1"
        exit 1
    fi
}

# Navigate to app directory
cd /home/site/wwwroot || cd /app || {
    echo "ERROR: Could not find application directory"
    echo "Current directory: $(pwd)"
    echo "Directory contents:"
    ls -la
    exit 1
}

echo "=== Environment Information ==="
echo "Working directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "PORT: ${PORT:-3001}"
echo "NODE_ENV: ${NODE_ENV:-development}"
echo ""

echo "=== Checking Required Environment Variables ==="
MISSING_VARS=()

# Check Supabase configuration
if [ -z "$SUPABASE_URL" ] && [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "⚠️  WARNING: SUPABASE_URL not set"
    MISSING_VARS+=("SUPABASE_URL")
else
    echo "✓ SUPABASE_URL configured"
fi

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "⚠️  WARNING: SUPABASE_SERVICE_KEY not set"
    MISSING_VARS+=("SUPABASE_SERVICE_KEY")
else
    echo "✓ SUPABASE_SERVICE_KEY configured"
fi

# Check optional but recommended variables
if [ -z "$GROQ_API_KEY" ]; then
    echo "ℹ️  INFO: GROQ_API_KEY not set (optional)"
fi

if [ -z "$AZURE_OPENAI_API_KEY" ]; then
    echo "ℹ️  INFO: AZURE_OPENAI_API_KEY not set (optional)"
fi

echo ""

# Check if node_modules exists
echo "=== Checking Dependencies ==="
if [ ! -d "node_modules" ]; then
    echo "ERROR: node_modules directory not found!"
    echo "This should have been included in the deployment package."
    echo "Attempting emergency install (this may take several minutes)..."

    if [ -f "package-lock.json" ]; then
        npm ci --production --no-audit --no-fund
    else
        npm install --production --no-audit --no-fund
    fi
    check_error "Failed to install dependencies"
else
    echo "✓ node_modules directory exists"
fi

# Check if Motia is available
echo ""
echo "=== Checking Motia Installation ==="
if command -v motia &> /dev/null; then
    echo "✓ Motia found in PATH: $(which motia)"
    MOTIA_CMD="motia"
elif [ -f "node_modules/.bin/motia" ]; then
    echo "✓ Motia found in node_modules"
    MOTIA_CMD="npx motia"
elif [ -f "node_modules/@motia/cli/dist/index.js" ]; then
    echo "✓ Motia CLI found at node_modules/@motia/cli"
    MOTIA_CMD="node node_modules/@motia/cli/dist/index.js"
else
    echo "ERROR: Motia not found!"
    echo "Attempting to install Motia..."
    npm install @motia/core @motia/cli --no-save --no-audit --no-fund
    check_error "Failed to install Motia"
    MOTIA_CMD="npx motia"
fi

# Show Motia version
echo "Motia version:"
$MOTIA_CMD --version 2>/dev/null || echo "Could not determine version"
echo ""

# Check if .motia directory exists and initialize if needed
echo "=== Checking Motia Project ==="
if [ ! -d ".motia" ]; then
    echo "⚠️  .motia directory not found, initializing Motia project..."
    $MOTIA_CMD install
    check_error "Failed to initialize Motia project"
    echo "✓ Motia project initialized"
else
    echo "✓ .motia directory exists"
fi

# Check if build is needed
if [ ! -d ".motia/build" ]; then
    echo "Build directory not found, running Motia build..."
    $MOTIA_CMD build
    check_error "Failed to build Motia project"
    echo "✓ Build completed"
fi

echo ""

# List available steps
echo "=== Available Motia Steps ==="
if [ -d "steps" ]; then
    echo "Steps directory contents:"
    ls -1 steps/*.step.* 2>/dev/null | head -10 || echo "No step files found"
else
    echo "WARNING: steps directory not found"
fi

echo ""

# Set memory options for Node.js
export NODE_OPTIONS="--max-old-space-size=2048"

# Set CORS origins if not already set
if [ -z "$ALLOWED_ORIGINS" ]; then
    export ALLOWED_ORIGINS="https://finagent-web-pps457j4wjrc6.azurewebsites.net,http://finagent-web-pps457j4wjrc6.azurewebsites.net,https://*.vercel.app,http://localhost:3000"
    echo "Setting default ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}"
fi

echo ""
echo "========================================="
echo "Starting Motia Application"
echo "========================================="
echo "Command: PORT=${PORT:-3001} $MOTIA_CMD start --host 0.0.0.0"
echo ""

# Start the application with timeout protection
timeout 300 sh -c "PORT=${PORT:-3001} $MOTIA_CMD start --host 0.0.0.0" 2>&1 || {
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 124 ]; then
        echo ""
        echo "ERROR: Application failed to start within 5 minutes (timeout)"
        echo "This usually indicates a startup issue or missing configuration."
    else
        echo ""
        echo "ERROR: Application failed to start with exit code: $EXIT_CODE"
    fi

    echo ""
    echo "=== Diagnostic Information ==="
    echo "Missing environment variables: ${MISSING_VARS[*]:-None}"
    echo ""
    echo "Recent error logs:"
    tail -20 /home/LogFiles/*.log 2>/dev/null || echo "No log files available"

    echo ""
    echo "=== Attempting Fallback Start ==="
    echo "Trying direct Node.js start as last resort..."

    # Try to find and run the main server file directly
    if [ -f ".motia/build/server.js" ]; then
        PORT=${PORT:-3001} node .motia/build/server.js
    elif [ -f "dist/index.js" ]; then
        PORT=${PORT:-3001} node dist/index.js
    else
        echo "FATAL: No fallback server file found"
        echo "Please check the deployment package and Motia configuration"
        exit 1
    fi
}