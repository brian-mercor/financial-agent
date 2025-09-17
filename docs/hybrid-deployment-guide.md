# Hybrid Deployment Guide: App Service + Containers

## Architecture Overview

This hybrid deployment strategy combines the best of both worlds:

- **Backend (Motia)** → Azure App Service (proven stability)
- **Frontend Apps** → Single Docker Container with Nginx routing

### Why Hybrid?

1. **Backend on App Service**
   - Motia framework works reliably on App Service
   - Avoids containerization issues with Motia's postinstall requirements
   - Better logging and diagnostics for complex backend logic
   - Proven track record in production

2. **Frontend in Container**
   - Multiple Next.js apps in one container
   - Nginx reverse proxy for efficient routing
   - Cost-effective (one container vs multiple App Services)
   - Easy to scale horizontally

## Architecture Diagram

```
Internet
    ↓
[Azure Container Instance]
    Nginx (Port 80/443)
    ├── / → Landing Page (port 3001)
    └── /app → Main App (port 3000)

[Azure App Service]
    └── Backend API (Motia) (port 3001)

[Azure Cache for Redis]
    └── Session & Data Cache
```

## Deployment Options

### Option 1: Hybrid Deployment Script (Recommended)

```bash
# Full deployment
./scripts/deploy-hybrid.sh

# Use Azure Container Registry (recommended for production)
./scripts/deploy-hybrid.sh --use-acr

# Deploy only backend
./scripts/deploy-hybrid.sh --backend-only

# Deploy only frontend
./scripts/deploy-hybrid.sh --frontend-only
```

### Option 2: ARM Template Deployment

```bash
# Create parameters file
cat > hybrid-params.json << EOF
{
  "\$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "supabaseUrl": {
      "value": "https://your-project.supabase.co"
    },
    "supabaseAnonKey": {
      "value": "your-anon-key"
    },
    "supabaseServiceKey": {
      "value": "your-service-key"
    }
  }
}
EOF

# Deploy ARM template
az deployment group create \
  --resource-group finagent-rg \
  --template-file azure-hybrid-deploy.json \
  --parameters @hybrid-params.json
```

### Option 3: Manual Docker Deployment

```bash
# Build frontend container locally
docker-compose -f docker-compose.frontend.yml build

# Tag for your registry
docker tag finagent_nginx:latest yourdockerhub/finagent-frontend:latest

# Push to registry
docker push yourdockerhub/finagent-frontend:latest

# Deploy to Azure Container Instance
az container create \
  --name finagent-frontend \
  --resource-group finagent-rg \
  --image yourdockerhub/finagent-frontend:latest \
  --dns-name-label finagent-app \
  --ports 80 443 \
  --cpu 2 \
  --memory 4
```

## Frontend Container Structure

### Nginx Routing Configuration

The Nginx configuration (`nginx/nginx.conf`) routes traffic:

- `/` → Landing page application
- `/app/*` → Main application
- `/_next/*` → Static assets for respective apps
- `/health` → Health check endpoint

### Adding New Frontend Apps

1. Add the new app to `docker-compose.frontend.yml`:

```yaml
services:
  new-app:
    build:
      context: ./apps/new-app
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=3002
    networks:
      - frontend
```

2. Update `nginx/nginx.conf` with routing:

```nginx
upstream new_app {
    server new-app:3002;
}

location /new-path {
    rewrite ^/new-path(.*)$ $1 break;
    proxy_pass http://new_app;
    # ... proxy headers
}
```

3. Rebuild and redeploy:

```bash
./scripts/deploy-hybrid.sh --frontend-only
```

## Environment Variables

### Backend (App Service)

Set via `set-azure-secrets.sh` or Azure Portal:

```bash
# Using the script
./scripts/set-azure-secrets.sh --backend-only

# Or manually via Azure CLI
az webapp config appsettings set \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --settings KEY=value
```

### Frontend (Container)

Set during container deployment:

```bash
az container create \
  --name finagent-frontend \
  --resource-group finagent-rg \
  --environment-variables \
    NEXT_PUBLIC_API_URL=https://backend.azurewebsites.net \
    NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co \
  # ... other options
```

## Cost Analysis

### Current Multi-App Service Approach
- Backend App Service (B2): ~$55/month
- Frontend App Service (B2): ~$55/month
- Landing App Service (B2): ~$55/month
- **Total**: ~$165/month

### Hybrid Approach
- Backend App Service (B2): ~$55/month
- Frontend Container (2 CPU, 4GB): ~$40/month
- **Total**: ~$95/month
- **Savings**: ~$70/month (42% reduction)

