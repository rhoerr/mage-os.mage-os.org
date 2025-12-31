---
title: 'Quick Start Guide'
description: 'Launch your first Mage-OS store in under 30 minutes with this step-by-step guide.'
tagline: 'Get Started'
layout: '~/layouts/ContentPageLayout.astro'
---

This guide will take you from **zero to a working Mage-OS installation** with minimal complexity. Perfect for developers, merchants evaluating the platform, or anyone wanting a fast local development environment.

## Prerequisites

Before you begin, ensure you have:

- **Server or local environment** with command-line access
- **PHP 8.3 or 8.4** installed with required extensions
- **Composer 2.8+** installed ([Get Composer](https://getcomposer.org/))
- **MySQL 8.4+** or **MariaDB 11.4+** running
- **OpenSearch 2.19+** running
- **Web server** (Apache 2.4+ or Nginx 1.26+) configured

**Don't have a development environment?** We recommend:
- [DDEV](https://ddev.com/) - Docker-based, easiest setup
- [Warden](https://warden.dev/) - Docker-based, Magento-focused
- [Lando](https://lando.dev/) - Docker-based, flexible

---

## Step 1: Create Project

Navigate to your web server's document root and create a new project:

```bash
composer create-project --repository-url=https://repo.mage-os.org/ mage-os/project-community-edition .
```

**What this does:**
- Downloads Mage-OS Distribution and all dependencies
- Sets up the basic file structure
- Configures composer autoloading

**Time:** 3-5 minutes (depending on connection speed)

---

## Step 2: Create Database

Create an empty database for your Mage-OS installation:

```bash
mysql -u root -p -e "CREATE DATABASE mage_os;"
mysql -u root -p -e "CREATE USER 'mage_os_user'@'localhost' IDENTIFIED BY 'secure_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON mage_os.* TO 'mage_os_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

**Time:** 1 minute

---

## Step 3: Run Installation

Run the setup installer with your configuration:

```bash
bin/magento setup:install \
  --base-url=http://yourdomain.local/ \
  --db-host=localhost \
  --db-name=mage_os \
  --db-user=mage_os_user \
  --db-password=secure_password \
  --admin-firstname=Admin \
  --admin-lastname=User \
  --admin-email=admin@example.com \
  --admin-user=admin \
  --admin-password=Admin123! \
  --language=en_US \
  --currency=USD \
  --timezone=America/New_York \
  --use-rewrites=1 \
  --search-engine=opensearch \
  --opensearch-host=localhost \
  --opensearch-port=9200
```

**Replace these values with your own:**
- `yourdomain.local` → Your local or production domain
- Database credentials
- Admin account details

**Time:** 5-10 minutes

---

## Step 4: Deploy Static Content

After installation completes, deploy assets and compile code:

```bash
# Set file permissions
find var generated vendor pub/static pub/media app/etc -type f -exec chmod g+w {} +
find var generated vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} +
chmod u+x bin/magento

# Compile dependency injection
bin/magento setup:di:compile

# Deploy static content
bin/magento setup:static-content:deploy -f

# Flush cache
bin/magento cache:flush
```

**Time:** 5-10 minutes

---

## Step 5: Set Deploy Mode

For **local development**, enable developer mode:

```bash
bin/magento deploy:mode:set developer
```

For **production**, use production mode:

```bash
bin/magento deploy:mode:set production
```

---

## Step 6: Access Your Store

### Storefront
Navigate to: `http://yourdomain.local/`

### Admin Panel
Navigate to: `http://yourdomain.local/admin`

**Login Credentials:**
- **Username:** admin (or what you specified)
- **Password:** Admin123! (or what you specified)

---

## Success! Your Store is Live

You now have a working Mage-OS installation. Here's what to do next:

### Configure Basic Settings

**Admin → Stores → Configuration**

- **General → Web:** Set secure base URLs
- **General → Store Information:** Add store name, address, contact info
- **Sales → Payment Methods:** Configure payment gateways
- **Sales → Shipping Methods:** Set up shipping options
- **Sales → Tax:** Configure tax rules

### Set Up Cron Jobs

Mage-OS requires cron for scheduled tasks:

```bash
crontab -e
```

Add:
```
* * * * * /usr/bin/php /var/www/html/bin/magento cron:run 2>&1 | grep -v "Ran jobs by schedule" >> /var/www/html/var/log/magento.cron.log
```

---

## Troubleshooting

### Blank page after installation

```bash
rm -rf var/cache/* var/page_cache/* generated/*
bin/magento setup:upgrade
bin/magento cache:flush
```

### 404 errors on storefront pages

Enable Apache mod_rewrite:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### Composer memory limit errors

```bash
php -d memory_limit=4G /usr/local/bin/composer create-project ...
```

### OpenSearch connection failed

Verify OpenSearch is running:
```bash
curl http://localhost:9200
```

---

## Next Steps

- [Full Installation Guide](/get-started/installation) - For custom environments
- [Migration Guide](/get-started/migration-guide) - Migrating from Magento
- [System Requirements](/get-started/system-requirements) - Detailed technical specs
- [Developer Documentation](https://devdocs.mage-os.org) - Full developer docs
