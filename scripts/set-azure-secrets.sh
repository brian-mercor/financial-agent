#!/bin/bash

# Azure Secrets Configuration Script
# This script sets Azure App Service environment variables from local .env files
# Usage: ./set-azure-secrets.sh [options]
# Options:
#   --backend-env <file>   Path to backend .env file (default: apps/backend/.env)
#   --frontend-env <file>  Path to frontend .env file (default: apps/web/.env)
#   --backend-only         Set secrets only for backend
#   --frontend-only        Set secrets only for frontend
#   --dry-run              Show what would be set without making changes
#   --verbose              Enable verbose output

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="finagent-rg"
BACKEND_APP="finagent-backend-pps457j4wjrc6"
FRONTEND_APP="finagent-web-pps457j4wjrc6"

# Default paths
BACKEND_ENV="apps/backend/.env"
FRONTEND_ENV="apps/web/.env"

# Options
SET_BACKEND=true
SET_FRONTEND=true
DRY_RUN=false
VERBOSE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-env)
            BACKEND_ENV="$2"
            shift 2
            ;;
        --frontend-env)
            FRONTEND_ENV="$2"
            shift 2
            ;;
        --backend-only)
            SET_FRONTEND=false
            shift
            ;;
        --frontend-only)
            SET_BACKEND=false
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --backend-env <file>   Path to backend .env file (default: apps/backend/.env)"
            echo "  --frontend-env <file>  Path to frontend .env file (default: apps/web/.env)"
            echo "  --backend-only         Set secrets only for backend"
            echo "  --frontend-only        Set secrets only for frontend"
            echo "  --dry-run              Show what would be set without making changes"
            echo "  --verbose              Enable verbose output"
            echo "  --help                 Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if Azure CLI is installed
check_azure_cli() {
    if ! command -v az &> /dev/null; then
        print_message "$RED" "Azure CLI is not installed. Please install it first."
        exit 1
    fi
}

# Function to check Azure login
check_azure_login() {
    if ! az account show &> /dev/null; then
        print_message "$YELLOW" "Not logged in to Azure. Logging in..."
        az login
    fi
}

