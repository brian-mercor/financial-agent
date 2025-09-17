# TradingView Library Private Submodule Setup

## Overview
The TradingView charting library is proprietary software that cannot be stored in public repositories. This document explains how we handle it using a private Git submodule.

## Architecture
```
main-repo (public/private)
├── apps/
│   ├── web/
│   │   └── public/
│   │       └── charting_library/ -> [SUBMODULE: private repo]
│   ├── web-a/
│   └── web-b/
```

## Setup Instructions

### Option 1: Private Git Submodule (Recommended)

1. **Create Private Repository**
   ```bash
   # Create a new private GitHub repo: [your-username]/finagent-tradingview-library
   # Do NOT initialize with any files
   ```

2. **Move Library to Private Repo**
   ```bash
   # Copy library to temporary location
   cp -r apps/web/public/charting_library /tmp/tradingview-temp
   
   # Initialize as Git repo
   cd /tmp/tradingview-temp
   git init
   git add .
   git commit -m "Initial commit: TradingView charting library"
   git remote add origin git@github.com:[your-username]/finagent-tradingview-library.git
   git push -u origin main
   ```

3. **Remove from Main Repo History**
   ```bash
   # Remove from current working tree
   rm -rf apps/web/public/charting_library
   
   # Remove from Git history (WARNING: This rewrites history!)
   git filter-branch --force --index-filter \
     'git rm -rf --cached --ignore-unmatch apps/web/public/charting_library' \
     --prune-empty --tag-name-filter cat -- --all
   ```

4. **Add as Submodule**
   ```bash
   # Add the private repo as a submodule
   git submodule add git@github.com:[your-username]/finagent-tradingview-library.git \
     apps/web/public/charting_library
   
   # Initialize and update
   git submodule init
   git submodule update
   ```

5. **Update GitHub Actions**
   ```yaml
   # In .github/workflows/azure-deploy.yml
   - name: Checkout code
     uses: actions/checkout@v4
     with:
       submodules: recursive
       token: ${{ secrets.TRADINGVIEW_REPO_TOKEN }}
   ```

6. **Setup GitHub Secrets**
   - Create a Personal Access Token with `repo` scope
   - Add as `TRADINGVIEW_REPO_TOKEN` in GitHub Secrets

### Option 2: Build-Time Download (Alternative)

1. **Store in Secure Location**
   ```bash
   # Upload to Azure Blob Storage or private npm registry
   # Store the URL and access token in GitHub Secrets
   ```

2. **Download During Build**
   ```yaml
   # In GitHub Actions
   - name: Download TradingView Library
     run: |
       curl -H "Authorization: ${{ secrets.TRADINGVIEW_TOKEN }}" \
         -o charting_library.tar.gz \
         "${{ secrets.TRADINGVIEW_URL }}"
       tar -xzf charting_library.tar.gz -C apps/web/public/
   ```

3. **Add to .gitignore**
   ```gitignore
   # TradingView library (downloaded during build)
   **/charting_library/
   ```

## For Team Members

### Initial Setup
```bash
# Clone with submodules
git clone --recursive [repo-url]

# Or if already cloned
git submodule init
git submodule update
```

### Updating Submodule
```bash
# Pull latest from submodule
cd apps/web/public/charting_library
git pull origin main
cd -
git add apps/web/public/charting_library
git commit -m "chore: update TradingView library"
```

## Deployment Configuration

### Azure App Service
The deployment will automatically handle submodules if configured correctly in GitHub Actions.

### Vercel/Netlify
Add build command:
```bash
git submodule update --init --recursive && npm run build
```

## Security Notes

1. **Never commit the library directly** - Always use submodule
2. **Restrict access** - Only give team members who need it access to the private repo
3. **Use tokens for CI/CD** - Don't use personal SSH keys in CI/CD
4. **Regular audits** - Check that the library isn't accidentally committed

## Troubleshooting

### Submodule not found
```bash
git submodule update --init --recursive
```

### Permission denied
- Check you have access to the private repository
- For CI/CD, ensure the token has correct permissions

### Library missing in deployment
- Verify submodules are initialized in deployment script
- Check that deployment service has access to private repo

## Rollback Plan

If you need to rollback the submodule approach:
```bash
# Remove submodule
git submodule deinit apps/web/public/charting_library
git rm apps/web/public/charting_library
rm -rf .git/modules/apps/web/public/charting_library

# Copy library back (from backup)
cp -r /backup/location/charting_library apps/web/public/
```

## Contact
For access to the private TradingView repository, contact the repository admin.