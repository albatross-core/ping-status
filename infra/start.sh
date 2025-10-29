#!/bin/sh

set -e

# Restore db
if [ ! -f "$DATABASE_PATH" ]; then
  echo "No database found, restoring from replica if exists"
  litestream restore -v -if-replica-exists -config /app/litestream.yml "$DATABASE_PATH"
fi

echo "Starting standalone ping-status service..."

# Run database migrations
echo "Running database migrations..."
bun run db:migrate

echo ""

pm2-runtime start /app/ecosystem.config.cjs