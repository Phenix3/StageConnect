#!/usr/bin/env bash
set -e

echo "Deploying StageConnect..."

# Pull latest code
git pull origin main

# Install PHP dependencies (no dev)
composer install --no-dev --optimize-autoloader --no-interaction

# Install JS dependencies and build
npm ci
npm run build

# Run database migrations
php artisan migrate --force

# Clear and cache configs for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Restart queue workers
php artisan queue:restart

echo "Deployment complete!"
