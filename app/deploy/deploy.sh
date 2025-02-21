#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
APP_PORT=3000
DB_PORT=5432
ENV_FILE="../.env"
COMPOSE_FILE="../docker-compose.yml"
COMPOSE_PROD_FILE="../docker-compose.prod.yml"
PROJECT_NAME="aixplore-portal"

# Function to display usage
usage() {
    echo -e "${GREEN}Usage: $0 [OPTIONS] COMMAND${NC}"
    echo
    echo "Commands:"
    echo "  cleanup        Stop containers, remove containers, images, volumes and prune images"
    echo "  greenfield    First-time deployment with clean database and admin user"
    echo "  preserve      Build images and run containers while preserving existing database"
    echo "  portal-only   Deploy only the portal (no database) and connect to existing database"
    echo "  update        Update application without affecting data"
    echo "  backup        Create a database backup"
    echo "  restore       Restore database from backup"
    echo "  logs          View container logs"
    echo
    echo "Options:"
    echo "  -p, --port PORT             Application port (default: 3000)"
    echo "  -d, --db-port PORT          Database port (default: 5432)"
    echo "  -e, --env-file FILE         Path to env file (default: ../.env)"
    echo "  -h, --help                  Display this help message"
    echo "  --prod                      Use production configuration"
    echo "  --external-db HOST:PORT     Use external database instead of container"
    echo
    echo "Examples:"
    echo "  $0 greenfield               # First-time deployment"
    echo "  $0 -p 8080 preserve         # Deploy preserving data on port 8080"
    echo "  $0 --external-db localhost:5432 portal-only  # Deploy portal with external database"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        exit 1
    fi
}

# Function to load environment variables
load_env() {
    if [ -f "$ENV_FILE" ]; then
        export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
    else
        echo -e "${RED}Error: Environment file not found: $ENV_FILE${NC}"
        exit 1
    fi
}

# Function to stop and remove containers
cleanup() {
    echo -e "${YELLOW}Cleaning up containers, images, and volumes...${NC}"
    docker compose -p $PROJECT_NAME down -v
    docker rmi $(docker images -q "$PROJECT_NAME*") 2>/dev/null || true
    docker system prune -f
    echo -e "${GREEN}Cleanup complete${NC}"
}

# Function for greenfield deployment
greenfield() {
    echo -e "${YELLOW}Starting greenfield deployment...${NC}"
    cleanup
    
    # Build and start containers
    # Export port for docker-compose and update NEXTAUTH_URL
    export PORT=$APP_PORT
    export NEXTAUTH_URL="http://localhost:$APP_PORT"
    
    if [ "$USE_PROD" = true ]; then
        docker compose -f $COMPOSE_PROD_FILE -p $PROJECT_NAME up -d --build
    else
        docker compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d --build
    fi
    
    # Wait for database to be ready
    echo -e "${YELLOW}Waiting for database to be ready...${NC}"
    sleep 10
    
    # Run database migrations
    docker compose -p $PROJECT_NAME exec app npx prisma migrate deploy

    # Create admin user with proper environment variables
    echo "Creating admin user..."
    docker compose -p $PROJECT_NAME exec app bash -c '
        if [[ -n "$ADMIN_EMAIL" && -n "$ADMIN_PASSWORD" ]]; then
            ADMIN_EMAIL="$ADMIN_EMAIL" ADMIN_PASSWORD="$ADMIN_PASSWORD" node scripts/create-admin.js
        else
            echo "Warning: ADMIN_EMAIL and/or ADMIN_PASSWORD not set. Using defaults."
            node scripts/create-admin.js
        fi
    '
    
    echo -e "${GREEN}Greenfield deployment complete${NC}"
    echo -e "${GREEN}Application is running on http://localhost:$APP_PORT${NC}"
}

# Function for preserved deployment
preserve() {
    echo -e "${YELLOW}Starting preserved deployment...${NC}"
    
    # Stop containers but preserve volumes
    docker compose -p $PROJECT_NAME down
    
    # Build and start containers
    if [ "$USE_PROD" = true ]; then
        docker compose -f $COMPOSE_PROD_FILE -p $PROJECT_NAME up -d --build
    else
        docker compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d --build
    fi
    
    echo -e "${GREEN}Preserved deployment complete${NC}"
    echo -e "${GREEN}Application is running on http://localhost:$APP_PORT${NC}"
}

# Function for portal-only deployment
portal_only() {
    echo -e "${YELLOW}Starting portal-only deployment...${NC}"
    
    if [ -z "$EXTERNAL_DB" ]; then
        echo -e "${RED}Error: External database connection string required for portal-only deployment${NC}"
        exit 1
    fi
    
    # Update DATABASE_URL in environment
    DB_HOST=$(echo $EXTERNAL_DB | cut -d: -f1)
    DB_PORT=$(echo $EXTERNAL_DB | cut -d: -f2)
    export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}"
    
    # Deploy only the app service
    if [ "$USE_PROD" = true ]; then
        docker compose -f $COMPOSE_PROD_FILE -p $PROJECT_NAME up -d --build app
    else
        docker compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d --build app
    fi
    
    echo -e "${GREEN}Portal-only deployment complete${NC}"
    echo -e "${GREEN}Application is running on http://localhost:$APP_PORT${NC}"
}

# Function to create database backup
backup() {
    echo -e "${YELLOW}Creating database backup...${NC}"
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).dump"
    docker compose -p $PROJECT_NAME exec db pg_dump -U $POSTGRES_USER -d $POSTGRES_DB -F c -f "/backups/$BACKUP_FILE"
    echo -e "${GREEN}Backup created: $BACKUP_FILE${NC}"
}

# Function to restore database from backup
restore() {
    echo -e "${YELLOW}Restoring database from backup...${NC}"
    if [ -z "$1" ]; then
        echo -e "${RED}Error: Backup file name required${NC}"
        exit 1
    fi
    
    docker compose -p $PROJECT_NAME exec db pg_restore -U $POSTGRES_USER -d $POSTGRES_DB -c "/backups/$1"
    echo -e "${GREEN}Database restored from: $1${NC}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            APP_PORT="$2"
            shift 2
            ;;
        -d|--db-port)
            DB_PORT="$2"
            shift 2
            ;;
        -e|--env-file)
            ENV_FILE="$2"
            shift 2
            ;;
        --prod)
            USE_PROD=true
            shift
            ;;
        --external-db)
            EXTERNAL_DB="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        cleanup|greenfield|preserve|portal-only|update|backup|restore|logs)
            COMMAND="$1"
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            usage
            exit 1
            ;;
    esac
done

# Check if command is provided
if [ -z "$COMMAND" ]; then
    echo -e "${RED}Error: Command required${NC}"
    usage
    exit 1
fi

# Main execution
check_docker
load_env

case $COMMAND in
    cleanup)
        cleanup
        ;;
    greenfield)
        greenfield
        ;;
    preserve)
        preserve
        ;;
    portal-only)
        portal_only
        ;;
    update)
        preserve
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    logs)
        docker compose -p $PROJECT_NAME logs -f
        ;;
    *)
        echo -e "${RED}Unknown command: $COMMAND${NC}"
        usage
        exit 1
        ;;
esac