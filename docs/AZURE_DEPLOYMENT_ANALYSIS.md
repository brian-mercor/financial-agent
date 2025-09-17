# Azure Deployment Analysis for Fin Agent Platform

## Current Application Architecture

### Applications Found
1. **Backend** (`apps/backend/`)
   - Motia-based backend with event-driven architecture
   - Has Dockerfile
   - Runs on port 3001 (mapped from 3000 internally)

2. **Main Web Frontend** (`apps/web/`)
   - Next.js application
   - Has Dockerfile
   - Runs on port 3000

3. **Web-A Frontend** (`apps/web-a/`)
   - Vite/React application
   - No Dockerfile found
   - Runs on default Vite port

4. **Web-B Frontend** (`apps/web-b/`)
   - Vite/React application
   - No Dockerfile found
   - Runs on default Vite port

5. **Finagent Landing** (`apps/finagent-landing/`)
   - Additional frontend app (need to check details)

## Existing Deployment Configuration

### Current Setup (from azure-deploy.json)
- **2 containers only**: Backend and Web
- Uses Azure Container Instances
- Includes Azure Cache for Redis
- Container Registry for Docker images

### Missing Components
- Web-A and Web-B are NOT included in current deployment
- No nginx/reverse proxy configuration found for serving multiple frontends

## Deployment Options

### Option 1: Separate Containers (Recommended for Production)
Deploy each frontend as a separate container:
- Backend container (existing)
- Web container (existing)
- Web-A container (new)
- Web-B container (new)
- Finagent-landing container (new)

**Pros:**
- Independent scaling
- Isolated failures
- Clear separation of concerns

**Cons:**
- Higher resource cost
- More complex deployment

### Option 2: Single Frontend Container with Nginx
Serve all frontends from one container using nginx routing:
- Backend container
- Frontend container with nginx serving:
  - `/` → web (Next.js)
  - `/app-a` → web-a (Vite)
  - `/app-b` → web-b (Vite)
  - `/landing` → finagent-landing

**Pros:**
- Lower resource cost
- Simpler container management

**Cons:**
- More complex build process
- All frontends share same resources
- Single point of failure for all frontends

### Option 3: App Service with Multiple Apps
Use Azure App Service instead of Container Instances:
- Each app as separate App Service
- Shared App Service Plan for cost optimization

**Pros:**
- Better suited for web applications
- Built-in SSL, custom domains
- Easier CI/CD integration

**Cons:**
- Different from existing setup
- May require architecture changes

## Required Steps for Deployment

### For Option 1 (Separate Containers):
1. Create Dockerfiles for web-a and web-b
2. Update azure-deploy.json to include new containers
3. Update deployment script to build and push all images
4. Configure proper networking between containers

### For Option 2 (Single Frontend with Nginx):
1. Create unified Dockerfile with nginx
2. Build all frontend apps
3. Configure nginx routing rules
4. Update deployment configuration

### For Option 3 (App Service):
1. Use existing azure-appservice-deploy.json
2. Deploy each app as separate App Service
3. Configure networking and environment variables

## Environment Variables Required

### Backend
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY
- PLAID_CLIENT_ID
- PLAID_SECRET
- POLYGON_API_KEY
- ALPACA_API_KEY
- ALPACA_SECRET_KEY
- OPENAI_API_KEY
- ANTHROPIC_API_KEY
- GROQ_API_KEY
- MEM0_API_KEY
- REDIS_URL

### Frontend Apps
- NEXT_PUBLIC_API_URL (pointing to backend)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Azure CLI Commands Needed

### Login and Setup
```bash
# Login to Azure
az login

# Set subscription (if multiple)
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Create resource group
az group create --name finagent-rg --location eastus
```

### Container Registry
```bash
# Create container registry
az acr create --resource-group finagent-rg --name finagentacr --sku Basic

# Login to registry
az acr login --name finagentacr

# Build and push images
az acr build --registry finagentacr --image finagent-backend:latest apps/backend
az acr build --registry finagentacr --image finagent-web:latest apps/web
```

### Deploy with ARM Template
```bash
# Deploy using existing template
az deployment group create \
  --resource-group finagent-rg \
  --template-file azure-deploy.json \
  --parameters @azure-deploy.parameters.json
```

### Alternative: Container Instances Direct
```bash
# Create container group
az container create \
  --resource-group finagent-rg \
  --name finagent-containers \
  --image finagentacr.azurecr.io/finagent-backend:latest \
  --cpu 2 --memory 4 \
  --ports 3001 \
  --environment-variables NODE_ENV=production PORT=3001 \
  --secure-environment-variables SUPABASE_URL=$SUPABASE_URL
```

## Recommendations

### Immediate Action (Quick Deployment)
1. **Use existing 2-container setup** for web and backend only
2. Deploy web-a and web-b separately later if needed
3. Use the existing `azure-deploy.sh` script with proper .env.production file

### Long-term Solution
1. **Create nginx-based unified frontend container** to serve all three frontend apps
2. This requires:
   - Creating Dockerfiles for web-a and web-b
   - Setting up nginx configuration
   - Building all apps during container build
   - Proper routing configuration

### Steps to Deploy Now
1. Create .env.production with all required variables
2. Run the existing deployment script:
   ```bash
   cd /root/repo
   ./scripts/azure-deploy.sh
   ```

### To Add web-a and web-b Later
1. Create Dockerfiles for each
2. Update azure-deploy.json to add new containers
3. Redeploy with updated configuration

## Decision Required

**Question:** Do you want to:
1. Deploy just backend + main web (existing setup) NOW?
2. First create a unified frontend container for all apps?
3. Deploy each frontend as a separate container?

The fastest path is option 1, using the existing setup.