### Further Optimization
- Use B1 tier during development: ~$28/month per service
- Implement auto-scaling for containers
- Use Azure Front Door for caching

## Monitoring

### Backend Logs (App Service)

```bash
# Stream logs
az webapp log tail \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg

# Download logs
az webapp log download \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --log-file backend-logs.zip
```

### Frontend Logs (Container)

```bash
# Stream container logs
az container logs \
  --name finagent-frontend \
  --resource-group finagent-rg \
  --follow

# Get container events
az container show \
  --name finagent-frontend \
  --resource-group finagent-rg \
  --query events
```

### Health Checks

```bash
# Backend health
curl https://finagent-backend-pps457j4wjrc6.azurewebsites.net/health

# Frontend health
curl http://finagent-app.eastus.azurecontainer.io/health
```

## SSL/TLS Configuration

### For Frontend Container

1. **Option A: Azure Application Gateway**
```bash
# Create Application Gateway with SSL termination
az network application-gateway create \
  --name finagent-gateway \
  --resource-group finagent-rg \
  --frontend-port 443 \
  --http-settings-port 80 \
  --cert-file certificate.pfx \
  --cert-password your-password
```

2. **Option B: Let's Encrypt with Nginx**
- Mount volumes for certificates
- Use certbot in container
- Auto-renewal via cron

3. **Option C: Azure Front Door**
```bash
# Create Front Door with managed SSL
az network front-door create \
  --name finagent-frontdoor \
  --resource-group finagent-rg \
  --backend-address finagent-app.eastus.azurecontainer.io
```

## Troubleshooting

### Backend Issues

1. **Motia not initializing**
```bash
# SSH into App Service
az webapp ssh \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg

# Manual initialization
cd /home/site/wwwroot
npx motia install
npx motia build
```

2. **Module not found**
```bash
# Redeploy with verbose logging
./scripts/deploy-hybrid.sh --backend-only --verbose
```

### Frontend Container Issues

1. **Container not starting**
```bash
# Check container status
az container show \
  --name finagent-frontend \
  --resource-group finagent-rg \
  --query instanceView.state

# View detailed events
az container show \
  --name finagent-frontend \
  --resource-group finagent-rg \
  --query events[].message
```

2. **Nginx routing issues**
```bash
# Exec into container
az container exec \
  --name finagent-frontend \
  --resource-group finagent-rg \
  --exec-command "/bin/sh"

# Test Nginx config
nginx -t

# Reload Nginx
nginx -s reload
```

3. **Image pull failures**
```bash
# Verify registry credentials
az acr credential show \
  --name finagentacr

# Check image exists
az acr repository show-tags \
  --name finagentacr \
  --repository finagent-frontend
```

## Migration Guide

### From Full App Service to Hybrid

1. **Keep backend as-is** (already on App Service)

2. **Containerize frontends**:
```bash
# Build container with all frontend apps
docker-compose -f docker-compose.frontend.yml build

# Test locally
docker-compose -f docker-compose.frontend.yml up

# Deploy container
./scripts/deploy-hybrid.sh --frontend-only
```

3. **Update DNS**:
- Point domain to Container Instance IP
- Or use Azure Front Door/Application Gateway

4. **Verify and cleanup**:
```bash
# Test new endpoints
curl http://finagent-app.eastus.azurecontainer.io

# Once verified, delete old frontend App Services
az webapp delete \
  --name finagent-web-pps457j4wjrc6 \
  --resource-group finagent-rg
```

### From Hybrid to Full Container (Future)

If Motia containerization issues are resolved:

1. **Create backend Dockerfile** with proper Motia initialization
2. **Update docker-compose.frontend.yml** to include backend
3. **Deploy as single container group** or migrate to AKS

## Best Practices

1. **Secrets Management**
   - Never hardcode secrets in Docker images
   - Use Azure Key Vault for production
   - Rotate credentials regularly

2. **Image Management**
   - Tag images with git commit SHA
   - Keep latest tag for current production
   - Clean up old images regularly

3. **Scaling**
   - Monitor container CPU/Memory usage
   - Set up auto-scaling rules
   - Consider AKS for complex scaling needs

4. **Backup and Recovery**
   - Regular database backups (Supabase)
   - Container image backups in ACR
   - Document recovery procedures

## Summary

This hybrid approach provides:
- ✅ Reliable backend deployment (App Service)
- ✅ Cost-effective frontend hosting (Single Container)
- ✅ Easy scaling and management
- ✅ Clear separation of concerns
- ✅ 42% cost reduction vs multi-App Service

The deployment scripts handle all the complexity while maintaining flexibility for different deployment scenarios.