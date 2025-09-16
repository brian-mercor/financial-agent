#!/bin/bash

# Script to start the development environment with the selected UI
# Usage: UI_APP=web-b ./scripts/start-dev.sh

# Default to the original web app if UI_APP is not set
UI_APP=${UI_APP:-web}

echo "Starting development with UI: $UI_APP"

# Check if the specified UI app exists
if [ ! -d "apps/$UI_APP" ]; then
  echo "Error: UI app 'apps/$UI_APP' does not exist"
  echo "Available options:"
  ls -d apps/web* | xargs -n 1 basename
  exit 1
fi

# Start the development servers
if [ "$UI_APP" = "web" ]; then
  pnpm run dev:web
elif [ "$UI_APP" = "web-b" ]; then
  pnpm run dev:web-b
else
  echo "Starting with custom UI app: $UI_APP"
  pnpm turbo run dev --filter=$UI_APP --filter=backend
fi