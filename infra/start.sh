#!/bin/sh

set -e

echo "Starting standalone ping-status service..."

# Run database migrations
echo "Running database migrations..."
bun run db:migrate

echo ""

pm2-runtime start /app/ecosystem.config.cjs