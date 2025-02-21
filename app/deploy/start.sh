#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
if [ "$NODE_ENV" = "production" ]; then
  exec node server.js
else
  exec npm run dev
fi