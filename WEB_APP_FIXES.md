# Web Applications Configuration Fixes

## Issue Summary
Multiple web applications (web-a through web-j) were experiencing 500 errors on API calls, specifically the `/api/chat/stream` endpoint. The root causes were:
1. **Incorrect backend port configuration** - Some apps were trying to proxy to port 3001 instead of 3000
2. **Port conflicts** - Multiple apps were configured to use the same port

## Configuration Status

### ✅ Working Apps (No Changes Needed)
| App | Port | Backend Proxy | Status |
|-----|------|---------------|--------|
| web-a | 5174 | localhost:3000 | ✅ Working |
| web-c | 5176 | localhost:3000 | ✅ Working |
| web-f | 5178 | localhost:3000 | ✅ Working |
| web-g | 5181 | localhost:3000 | ✅ Working |
| web-h | 5180 | localhost:3000 | ✅ Working |
| web-j | 5182 | localhost:3000 | ✅ Working |

### ❌ Fixed Apps
| App | Issue | Old Config | New Config | Fix Applied |
|-----|-------|------------|------------|-------------|
| **web-b** | Wrong backend port | proxy: 3001, port: 5175 | proxy: 3000, port: 5175 | ✅ Fixed proxy target |
| **web-d** | Port conflict with web-c | port: 5176 | port: 5179 | ✅ Changed to unique port |
| **web-e** | Wrong backend port | proxy: 3001, port: 5177 | proxy: 3000, port: 5177 | ✅ Fixed proxy target |
| **web-i** | Port conflict with web-g | port: 5181 | port: 5183 | ✅ Changed to unique port |

## Root Cause Analysis

### 1. Backend Port Misconfiguration
- **Issue**: web-b and web-e were configured to proxy API calls to `http://localhost:3001`
- **Reality**: The Motia backend runs on port 3000 by default
- **Impact**: All API calls resulted in connection refused errors, manifesting as 500 errors to the client

### 2. Port Conflicts
- **Issue**: Multiple apps configured with the same port numbers
  - web-c and web-d both used port 5176
  - web-g and web-i both used port 5181
- **Impact**: Only one app could run at a time on each port

## Files Modified

1. `/root/repo/apps/web-b/vite.config.js` - Changed proxy target from 3001 to 3000
2. `/root/repo/apps/web-d/vite.config.js` - Changed port from 5176 to 5179
3. `/root/repo/apps/web-e/vite.config.js` - Changed proxy target from 3001 to 3000
4. `/root/repo/apps/web-i/vite.config.js` - Changed port from 5181 to 5183

## Final Port Allocation

| Port | Application |
|------|------------|
| 5174 | web-a |
| 5175 | web-b |
| 5176 | web-c |
| 5177 | web-e |
| 5178 | web-f |
| 5179 | web-d (reassigned) |
| 5180 | web-h |
| 5181 | web-g |
| 5182 | web-j |
| 5183 | web-i (reassigned) |
| 3000 | backend (Motia) |

## Testing After Fixes

To verify the fixes work:

1. **Start the backend**:
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **Start any web app**:
   ```bash
   # For web-b (previously broken)
   cd apps/web-b
   npm run dev
   # Access at http://localhost:5175/dashboard
   ```

3. **Test the API**:
   ```bash
   # Test chat stream endpoint
   curl -X POST http://localhost:5175/api/chat/stream \
     -H "Content-Type: application/json" \
     -d '{"message": "test"}'
   ```

## Prevention Guidelines

To prevent similar issues in the future:

1. **Use environment variables** for backend URL configuration instead of hardcoding
2. **Document port allocations** in a central location
3. **Use a port allocation strategy**:
   - Backend: 3000-3099
   - Frontend apps: 5000-5999
   - Keep a registry of allocated ports
4. **Add validation** in development scripts to check for port conflicts
5. **Consider using a reverse proxy** (nginx/caddy) for all apps in production

## Development Commands

Run specific apps with the backend:
```bash
# From root directory
npm run dev:web-a  # Port 5174
npm run dev:web-b  # Port 5175 (now fixed)
npm run dev:web-d  # Port 5179 (now on unique port)
npm run dev:web-e  # Port 5177 (now fixed)

# Or run all at once
npm run dev:all
```

## Verification Checklist

- [x] All apps have unique ports
- [x] All apps proxy to correct backend port (3000)
- [x] No port conflicts exist
- [x] Configuration is documented
- [x] Fixes have been applied to vite.config.js files