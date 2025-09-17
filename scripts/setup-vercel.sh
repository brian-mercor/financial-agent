#!/bin/bash

# Vercel Setup Script
# This script helps set up and deploy frontend apps to Vercel
# Usage: ./setup-vercel.sh [app-name]

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_message "$YELLOW" "Vercel CLI is not installed. Installing..."
        npm i -g vercel
    else
        print_message "$GREEN" "Vercel CLI is installed"
    fi
}

# Function to set up Vercel project
setup_vercel_project() {
    local app_path=$1
    local app_name=$2

    print_message "$BLUE" "Setting up Vercel project for ${app_name}..."

    cd $app_path

    # Check if already linked to a Vercel project
    if [ -f ".vercel/project.json" ]; then
        print_message "$YELLOW" "Project already linked to Vercel"
        read -p "Do you want to relink? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return
        fi
    fi

    # Link to Vercel project
    print_message "$BLUE" "Linking to Vercel project..."
    vercel link

    cd - > /dev/null
}

# Function to set environment variables
set_vercel_env() {
    local app_path=$1
    local app_name=$2

    print_message "$BLUE" "Setting environment variables for ${app_name}..."

    cd $app_path

    # Get backend URL
    BACKEND_URL=${BACKEND_URL:-"https://finagent-backend-pps457j4wjrc6.azurewebsites.net"}

    print_message "$YELLOW" "Backend URL: ${BACKEND_URL}"

    # Set production environment variables
    print_message "$BLUE" "Setting production environment variables..."

    if [ "$app_name" = "web" ]; then
        # Main app environment variables
        vercel env add NEXT_PUBLIC_API_URL production <<< "$BACKEND_URL"

        # Prompt for Supabase credentials
        print_message "$YELLOW" "Enter Supabase URL (or press Enter to skip):"
        read -r SUPABASE_URL
        if [ -n "$SUPABASE_URL" ]; then
            vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$SUPABASE_URL"
        fi

        print_message "$YELLOW" "Enter Supabase Anon Key (or press Enter to skip):"
        read -r SUPABASE_ANON_KEY
        if [ -n "$SUPABASE_ANON_KEY" ]; then
            vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"
        fi
    elif [ "$app_name" = "finagent-landing" ]; then
        # Landing page environment variables
        vercel env add NEXT_PUBLIC_API_URL production <<< "$BACKEND_URL"

        # Get the main app URL
        print_message "$YELLOW" "Enter main app URL (e.g., https://finagent.vercel.app):"
        read -r APP_URL
        if [ -n "$APP_URL" ]; then
            vercel env add NEXT_PUBLIC_APP_URL production <<< "$APP_URL"
        fi
    fi

    # Also set for preview deployments
    print_message "$BLUE" "Setting preview environment variables..."
    vercel env add NEXT_PUBLIC_API_URL preview <<< "$BACKEND_URL"

    print_message "$GREEN" "Environment variables configured"

    cd - > /dev/null
}

# Function to deploy to Vercel
deploy_to_vercel() {
    local app_path=$1
    local app_name=$2
    local env=${3:-"production"}

    print_message "$BLUE" "Deploying ${app_name} to Vercel (${env})..."

    cd $app_path

    if [ "$env" = "production" ]; then
        vercel --prod
    else
        vercel
    fi

    cd - > /dev/null
}

# Main function
main() {
    print_message "$BLUE" "========================================="
    print_message "$BLUE" "Vercel Setup and Deployment Script"
    print_message "$BLUE" "========================================="

    # Check Vercel CLI
    check_vercel_cli

    # Check if logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_message "$YELLOW" "Not logged in to Vercel. Logging in..."
        vercel login
    fi

    # Determine which app to deploy
    APP_NAME=${1:-""}

    if [ -z "$APP_NAME" ]; then
        print_message "$YELLOW" "Which app would you like to deploy?"
        print_message "$YELLOW" "1) Main App (apps/web)"
        print_message "$YELLOW" "2) Landing Page (apps/finagent-landing)"
        print_message "$YELLOW" "3) Both"
        read -p "Enter choice (1-3): " choice

        case $choice in
            1)
                APPS=("web")
                ;;
            2)
                APPS=("finagent-landing")
                ;;
            3)
                APPS=("web" "finagent-landing")
                ;;
            *)
                print_message "$RED" "Invalid choice"
                exit 1
                ;;
        esac
    else
        APPS=("$APP_NAME")
    fi

    # Process each app
    for app in "${APPS[@]}"; do
        APP_PATH="apps/${app}"

        if [ ! -d "$APP_PATH" ]; then
            print_message "$RED" "App directory not found: $APP_PATH"
            continue
        fi

        print_message "$BLUE" "\n========================================="
        print_message "$BLUE" "Processing: ${app}"
        print_message "$BLUE" "========================================="

        # Setup Vercel project
        setup_vercel_project "$APP_PATH" "$app"

        # Set environment variables
        read -p "Do you want to set environment variables? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            set_vercel_env "$APP_PATH" "$app"
        fi

        # Deploy
        read -p "Do you want to deploy now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            deploy_to_vercel "$APP_PATH" "$app" "production"
        fi
    done

    print_message "$GREEN" "\n========================================="
    print_message "$GREEN" "Vercel Setup Complete!"
    print_message "$GREEN" "========================================="

    print_message "$BLUE" "Your apps are now configured for Vercel deployment."
    print_message "$BLUE" ""
    print_message "$YELLOW" "Next steps:"
    print_message "$YELLOW" "1. Configure custom domains in Vercel Dashboard"
    print_message "$YELLOW" "2. Set up GitHub integration for automatic deployments"
    print_message "$YELLOW" "3. Configure preview deployments for pull requests"
    print_message "$YELLOW" ""
    print_message "$YELLOW" "To manually deploy in the future:"
    print_message "$YELLOW" "  cd apps/web && vercel --prod"
    print_message "$YELLOW" "  cd apps/finagent-landing && vercel --prod"
}

# Run main function
main "$@"