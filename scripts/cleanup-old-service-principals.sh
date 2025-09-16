#!/bin/bash

# Script to safely cleanup old Azure Service Principals after verification

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Azure Service Principal Cleanup Tool ===${NC}"
echo ""

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Azure. Initiating login...${NC}"
    az login
fi

# Function to display SP details
show_sp_details() {
    local SP_ID=$1
    echo -e "${CYAN}Fetching details for: $SP_ID${NC}"
    
    # Get SP details
    SP_DETAILS=$(az ad sp show --id "$SP_ID" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        DISPLAY_NAME=$(echo "$SP_DETAILS" | jq -r '.displayName')
        CREATED=$(echo "$SP_DETAILS" | jq -r '.createdDateTime')
        APP_ID=$(echo "$SP_DETAILS" | jq -r '.appId')
        
        echo "  Display Name: $DISPLAY_NAME"
        echo "  App ID: $APP_ID"
        echo "  Created: $CREATED"
        
        # Get role assignments
        ROLES=$(az role assignment list \
            --assignee "$SP_ID" \
            --query "[].{role:roleDefinitionName, scope:scope}" \
            -o json 2>/dev/null)
        
        if [ ! -z "$ROLES" ] && [ "$ROLES" != "[]" ]; then
            echo "  Roles:"
            echo "$ROLES" | jq -r '.[] | "    - \(.role) on \(.scope)"'
        fi
        
        # Check for recent activity (last sign-in)
        echo ""
        return 0
    else
        echo -e "${RED}Could not fetch details for $SP_ID${NC}"
        return 1
    fi
}

# List all service principals
echo -e "${YELLOW}Searching for service principals with 'finagent' in the name...${NC}"
echo ""

# Get all SPs with finagent in the name
SPS=$(az ad sp list --all --query "[?contains(displayName, 'finagent')].{name:displayName, created:createdDateTime, id:appId}" -o json)

if [ "$SPS" == "[]" ]; then
    echo -e "${YELLOW}No service principals found with 'finagent' in the name${NC}"
    echo ""
    echo "Do you want to search for a different pattern? (y/n)"
    read -r SEARCH_AGAIN
    
    if [[ "$SEARCH_AGAIN" == "y" || "$SEARCH_AGAIN" == "Y" ]]; then
        echo "Enter search pattern:"
        read -r PATTERN
        SPS=$(az ad sp list --all --query "[?contains(displayName, '$PATTERN')].{name:displayName, created:createdDateTime, id:appId}" -o json)
    else
        exit 0
    fi
fi

# Display found service principals
echo -e "${BLUE}Found Service Principals:${NC}"
echo "$SPS" | jq -r '.[] | "\(.id) | \(.name) | Created: \(.created)"' | nl
echo ""

# Store in array for selection
readarray -t SP_ARRAY < <(echo "$SPS" | jq -r '.[].id')
readarray -t SP_NAMES < <(echo "$SPS" | jq -r '.[].name')

if [ ${#SP_ARRAY[@]} -eq 0 ]; then
    echo -e "${YELLOW}No service principals found${NC}"
    exit 0
fi

# Get the current/active SP
echo -e "${YELLOW}Which service principal is currently ACTIVE (in use)? Enter number or 'skip':${NC}"
read -r ACTIVE_NUM

ACTIVE_SP=""
if [[ "$ACTIVE_NUM" =~ ^[0-9]+$ ]] && [ "$ACTIVE_NUM" -ge 1 ] && [ "$ACTIVE_NUM" -le ${#SP_ARRAY[@]} ]; then
    ACTIVE_SP=${SP_ARRAY[$((ACTIVE_NUM-1))]}
    echo -e "${GREEN}Active SP: ${SP_NAMES[$((ACTIVE_NUM-1))]}${NC}"
    echo ""
fi

# Select SPs to delete
echo -e "${YELLOW}Select service principals to DELETE (comma-separated numbers, or 'all' except active):${NC}"
echo "Example: 1,3,4 or 'all'"
read -r DELETE_SELECTION

TO_DELETE=()

if [ "$DELETE_SELECTION" == "all" ]; then
    for i in "${!SP_ARRAY[@]}"; do
        if [ "${SP_ARRAY[$i]}" != "$ACTIVE_SP" ]; then
            TO_DELETE+=("${SP_ARRAY[$i]}")
        fi
    done
else
    IFS=',' read -ra SELECTIONS <<< "$DELETE_SELECTION"
    for sel in "${SELECTIONS[@]}"; do
        sel=$(echo "$sel" | xargs) # Trim whitespace
        if [[ "$sel" =~ ^[0-9]+$ ]] && [ "$sel" -ge 1 ] && [ "$sel" -le ${#SP_ARRAY[@]} ]; then
            SP_TO_DEL=${SP_ARRAY[$((sel-1))]}
            if [ "$SP_TO_DEL" == "$ACTIVE_SP" ]; then
                echo -e "${RED}⚠ Warning: Skipping active SP: ${SP_NAMES[$((sel-1))]}${NC}"
            else
                TO_DELETE+=("$SP_TO_DEL")
            fi
        fi
    done
fi

if [ ${#TO_DELETE[@]} -eq 0 ]; then
    echo -e "${YELLOW}No service principals selected for deletion${NC}"
    exit 0
fi

# Show what will be deleted
echo ""
echo -e "${RED}=== SERVICE PRINCIPALS TO BE DELETED ===${NC}"
for sp_id in "${TO_DELETE[@]}"; do
    show_sp_details "$sp_id"
    echo "---"
done

echo ""
echo -e "${RED}⚠ THIS ACTION CANNOT BE UNDONE ⚠${NC}"
echo -e "${YELLOW}Are you sure you want to delete ${#TO_DELETE[@]} service principal(s)? (yes/no)${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Deletion cancelled${NC}"
    exit 0
fi

# Perform deletion
echo ""
echo -e "${YELLOW}Deleting service principals...${NC}"

SUCCESS_COUNT=0
FAILED_COUNT=0

for sp_id in "${TO_DELETE[@]}"; do
    # Find the name for this SP
    SP_NAME=""
    for i in "${!SP_ARRAY[@]}"; do
        if [ "${SP_ARRAY[$i]}" == "$sp_id" ]; then
            SP_NAME=${SP_NAMES[$i]}
            break
        fi
    done
    
    echo -n "Deleting $SP_NAME ($sp_id)... "
    
    if az ad sp delete --id "$sp_id" 2>/dev/null; then
        echo -e "${GREEN}✓ Deleted${NC}"
        ((SUCCESS_COUNT++))
        
        # Log the deletion
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Deleted SP: $SP_NAME ($sp_id)" >> azure-sp-cleanup.log
    else
        echo -e "${RED}✗ Failed${NC}"
        ((FAILED_COUNT++))
    fi
done

echo ""
echo -e "${BLUE}=== Cleanup Summary ===${NC}"
echo -e "${GREEN}Successfully deleted: $SUCCESS_COUNT${NC}"
if [ $FAILED_COUNT -gt 0 ]; then
    echo -e "${RED}Failed to delete: $FAILED_COUNT${NC}"
fi
echo "Cleanup logged to: azure-sp-cleanup.log"

# Final verification
echo ""
echo -e "${YELLOW}Remaining service principals:${NC}"
az ad sp list --all --query "[?contains(displayName, 'finagent')].{name:displayName, created:createdDateTime, id:appId}" -o table