---
title: 'Installation Guide'
description: 'Comprehensive installation guide for Mage-OS covering Composer, Docker, cloud, and manual installation methods.'
tagline: 'Get Started'
layout: '~/layouts/ContentPageLayout.astro'
---

This guide covers detailed installation methods for various environments. For a quick setup, see the [Quick Start Guide](/get-started/quick-start).

## Installation Methods

1. [Composer Installation](#composer-installation) (Recommended)
2. [Docker Installation](#docker-installation)
3. [Cloud Deployment](#cloud-deployment)

---

## Composer Installation

The recommended method for most installations.

### Prerequisites

Ensure your system meets the [System Requirements](/get-started/system-requirements).

### Step 1: Create Project

```bash
composer create-project --repository-url=https://repo.mage-os.org/ \
  mage-os/project-community-edition <install-directory>
```

Replace `<install-directory>` with your desired path or `.` for current directory.

### Step 2: Set File Permissions

```bash
cd <install-directory>
find var generated vendor pub/static pub/media app/etc -type f -exec chmod g+w {} +
find var generated vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} +
chown -R :www-data .
chmod u+x bin/magento
```

### Step 3: Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE mageos;
CREATE USER 'mageos'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL ON mageos.* TO 'mageos'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Run Installer

```bash
bin/magento setup:install \
  --base-url="http://your-domain.com/" \
  --db-host="localhost" \
  --db-name="mageos" \
  --db-user="mageos" \
  --db-password="your_password" \
  --admin-firstname="Admin" \
  --admin-lastname="User" \
  --admin-email="admin@example.com" \
  --admin-user="admin" \
  --admin-password="Admin123!" \
  --language="en_US" \
  --currency="USD" \
  --timezone="America/New_York" \
  --use-rewrites="1" \
  --search-engine="opensearch" \
  --opensearch-host="localhost" \
  --opensearch-port="9200" \
  --opensearch-index-prefix="mageos" \
  --opensearch-timeout="15"
```

### Step 5: Post-Installation

```bash
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f
bin/magento indexer:reindex
bin/magento cache:flush
```

---

## Docker Installation

### Using DDEV (Recommended)

```bash
# Install DDEV
curl -fsSL https://ddev.com/install.sh | bash

# Create project directory
mkdir mageos && cd mageos

# Configure DDEV
ddev config --project-type=magento2 --docroot=pub --php-version=8.3

# Start environment
ddev start

# Create Mage-OS project
ddev composer create-project --repository-url=https://repo.mage-os.org/ \
  mage-os/project-community-edition .

# Run installer
ddev magento setup:install \
  --base-url="https://mageos.ddev.site/" \
  --db-host="db" \
  --db-name="db" \
  --db-user="db" \
  --db-password="db" \
  --admin-firstname="Admin" \
  --admin-lastname="User" \
  --admin-email="admin@example.com" \
  --admin-user="admin" \
  --admin-password="Admin123!" \
  --search-engine="opensearch" \
  --opensearch-host="opensearch" \
  --opensearch-port="9200"

# Deploy
ddev magento setup:di:compile
ddev magento setup:static-content:deploy -f
ddev magento cache:flush
```

### Using Warden

```bash
# Install Warden
brew install davidalger/warden/warden

# Create project
mkdir mageos && cd mageos
warden env-init mageos magento2

# Start environment
warden env up

# Install Mage-OS
warden shell
composer create-project --repository-url=https://repo.mage-os.org/ \
  mage-os/project-community-edition .

# Follow standard installation steps
```

---

## Cloud Deployment

### AWS EC2

1. Launch an EC2 instance (t3.large minimum)
2. Install LAMP/LEMP stack
3. Install OpenSearch or Elasticsearch
4. Follow Composer installation steps
5. Configure security groups for web traffic

### Google Cloud Platform

1. Create Compute Engine instance (n2-standard-2 minimum)
2. Install required software stack
3. Follow Composer installation steps
4. Configure firewall rules

### Azure

1. Create Virtual Machine (Standard_D2s_v3 minimum)
2. Install required software
3. Follow Composer installation steps
4. Configure network security groups

---

## Web Server Configuration

### Apache Virtual Host

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/mageos/pub

    <Directory /var/www/mageos/pub>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/mageos-error.log
    CustomLog ${APACHE_LOG_DIR}/mageos-access.log combined
</VirtualHost>
```

### Nginx Configuration

```nginx
upstream fastcgi_backend {
    server unix:/var/run/php/php8.3-fpm.sock;
}

server {
    listen 80;
    server_name your-domain.com;

    set $MAGE_ROOT /var/www/mageos;
    set $MAGE_MODE production;

    include /var/www/mageos/nginx.conf.sample;
}
```

---

## Post-Installation Setup

### Configure Cron

```bash
crontab -e
```

Add:
```
* * * * * /usr/bin/php /var/www/mageos/bin/magento cron:run 2>&1 | grep -v "Ran jobs by schedule" >> /var/www/mageos/var/log/magento.cron.log
```

### Set Production Mode

```bash
bin/magento deploy:mode:set production
```

### Enable Caches

```bash
bin/magento cache:enable
```

### Configure Redis (Recommended)

Edit `app/etc/env.php`:

```php
'cache' => [
    'frontend' => [
        'default' => [
            'backend' => 'Magento\\Framework\\Cache\\Backend\\Redis',
            'backend_options' => [
                'server' => '127.0.0.1',
                'port' => '6379',
                'database' => '0'
            ]
        ],
        'page_cache' => [
            'backend' => 'Magento\\Framework\\Cache\\Backend\\Redis',
            'backend_options' => [
                'server' => '127.0.0.1',
                'port' => '6379',
                'database' => '1'
            ]
        ]
    ]
],
'session' => [
    'save' => 'redis',
    'redis' => [
        'host' => '127.0.0.1',
        'port' => '6379',
        'database' => '2'
    ]
],
```

---

## Troubleshooting

### Common Issues

**Permission denied errors:**
```bash
sudo chown -R www-data:www-data /var/www/mageos
sudo chmod -R 755 /var/www/mageos
```

**Memory limit exceeded:**
```bash
php -d memory_limit=4G bin/magento setup:di:compile
```

**Static content deployment fails:**
```bash
bin/magento setup:static-content:deploy -f --jobs=4
```

---

## Next Steps

- [System Requirements](/get-started/system-requirements) - Verify your setup
- [Migration Guide](/get-started/migration-guide) - Migrate from Magento
- [Quick Start Guide](/get-started/quick-start) - Quick setup overview
