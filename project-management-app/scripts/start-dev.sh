#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "📦 Installing backend dependencies..."
cd "$ROOT/backend" && npm install

echo "📦 Installing frontend dependencies..."
cd "$ROOT/frontend" && npm install

echo "🚀 Starting backend and frontend..."
cd "$ROOT/backend" && npm run dev &
cd "$ROOT/frontend" && npm run dev &

wait
