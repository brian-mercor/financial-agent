# Frontend-Backend Integration Guide

## Backend Endpoints

All frontend applications should connect to the Azure Container Apps backend:

**Production Backend URL**: `https://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io`

## Environment Variables

Each frontend app has an `.env.example` file with the required configuration. Copy it to `.env.local` (Next.js) or `.env` (Vite/React) and update as needed.

### Next.js Apps (web, web-a)
```env
NEXT_PUBLIC_API_URL=https://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io/api
NEXT_PUBLIC_WS_URL=wss://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io
```

### Vite Apps (web-b through web-j)
```env
VITE_API_URL=https://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io/api
VITE_WS_URL=wss://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io
```

### React Apps (if using Create React App)
```env
REACT_APP_API_URL=https://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io/api
REACT_APP_WS_URL=wss://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io
```

## CORS Configuration

The backend is configured to accept requests from:
- `https://*.vercel.app` (all Vercel deployments)
- `http://localhost:3000` (Next.js local dev)
- `http://localhost:5173` (Vite local dev)
- `http://localhost:5174` (Vite alternate port)

## API Endpoints

### Health Check
```bash
GET https://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io/health
```

### Chat API
```bash
POST https://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io/api/chat
Content-Type: application/json

{
  "message": "Your message here",
  "sessionId": "optional-session-id"
}
```

### WebSocket Connection
```javascript
const ws = new WebSocket('wss://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io');

ws.onopen = () => {
  console.log('Connected to backend');
  ws.send(JSON.stringify({ type: 'ping' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

## Deploying Frontend to Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy with Environment Variables
```bash
cd apps/web-[variant]
vercel --prod
```

During deployment, Vercel will ask for environment variables. Add:
- `NEXT_PUBLIC_API_URL` or `VITE_API_URL` with the backend URL
- Any other app-specific variables

### 3. Or Use Vercel Dashboard

1. Import project from GitHub
2. Set environment variables in Project Settings
3. Deploy

## Example Frontend Code

### Next.js (apps/web)
```typescript
// app/api/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function sendMessage(message: string) {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  return response.json();
}
```

### Vite/React (apps/web-b through web-j)
```typescript
// src/api/client.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function sendMessage(message: string) {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  return response.json();
}
```

## Troubleshooting

### CORS Errors
If you see CORS errors:
1. Check that your domain is in the allowed origins
2. Ensure you're using HTTPS for production
3. Include credentials if needed: `credentials: 'include'`

### Connection Refused
If the backend is not responding:
1. Check if Container App is running: `az containerapp show -n motia-backend -g finagent-rg --query properties.runningStatus`
2. Container Apps scale to zero - first request may take 2-5 seconds to wake up

### WebSocket Connection Failed
1. Ensure using `wss://` protocol for secure connections
2. Some corporate firewalls block WebSocket - test on different network

## Backend Monitoring

### Check Backend Status
```bash
curl https://motia-backend.victoriousfield-1103b152.eastus.azurecontainerapps.io/health
```

### View Logs
```bash
az containerapp logs show -n motia-backend -g finagent-rg --follow
```

### Scale Status
```bash
az containerapp replica list -n motia-backend -g finagent-rg -o table
```

## Cost Optimization

The backend uses **scale-to-zero** configuration:
- Automatically scales down when idle
- First request after idle takes 2-5 seconds
- Saves ~90% on hosting costs
- Scales up to 3 replicas under load

## Support

For issues or questions:
1. Check backend health endpoint
2. Review Container Apps logs
3. Verify environment variables in frontend
4. Test with curl to isolate frontend/backend issues