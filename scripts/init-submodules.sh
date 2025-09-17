#!/bin/bash
# Initialize submodules for deployment
set -e

echo "Initializing Git submodules..."

# For CI/CD environments, we might need to handle authentication
if [ -n "$GITHUB_ACTIONS" ] || [ -n "$AZURE_WEBAPP" ]; then
    echo "Running in CI/CD environment"
    
    # If we have a deploy key or token for the private repo
    if [ -n "$CHARTING_LIBRARY_DEPLOY_KEY" ]; then
        echo "Setting up SSH for private submodule access..."
        
        # Setup SSH key
        mkdir -p ~/.ssh
        echo "$CHARTING_LIBRARY_DEPLOY_KEY" > ~/.ssh/charting_library_key
        chmod 600 ~/.ssh/charting_library_key
        
        # Configure SSH to use this key for GitHub
        cat >> ~/.ssh/config << EOF
Host github.com-charting
    HostName github.com
    User git
    IdentityFile ~/.ssh/charting_library_key
    StrictHostKeyChecking no
EOF
        
        # Update the submodule URL temporarily for this session
        git config submodule.apps/web/public/charting_library.url git@github.com-charting:brianyang/charting_library.git
    fi
fi

# Initialize and update submodules
git submodule init
git submodule update --recursive

# Verify the submodule was initialized
if [ -d "apps/web/public/charting_library/charting_library" ]; then
    echo "✓ Submodules initialized successfully"
    echo "  TradingView library available at: apps/web/public/charting_library/"
else
    echo "⚠️  Warning: charting_library submodule may not have initialized properly"
    echo "  Please check that you have access to the private repository"
fi