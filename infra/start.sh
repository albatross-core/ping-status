#!/bin/sh
set -e

echo "Starting ping-status services..."
echo "PORT=${PORT:-3000}"
echo "NODE_ENV=${NODE_ENV:-development}"

# Start pinger in background
echo "Starting pinger..."
bun run start:pinger &

# Start API server in foreground
echo "Starting API server..."
exec bun run start:app
