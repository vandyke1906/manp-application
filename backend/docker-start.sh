#!/bin/sh

# Ensure Laravel caches are up-to-date
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations if needed
php artisan migrate --force

# Start PHP-FPM in the background
php-fpm & 

# Start Nginx in the background
nginx &

# Start Laravel queue worker in the foreground (keeps container running)
php artisan queue:work --sleep=3 --tries=3
