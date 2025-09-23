# Frontend Monorepo Standardization

## Critical Principle

**All frontend apps (web-a through web-j) MUST be identical except for UI styling.** No one-off solutions or custom backends are allowed.

## The Standard Pattern

### 1. Shared Backend
- **ONE backend serves ALL frontends**: The Motia backend on port 3000
- **NO custom servers**: Never create Express servers or mock backends
- **NO mock responses**: Critical features like chat must use real backend

### 2. Identical Structure
Every app follows this exact structure:
```
apps/web-[x]/
├── src/
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── lib/                 # Utilities
│   └── styles/              # CSS (only difference)
├── vite.config.js           # Same proxy config
├── package.json             # Same dependencies
└── [config files]           # Same configs
```

### 3. Vite Proxy Configuration
All apps use identical proxy setup:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

### 4. Running Apps

#### Development
```bash
# Each app runs with backend via Turbo
pnpm run dev:web-a  # web-a + backend
pnpm run dev:web-j  # web-j + backend
```

#### What Happens
1. Turbo starts the Motia backend on port 3000
2. Turbo starts the frontend on its assigned port
3. Frontend proxies API calls to backend

### 5. Port Assignments
| App | Port |
|-----|------|
| backend | 3000 |
| web-a | 5174 |
| web-b | 5175 |
| web-c | 5176 |
| web-d | 5177 |
| web-e | 5178 |
| web-f | 5179 |
| web-g | 5180 |
| web-h | 5181 |
| web-i | 5182 |
| web-j | 5183 |

## Common Issues & Solutions

### "No response received" Error
**Problem**: Dashboard shows this when backend isn't running
**Solution**:
1. Ensure backend is running: `cd apps/backend && npx motia dev`
2. Check backend has `.env` file with `PORT=3000`
3. Never add mock responses - fix the real backend

### Backend Won't Start
**Problem**: Motia hangs or fails
**Solution**:
1. Create `.env` file in `apps/backend/`:
```env
NODE_ENV=development
PORT=3000
```
2. Run postinstall: `cd apps/backend && pnpm run postinstall`
3. Start with: `npx motia dev`

### Wrong Port
**Problem**: App not accessible on expected port
**Solution**: Check `vite.config.js` has correct port number

## Production Deployment

### Development vs Production

| Aspect | Development | Production |
|--------|------------|------------|
| Backend | Local Motia on 3000 | Deployed Motia service |
| Frontend Proxy | Vite proxy to localhost:3000 | Vercel routing |
| API Calls | `/api/*` → `localhost:3000` | `/api/*` → Production API |

### Vercel Configuration
Each frontend deploys separately but connects to same backend:
- web-a.vercel.app → Production API
- web-j.vercel.app → Production API
- All use same API endpoint

## Rules & Guidelines

### DO ✅
- Keep all apps structurally identical
- Use the shared Motia backend
- Follow the standard proxy pattern
- Test with real backend responses
- Only customize styles and UI components

### DON'T ❌
- Create custom backend servers
- Add mock API responses
- Change proxy configurations
- Add app-specific backend logic
- Modify the core service layer

## Adding New Frontend App

```bash
# 1. Copy existing app
cp -r apps/web-j apps/web-k

# 2. Update package.json name
# Change "name": "web-j" to "web-k"

# 3. Set unique port in vite.config.js
# port: 5184

# 4. Add to root package.json
"dev:web-k": "turbo run dev --filter=web-k --filter=backend"

# 5. Customize ONLY styles and UI
```

## Testing Checklist

Before committing any frontend app changes:
- [ ] App structure matches standard pattern
- [ ] Proxy points to `http://localhost:3000`
- [ ] No mock API responses added
- [ ] No custom backend created
- [ ] Works with shared Motia backend
- [ ] Only UI/styles differ from other apps

## Why This Matters

1. **Consistency**: Easy to maintain and debug
2. **Scalability**: Can add new UIs quickly
3. **Testing**: One backend to test all frontends
4. **Deployment**: Predictable production behavior
5. **Development**: Any developer can work on any app

## Quick Reference

```bash
# Start specific app
pnpm run dev:web-j

# If backend issues
cd apps/backend
echo "PORT=3000" > .env
npx motia dev

# Test API
curl http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```