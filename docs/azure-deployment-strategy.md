# Azure Deployment Strategy

## Overview

This document explains our deployment strategy for the Fin Agent Platform and the rationale behind choosing Azure App Service over Container Instances.

## Deployment Evolution

### Initial Approach: Container Deployment

We initially attempted to deploy using Azure Container Instances with the following architecture:
- Docker containers for backend and frontend
- Azure Container Registry for image storage
- ARM templates for infrastructure as code
- Container orchestration for scaling

### Issues Encountered with Containers

Based on our commit history and deployment attempts, we encountered several critical issues:

1. **pnpm Package Manager Incompatibility**
   - Azure Container Instances had issues with pnpm's symlinked node_modules structure
   - Commits show switching from pnpm to npm for deployment (commit 710b055)
   - Complex workarounds required for module resolution

2. **Motia Framework Initialization**
   - The Motia framework requires a postinstall step that creates a `.motia` directory
   - Container builds were not properly executing postinstall scripts
   - Runtime errors: "Cannot read properties of undefined (reading 'recentlyCreatedOwnerStacks')"

3. **Deployment Timeouts**
   - Container startup times exceeded Azure's timeout limits
   - Motia's build process during container startup caused timeouts
   - Commit 94ac217 specifically addresses "Azure deployment timeout" issues

4. **Module Resolution Issues**
   - Node.js module resolution failed in containerized environment
   - Required manual copying of pnpm modules (commits a31e148, 8df9f23)
   - Symlink issues in container filesystem

### Current Approach: App Service Deployment

We switched to Azure App Service deployment which provides:

1. **Better Node.js Support**
   - Native Node.js runtime with proper module resolution
   - Built-in support for npm/pnpm workflows
   - Persistent filesystem for `.motia` directory

2. **Simpler Deployment Process**
   - ZIP deployment with automatic extraction
   - Built-in build and deployment pipelines
   - No need for container registry management

3. **Cost Effectiveness**
   - App Service Basic tier is more cost-effective than Container Instances
   - Better resource utilization
   - Automatic scaling options available

4. **Proven Stability**
   - Successfully deployed and running in production
   - Faster deployment times
   - Better logging and diagnostics

## Deployment Scripts

### 1. deploy-azure.sh

Main deployment script that:
- Creates Azure resources (Resource Group, App Service Plan)
- Builds applications locally
- Creates deployment packages with startup scripts
- Deploys to Azure App Service using ZIP deployment
- Configures basic app settings

**Usage:**
```bash
# Full deployment
./scripts/deploy-azure.sh

# Skip build (if already built)
./scripts/deploy-azure.sh --skip-build

# Deploy only backend
./scripts/deploy-azure.sh --backend-only

# Deploy only frontend
./scripts/deploy-azure.sh --frontend-only
```

### 2. set-azure-secrets.sh

Separate script for managing secrets that:
- Reads local .env files
- Sets Azure App Service environment variables
- Never exposes secrets in logs or command history
- Supports dry-run mode for verification
- Automatically masks sensitive values

**Usage:**
```bash
# Set secrets for both apps
./scripts/set-azure-secrets.sh

# Dry run to see what would be set
./scripts/set-azure-secrets.sh --dry-run

# Set only backend secrets
./scripts/set-azure-secrets.sh --backend-only

# Use custom env file
./scripts/set-azure-secrets.sh --backend-env .env.production

# Verbose mode (still masks sensitive values)
./scripts/set-azure-secrets.sh --verbose
```

## Security Best Practices

### Secret Management

1. **Separation of Concerns**
   - Code deployment is separate from secret configuration
   - Secrets are never included in deployment packages
   - Local .env files are used as the source of truth

2. **Secret Protection**
   - Secrets are masked in all output
   - No secrets in command history
   - Azure CLI handles secure transmission
   - App settings are encrypted at rest in Azure

3. **Deployment Workflow**
   ```bash
   # Step 1: Deploy code (no secrets)
   ./scripts/deploy-azure.sh

   # Step 2: Configure secrets from local .env
   ./scripts/set-azure-secrets.sh

   # Step 3: Verify deployment
   curl https://finagent-backend-pps457j4wjrc6.azurewebsites.net/health
   ```

### Environment Files Structure

```
apps/
├── backend/
│   ├── .env              # Local development secrets (git ignored)
│   ├── .env.example      # Template with dummy values (committed)
│   └── .env.production   # Production secrets (git ignored)
└── web/
    ├── .env              # Local development secrets (git ignored)
    ├── .env.example      # Template with dummy values (committed)
    └── .env.production   # Production secrets (git ignored)
```

## Migration Path (If Needed)

If we need to migrate back to containers in the future:

1. **Use App Service Containers**
   - App Service supports container deployment
   - Provides same benefits with container flexibility
   - Easier migration path than Container Instances

2. **Consider Azure Kubernetes Service (AKS)**
   - Better container orchestration
   - More mature ecosystem
   - Better support for complex deployments

3. **Address Root Causes**
   - Pre-build Motia in Docker image
   - Use multi-stage builds to optimize
   - Include all dependencies in image

## Monitoring and Maintenance

### Health Checks

Backend health endpoint:
```bash
curl https://finagent-backend-pps457j4wjrc6.azurewebsites.net/health
```

### View Logs

```bash
# Backend logs
az webapp log tail \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg

# Frontend logs
az webapp log tail \
  --name finagent-web-pps457j4wjrc6 \
  --resource-group finagent-rg
```

### Update Secrets

```bash
# Update specific secret
az webapp config appsettings set \
  --name finagent-backend-pps457j4wjrc6 \
  --resource-group finagent-rg \
  --settings OPENAI_API_KEY="new-key-value"

# Or use the script
./scripts/set-azure-secrets.sh --backend-only
```

## Cost Optimization

### Current Setup
- **App Service Plan**: Basic B2 (2 cores, 3.5 GB RAM)
- **Estimated Cost**: ~$55/month per app
- **Total**: ~$110/month for both apps

### Optimization Options
1. Use single App Service Plan for both apps
2. Scale down to B1 during low traffic
3. Use Azure Front Door for caching
4. Implement auto-scaling rules

## Troubleshooting

### Common Issues and Solutions

1. **Deployment Fails**
   ```bash
   # Check deployment logs
   az webapp log deployment show \
     --name finagent-backend-pps457j4wjrc6 \
     --resource-group finagent-rg
   ```

2. **App Won't Start**
   ```bash
   # Check startup logs
   az webapp log tail \
     --name finagent-backend-pps457j4wjrc6 \
     --resource-group finagent-rg \
     --filter Error
   ```

3. **Module Not Found Errors**
   ```bash
   # Redeploy with full node_modules
   ./scripts/deploy-azure.sh --verbose
   ```

4. **Motia Initialization Issues**
   ```bash
   # SSH into app and run manually
   az webapp ssh \
     --name finagent-backend-pps457j4wjrc6 \
     --resource-group finagent-rg

   # In SSH session:
   cd /home/site/wwwroot
   npx motia install
   ```

## Conclusion

While container deployment offers benefits in terms of consistency and portability, Azure App Service provides a more stable and cost-effective solution for our Motia-based application. The deployment scripts ensure a clean separation between code deployment and secret management, maintaining security while simplifying the deployment process.