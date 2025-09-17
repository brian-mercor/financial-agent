# Vercel Frontend + Azure Backend Deployment Guide

## Overview

This guide describes the optimal deployment strategy:
- **Frontend Apps** → Vercel (Free/Pro plan, global CDN, automatic SSL)
- **Backend (Motia)** → Azure App Service (reliable, proven to work)

## Cost Analysis

### This Approach
- **Frontend (Vercel)**: $0 (Free tier or already on Pro)
- **Backend (Azure App Service B1)**: ~$28/month
- **Total**: ~$28/month

### Previous Approaches
- All App Services: ~$165/month
- Hybrid (Container + App Service): ~$95/month
- **Savings**: 83% reduction from all App Services!

## Architecture

```
[Vercel CDN - Global]
├── finagent.vercel.app (Main App)
└── finagent-landing.vercel.app (Landing Page)
         ↓ API Calls ↓
[Azure App Service - East US]
└── finagent-backend-pps457j4wjrc6.azurewebsites.net
         ↓ Database ↓
[Supabase Cloud]
```

## Quick Start

### 1. Deploy Backend to Azure

```bash
# Deploy backend with CORS configured for Vercel
./scripts/deploy-backend-azure.sh

# Set backend secrets
./scripts/set-azure-secrets.sh --backend-only
```

### 2. Deploy Frontend to Vercel

```bash
# Interactive setup and deployment
./scripts/setup-vercel.sh

# Or manual deployment
cd apps/web
vercel --prod

cd apps/finagent-landing
vercel --prod
```

## Detailed Setup

### Backend Deployment (Azure)

#### Step 1: Deploy Backend

```bash
# Full deployment with CORS setup
./scripts/deploy-backend-azure.sh

# Skip build if already built
./scripts/deploy-backend-azure.sh --skip-build
```

This script:
- Creates Azure resources (Resource Group, App Service Plan)
- Builds and packages the Motia backend
- Deploys to Azure App Service
- Configures CORS for Vercel domains

#### Step 2: Configure Backend Secrets

```bash
# Set secrets from local .env file
./scripts/set-azure-secrets.sh --backend-only

# Or set manually via Azure CLI
az webapp config appsettings set \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --settings \
    SUPABASE_URL="your-url" \
    SUPABASE_SERVICE_KEY="your-key" \
    OPENAI_API_KEY="your-key"
```

### Frontend Deployment (Vercel)

#### Option 1: Using Setup Script (Recommended)

```bash
# Interactive setup for both apps
./scripts/setup-vercel.sh

# Or specific app
./scripts/setup-vercel.sh web
./scripts/setup-vercel.sh finagent-landing
```

#### Option 2: Manual Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy main app
cd apps/web
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://finagent-backend-pps457j4wjrc6.azurewebsites.net

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter: your-supabase-url

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Enter: your-anon-key

# Deploy to production
vercel --prod
```

#### Option 3: GitHub Integration

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel Dashboard
3. Automatic deployments on push to main

## CORS Configuration

The backend CORS service (`apps/backend/services/cors.service.ts`) handles CORS automatically.

### Default Allowed Origins

- `https://*.vercel.app` (all Vercel deployments)
- `http://localhost:3000` (local development)
- `http://localhost:3001` (local development)

### Adding Custom Domains

```bash
# Set custom domains via environment variable
export VERCEL_DOMAINS="app.yourdomain.com,landing.yourdomain.com"
./scripts/deploy-backend-azure.sh --set-cors

# Or set in Azure
az webapp config appsettings set \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --settings ALLOWED_ORIGINS="https://app.yourdomain.com,https://landing.yourdomain.com"
```

## Environment Variables

### Backend (Azure App Service)

```env
# Required
NODE_ENV=production
SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_KEY=your-service-key

# Financial APIs
PLAID_CLIENT_ID=your-id
PLAID_SECRET=your-secret
POLYGON_API_KEY=your-key
ALPACA_API_KEY=your-key
ALPACA_SECRET_KEY=your-secret

# AI Services
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key
GROQ_API_KEY=your-key

# CORS
ALLOWED_ORIGINS=https://finagent.vercel.app,https://finagent-landing.vercel.app
```

### Frontend (Vercel)

