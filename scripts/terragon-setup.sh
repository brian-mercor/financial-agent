#!/usr/bin/env bash
# terragon-setup.sh - Setup env files for Turbo monorepo apps in sandbox
# This script copies a single env source into per-app .env/.env.local files
# so backend and frontends can find their variables.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")"/.. && pwd)"

# Optional: path to a single env file provided by the sandbox.
# If not set, we try common names at repo root.
TERRAGON_ENV_FILE="${TERRAGON_ENV_FILE:-}"

if [[ -z "${TERRAGON_ENV_FILE}" ]]; then
  for candidate in \
    ".env.production" \
    ".env" \
    ".env.local" \
    ".env.shared" \
    ".env.terragon"; do
    if [[ -f "${REPO_ROOT}/${candidate}" ]]; then
      TERRAGON_ENV_FILE="${REPO_ROOT}/${candidate}"
      break
    fi
  done
fi

# If still not found, allow running purely from current process env.
if [[ -n "${TERRAGON_ENV_FILE}" && -f "${TERRAGON_ENV_FILE}" ]]; then
  echo "Using env file: ${TERRAGON_ENV_FILE}"
  # Export all vars from the file into the current environment
  set -a
  # shellcheck disable=SC1090
  source "${TERRAGON_ENV_FILE}"
  set +a
else
  echo "No local env file found. Proceeding with current process environment."
fi

# Helper: write selected env vars to a target file
write_env_file() {
  local target_file="$1"; shift
  local patterns=("$@")

  mkdir -p "$(dirname "${target_file}")"
  : > "${target_file}"

  # Compose a single regex from provided patterns
  local regex
  regex="$(IFS='|'; echo "${patterns[*]}")"

  # Iterate environment and filter keys matching regex
  # Preserve order; avoid exporting noisy OS vars
  while IFS='=' read -r key val; do
    if [[ "${key}" =~ ${regex} ]]; then
      printf '%s=%s\n' "${key}" "${val}" >> "${target_file}"
    fi
  done < <(env | sort)
}

# Helper: ensure frontend-specific mappings exist
augment_frontend_env() {
  # Map BACKEND_URL -> NEXT_PUBLIC_API_URL if missing
  if [[ -n "${BACKEND_URL:-}" && -z "${NEXT_PUBLIC_API_URL:-}" ]]; then
    export NEXT_PUBLIC_API_URL="${BACKEND_URL}"
  fi

  # Mirror NEXT_PUBLIC_SUPABASE_* to VITE_SUPABASE_* if those are missing
  if [[ -n "${NEXT_PUBLIC_SUPABASE_URL:-}" && -z "${VITE_SUPABASE_URL:-}" ]]; then
    export VITE_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
  fi
  if [[ -n "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" && -z "${VITE_SUPABASE_ANON_KEY:-}" ]]; then
    export VITE_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
  fi
}

# Patterns to include per app (based on turbo.json env passthrough)
BACKEND_PATTERNS=(
  '^NODE_ENV$' '^PORT$' '^REDIS_' '^SUPABASE_' '^PLAID_' '^POLYGON_API_KEY$' '^ALPACA_'
  '^OPENAI_API_KEY$' '^ANTHROPIC_API_KEY$' '^GROQ_API_KEY$' '^MEM0_'
)
FRONTEND_PATTERNS=(
  '^NODE_ENV$' '^NEXT_PUBLIC_' '^VITE_' '^BACKEND_URL$'
)

echo "Creating per-app env files..."

# Backend: apps/backend/.env
write_env_file "${REPO_ROOT}/apps/backend/.env" "${BACKEND_PATTERNS[@]}"
echo "  - wrote apps/backend/.env"

# Frontend (Next): apps/web/.env.local
augment_frontend_env
write_env_file "${REPO_ROOT}/apps/web/.env.local" "${FRONTEND_PATTERNS[@]}"
echo "  - wrote apps/web/.env.local"

# Other web-* variants: create .env (many are Vite-based)
for appdir in "${REPO_ROOT}"/apps/web-*; do
  [[ -d "${appdir}" ]] || continue
  augment_frontend_env
  write_env_file "${appdir}/.env" "${FRONTEND_PATTERNS[@]}"
  echo "  - wrote ${appdir}/.env"
done

# Optional landing pages (Astro/Next): include NEXT_PUBLIC_* if present
if [[ -d "${REPO_ROOT}/apps/finagent-landing" ]]; then
  augment_frontend_env
  write_env_file "${REPO_ROOT}/apps/finagent-landing/.env" "${FRONTEND_PATTERNS[@]}"
  echo "  - wrote apps/finagent-landing/.env"
fi

echo "Setup complete!"