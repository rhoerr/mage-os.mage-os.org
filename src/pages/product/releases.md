---
title: 'Releases'
description: 'Download the latest Mage-OS release and view the complete version history with release notes.'
tagline: 'Product'
layout: '~/layouts/ContentPageLayout.astro'
---

Download the latest Mage-OS Distribution and explore our release history.

## Latest Release: Mage-OS 2.0

**Released:** October 2025
**Based on:** Magento Open Source 2.4.8-p3

### Quick Install

```bash
composer create-project --repository-url=https://repo.mage-os.org/ mage-os/project-community-edition .
```

### Upgrade from Magento

```bash
composer config repositories.0 composer https://repo.mage-os.org/ && \
composer require mage-os/product-community-edition --no-update && \
composer remove magento/product-community-edition magento/composer-dependency-version-audit-plugin magento/composer-root-update-plugin --no-update && \
composer update --no-plugins --with-all-dependencies
```

[Full Installation Guide](/get-started/installation) | [Migration Guide](/get-started/migration-guide)

---

## What's New in 2.0

### New Features

- **PCI DSS 4.0 Compliance** - Enhanced security policies including automatic account deactivation, session security, and strengthened authentication
- **AI-Powered Translation** - Automatic translation using DeepL, OpenAI, or Google Gemini for products, categories, and CMS content
- **Inventory Reservations Grid** - Better visibility into stock reservations with direct management
- **Meta Robots Control** - Fine-tune NOINDEX, NOFOLLOW, and NOARCHIVE tags per page
- **PageBuilder Widgets** - CMS Widget support with live previews
- **PageBuilder Import/Export** - Share templates between instances via local files or Dropbox
- **Theme Optimization** - Back/forward cache, speculative preloading, smooth transitions

### Platform Improvements

- PHP 8.4 compatibility fixes
- Admin dashboard JavaScript fixes
- Config load safety checks
- Configurable product export fixes
- USPS REST API support (legacy Web Services API ends January 2026)

### Recommended Software Versions

| Component    | Version               |
| ------------ | --------------------- |
| PHP          | 8.4 / 8.3             |
| Composer     | 2.8                   |
| OpenSearch   | 2.19                  |
| MariaDB      | 11.4                  |
| MySQL        | 8.4                   |
| RabbitMQ     | 4                     |
| Redis/Valkey | Valkey 8 / Redis 7.2+ |
| Varnish      | 7.6                   |
| Apache       | 2.4                   |
| nginx        | 1.26                  |

---

## Release History

### Mage-OS 1.3.1

**Released:** September 2025
**Based on:** Magento 2.4.7-p3

Security patch release.

### Mage-OS 1.3.0

**Released:** August 2025
**Based on:** Magento 2.4.7-p3

New features and improvements.

### Mage-OS 1.2.0

**Released:** June 2025
**Based on:** Magento 2.4.7-p2

New versioning policy introduced.

### Mage-OS 1.1.0

**Released:** April 2025
**Based on:** Magento 2.4.6-p4

New admin experience and more.

### Mage-OS 1.0.6

**Released:** February 2025
**Based on:** Magento 2.4.6-p4

Bug fixes and improvements.

### Mage-OS 1.0.5

**Released:** November 2024
**Based on:** Magento 2.4.6-p3

Security and stability updates.

### Mage-OS 1.0.4

**Released:** August 2024
**Based on:** Magento 2.4.6-p2

Continued improvements.

### Mage-OS 1.0.3

**Released:** July 2024
**Based on:** Magento 2.4.6-p2

Bug fixes.

### Mage-OS 1.0.0

**Released:** October 2023
**Based on:** Magento 2.4.6

The first official Mage-OS Distribution release! A milestone showcasing what the community can achieve together.

---

## Version Support

As a volunteer-run nonprofit, we currently support only the **latest release branch**. Staying up to date ensures you have the latest security patches and features.

### Security Patches

Adobe releases security patches on the second Tuesday of each month. Mage-OS publishes updates following each Adobe release to incorporate the latest security fixes.

---

## Upgrading

### From Previous Mage-OS Version

```bash
composer update mage-os/product-community-edition --with-all-dependencies
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f
bin/magento cache:flush
```

### From Magento Open Source

See the [Migration Guide](/get-started/migration-guide) for detailed instructions.

---

## Repositories

### Main Distribution

- **Composer:** `https://repo.mage-os.org/`
- **GitHub:** [github.com/mage-os/mageos-magento2](https://github.com/mage-os/mageos-magento2)

### Mage-OS Lab

- **GitHub:** [github.com/mage-os-lab](https://github.com/mage-os-lab)

### Documentation

- **DevDocs:** [devdocs.mage-os.org](https://devdocs.mage-os.org)

---

## Acknowledgments

Mage-OS releases are made possible by our community contributors. Special thanks to:

- All pull request contributors
- Lab module developers
- Testing and QA volunteers
- Documentation writers
- Financial supporters and partners

[View all contributors](/community)

---

## Get Started

Ready to try the latest release?

- [Quick Start Guide](/get-started/quick-start) - Install in 30 minutes
- [System Requirements](/get-started/system-requirements) - Check compatibility
- [Migration Guide](/get-started/migration-guide) - Upgrade from Magento
