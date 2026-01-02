---
title: 'Releases'
description: 'Download the latest Mage-OS release and view the complete version history with release notes.'
tagline: 'Product'
layout: '~/layouts/ContentPageLayout.astro'
---

Download the latest Mage-OS Distribution and explore our complete release history below.

@TODO: Integrate with/pull from the releases posts collection

---

## Latest Release: Mage-OS 2.0

| | |
|-------------|-------------------------|
| **Version** | 2.0 |
| **Released** | October 16, 2025 |
| **Base** | Magento Open Source 2.4.8-p3 |
| **PHP** | 8.3 / 8.4 |

### Quick Install (New Project)

Create a fresh Mage-OS installation with a single command:

```bash
composer create-project --repository-url=https://repo.mage-os.org/ mage-os/project-community-edition .
```

After Composer finishes, run the installer to complete setup. See the [Full Installation Guide](/get-started/installation) for detailed steps.

### Migrate from Magento Open Source

Switch your existing Magento store to Mage-OS:

```bash
composer config repositories.0 composer https://repo.mage-os.org/ && \
composer require mage-os/product-community-edition --no-update && \
composer remove magento/product-community-edition magento/composer-dependency-version-audit-plugin magento/composer-root-update-plugin --no-update && \
composer update --no-plugins --with-all-dependencies
```

> **Tip:** We recommend updating to the latest Magento version before migrating to minimize compatibility issues.

[Full Installation Guide](/get-started/installation) | [Migration Guide](/get-started/migration-guide) | [System Requirements](/get-started/system-requirements)

---

## What's New in 2.0

Mage-OS 2.0 is a major release that showcases the power of community-driven innovation, featuring significant new capabilities and platform improvements.

### New Features

- **PCI DSS 4.0 Compliance** - Enhanced security policies including automatic account deactivation, session security, and strengthened authentication to meet the latest payment security standards
- **AI-Powered Translation** - Automatic content translation using DeepL, OpenAI, or Google Gemini for products, categories, and CMS pages
- **Inventory Reservations Grid** - Better visibility into stock reservations with direct management capabilities in the admin panel
- **Meta Robots Control** - Fine-tune NOINDEX, NOFOLLOW, and NOARCHIVE tags on a per-page basis for improved SEO control
- **PageBuilder Widgets** - Full CMS Widget support directly in Page Builder with live previews
- **PageBuilder Import/Export** - Share templates between Mage-OS instances via local files or Dropbox integration
- **Theme Optimization** - Back/forward cache support, speculative preloading, and smooth page transitions for better Core Web Vitals

### Platform Improvements

- Full PHP 8.4 compatibility
- Admin dashboard JavaScript fixes and performance improvements
- Config load safety checks for more reliable deployments
- Configurable product export fixes
- USPS REST API support (legacy Web Services API ends January 2026)

### Recommended Software Versions

| Component    | Recommended Version   | Minimum Version |
| ------------ | --------------------- | --------------- |
| PHP          | 8.4                   | 8.3             |
| Composer     | 2.8                   | 2.7             |
| OpenSearch   | 2.19                  | 2.12            |
| MariaDB      | 11.4                  | 10.6            |
| MySQL        | 8.4                   | 8.0             |
| RabbitMQ     | 4                     | 3.13            |
| Redis/Valkey | Valkey 8 / Redis 7.2+ | Redis 7.0       |
| Varnish      | 7.6                   | 7.4             |
| Apache       | 2.4                   | 2.4             |
| nginx        | 1.26                  | 1.24            |

---

## Release History

All Mage-OS releases with their corresponding Magento Open Source base versions. Since June 2025, Mage-OS follows semantic versioning (Major.Minor.Patch).

| Version | Release Date | Magento Base | Highlights |
|---------|--------------|--------------|------------|
| **2.0** | Oct 16, 2025 | 2.4.8-p3 | PCI DSS 4.0, AI Translation, PHP 8.4 |
| 1.3.1 | Sep 9, 2025 | 2.4.8-p2 | Security patch release |
| 1.3.0 | Aug 15, 2025 | 2.4.8-p2 | Performance improvements, bug fixes |
| 1.2.0 | Jun 18, 2025 | 2.4.8-p1 | New semantic versioning policy |
| 1.1.0 | Apr 15, 2025 | 2.4.8 | Enhanced admin experience |
| 1.0.6 | Feb 13, 2025 | 2.4.7-p4 | Bug fixes and stability improvements |
| 1.0.5 | Nov 6, 2024 | 2.4.7-p3 | Security and stability updates |
| 1.0.4 | Aug 22, 2024 | 2.4.7-p2 | Continued platform improvements |
| 1.0.3 | Jul 25, 2024 | 2.4.7-p1 | Bug fixes |
| 1.0.2 | Jul 18, 2024 | 2.4.7-p1 | Stability improvements |
| 1.0.1 | Oct 11, 2023 | 2.4.6-p3 | First patch release |
| **1.0.0** | Oct 10, 2023 | 2.4.6-p2 | First official Mage-OS release |

