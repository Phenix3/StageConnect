FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    oniguruma-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libwebp-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        pgsql \
        mbstring \
        zip \
        gd \
        opcache \
        pcntl \
        bcmath

# Install Redis extension
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
