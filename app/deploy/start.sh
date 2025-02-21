#!/bin/sh
set -e

MAX_RETRIES=30
RETRY_INTERVAL=2

echo "Waiting for database to be ready..."
retries=0
until pg_isready -h db -U $POSTGRES_USER -d $POSTGRES_DB &>/dev/null || [ $retries -eq $MAX_RETRIES ]
do
  echo "Database connection attempt $((retries+1))/$MAX_RETRIES failed, retrying in ${RETRY_INTERVAL}s..."
  retries=$((retries+1))
  sleep $RETRY_INTERVAL
done

if [ $retries -eq $MAX_RETRIES ]; then
  echo "Could not connect to database after $MAX_RETRIES attempts"
  exit 1
fi

echo "Database is ready..."

echo "Starting application..."
if [ "$NODE_ENV" = "production" ]; then
  exec node server.js
else
  exec npm run dev
fi