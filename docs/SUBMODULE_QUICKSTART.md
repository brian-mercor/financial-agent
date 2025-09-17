# TradingView Submodule Quick Start

## For Developers

### First Time Setup
When you clone the repository for the first time:

```bash
# Clone with submodules
git clone --recursive git@github.com:yourorg/finagent2.git

# OR if you already cloned without --recursive
git submodule init
git submodule update
```

### Daily Development
The submodule acts like a regular directory, but it's actually a separate Git repository:

```bash
# Pull latest changes including submodule updates
git pull
git submodule update

# OR do both in one command
git pull --recurse-submodules
```

### Updating the TradingView Library
If you need to update the library version:

```bash
cd apps/web/public/charting_library
git pull origin master
cd -
git add apps/web/public/charting_library
git commit -m "chore: update TradingView library"
```

## For CI/CD

### GitHub Actions
Already configured! The workflow uses:
```yaml
- uses: actions/checkout@v4
  with:
    submodules: recursive
```

### Manual Deployment
If deploying manually, run:
```bash
./scripts/init-submodules.sh
```

## Troubleshooting

### "Permission denied" error
You need access to the private repository. Contact the repo admin.

### Submodule is empty
```bash
git submodule update --init --recursive
```

### Can't push changes to submodule
You need write access to `git@github.com:brianyang/charting_library.git`

### Reduce library size
Run the pruning script to remove unnecessary language bundles:
```bash
./scripts/prune-submodule-library.sh
```

## Security Notes
- The `brianyang/charting_library` repository must remain **PRIVATE**
- Never commit the library files directly to the main repo
- Use deploy keys for CI/CD, not personal access tokens when possible