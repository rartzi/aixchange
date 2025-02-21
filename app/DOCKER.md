# Docker Deployment Guide

This guide explains how to deploy the application using Docker in both development and production environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+
- Git

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the following variables in `.env`:
```
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## Development

Start the development environment:

```bash
docker compose up
```

This will:
- Start the application in development mode with hot reloading
- Create a PostgreSQL database
- Mount source code for live updates
- Set up automatic database backups

## Production

1. Build and start the production environment:
```bash
NODE_ENV=production docker compose up --build
```

2. Or use the production-optimized configuration:
```bash
docker compose -f docker-compose.prod.yml up --build
```

## Configuration

### Resource Limits

Resource limits are configured in docker-compose.yml:

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

Adjust these values based on your server capacity.

### Volumes

The application uses several Docker volumes:
- `postgres_data`: Database files
- `solution_uploads`: User-uploaded files
- `next_cache`: Next.js build cache
- `external-images`: External images storage

### Health Checks

Both the application and database include health checks:
- App: Checks `/api/health` endpoint every 30s
- Database: Checks PostgreSQL connection every 10s

### Backups

Database backups are automatically created daily and stored in `./backups`. Backups older than 7 days are automatically removed.

## Common Commands

1. View logs:
```bash
docker compose logs -f
```

2. Rebuild containers:
```bash
docker compose up --build
```

3. Stop and remove containers:
```bash
docker compose down
```

4. Stop and remove containers including volumes:
```bash
docker compose down -v
```

5. View container status:
```bash
docker compose ps
```

## Troubleshooting

1. If the application fails to start:
   - Check logs: `docker compose logs app`
   - Verify environment variables
   - Ensure database is running: `docker compose ps`

2. If database connection fails:
   - Check database logs: `docker compose logs db`
   - Verify database credentials in .env
   - Ensure database volume permissions are correct

3. If volumes have permission issues:
   - Check volume ownership: `ls -l ./backups`
   - Verify user permissions in Dockerfile
   - Ensure host directories exist with correct permissions

## Security Notes

1. Never commit .env files
2. Use strong passwords for database
3. Keep Docker and dependencies updated
4. Follow least privilege principle
5. Regularly backup data
6. Monitor container logs
7. Use non-root user (configured in Dockerfile)