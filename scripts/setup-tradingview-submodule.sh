#!/bin/bash
set -e

echo "=== TradingView Library Private Submodule Setup ==="
echo "Using repository: https://github.com/brianyang/charting_library"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}Current branch: $CURRENT_BRANCH${NC}"
echo ""

# Step 1: Remove existing charting_library from working tree
echo -e "${YELLOW}Step 1: Remove existing charting_library from working tree${NC}"
echo "---------------------------------------"
if [ -d "apps/web/public/charting_library" ]; then
    echo "Removing apps/web/public/charting_library..."
    rm -rf apps/web/public/charting_library
    echo -e "${GREEN}✓ Removed existing directory${NC}"
else
    echo "No existing charting_library found"
fi

# Step 2: Clean from Git history
echo -e "${YELLOW}Step 2: Remove from Git history${NC}"
echo "---------------------------------------"
echo -e "${RED}WARNING: This will rewrite Git history!${NC}"
echo "This will remove all traces of charting_library from the commit history."
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Use git filter-branch to remove from history
    echo "Removing from Git history (this may take a while)..."
    
    # First, backup refs
    cp -r .git/refs .git/refs.backup
    
    git filter-branch --force --index-filter \
        'git rm -rf --cached --ignore-unmatch apps/web/public/charting_library apps/web-a/public/charting_library apps/web-b/public/charting_library' \
        --prune-empty --tag-name-filter cat -- --all
    
    echo -e "${GREEN}✓ Removed from Git history${NC}"
    
    # Clean up
    echo "Cleaning up..."
    rm -rf .git/refs/original/
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    echo -e "${GREEN}✓ Cleanup complete${NC}"
fi

# Step 3: Add as submodule
echo -e "${YELLOW}Step 3: Add private repository as submodule${NC}"
echo "---------------------------------------"
echo "Adding https://github.com/brianyang/charting_library as submodule..."

# Add the submodule
git submodule add https://github.com/brianyang/charting_library.git apps/web/public/charting_library

# Initialize and update
git submodule init
git submodule update

echo -e "${GREEN}✓ Added as submodule${NC}"

# Step 4: Update .gitignore (as backup)
echo -e "${YELLOW}Step 4: Update .gitignore${NC}"
echo "---------------------------------------"
if ! grep -q "# TradingView library handled by submodule" .gitignore; then
    echo "" >> .gitignore
    echo "# TradingView library handled by submodule" >> .gitignore
    echo "# Backup: never commit the actual library files if submodule fails" >> .gitignore
    echo "apps/*/public/charting_library_local/" >> .gitignore
    echo -e "${GREEN}✓ Updated .gitignore${NC}"
fi

# Step 5: Update GitHub Actions workflow
echo -e "${YELLOW}Step 5: Update deployment workflow${NC}"
echo "---------------------------------------"

# Check if the workflow needs updating
if grep -q "submodules: recursive" .github/workflows/azure-deploy.yml; then
    echo "GitHub Actions already configured for submodules"
else
    echo "Updating GitHub Actions workflow to handle submodules..."
    # We'll need to update the checkout step
    sed -i.bak '
    /- name: Checkout code/,/uses: actions\/checkout@v4/ {
        /uses: actions\/checkout@v4/a\
\      with:\
\        submodules: recursive
    }' .github/workflows/azure-deploy.yml
    
    echo -e "${GREEN}✓ Updated GitHub Actions workflow${NC}"
fi

# Step 6: Create helper scripts
echo -e "${YELLOW}Step 6: Create helper scripts${NC}"
echo "---------------------------------------"

cat > scripts/update-submodules.sh << 'EOF'
#!/bin/bash
# Update all submodules to latest
set -e

echo "Updating submodules..."
git submodule update --init --recursive
git submodule foreach git pull origin main

echo "✓ Submodules updated"
EOF
chmod +x scripts/update-submodules.sh

cat > scripts/prune-tradingview-library.sh << 'EOF'
#!/bin/bash
# Remove unnecessary files from TradingView library to reduce size
set -e

LIBRARY_PATH="apps/web/public/charting_library"

if [ ! -d "$LIBRARY_PATH" ]; then
    echo "Error: charting_library not found at $LIBRARY_PATH"
    exit 1
fi

echo "Pruning unnecessary files from TradingView library..."

# Remove development files
find $LIBRARY_PATH -name "*.map" -delete
find $LIBRARY_PATH -name "*.ts" -delete
find $LIBRARY_PATH -name ".DS_Store" -delete

# Remove documentation if exists
rm -rf $LIBRARY_PATH/docs
rm -rf $LIBRARY_PATH/examples

echo "✓ Library pruned"
EOF
chmod +x scripts/prune-tradingview-library.sh

echo -e "${GREEN}✓ Helper scripts created${NC}"

# Step 7: Commit changes
echo -e "${YELLOW}Step 7: Ready to commit${NC}"
echo "---------------------------------------"
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Commit these changes:"
echo "   git add .gitmodules .gitignore scripts/"
echo "   git commit -m 'feat: add TradingView library as private submodule'"
echo ""
echo "2. Push the changes:"
echo "   git push origin $CURRENT_BRANCH"
echo ""
echo "3. If the repository is private, add collaborators:"
echo "   Go to https://github.com/brianyang/charting_library/settings/access"
echo ""
echo -e "${YELLOW}After merging to main:${NC}"
echo "4. Squash commits to remove TradingView references from history:"
echo "   git checkout main"
echo "   git pull origin main"
echo "   git reset --soft <commit-before-tradingview-was-added>"
echo "   git commit -m 'feat: implement chart functionality'"
echo "   git push --force-with-lease origin main"
echo ""
echo -e "${RED}Important Security Notes:${NC}"
echo "- Ensure https://github.com/brianyang/charting_library is PRIVATE"
echo "- All team members need access to the private repository"
echo "- Never commit the library files directly to the main repo"