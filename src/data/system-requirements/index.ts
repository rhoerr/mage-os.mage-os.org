/**
 * Centralized system requirements data
 *
 * Fetches version data from mage-os/github-actions repository at build time.
 * Only the latest version is actively supported by policy.
 *
 * Source: https://github.com/mage-os/github-actions/tree/main/supported-version/src/versions/mage-os
 */

import type { PackageMatrixVersion, VersionData, ParsedVersion, QuickRequirements } from './types';
import fallbackData from './fallback.json';

const BASE_URL = 'https://raw.githubusercontent.com/mage-os/github-actions/main/supported-version/src/versions/mage-os';

// Cache for version data (singleton pattern for Astro build)
let versionDataCache: VersionData | null = null;

/**
 * Fetch version data from the remote repository
 * Falls back to local data if fetch fails
 */
export async function fetchVersionData(): Promise<VersionData> {
  if (versionDataCache) {
    return versionDataCache;
  }

  try {
    const [compositeRes, individualRes] = await Promise.all([
      fetch(`${BASE_URL}/composite.json`),
      fetch(`${BASE_URL}/individual.json`),
    ]);

    if (!compositeRes.ok || !individualRes.ok) {
      throw new Error('Failed to fetch version data');
    }

    const composite = await compositeRes.json();
    const individual = await individualRes.json();

    versionDataCache = { composite, individual };
    return versionDataCache;
  } catch (error) {
    console.warn('Using fallback version data:', error);
    versionDataCache = fallbackData as VersionData;
    return versionDataCache;
  }
}

/**
 * Extract clean version number from Docker image string
 * @example "mysql:8.4" -> "8.4"
 * @example "opensearchproject/opensearch:2.19.1" -> "2.19.1"
 * @example "rabbitmq:4.0-management" -> "4.0"
 */
export function parseDockerVersion(dockerImage: string): string {
  if (!dockerImage) return '';
  const match = dockerImage.match(/:([^:]+)$/);
  if (!match) return dockerImage;
  return match[1].replace(/-management$/, '').replace(/-alpine$/, '');
}

/**
 * Extract Mage-OS version from package key
 * @example "mage-os/project-community-edition:2.1.0" -> "2.1.0"
 */
export function extractVersion(packageKey: string): string {
  const match = packageKey.match(/:(\d+\.\d+\.\d+)$/);
  return match ? match[1] : packageKey;
}

/**
 * Extract major.minor version
 * @example "2.1.0" -> "2.1"
 */
export function getMajorMinor(version: string): string {
  const parts = version.split('.');
  return parts.slice(0, 2).join('.');
}

/**
 * Get the latest (actively supported) release
 * By policy, only the latest version is actively supported
 */
export async function getLatestRelease(): Promise<PackageMatrixVersion | null> {
  const { composite } = await fetchVersionData();

  // The unversioned key is the latest
  const latestKey = 'mage-os/project-community-edition';
  if (composite[latestKey]) {
    return composite[latestKey];
  }

  // Fallback: find the highest version
  const versions = Object.keys(composite)
    .filter((k) => k.includes(':'))
    .map((k) => ({ key: k, version: extractVersion(k) }))
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));

  return versions.length > 0 ? composite[versions[0].key] : null;
}

/**
 * Get a specific version's requirements
 */
export async function getRelease(version: string): Promise<PackageMatrixVersion | null> {
  const { individual } = await fetchVersionData();
  const key = `mage-os/project-community-edition:${version}`;
  return individual[key] || null;
}

/**
 * Get all individual releases (point releases)
 */
export async function getAllReleases(): Promise<ParsedVersion[]> {
  const { individual } = await fetchVersionData();
  const now = new Date();

  return Object.entries(individual)
    .map(([key, entry]) => ({
      version: extractVersion(key),
      upstream: extractUpstream(entry.magento),
      php: String(entry.php),
      composer: parseDockerVersion(String(entry.composer)),
      mysql: parseDockerVersion(entry.mysql),
      opensearch: parseDockerVersion(entry.opensearch),
      elasticsearch: parseDockerVersion(entry.elasticsearch),
      rabbitmq: parseDockerVersion(entry.rabbitmq),
      redis: parseDockerVersion(entry.redis),
      valkey: parseDockerVersion(entry.valkey),
      varnish: parseDockerVersion(entry.varnish),
      nginx: parseDockerVersion(entry.nginx),
      releaseDate: new Date(entry.release),
      eolDate: new Date(entry.eol),
      isActive: new Date(entry.eol) > now,
    }))
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
}

/**
 * Get major releases only (x.y.0 versions)
 */
export async function getMajorReleases(limit = 5): Promise<ParsedVersion[]> {
  const all = await getAllReleases();
  return all.filter((r) => r.version.endsWith('.0')).slice(0, limit);
}

/**
 * Extract upstream Magento version
 */
function extractUpstream(magento: string): string {
  // Handle format like "2.4.8-p3" or extract from package name
  const match = magento.match(/(\d+\.\d+\.\d+(?:-p\d+)?)/);
  return match ? match[1] : magento;
}

/**
 * Get quick requirements for display
 * Returns recommended versions for the latest release
 */
export async function getQuickRequirements(): Promise<QuickRequirements> {
  const latest = await getLatestRelease();

  if (!latest) {
    // Fallback defaults
    return {
      php: '8.4',
      composer: '2.9',
      mysql: '8.4',
      mariadb: '11.4',
      opensearch: '2.19',
      elasticsearch: '8.x',
      redis: '7.2',
      valkey: '8.0',
      rabbitmq: '4.0',
      varnish: '7.6',
      nginx: '1.26',
      apache: '2.4',
    };
  }

  return {
    php: String(latest.php),
    composer: parseDockerVersion(String(latest.composer)),
    mysql: parseDockerVersion(latest.mysql),
    mariadb: '11.4', // MariaDB equivalent (not in source data)
    opensearch: parseDockerVersion(latest.opensearch),
    elasticsearch: parseDockerVersion(latest.elasticsearch) || '8.x',
    redis: parseDockerVersion(latest.redis),
    valkey: parseDockerVersion(latest.valkey),
    rabbitmq: parseDockerVersion(latest.rabbitmq),
    varnish: parseDockerVersion(latest.varnish),
    nginx: parseDockerVersion(latest.nginx),
    apache: '2.4', // Apache version (not in source data)
  };
}

/**
 * Format date for display
 */
export function formatReleaseDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Re-export types
export type { PackageMatrixVersion, VersionData, ParsedVersion, QuickRequirements };
