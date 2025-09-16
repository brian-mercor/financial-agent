# Multi-UI Monorepo Setup

This project now supports multiple UI applications that can connect to the same backend. Each UI is a separate app within the monorepo structure.

## Available UIs

1. **web** - Original pet store UI (port: 5173)
2. **web-b** - Fin mobile payment platform UI (port: 5174)

## Project Structure

```
apps/
├── backend/      # Shared backend (Motia framework)
├── web/          # Original UI
└── web-b/        # Alternative Fin UI
```

## Running Different UIs

### Method 1: Using NPM Scripts

```bash
# Run original web UI with backend
pnpm run dev:web

# Run Fin UI (web-b) with backend
pnpm run dev:web-b

# Run all UIs and backend simultaneously
pnpm run dev:all
```

### Method 2: Using Environment Variable

```bash
# Run with original UI (default)
UI_APP=web ./scripts/start-dev.sh

# Run with Fin UI
UI_APP=web-b ./scripts/start-dev.sh
```

### Method 3: Using Turbo Directly

```bash
# Run specific UI with backend
pnpm turbo run dev --filter=web-b --filter=backend
```

## Ports

- Backend: http://localhost:3000
- Original Web UI: http://localhost:5173
- Fin Web UI: http://localhost:5174

## Creating a New UI

To add another UI variant:

1. Create a new app folder:
```bash
mkdir apps/web-c
cd apps/web-c
npm create vite@latest . -- --template react
```

2. Configure a unique port in `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,  // Use a unique port
    host: true
  }
})
```

3. Add a script to root `package.json`:
```json
"dev:web-c": "turbo run dev --filter=web-c --filter=backend"
```

4. Install dependencies:
```bash
pnpm install
```

## Features

- **Monorepo Structure**: All UIs share the same dependencies and build tools
- **Independent Development**: Each UI can be developed and deployed independently
- **Shared Backend**: All UIs connect to the same backend API
- **Hot Reload**: Each UI supports hot module replacement for fast development
- **TypeScript Support**: Full TypeScript support across all apps
- **Tailwind CSS**: Each UI can use its own styling approach

## Notes

- Each UI maintains its own package.json and can have different dependencies
- The backend remains unchanged regardless of which UI is being used
- All UIs can run simultaneously for A/B testing or gradual migration