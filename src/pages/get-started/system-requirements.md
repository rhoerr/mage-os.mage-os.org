---
title: 'System Requirements'
description: 'Complete technical requirements for Mage-OS including PHP versions, database specifications, and server configuration.'
tagline: 'Get Started'
layout: '~/layouts/ContentPageLayout.astro'
---

Ensure your environment meets these requirements before installation.

## Recommended Software Versions (Mage-OS 2.0)

| Component      | Recommended Version      |
| -------------- | ------------------------ |
| PHP            | 8.4 / 8.3                |
| Composer       | 2.8                      |
| OpenSearch     | 2.19                     |
| MariaDB        | 11.4                     |
| MySQL          | 8.4                      |
| RabbitMQ       | 4                        |
| Redis / Valkey | Valkey 8 (or Redis 7.2+) |
| Varnish        | 7.6                      |
| Apache         | 2.4                      |
| nginx          | 1.26                     |

---

## Operating System

- **Linux distributions:** Ubuntu 22.04+, Debian 12+, Rocky Linux 9+, AlmaLinux 9+
- **macOS:** 13+ (development only)
- **Windows:** via WSL2 (development only)

---

## Web Server

### Apache

- Version 2.4+
- `mod_rewrite` enabled
- `.htaccess` support

### Nginx

- Version 1.26+
- Proper rewrite rules configured

---

## PHP Requirements

### Supported Versions

- PHP 8.3 (recommended for stability)
- PHP 8.4 (latest features)

### Required Extensions

```
bcmath, ctype, curl, dom, fileinfo, gd, hash, iconv, intl,
json, libxml, mbstring, openssl, pcre, pdo_mysql, simplexml,
soap, sockets, sodium, xml, xsl, zip, zlib
```

### PHP Settings

| Setting             | Minimum | Recommended |
| ------------------- | ------- | ----------- |
| memory_limit        | 2GB     | 4GB         |
| max_execution_time  | 300     | 600         |
| max_input_vars      | 10000   | 75000       |
| post_max_size       | 64M     | 256M        |
| upload_max_filesize | 64M     | 256M        |
| realpath_cache_size | 10M     | 10M         |
| realpath_cache_ttl  | 7200    | 7200        |

---

## Database

### Supported Databases

| Database | Minimum Version | Recommended |
| -------- | --------------- | ----------- |
| MySQL    | 8.0             | 8.4         |
| MariaDB  | 10.6            | 11.4        |
| Percona  | 8.0             | 8.0         |

### Database Settings

```ini
innodb_buffer_pool_size = 1G  # Adjust based on available RAM
innodb_log_file_size = 256M
max_allowed_packet = 64M
tmp_table_size = 64M
max_heap_table_size = 64M
```

---

## Search Engine

### Supported Search Engines

| Engine        | Minimum Version | Recommended |
| ------------- | --------------- | ----------- |
| OpenSearch    | 2.5             | 2.19        |
| Elasticsearch | 7.17            | 8.x         |

### Memory Requirements

- Minimum: 2GB heap
- Recommended: 4GB+ heap for production

---

## Cache & Sessions

### Redis / Valkey (Recommended)

| Software | Minimum Version | Recommended |
| -------- | --------------- | ----------- |
| Valkey   | 7.0             | 8.0         |
| Redis    | 7.0             | 7.2+        |

### Varnish (Production)

| Version | Status      |
| ------- | ----------- |
| 7.6     | Recommended |
| 7.x     | Supported   |

---

## Message Queue

### RabbitMQ (Optional)

| Version | Status      |
| ------- | ----------- |
| 4.0     | Recommended |
| 3.12+   | Supported   |

---

## Composer

- Version 2.8+ required
- Memory: 2GB+ available for installation

---

## Disk Space

| Purpose     | Minimum | Recommended |
| ----------- | ------- | ----------- |
| Application | 5GB     | 10GB        |
| Database    | 10GB    | 50GB+       |
| Media files | Varies  | Varies      |
| Logs        | 5GB     | 10GB        |

---

## Compatibility Matrix

| Mage-OS Version | PHP     | MySQL | OpenSearch | Magento Base |
| --------------- | ------- | ----- | ---------- | ------------ |
| 2.0             | 8.3-8.4 | 8.0+  | 2.5+       | 2.4.8-p3     |
| 1.3             | 8.2-8.3 | 8.0+  | 2.5+       | 2.4.7-p3     |
| 1.2             | 8.2-8.3 | 8.0+  | 2.5+       | 2.4.7-p2     |
| 1.1             | 8.1-8.2 | 8.0+  | 2.5+       | 2.4.6-p4     |

---

## Recommended Hosting Environments

### Managed Magento Hosting

- **Hypernode** - Optimized for Magento/Mage-OS
- **Nexcess** - Managed Magento hosting
- **Cloudways** - Managed cloud platform

### Cloud Providers

- **AWS EC2** - t3.large or larger
- **Google Cloud** - n2-standard-2 or larger
- **Azure** - Standard_D2s_v3 or larger
- **DigitalOcean** - Premium Droplets 4GB+

### Development Environments

- **DDEV** - Docker-based local development
- **Warden** - Docker environment for Magento
- **Lando** - Flexible Docker development

---

## Next Steps

- [Quick Start Guide](/get-started/quick-start) - Get started in 30 minutes
- [Installation Guide](/get-started/installation) - Detailed installation instructions
- [Migration Guide](/get-started/migration-guide) - Migrate from Magento
