# Azure Cost Analysis - Detailed Breakdown

## Current Monthly Costs (App Service)

### Production Environment
```
Backend App Service (B2):           $55.00/month
Frontend App Service (B2):          $55.00/month  
Azure Container Registry (Basic):   $5.00/month
Application Insights:               $0.00/month (free tier)
----------------------------------------
TOTAL:                             $115.00/month
```

## Proposed Costs (Container Apps)

### Scenario 1: Minimum Configuration (Dev/Staging)
```
Container Apps:
  - vCPU (0.25):        0.25 × $62.21 = $15.55/month
  - Memory (0.5 GiB):   0.5 × $12.96 = $6.48/month
  - Scale to zero:     -80% (idle 20hrs/day) = $4.41/month
Azure Container Registry:            $5.00/month
----------------------------------------
TOTAL:                              $9.41/month (92% savings)
```

### Scenario 2: Standard Configuration (Production)
```
Container Apps:
  - vCPU (1.0):         1.0 × $62.21 = $62.21/month
  - Memory (2.0 GiB):   2.0 × $12.96 = $25.92/month
  - Scale to zero:     -60% (idle 14hrs/day) = $35.24/month
Azure Container Registry:            $5.00/month
----------------------------------------
TOTAL:                              $40.24/month (65% savings)
```

### Scenario 3: High Availability (Peak Traffic)
```
Container Apps:
  - vCPU (2.0):         2.0 × $62.21 = $124.42/month
  - Memory (4.0 GiB):   4.0 × $12.96 = $51.84/month
  - Auto-scaling:      Avg 2 replicas = $176.26/month
  - Scale down nights: -30% = $123.38/month
Azure Container Registry:            $5.00/month
Azure Front Door (Caching):          $35.00/month
----------------------------------------
TOTAL:                              $163.38/month (but handles 10x traffic)
```

## Real-World Cost Examples

### Startup (< 1000 users/day)
```
Container Apps (scale-to-zero):     $10-15/month
App Service (always on):            $110/month
Savings: $95-100/month (90%)
```

### Growth Stage (10,000 users/day)
```
Container Apps (auto-scale):        $40-60/month
App Service (manual scale):         $110-220/month
Savings: $70-160/month (64-73%)
```

### Scale Stage (100,000 users/day)
```
Container Apps (multi-replica):     $150-200/month
App Service (P2V2 × 4):            $600/month
Savings: $400-450/month (67-75%)
```

## Hidden Costs Comparison

### App Service Hidden Costs
- **No auto-scaling in Basic**: Need Premium for auto-scale (+$200/month)
- **SSL certificates**: $70/year for custom domains
- **Deployment slots**: Only in Standard tier (+$75/month)
- **Always running**: Paying for idle time (nights/weekends)

### Container Apps Hidden Costs
- **Container Registry**: $5/month (Basic tier)
- **Bandwidth**: $0.087/GB after 5GB free
- **Log Analytics**: Free for first 5GB/month
- **Build time**: ACR build tasks ~$0.10 per build

## Cost Optimization Tips

### 1. Implement Scale-to-Zero
```yaml
scale:
  minReplicas: 0  # Critical for cost savings
  maxReplicas: 5
  rules:
    - name: http-scaling
      http:
        metadata:
          concurrentRequests: "10"
```
**Savings**: 70-90% during off-hours

### 2. Right-Size Resources
```bash
# Monitor actual usage
az monitor metrics list \
  --resource /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.App/containerApps/{app} \
  --metric CPUUsageNormalized \
  --aggregation Average

# Adjust based on metrics
az containerapp update \
  --name app \
  --cpu 0.5 \
  --memory 1.0
```
**Savings**: 50% if over-provisioned

### 3. Use Consumption Tier (When Available)
```bash
# Future: Consumption tier
az containerapp create \
  --tier Consumption  # Coming soon
  --pay-per-request   # Like AWS Lambda
```
**Estimated**: <$5/month for low traffic

## Break-Even Analysis

### When to Use Each Service

**Use App Service when:**
- Traffic is constant 24/7 (no idle time)
- Need Windows containers
- Require legacy .NET framework
- Want simplest possible setup

**Use Container Apps when:**
- Traffic has peaks and valleys (most apps)
- Need auto-scaling (traffic spikes)
- Want to save money (80% cheaper)
- Need modern container features
- Want Kubernetes without complexity

### Traffic Break-Even Points
```
Daily Requests | App Service | Container Apps | Winner
-------------- | ----------- | -------------- | -------
< 1,000        | $110/mo     | $10/mo         | Container Apps (-91%)
10,000         | $110/mo     | $20/mo         | Container Apps (-82%)
100,000        | $110/mo     | $40/mo         | Container Apps (-64%)
1,000,000      | $220/mo*    | $120/mo        | Container Apps (-45%)
10,000,000     | $600/mo**   | $400/mo        | Container Apps (-33%)

* Requires scaling to Standard tier
** Requires Premium tier with multiple instances
```

## Annual Cost Projection

### Current Setup (App Service)
```
Year 1:  $1,380 ($115 × 12)
Year 2:  $1,380
Year 3:  $1,380
----------------------------------------
3-Year Total: $4,140
```

### Proposed Setup (Container Apps)
```
Year 1:  $480 ($40 × 12)
Year 2:  $480
Year 3:  $480
----------------------------------------
3-Year Total: $1,440
3-Year Savings: $2,700 (65%)
```

## ROI of Migration

### Migration Costs
- Developer time: 8 hours @ $150/hr = $1,200
- Testing: 4 hours @ $150/hr = $600
- Total one-time cost: $1,800

### Payback Period
- Monthly savings: $75
- Payback period: 24 months
- 3-year ROI: 150%

## Detailed Pricing Formulas

### Container Apps Pricing
```
Monthly Cost = (vCPU × $62.21) + (Memory × $12.96) × Utilization%

Where:
- vCPU price: $0.000024/vCPU-second
- Memory price: $0.0000025/GiB-second
- Utilization: % of time running (100% - idle%)
```

### App Service Pricing
```
Monthly Cost = Tier Price × Number of Instances

Tiers:
- B1 (1 core, 1.75 GB): $55/month
- B2 (2 cores, 3.5 GB): $110/month
- S1 (1 core, 1.75 GB): $146/month
- P1V3 (2 cores, 8 GB): $203/month
```

## Recommendations by Budget

### < $20/month Budget
✅ **Container Apps with scale-to-zero**
- 0.25 vCPU, 0.5 GiB memory
- Perfect for MVPs and prototypes

### $20-100/month Budget
✅ **Container Apps standard**
- 1 vCPU, 2 GiB memory
- Auto-scaling 1-5 replicas
- Handles most production workloads

### $100-500/month Budget
✅ **Container Apps with CDN**
- 2 vCPU, 4 GiB memory
- Azure Front Door for caching
- Multi-region deployment

### > $500/month Budget
Consider:
- Azure Kubernetes Service (AKS)
- Multiple Container Apps environments
- Global deployment with Traffic Manager

## Conclusion

**Container Apps offers 65-90% cost savings** compared to App Service for typical workloads, with better performance and scalability. The only scenario where App Service might be cheaper is for applications with perfectly constant 24/7 traffic and no need for scaling - which is rare in practice.