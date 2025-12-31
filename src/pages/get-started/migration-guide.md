---
title: 'Migration Guide'
description: 'Seamlessly migrate from Magento Open Source to Mage-OS with zero downtime and full compatibility.'
tagline: 'Get Started'
layout: '~/layouts/ContentPageLayout.astro'
---

Migrating from Magento Open Source to Mage-OS is straightforward. Your existing extensions, themes, and customizations will continue to work without modification.

## Why Migrate to Mage-OS?

- **Enhanced Performance** - Optimized caching and database queries
- **Faster Security Patches** - Community-accelerated security updates
- **New Features** - AI translation, PCI DSS 4.0 compliance, theme optimization
- **Full Compatibility** - 100% compatible with Magento extensions and themes
- **Community Governance** - Transparent, democratic decision-making

---

## Pre-Migration Checklist

Before migrating, ensure you have:

- [ ] Complete backup of your current installation
- [ ] Database backup
- [ ] Media files backup
- [ ] SSH/command-line access to your server
- [ ] Composer 2.8+ installed
- [ ] Current Magento version is 2.4.6 or later (recommended: update to latest Magento first)

---

## Migration Process

### Step 1: Create Backup

```bash
# Backup database
mysqldump -u username -p database_name > backup.sql

# Backup files
tar -czvf magento-backup.tar.gz /path/to/magento
```

### Step 2: Switch to Mage-OS Repository

```bash
cd /path/to/your/magento

# Add Mage-OS repository
composer config repositories.0 composer https://repo.mage-os.org/

# Require Mage-OS product
composer require mage-os/product-community-edition --no-update

# Remove Magento product
composer remove magento/product-community-edition \
  magento/composer-dependency-version-audit-plugin \
  magento/composer-root-update-plugin --no-update

# Update all dependencies
composer update --no-plugins --with-all-dependencies
```

### Step 3: Run Upgrade

```bash
# Run setup upgrade
bin/magento setup:upgrade

# Compile DI
bin/magento setup:di:compile

# Deploy static content
bin/magento setup:static-content:deploy -f

# Reindex
bin/magento indexer:reindex

# Flush cache
bin/magento cache:flush
```

### Step 4: Verify Installation

```bash
# Check version
bin/magento --version

# Should output: Mage-OS 2.x.x
```

---

## One-Line Migration

For experienced users, the entire process can be condensed:

```bash
composer config repositories.0 composer https://repo.mage-os.org/ && \
composer require mage-os/product-community-edition --no-update && \
composer remove magento/product-community-edition \
  magento/composer-dependency-version-audit-plugin \
  magento/composer-root-update-plugin --no-update && \
composer update --no-plugins --with-all-dependencies && \
bin/magento setup:upgrade && \
bin/magento setup:di:compile && \
bin/magento setup:static-content:deploy -f && \
bin/magento cache:flush
```

---

## Compatibility

### Extensions

Mage-OS maintains 100% compatibility with Magento Open Source extensions. Your existing extensions will continue to work without modification.

### Themes

All Magento 2 themes are fully compatible with Mage-OS, including:

- Luma (default)
- Blank (base theme)
- Custom themes
- Third-party themes (Hyvä, etc.)

### Customizations

Custom modules, plugins, and customizations built for Magento Open Source will work on Mage-OS without changes.

---

## Zero-Downtime Migration

For production environments, use a staged approach:

### 1. Clone Environment

```bash
# Clone your production to a staging environment
rsync -avz production/ staging/
```

### 2. Test Migration on Staging

Perform the migration on staging first and thoroughly test:

- Checkout flow
- Admin panel functionality
- Third-party integrations
- Custom functionality

### 3. Schedule Maintenance Window

For the final switchover:

1. Enable maintenance mode
2. Sync any database changes
3. Perform migration
4. Test critical paths
5. Disable maintenance mode

```bash
# Enable maintenance mode
bin/magento maintenance:enable

# ... perform migration ...

# Disable maintenance mode
bin/magento maintenance:disable
```

---

## Rollback Procedure

If issues arise, you can rollback:

```bash
# Restore database
mysql -u username -p database_name < backup.sql

# Restore files
tar -xzvf magento-backup.tar.gz -C /
```

To switch back to Magento repositories:

```bash
composer config repositories.0 composer https://repo.magento.com/
composer require magento/product-community-edition --no-update
composer remove mage-os/product-community-edition --no-update
composer update --no-plugins --with-all-dependencies
bin/magento setup:upgrade
```

---

## Post-Migration

After successful migration:

### Verify New Features

Mage-OS 2.0 includes:

- PCI DSS 4.0 compliance settings
- AI-powered translation (requires API key)
- Theme optimization features
- Enhanced Page Builder

### Update Cron

Verify cron is running correctly:

```bash
bin/magento cron:run
```

### Clear Full Page Cache

```bash
bin/magento cache:clean full_page
```

---

## Troubleshooting

### Composer Conflicts

If you encounter dependency conflicts:

```bash
composer update --with-all-dependencies
```

### Module Version Mismatches

```bash
bin/magento setup:upgrade --keep-generated
bin/magento module:status
```

### Static Content Issues

```bash
rm -rf pub/static/* var/view_preprocessed/*
bin/magento setup:static-content:deploy -f
```

---

## Support

Need help with migration?

- **Community Discord:** [chat.mage-os.org](https://discord.com/invite/nvZDVA2NdC)
- **GitHub Issues:** [github.com/mage-os](https://github.com/mage-os)
- **Developer Docs:** [devdocs.mage-os.org](https://devdocs.mage-os.org)

For enterprise migrations, consider working with a [Mage-OS partner](/about).

---

## Next Steps

- [Quick Start Guide](/get-started/quick-start) - New installation guide
- [System Requirements](/get-started/system-requirements) - Technical specifications
- [Features](/product/features) - Explore Mage-OS features
