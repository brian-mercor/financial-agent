#!/bin/bash

# Script to prune TradingView charting library to essential files only
# Reduces library size from ~26MB to ~3-5MB

set -e

# Configuration
SOURCE_DIR="/Users/brian/Public/general-repos/fin/finagent2/apps/webb/public/charting_library"
BACKUP_DIR="/Users/brian/Public/general-repos/fin/finagent2/apps/webb/public/charting_library_backup"
PRUNED_DIR="/Users/brian/Public/general-repos/fin/finagent2/apps/webb/public/charting_library_pruned"

# Create backup if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
  echo "Creating backup of original library..."
  cp -r "$SOURCE_DIR" "$BACKUP_DIR"
  echo "Backup created at: $BACKUP_DIR"
fi

# Remove existing pruned directory if it exists
if [ -d "$PRUNED_DIR" ]; then
  echo "Removing existing pruned directory..."
  rm -rf "$PRUNED_DIR"
fi

# Create pruned directory structure
echo "Creating pruned library structure..."
mkdir -p "$PRUNED_DIR"
mkdir -p "$PRUNED_DIR/bundles"

# Copy essential root files
echo "Copying essential root files..."
cp "$SOURCE_DIR/charting_library.js" "$PRUNED_DIR/" 2>/dev/null || true
cp "$SOURCE_DIR/charting_library.esm.js" "$PRUNED_DIR/" 2>/dev/null || true
cp "$SOURCE_DIR/charting_library.cjs.js" "$PRUNED_DIR/" 2>/dev/null || true
cp "$SOURCE_DIR/charting_library.d.ts" "$PRUNED_DIR/" 2>/dev/null || true
cp "$SOURCE_DIR/datafeed-api.d.ts" "$PRUNED_DIR/" 2>/dev/null || true
cp "$SOURCE_DIR/package.json" "$PRUNED_DIR/" 2>/dev/null || true
cp "$SOURCE_DIR/sameorigin.html" "$PRUNED_DIR/" 2>/dev/null || true

# Copy essential library bundle
echo "Copying core library bundle..."
cp "$SOURCE_DIR/bundles/library."*.js "$PRUNED_DIR/bundles/" 2>/dev/null || true

# Copy only English language bundles (en.*)
echo "Copying English language bundles only..."
for file in "$SOURCE_DIR/bundles"/en.*.js; do
  [ -e "$file" ] && cp "$file" "$PRUNED_DIR/bundles/"
done

# Copy essential numbered bundles (these are core functionality)
# We'll copy the most common ones that are typically required
echo "Copying essential core bundles..."
ESSENTIAL_BUNDLES=(
  "runtime"
  "library"
  "vendors"
  "chart"
  "drawing"
  "study"
)

for pattern in "${ESSENTIAL_BUNDLES[@]}"; do
  for file in "$SOURCE_DIR/bundles/"*"$pattern"*.js; do
    [ -e "$file" ] && cp "$file" "$PRUNED_DIR/bundles/"
  done
done

# Copy main numbered bundles (first 50 most common)
echo "Copying main numbered bundles..."
for file in "$SOURCE_DIR/bundles/"[0-9]*.js; do
  basename=$(basename "$file")
  # Skip language-specific numbered bundles
  if [[ ! "$basename" =~ \.[a-z]{2}(_[A-Z]{2})?\. ]]; then
    # Get the bundle number
    bundle_num=$(echo "$basename" | grep -o '^[0-9]*' | head -1)
    if [ ! -z "$bundle_num" ] && [ "$bundle_num" -lt 5000 ]; then
      cp "$file" "$PRUNED_DIR/bundles/"
    fi
  fi
done

# Copy essential CSS files (non-RTL, non-language specific)
echo "Copying essential CSS files..."
for file in "$SOURCE_DIR/bundles/"*.css; do
  basename=$(basename "$file")
  # Skip RTL and language-specific CSS
  if [[ ! "$basename" =~ \.rtl\. ]] && [[ ! "$basename" =~ \.[a-z]{2}(_[A-Z]{2})?\. ]]; then
    # Get the bundle number
    bundle_num=$(echo "$basename" | grep -o '^[0-9]*' | head -1)
    if [ ! -z "$bundle_num" ] && [ "$bundle_num" -lt 5000 ]; then
      cp "$file" "$PRUNED_DIR/bundles/"
    fi
  fi
done

# Copy specific essential tools and features
echo "Copying essential drawing tools..."
ESSENTIAL_TOOLS=(
  "restricted-toolset"
  "chart-event-hint"
  "demonstration-highlighter"
  "floating-toolbars"
)

for tool in "${ESSENTIAL_TOOLS[@]}"; do
  for file in "$SOURCE_DIR/bundles/"*"$tool"*.js; do
    [ -e "$file" ] && cp "$file" "$PRUNED_DIR/bundles/"
  done
done

# Calculate size savings
ORIGINAL_SIZE=$(du -sh "$SOURCE_DIR" | cut -f1)
PRUNED_SIZE=$(du -sh "$PRUNED_DIR" | cut -f1)
NUM_ORIGINAL_FILES=$(find "$SOURCE_DIR" -type f | wc -l | tr -d ' ')
NUM_PRUNED_FILES=$(find "$PRUNED_DIR" -type f | wc -l | tr -d ' ')

echo ""
echo "========================================="
echo "TradingView Library Pruning Complete!"
echo "========================================="
echo "Original size: $ORIGINAL_SIZE ($NUM_ORIGINAL_FILES files)"
echo "Pruned size: $PRUNED_SIZE ($NUM_PRUNED_FILES files)"
echo "Location: $PRUNED_DIR"
echo ""
echo "To use the pruned library:"
echo "1. Test it first: mv $SOURCE_DIR ${SOURCE_DIR}_old && cp -r $PRUNED_DIR $SOURCE_DIR"
echo "2. If it works, remove the old: rm -rf ${SOURCE_DIR}_old"
echo "3. If issues occur, restore: rm -rf $SOURCE_DIR && mv ${SOURCE_DIR}_old $SOURCE_DIR"
echo ""
echo "Removed:"
echo "- All non-English language bundles (saves ~15MB)"
echo "- RTL (right-to-left) CSS files"
echo "- Advanced drawing tools (keep only essentials)"
echo "- Rarely used numbered bundles (>5000)"