# Function to parse .env file
parse_env_file() {
    local env_file=$1
    local -n result=$2  # Use nameref to return associative array

    if [ ! -f "$env_file" ]; then
        print_message "$RED" "Environment file not found: $env_file"
        return 1
    fi

    while IFS= read -r line; do
        # Skip comments and empty lines
        if [[ -z "$line" ]] || [[ "$line" =~ ^[[:space:]]*# ]]; then
            continue
        fi

        # Parse KEY=VALUE pairs
        if [[ "$line" =~ ^([A-Z_][A-Z0-9_]*)=(.*)$ ]]; then
            local key="${BASH_REMATCH[1]}"
            local value="${BASH_REMATCH[2]}"

            # Remove surrounding quotes if present
            value="${value%\"}"
            value="${value#\"}"
            value="${value%\'}"
            value="${value#\'}"

            result["$key"]="$value"

            if [ "$VERBOSE" = true ]; then
                # Mask sensitive values in verbose output
                if [[ "$key" =~ (KEY|SECRET|PASSWORD|TOKEN) ]]; then
                    print_message "$MAGENTA" "  Found: $key=***MASKED***"
                else
                    print_message "$MAGENTA" "  Found: $key=${value:0:20}..."
                fi
            fi
        fi
    done < "$env_file"
}

# Function to set app settings
set_app_settings() {
    local app_name=$1
    local -n env_vars=$2  # Use nameref to access associative array
    local app_type=$3

    print_message "$BLUE" "Processing $app_type environment variables..."

    # Build settings string
    local settings=""
    local count=0

    # List of sensitive keys that should be masked in output
    local sensitive_patterns="KEY|SECRET|PASSWORD|TOKEN|CREDENTIAL"

    for key in "${!env_vars[@]}"; do
        local value="${env_vars[$key]}"

        # Skip empty values
        if [ -z "$value" ]; then
            continue
        fi

        # Add to settings string
        if [ -n "$settings" ]; then
            settings="$settings "
        fi
        settings="${settings}${key}=\"${value}\""
        ((count++))

        # Display what will be set
        if [[ "$key" =~ $sensitive_patterns ]]; then
            print_message "$YELLOW" "  Setting: $key=***MASKED***"
        else
            if [ "$VERBOSE" = true ]; then
                print_message "$YELLOW" "  Setting: $key=${value:0:50}..."
            else
                print_message "$YELLOW" "  Setting: $key"
            fi
        fi
    done

    if [ $count -eq 0 ]; then
        print_message "$YELLOW" "No environment variables to set for $app_type"
        return 0
    fi

    print_message "$BLUE" "Found $count environment variables to set"

    if [ "$DRY_RUN" = true ]; then
        print_message "$MAGENTA" "DRY RUN: Would set $count environment variables for $app_name"
    else
        # Set all app settings at once
        print_message "$BLUE" "Updating Azure App Service settings for $app_name..."

        # Use eval to expand the settings string properly
        eval "az webapp config appsettings set \
            --name $app_name \
            --resource-group $RESOURCE_GROUP \
            --settings $settings \
            --output none"

        if [ $? -eq 0 ]; then
            print_message "$GREEN" "Successfully set $count environment variables for $app_type"
        else
            print_message "$RED" "Failed to set environment variables for $app_type"
            return 1
        fi
    fi
}

# Function to verify app exists
verify_app_exists() {
    local app_name=$1
    local app_type=$2

    if ! az webapp show --name $app_name --resource-group $RESOURCE_GROUP &> /dev/null; then
        print_message "$RED" "$app_type app '$app_name' does not exist in resource group '$RESOURCE_GROUP'"
        print_message "$YELLOW" "Please run ./deploy-azure.sh first to create the app"
        return 1
    fi
}

# Function to create example .env file
create_example_env() {
    local env_file=$1
    local app_type=$2

    print_message "$YELLOW" "Creating example $app_type .env file at $env_file.example"

    if [ "$app_type" = "backend" ]; then
        cat > "$env_file.example" << 'EOF'
# Node Environment
NODE_ENV=production
PORT=3001

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Financial APIs
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
PLAID_ENV=sandbox
POLYGON_API_KEY=your-polygon-api-key
ALPACA_API_KEY=your-alpaca-api-key
ALPACA_SECRET_KEY=your-alpaca-secret-key

# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GROQ_API_KEY=your-groq-api-key

# Memory Service
MEM0_API_KEY=your-mem0-api-key
MEM0_ENDPOINT=https://api.mem0.ai

# Cache
REDIS_URL=redis://your-redis-url:6379
EOF
    else
        cat > "$env_file.example" << 'EOF'
# Node Environment
NODE_ENV=production

# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.azurewebsites.net

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EOF
    fi

    print_message "$GREEN" "Example file created. Copy it to $env_file and fill in your values."
}

# Main execution
main() {
    print_message "$BLUE" "========================================="
    print_message "$BLUE" "Azure Secrets Configuration Script"
    print_message "$BLUE" "========================================="

    # Check prerequisites
    check_azure_cli
    check_azure_login

    if [ "$DRY_RUN" = true ]; then
        print_message "$MAGENTA" "Running in DRY RUN mode - no changes will be made"
    fi

    # Process backend secrets
    if [ "$SET_BACKEND" = true ]; then
        print_message "$BLUE" "\nConfiguring Backend Secrets..."
        print_message "$BLUE" "========================================="

        # Verify app exists
        if ! verify_app_exists "$BACKEND_APP" "Backend"; then
            exit 1
        fi

        # Check if env file exists
        if [ ! -f "$BACKEND_ENV" ]; then
            print_message "$YELLOW" "Backend .env file not found: $BACKEND_ENV"
            create_example_env "$BACKEND_ENV" "backend"
            print_message "$RED" "Please create $BACKEND_ENV with your secrets and run again"
            exit 1
        fi

        # Parse backend env file
        declare -A backend_vars
        parse_env_file "$BACKEND_ENV" backend_vars

        # Set backend app settings
        set_app_settings "$BACKEND_APP" backend_vars "Backend"

        # Restart app if not dry run
        if [ "$DRY_RUN" = false ]; then
            print_message "$BLUE" "Restarting backend app..."
            az webapp restart --name $BACKEND_APP --resource-group $RESOURCE_GROUP
        fi
    fi

    # Process frontend secrets
    if [ "$SET_FRONTEND" = true ]; then
        print_message "$BLUE" "\nConfiguring Frontend Secrets..."
        print_message "$BLUE" "========================================="

        # Verify app exists
        if ! verify_app_exists "$FRONTEND_APP" "Frontend"; then
            exit 1
        fi

        # Check if env file exists
        if [ ! -f "$FRONTEND_ENV" ]; then
            print_message "$YELLOW" "Frontend .env file not found: $FRONTEND_ENV"
            create_example_env "$FRONTEND_ENV" "frontend"
            print_message "$RED" "Please create $FRONTEND_ENV with your secrets and run again"
            exit 1
        fi

        # Parse frontend env file
        declare -A frontend_vars
        parse_env_file "$FRONTEND_ENV" frontend_vars

        # Add backend URL if not present
        if [ -z "${frontend_vars[NEXT_PUBLIC_API_URL]}" ]; then
            frontend_vars[NEXT_PUBLIC_API_URL]="https://${BACKEND_APP}.azurewebsites.net"
            print_message "$YELLOW" "  Auto-setting: NEXT_PUBLIC_API_URL=https://${BACKEND_APP}.azurewebsites.net"
        fi

        # Set frontend app settings
        set_app_settings "$FRONTEND_APP" frontend_vars "Frontend"

        # Restart app if not dry run
        if [ "$DRY_RUN" = false ]; then
            print_message "$BLUE" "Restarting frontend app..."
            az webapp restart --name $FRONTEND_APP --resource-group $RESOURCE_GROUP
        fi
    fi

    print_message "$GREEN" "\n========================================="
    if [ "$DRY_RUN" = true ]; then
        print_message "$MAGENTA" "DRY RUN completed - no changes were made"
        print_message "$YELLOW" "Remove --dry-run flag to apply changes"
    else
        print_message "$GREEN" "Secrets configuration completed successfully!"
        print_message "$GREEN" "Your apps have been restarted with new settings"
    fi
    print_message "$GREEN" "========================================="

    # Show app URLs
    if [ "$SET_BACKEND" = true ]; then
        print_message "$BLUE" "Backend: https://${BACKEND_APP}.azurewebsites.net"
    fi
    if [ "$SET_FRONTEND" = true ]; then
        print_message "$BLUE" "Frontend: https://${FRONTEND_APP}.azurewebsites.net"
    fi

    # Security reminder
    print_message "$YELLOW" "\nSecurity Reminders:"
    print_message "$YELLOW" "1. Never commit .env files to version control"
    print_message "$YELLOW" "2. Rotate API keys regularly"
    print_message "$YELLOW" "3. Use Azure Key Vault for production secrets"
    print_message "$YELLOW" "4. Enable audit logging for secret access"
}

# Run main function
main