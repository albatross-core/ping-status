#!/bin/sh

set -e

echo "Starting standalone ping-status service..."

# Run database migrations
echo "Running database migrations..."
bun run db:migrate

# Start pinger in background
echo "Starting pinger..."
bun run start:pinger &

# Start API server in foreground
echo "Starting API server..."
exec bun run start:app

# pm2-runtime start /app/ecosystem.config.cjs