### Versioning Policy

- **Major versions** (e.g., 2.0) - Significant platform changes and new feature bundles
- **Minor versions** (e.g., 1.3) - Generally aligned with Magento updates and feature additions
- **Patch versions** (e.g., 1.3.1) - Security patches and urgent compatibility fixes

---

## Version Support

As a volunteer-run nonprofit, Mage-OS currently supports only the **latest release branch**. We recommend staying up to date to ensure you have the latest security patches and features.

### Security Patch Schedule

Adobe releases security patches on the second Tuesday of each month ("Patch Tuesday"). Mage-OS typically publishes corresponding updates within days of each Adobe release to incorporate the latest security fixes.

> **Why upgrade regularly?** Security patches address vulnerabilities that could put your store and customer data at risk. Staying current is the best way to protect your business.

---

## Upgrading

### From a Previous Mage-OS Version

Upgrade your existing Mage-OS installation to the latest version:

```bash
# Step 1: Update packages
composer update mage-os/product-community-edition --with-all-dependencies

# Step 2: Run database migrations
bin/magento setup:upgrade

# Step 3: Compile dependency injection
bin/magento setup:di:compile

# Step 4: Deploy static content
bin/magento setup:static-content:deploy -f

# Step 5: Clear cache
bin/magento cache:flush
```

> **Before upgrading:** Always back up your database and files before performing any upgrade. Test the upgrade in a staging environment first.

### From Magento Open Source

Migrating from Magento to Mage-OS is straightforward and typically takes 15-30 minutes. Your existing extensions, themes, and customizations remain compatible.

See the [Migration Guide](/get-started/migration-guide) for step-by-step instructions.

---

## Repositories

### Main Distribution

| Resource | URL |
|----------|-----|
| **Composer Repository** | `https://repo.mage-os.org/` |
| **GitHub Source** | [github.com/mage-os/mageos-magento2](https://github.com/mage-os/mageos-magento2) |

### Mage-OS Lab

Experimental features and community innovations are developed in Mage-OS Lab before being included in the main distribution.

| Resource | URL |
|----------|-----|
| **GitHub Organization** | [github.com/mage-os-lab](https://github.com/mage-os-lab) |

### Magento Mirrors

Mage-OS provides public Magento Open Source mirrors for installing Magento without Adobe Marketplace authentication:

| Region | Mirror URL |
|--------|------------|
| EU (Primary) | [mirror.mage-os.org](https://mirror.mage-os.org/) |
| EU (Hypernode) | [mage-os.hypernode.com/mirror/](https://mage-os.hypernode.com/mirror/) |
| EU (maxcluster) | [mage-os.maxcluster.net/mirror/](https://mage-os.maxcluster.net/mirror/) |
| UK (Sonassi) | [mirror.sonassi.com](https://mirror.sonassi.com/) |
| US (Breeze) | [mage-os-usa.breeze.io/mirror/](https://mage-os-usa.breeze.io/mirror/) |
| US (JetRails) | [mage-os-repo.jetrails.com/mirror/](https://mage-os-repo.jetrails.com/mirror/) |
| IN (Breeze) | [mage-os-india.breeze.io/mirror/](https://mage-os-india.breeze.io/mirror/) |

### Documentation

| Resource | URL |
|----------|-----|
| **Developer Docs** | [devdocs.mage-os.org](https://devdocs.mage-os.org) |
| **Docs GitHub** | [github.com/mage-os/devdocs](https://github.com/mage-os/devdocs) |

---

## Acknowledgments

Mage-OS releases are made possible by our global community of contributors. Special thanks to:

- **Code Contributors** - Pull request authors and reviewers
- **Lab Developers** - Creators of experimental features and innovations
- **QA Volunteers** - Testing and quality assurance
- **Documentation Writers** - Keeping our docs accurate and helpful
- **Financial Supporters** - Partners and sponsors who fund development

[View all contributors](/community) | [Become a contributor](/community/get-involved)

---

## Get Started Today

Ready to try the latest Mage-OS release?

| Action | Link | Description |
|--------|------|-------------|
| **Quick Start** | [Get Started](/get-started/quick-start) | Install Mage-OS in 30 minutes |
| **System Requirements** | [View Requirements](/get-started/system-requirements) | Check your server compatibility |
| **Migration Guide** | [Migrate Now](/get-started/migration-guide) | Switch from Magento Open Source |
| **Features** | [Explore Features](/product/features) | See what makes Mage-OS different |

---

## Need Help?

- **Community Support:** Join our [Discord server](/discord-channel) for real-time help
- **Documentation:** Browse [devdocs.mage-os.org](https://devdocs.mage-os.org) for technical guides
- **GitHub Issues:** Report bugs at [github.com/mage-os/mageos-magento2](https://github.com/mage-os/mageos-magento2/issues)
