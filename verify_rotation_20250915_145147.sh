#!/bin/bash
# Verification script for secret rotation

echo "Verifying secret rotation..."

# Test GitHub secrets exist (not values)
echo "GitHub Secrets:"
gh secret list --repo $REPO_NAME

# Test Azure Key Vault secrets exist
echo -e "\nAzure Key Vault Secrets:"
az keyvault secret list --vault-name $KEY_VAULT_NAME --query "[].name" -o tsv

# Test endpoints
echo -e "\nTesting endpoints..."
curl -s -o /dev/null -w "Backend: %{http_code}\n" https://finagent-backend.azurewebsites.net/health || echo "Backend: Failed"
curl -s -o /dev/null -w "Frontend: %{http_code}\n" https://finagent-web.azurewebsites.net || echo "Frontend: Failed"

echo -e "\nVerification complete!"
