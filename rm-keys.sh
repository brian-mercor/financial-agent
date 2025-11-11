#!/bin/bash

# ============================================================================
# GitHub Secret Scanning Violation Cleanup Script
# ============================================================================
# Removes secrets from git history to enable pushing to GitHub
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=========================================="
echo " GitHub Secret Scanning - Cleanup Script "
echo "=========================================="
echo ""

# Verify we're in a git repository
if [ ! -d .git ]; then
    echo -e "${RED}[✗] Error: Not a git repository${NC}"
    exit 1
fi

# Files identified by GitHub Secret Scanning
FILES_TO_REMOVE=(
    "azure-sp-backup-2.json"
    "azure-sp-backup-20250915-real.json"
    "DEPLOYMENT_SUMMARY.md"
    "azure-credentials-rotation.log"
    "scripts/rotate-azure-credentials.sh"
    "scripts/verify-both-credentials.sh"
    "setup-github-secrets.sh"
    "scripts/remove-exposed-secrets.sh"
    "scripts/scan-for-secrets.sh"
    "setup-github-secrets-azure.sh"
    "azure-appservice-deploy.json"
)

echo -e "${YELLOW}[!] WARNING: This will rewrite git history!${NC}"
echo -e "${YELLOW}[!] All collaborators will need to re-clone the repository${NC}"
echo ""
echo "Files to be removed from history:"
for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${RED}✗${NC} $file (exists)"
    else
        echo -e "  ${BLUE}ℹ${NC} $file (already removed)"
    fi
done
echo ""

read -p "Do you want to proceed? (yes/NO): " -r
echo ""
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Create backup
BACKUP_DIR="../fin-agent2-backup-$(date +%Y%m%d_%H%M%S)"
echo -e "${BLUE}[→]${NC} Creating backup at $BACKUP_DIR..."
cp -R . "$BACKUP_DIR"
echo -e "${GREEN}[✓]${NC} Backup created"
echo ""

# Remove files from working directory first
echo -e "${BLUE}[→]${NC} Removing files from working directory..."
for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        rm -f "$file"
        echo -e "  ${GREEN}✓${NC} Removed $file"
    fi
done
echo ""

# Commit the removal
echo -e "${BLUE}[→]${NC} Committing file removals..."
git add -A
git commit -m "security: remove files containing exposed secrets" || echo "No changes to commit"
echo ""

# Use git-filter-repo to remove files from history
echo -e "${BLUE}[→]${NC} Removing files from git history using git-filter-repo..."
echo -e "${YELLOW}[!]${NC} This may take a few minutes..."
echo ""

# Create paths file for git-filter-repo
PATHS_FILE=$(mktemp)
for file in "${FILES_TO_REMOVE[@]}"; do
    echo "$file" >> "$PATHS_FILE"
done

# Run git-filter-repo
git-filter-repo --invert-paths --paths-from-file "$PATHS_FILE" --force

# Clean up temp file
rm -f "$PATHS_FILE"

echo -e "${GREEN}[✓]${NC} Git history cleaned"
echo ""

# Clean up refs and garbage collect
echo -e "${BLUE}[→]${NC} Cleaning up repository..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive
echo -e "${GREEN}[✓]${NC} Repository cleaned"
echo ""

# Re-add the remote (git-filter-repo removes it)
echo -e "${BLUE}[→]${NC} Re-adding remote origin..."
git remote add origin git@github.com:brian-mercor/financial-agent.git
echo -e "${GREEN}[✓]${NC} Remote added"
echo ""

echo "=========================================="
echo -e "${GREEN}[✓] Cleanup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Force push to GitHub:"
echo -e "   ${BLUE}git push origin main --force${NC}"
echo ""
echo "2. If you have other branches:"
echo -e "   ${BLUE}git push origin --force --all${NC}"
echo ""
echo -e "${RED}[!] CRITICAL SECURITY STEPS:${NC}"
echo "   • Rotate ALL Azure credentials immediately"
echo "   • Rotate Groq API keys"
echo "   • Rotate Azure AI Services keys"
echo "   • Update all environment variables"
echo "   • Notify team to re-clone the repository"
echo ""
echo "Backup location: $BACKUP_DIR"
echo ""