```env
# Main App (apps/web)
NEXT_PUBLIC_API_URL=https://finagent-backend-pps457j4wjrc6.azurewebsites.net
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Landing Page (apps/finagent-landing)
NEXT_PUBLIC_API_URL=https://finagent-backend-pps457j4wjrc6.azurewebsites.net
NEXT_PUBLIC_APP_URL=https://finagent.vercel.app
```

## Vercel Configuration Files

### apps/web/vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@backend_api_url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://finagent-backend-pps457j4wjrc6.azurewebsites.net/:path*"
    }
  ]
}
```

## Custom Domains

### Vercel (Frontend)

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificates are automatic

### Azure (Backend API)

```bash
# Add custom domain to App Service
az webapp config hostname add \
  --webapp-name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --hostname api.yourdomain.com
```

## Monitoring

### Backend Logs (Azure)

```bash
# Stream logs
az webapp log tail \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg

# Enable application logging
az webapp log config \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --application-logging filesystem
```

### Frontend Logs (Vercel)

- View in Vercel Dashboard → Functions → Logs
- Or use Vercel CLI: `vercel logs`

### Health Checks

```bash
# Backend health
curl https://finagent-backend-pps457j4wjrc6.azurewebsites.net/health

# Frontend (through Vercel)
curl https://finagent.vercel.app
```

## CI/CD Setup

### GitHub Actions for Backend

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend to Azure

on:
  push:
    branches: [main]
    paths:
      - 'apps/backend/**'
      - '.github/workflows/deploy-backend.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Deploy to Azure
        run: |
          ./scripts/deploy-backend-azure.sh
        env:
          AZURE_CREDENTIALS: ${{ secrets.AZURE_CREDENTIALS }}
```

### Vercel GitHub Integration

1. Connect GitHub repo in Vercel Dashboard
2. Configure build settings:
   - Root Directory: `apps/web` or `apps/finagent-landing`
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Set environment variables in Vercel Dashboard
4. Automatic deployments on push

## Troubleshooting

### CORS Issues

```bash
# Check current CORS settings
az webapp cors show \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg

# Add Vercel preview URLs
az webapp cors add \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --allowed-origins "https://*.vercel.app"

# Restart backend
az webapp restart \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg
```

### Backend Not Responding

```bash
# Check app status
az webapp show \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --query state

# View recent logs
az webapp log download \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --log-file logs.zip

# SSH into container
az webapp ssh \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg
```

### Vercel Build Failures

```bash
# Check build logs
vercel logs --output raw

# Clear cache and redeploy
vercel --force

# Check environment variables
vercel env ls
```

## Migration from Other Deployments

### From All Azure App Services

1. Deploy backend (already on App Service)
2. Set up Vercel projects
3. Deploy frontends to Vercel
4. Update DNS records
5. Delete frontend App Services

### From Docker/Container Deployments

1. Deploy backend to App Service
2. Set up Vercel projects
3. Deploy frontends to Vercel
4. Delete container instances

## Security Best Practices

1. **API Keys**
   - Store in Azure Key Vault or Vercel environment variables
   - Never commit to repository
   - Rotate regularly

2. **CORS**
   - Only allow specific domains in production
   - Use wildcards carefully
   - Validate origin headers

3. **HTTPS**
   - Always use HTTPS in production
   - Vercel provides automatic SSL
   - Configure SSL for Azure custom domains

4. **Authentication**
   - Implement proper authentication
   - Use Supabase Row Level Security
   - Validate all API requests

## Cost Optimization Tips

1. **Azure App Service**
   - Use B1 tier for low traffic (~$28/month)
   - Scale up only when needed
   - Use auto-scaling rules

2. **Vercel**
   - Stay within free tier limits:
     - 100GB bandwidth/month
     - 100GB-hours compute/month
   - Use ISR (Incremental Static Regeneration)
   - Optimize images with next/image

3. **Monitoring**
   - Set up spending alerts in Azure
   - Monitor Vercel usage in dashboard
   - Use caching to reduce API calls

## Summary

This deployment strategy provides:

✅ **Minimal Cost**: ~$28/month total (83% savings)
✅ **Maximum Performance**: Vercel CDN for frontend, dedicated backend
✅ **Simple Management**: Separate concerns, easy updates
✅ **Automatic Scaling**: Vercel handles frontend scaling
✅ **Global Distribution**: Vercel edge network
✅ **SSL Included**: Automatic HTTPS on both platforms

The combination of Vercel for frontend and Azure App Service for backend provides the best balance of cost, performance, and reliability.