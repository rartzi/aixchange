# Use Node.js LTS as base image
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    libc6-compat \
    python3 \
    make \
    g++

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Generate Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/uploads /app/public/external-images && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'if [ "$NODE_ENV" = "production" ]; then' >> /app/start.sh && \
    echo '  node server.js' >> /app/start.sh && \
    echo 'else' >> /app/start.sh && \
    echo '  npm run dev' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    chmod +x /app/start.sh

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["/app/start.sh"]