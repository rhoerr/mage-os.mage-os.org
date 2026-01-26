/**
 * Type definitions for Mage-OS system requirements
 * Based on: https://github.com/mage-os/github-actions/blob/main/supported-version/src/matrix/matrix-type.ts
 */

/**
 * Raw version entry from the mage-os/github-actions repository
 */
export interface PackageMatrixVersion {
  magento: string;
  php: string | number;
  composer: string | number;
  mysql: string;
  elasticsearch: string;
  opensearch: string;
  rabbitmq: string;
  redis: string;
  varnish: string;
  valkey: string;
  nginx: string;
  os: string;
  release: string;
  eol: string;
}

/**
 * Version data fetched from the remote repository
 */
export interface VersionData {
  composite: Record<string, PackageMatrixVersion>;
  individual: Record<string, PackageMatrixVersion>;
}

/**
 * Parsed version info for display purposes
 */
export interface ParsedVersion {
  version: string;
  upstream: string;
  php: string;
  composer: string;
  mysql: string;
  opensearch: string;
  elasticsearch: string;
  rabbitmq: string;
  redis: string;
  valkey: string;
  varnish: string;
  nginx: string;
  releaseDate: Date;
  eolDate: Date;
  isActive: boolean;
}

/**
 * Simplified requirements for quick display
 */
export interface QuickRequirements {
  php: string;
  composer: string;
  mysql: string;
  mariadb: string;
  opensearch: string;
  elasticsearch: string;
  redis: string;
  valkey: string;
  rabbitmq: string;
  varnish: string;
  nginx: string;
  apache: string;
}
