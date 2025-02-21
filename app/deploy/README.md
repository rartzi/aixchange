# AIXplore Portal Deployment Guide

This directory contains scripts and documentation for deploying the AIXplore Portal application.

## Quick Start

The `deploy.sh` script provides several deployment options to suit different scenarios.

### Basic Usage

```bash
./deploy.sh [OPTIONS] COMMAND
```

## Commands

### 1. Greenfield Deployment
For first-time deployment or when you want a fresh start:
```bash
./deploy.sh greenfield
```
This will:
- Clean up any existing containers/volumes
- Build fresh images
- Start containers
- Run database migrations
- Create admin user

### 2. Preserved Deployment
To update the application while preserving data:
```bash
./deploy.sh preserve
```
This will:
- Keep existing volumes (preserving data)
- Rebuild and update containers
- Maintain database state

### 3. Cleanup
To remove all project-related containers, images, and volumes:
```bash
./deploy.sh cleanup
```

### 4. Portal-Only Deployment
To deploy only the portal and connect to an existing database:
```bash
./deploy.sh --external-db localhost:5432 portal-only
```

## Options

- `-p, --port PORT`: Set application port (default: 3000)
- `-d, --db-port PORT`: Set database port (default: 5432)
- `-e, --env-file FILE`: Specify environment file path
- `--prod`: Use production configuration
- `--external-db HOST:PORT`: Connect to external database

## Examples

1. Deploy on custom ports:
```bash
./deploy.sh -p 8080 -d 5433 greenfield
```

2. Production deployment:
```bash
./deploy.sh --prod preserve
```

3. Connect to existing database:
```bash
./deploy.sh --external-db db.example.com:5432 portal-only
```

4. View logs:
```bash
./deploy.sh logs
```

## Database Management

### Create Backup
```bash
./deploy.sh backup
```
Backups are stored in the `backups` directory.

### Restore from Backup
```bash
./deploy.sh restore backup_20250221_123456.dump
```

## Environment Variables

The deployment script uses environment variables from the `.env` file. Required variables:

```env
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## Troubleshooting

1. If deployment fails:
   - Check Docker is running
   - Verify environment variables
   - Check ports are available
   - View logs: `./deploy.sh logs`

2. Database connection issues:
   - Verify database credentials
   - Check database port is accessible
   - Ensure database service is healthy

3. Permission issues:
   - Ensure deploy.sh is executable (`chmod +x deploy.sh`)
   - Check volume permissions
   - Verify user has Docker access

## Security Notes

1. Always use strong passwords in .env file
2. Keep backups in a secure location
3. Use production configuration in production environment
4. Regularly update dependencies
5. Monitor logs for suspicious activity