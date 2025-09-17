#!/bin/bash
# Prune unnecessary files from TradingView library submodule to reduce size
set -e

LIBRARY_PATH="apps/web/public/charting_library"

if [ ! -d "$LIBRARY_PATH" ]; then
    echo "Error: charting_library not found at $LIBRARY_PATH"
    echo "Make sure you've initialized the submodule first:"
    echo "  git submodule init && git submodule update"
    exit 1
fi

echo "=== TradingView Library Pruning Tool ==="
echo "This will reduce the library size by removing unnecessary files"
echo ""

# Count size before
SIZE_BEFORE=$(du -sh $LIBRARY_PATH | cut -f1)
FILES_BEFORE=$(find $LIBRARY_PATH -type f | wc -l | tr -d ' ')
echo "Current size: $SIZE_BEFORE ($FILES_BEFORE files)"
echo ""

# Languages to keep (modify as needed)
KEEP_LANGS="en"  # Add more like "en,es,fr,zh" if needed
echo "Languages to keep: $KEEP_LANGS"
echo ""

read -p "Continue with pruning? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

cd $LIBRARY_PATH

# Create a new branch for the pruning
BRANCH_NAME="prune-$(date +%Y%m%d)"
echo "Creating branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME 2>/dev/null || git checkout $BRANCH_NAME

echo ""
echo "Pruning unnecessary files..."

# Remove source maps and TypeScript files (except .d.ts)
echo "- Removing source maps and TypeScript files..."
find . -name "*.map" -type f -delete 2>/dev/null || true
find . -name "*.ts" -type f -not -name "*.d.ts" -delete 2>/dev/null || true

# Remove documentation and examples
echo "- Removing documentation and examples..."
rm -rf docs examples 2>/dev/null || true

# Remove .DS_Store files
find . -name ".DS_Store" -type f -delete 2>/dev/null || true

# Prune language bundles in charting_library/bundles
if [ -d "charting_library/bundles" ]; then
    echo "- Pruning language bundles..."
    
    # Count language files before
    LANG_COUNT_BEFORE=$(ls charting_library/bundles/*.*.js 2>/dev/null | wc -l | tr -d ' ')
    
    # Remove non-English language bundles
    for bundle in charting_library/bundles/*.*.js; do
        if [ -f "$bundle" ]; then
            filename=$(basename "$bundle")
            # Check if it's a language-specific bundle (format: number.lang.hash.js)
            if [[ "$filename" =~ ^[0-9]+\.([a-z]{2}(_[A-Z]{2})?)\. ]]; then
                lang="${BASH_REMATCH[1]}"
                if [[ ! ",$KEEP_LANGS," =~ ",$lang," ]]; then
                    rm -f "$bundle"
                    # Also remove corresponding CSS if exists
                    css_file="${bundle%.js}.css"
                    [ -f "$css_file" ] && rm -f "$css_file"
                fi
            fi
        fi
    done
    
    # Remove RTL CSS files
    echo "- Removing RTL stylesheets..."
    rm -f charting_library/bundles/*.rtl.*.css 2>/dev/null || true
    
    LANG_COUNT_AFTER=$(ls charting_library/bundles/*.*.js 2>/dev/null | wc -l | tr -d ' ')
    echo "  Removed $((LANG_COUNT_BEFORE - LANG_COUNT_AFTER)) language bundle files"
fi

# Optional: Remove less common numbered bundles (>5000)
echo "- Removing rare numbered bundles (>5000)..."
for file in charting_library/bundles/[5-9][0-9][0-9][0-9]*.js; do
    [ -f "$file" ] && rm -f "$file"
    # Also remove corresponding CSS
    css_file="${file%.js}.css"
    [ -f "$css_file" ] && rm -f "$css_file"
done

# Count size after
cd -
SIZE_AFTER=$(du -sh $LIBRARY_PATH | cut -f1)
FILES_AFTER=$(find $LIBRARY_PATH -type f | wc -l | tr -d ' ')

echo ""
echo "========================================="
echo "Pruning Complete!"
echo "========================================="
echo "Before: $SIZE_BEFORE ($FILES_BEFORE files)"
echo "After:  $SIZE_AFTER ($FILES_AFTER files)"
echo "Reduction: $((FILES_BEFORE - FILES_AFTER)) files removed"
echo ""

# Show git status
cd $LIBRARY_PATH
echo "Changes in submodule:"
git status --short | head -10
CHANGES=$(git status --short | wc -l | tr -d ' ')
if [ "$CHANGES" -gt 10 ]; then
    echo "... and $((CHANGES - 10)) more files"
fi

echo ""
echo "To commit these changes to the submodule:"
echo "  cd $LIBRARY_PATH"
echo "  git add -A"
echo "  git commit -m 'chore: prune library - remove unnecessary language bundles and files'"
echo "  git push origin $BRANCH_NAME"
echo ""
echo "Then create a PR to merge into master, or push directly:"
echo "  git checkout master"
echo "  git merge $BRANCH_NAME"
echo "  git push origin master"
echo ""
echo "Finally, update the main repository:"
echo "  cd $(pwd)"
echo "  git add $LIBRARY_PATH"
echo "  git commit -m 'chore: update submodule with pruned library'"