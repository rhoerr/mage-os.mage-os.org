import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

const WP_EVENTS_DIR = '../wp-export/output/custom/ajde_events';
const ASTRO_EVENTS_DIR = './src/data/events';

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  try {
    const frontmatter = yaml.load(match[1]);
    const body = match[2];
    return { frontmatter, body };
  } catch (e) {
    console.error('Failed to parse frontmatter:', e.message);
    return null;
  }
}

function extractExcerpt(body, maxLength = 160) {
  if (!body || body.trim().length === 0) return '';

  let text = body
    .replace(/^#+\s+.*/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

function extractLocationFromTitle(title) {
  // Try to extract location from common patterns
  const patterns = [
    /Meet Magento\s+(.+)/i,
    /Mage(?:Titans|Unconference)\s+(.+)/i,
    /MeetCommerce\s+(.+)/i,
    /Magento (?:Meetup|Stammtisch)\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

function transformEvent(filename, content) {
  const parsed = extractFrontmatter(content);
  if (!parsed) return null;

  const { frontmatter, body } = parsed;

  // Parse date
  let dateStr;
  if (frontmatter.date instanceof Date) {
    dateStr = frontmatter.date.toISOString();
  } else {
    dateStr = new Date(frontmatter.date + 'T00:00:00.000Z').toISOString();
  }

  // Build new frontmatter
  const newFrontmatter = {
    title: frontmatter.title,
    date: dateStr,
  };

  // Try to extract location from title
  const location = extractLocationFromTitle(frontmatter.title);
  if (location) {
    newFrontmatter.location = location;
  }

  // Add excerpt if there's body content
  const excerpt = extractExcerpt(body);
  if (excerpt) {
    newFrontmatter.excerpt = excerpt;
  }

  // Generate new content
  const newContent = `---
${yaml.dump(newFrontmatter, { lineWidth: -1, quotingType: '"', forceQuotes: true }).trim()}
---
${body}`;

  return newContent;
}

async function migrateEvent(filename, sourceDir, targetDir) {
  const sourcePath = join(sourceDir, filename);
  const content = await readFile(sourcePath, 'utf-8');

  const transformed = transformEvent(filename, content);
  if (!transformed) {
    console.error(`Failed to transform: ${filename}`);
    return false;
  }

  const targetPath = join(targetDir, filename);
  await writeFile(targetPath, transformed);
  console.log(`Migrated: ${filename}`);
  return true;
}

async function main() {
  // Ensure target directory exists
  if (!existsSync(ASTRO_EVENTS_DIR)) {
    await mkdir(ASTRO_EVENTS_DIR, { recursive: true });
  }

  // Get all markdown files
  const files = await readdir(WP_EVENTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith('.md') && !f.startsWith('.'));

  console.log(`Found ${mdFiles.length} events to migrate`);

  let success = 0;
  let failed = 0;

  for (const file of mdFiles) {
    try {
      if (await migrateEvent(file, WP_EVENTS_DIR, ASTRO_EVENTS_DIR)) {
        success++;
      } else {
        failed++;
      }
    } catch (e) {
      console.error(`Error migrating ${file}:`, e.message);
      failed++;
    }
  }

  console.log(`\nMigration complete: ${success} succeeded, ${failed} failed`);
}

main().catch(console.error);
