#!/usr/bin/env node

/**
 * Fetches Mage-OS version data from github-actions repository
 * and saves it as fallback.json for build-time resilience.
 *
 * Run manually: node scripts/fetch-versions.mjs
 * Or automatically: npm run fetch-versions (before build)
 *
 * Source: https://github.com/mage-os/github-actions/tree/main/supported-version/src/versions/mage-os
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://raw.githubusercontent.com/mage-os/github-actions/main/supported-version/src/versions/mage-os';

const OUTPUT_PATH = join(__dirname, '../src/data/system-requirements/fallback.json');

/**
 * Normalize version entry to ensure all expected fields exist
 */
function normalizeEntry(entry) {
  return {
    magento: entry.magento || '',
    php: entry.php,
    composer: entry.composer,
    mysql: entry.mysql || '',
    elasticsearch: entry.elasticsearch || '',
    opensearch: entry.opensearch || '',
    rabbitmq: entry.rabbitmq || '',
    redis: entry.redis || '',
    varnish: entry.varnish || '',
    valkey: entry.valkey || '',
    nginx: entry.nginx || '',
    os: entry.os || 'ubuntu-latest',
    release: entry.release || '',
    eol: entry.eol || '',
  };
}

/**
 * Normalize all entries in a version object
 */
function normalizeVersions(versions) {
  const normalized = {};
  for (const [key, entry] of Object.entries(versions)) {
    normalized[key] = normalizeEntry(entry);
  }
  return normalized;
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`Retry ${i + 1}/${retries} for ${url}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function main() {
  console.log('Fetching Mage-OS version data...');

  try {
    const [composite, individual] = await Promise.all([
      fetchWithRetry(`${BASE_URL}/composite.json`),
      fetchWithRetry(`${BASE_URL}/individual.json`),
    ]);

    const data = {
      composite: normalizeVersions(composite),
      individual: normalizeVersions(individual),
    };

    writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2) + '\n');

    const compositeCount = Object.keys(data.composite).length;
    const individualCount = Object.keys(data.individual).length;

    console.log(`✓ Version data updated successfully`);
    console.log(`  - ${compositeCount} composite version ranges`);
    console.log(`  - ${individualCount} individual releases`);
    console.log(`  - Output: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('✗ Failed to fetch version data:', error.message);
    console.error('  Keeping existing fallback.json');
    process.exit(1);
  }
}

main();
