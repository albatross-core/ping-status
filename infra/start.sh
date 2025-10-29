#!/bin/sh

set -e

# Restore db
if [ ! -f "$DATABASE_PATH" ]; then
  echo "Database not found, restoring from backup if exists..."
  litestream restore -config /app/litestream.yml -if-replica-exists "$DATABASE_PATH"
fi

echo "Starting standalone ping-status service..."

# Run database migrations
echo "Running database migrations..."
bun run db:migrate

echo ""

pm2-runtime start /app/ecosystem.config.cjs