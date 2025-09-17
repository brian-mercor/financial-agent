#!/bin/bash
set -e

echo "=== Create Private TradingView Library Repository ==="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we have a backup of the library
if [ ! -d "/tmp/charting_library_backup" ]; then
    echo -e "${YELLOW}No backup found. Looking for TradingView library...${NC}"
    
    # Try to find it from Git history
    echo "Attempting to recover from Git history..."
    git show 4a2f6c9:apps/web/public/charting_library > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "Found in Git history. Extracting..."
        mkdir -p /tmp/charting_library_backup
        cd /tmp
        git clone /Users/brian/Public/general-repos/fin/finagent2 temp_extract
        cd temp_extract
        git checkout 4a2f6c9
        cp -r apps/web/public/charting_library /tmp/charting_library_backup/
        cd ..
        rm -rf temp_extract
        echo -e "${GREEN}✓ Extracted from Git history${NC}"
    else
        echo -e "${RED}Could not find charting_library. You need to provide the library files.${NC}"
        echo "Please place the TradingView library at: /tmp/charting_library_backup"
        exit 1
    fi
fi

cd /tmp/charting_library_backup

# Initialize as Git repository if not already
if [ ! -d ".git" ]; then
    git init
    echo "# TradingView Charting Library" > README.md
    echo "" >> README.md
    echo "This is a private repository containing the proprietary TradingView charting library." >> README.md
    echo "" >> README.md
    echo "**This code is NOT open source and must remain private.**" >> README.md
    
    # Create .gitignore
    cat > .gitignore << 'EOF'
.DS_Store
node_modules/
*.log
EOF
    
    git add .
    git commit -m "Initial commit: TradingView charting library (proprietary)"
fi

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Go to GitHub and create a new PRIVATE repository:"
echo "   https://github.com/new"
echo "   - Repository name: charting_library"
echo "   - Set to PRIVATE"
echo "   - Do NOT initialize with README, .gitignore, or license"
echo ""
echo "2. After creating, run these commands:"
echo -e "${GREEN}cd /tmp/charting_library_backup${NC}"
echo -e "${GREEN}git remote add origin https://github.com/brianyang/charting_library.git${NC}"
echo -e "${GREEN}git branch -M main${NC}"
echo -e "${GREEN}git push -u origin main${NC}"
echo ""
echo "3. Then return to your main project and run:"
echo -e "${GREEN}cd /Users/brian/Public/general-repos/fin/finagent2${NC}"
echo -e "${GREEN}git submodule add https://github.com/brianyang/charting_library.git apps/web/public/charting_library${NC}"
echo -e "${GREEN}git add .gitmodules apps/web/public/charting_library${NC}"
echo -e "${GREEN}git commit -m 'feat: add TradingView library as private submodule'${NC}"