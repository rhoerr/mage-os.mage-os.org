import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { parseStringPromise } from 'xml2js';

const WP_EXPORT_DIR = '../wp-export';
const WP_POSTS_DIR = '../wp-export/output/posts';
const ASTRO_POSTS_DIR = './src/data/post';
const ASTRO_AUTHORS_DIR = './src/data/authors';

// Category mapping from lowercase to title case
const categoryMap = {
  updates: 'Updates',
  releases: 'Releases',
  initiatives: 'Initiatives',
  'ecommerce-insights': 'eCommerce Insights',
  'case-studies': 'Case Studies',
  event: 'Events',
  events: 'Events',
  'event-recap': 'Events',
  community: 'Community',
  technical: 'Technical',
};

// Store parsed author data and post-author mappings
let authorsMap = new Map(); // login -> author details
let postAuthorMap = new Map(); // post slug -> author login

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractCDATA(value) {
  if (!value) return '';
  if (Array.isArray(value)) value = value[0];
  if (typeof value === 'string') return value;
  if (value._) return value._;
  return '';
}

async function parseWordPressExport() {
  // Find the latest WP export XML file
  const files = await readdir(WP_EXPORT_DIR);
  const xmlFiles = files
    .filter((f) => f.endsWith('.xml'))
    .sort()
    .reverse();

  if (xmlFiles.length === 0) {
    console.error('No WordPress export XML files found in', WP_EXPORT_DIR);
    return false;
  }

  const latestXml = xmlFiles[0];
  console.log(`Parsing WordPress export: ${latestXml}`);

  const xmlContent = await readFile(join(WP_EXPORT_DIR, latestXml), 'utf-8');
  const result = await parseStringPromise(xmlContent, { explicitArray: false });

  const channel = result.rss.channel;

  // Parse authors
  const wpAuthors = channel['wp:author'];
  const authorsList = Array.isArray(wpAuthors) ? wpAuthors : [wpAuthors];

  for (const author of authorsList) {
    const login = extractCDATA(author['wp:author_login']);
    const displayName = extractCDATA(author['wp:author_display_name']);
    const firstName = extractCDATA(author['wp:author_first_name']);
    const lastName = extractCDATA(author['wp:author_last_name']);
    const email = extractCDATA(author['wp:author_email']);

    // Determine the best name to use
    let name = displayName;
    if (firstName && lastName) {
      name = `${firstName} ${lastName}`;
    } else if (firstName) {
      name = firstName;
    } else if (!displayName || displayName === login || displayName.includes('@')) {
      // Skip authors with no proper name
      name = login;
    }

    authorsMap.set(login, {
      login,
      name,
      displayName,
      firstName,
      lastName,
      email,
      slug: slugify(name),
    });
  }

  console.log(`Found ${authorsMap.size} authors in WordPress export`);

  // Parse posts to get author mappings
  const items = channel.item;
  const itemsList = Array.isArray(items) ? items : [items];

  for (const item of itemsList) {
    const postType = extractCDATA(item['wp:post_type']);
    if (postType !== 'post') continue;

    const postStatus = extractCDATA(item['wp:status']);
    if (postStatus !== 'publish') continue;

    const creator = extractCDATA(item['dc:creator']);
    const postName = extractCDATA(item['wp:post_name']);
    const pubDate = item.pubDate;

    // Extract date from pubDate or post_date
    let dateStr = '';
    if (pubDate) {
      const date = new Date(pubDate);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      }
    }

    if (dateStr && postName) {
      const filename = `${dateStr}-${postName}.md`;
      postAuthorMap.set(filename, creator);
    }
  }

  console.log(`Found ${postAuthorMap.size} published posts with author mappings`);
  return true;
}

async function generateAuthorFiles() {
  // Ensure authors directory exists
  if (!existsSync(ASTRO_AUTHORS_DIR)) {
    await mkdir(ASTRO_AUTHORS_DIR, { recursive: true });
  }

  // Track which slugs we've used to avoid duplicates
  const usedSlugs = new Set();

  // Always ensure mage-os-team author exists
  const mageOsTeamPath = join(ASTRO_AUTHORS_DIR, 'mage-os-team.md');
  if (!existsSync(mageOsTeamPath)) {
    const mageOsTeamContent = `---
name: Mage-OS Team
slug: mage-os-team
avatar: ~/assets/images/mage-os-logo.svg
bio: The official Mage-OS project team.
website: https://mage-os.org
social:
  github: https://github.com/mage-os
  discord: https://discord.gg/nvZDVA2NdC
---
`;
    await writeFile(mageOsTeamPath, mageOsTeamContent);
    console.log('Created author: mage-os-team');
  }
  usedSlugs.add('mage-os-team');

  // Map mage-os-admin to mage-os-team
  const adminAuthor = authorsMap.get('mage-os-admin');
  if (adminAuthor) {
    adminAuthor.slug = 'mage-os-team';
  }

  // Generate author files for each unique author used in posts
  const usedAuthors = new Set(postAuthorMap.values());

  for (const login of usedAuthors) {
    const author = authorsMap.get(login);
    if (!author) {
      console.warn(`Warning: Author login "${login}" not found in author list`);
      continue;
    }

    // Skip if this maps to mage-os-team
    if (author.slug === 'mage-os-team') continue;

    // Handle duplicate slugs
    let slug = author.slug;
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${login.substring(0, 4)}`;
    }
    usedSlugs.add(slug);
    author.slug = slug;

    const authorPath = join(ASTRO_AUTHORS_DIR, `${slug}.md`);

    // Skip if author file already exists
    if (existsSync(authorPath)) {
      console.log(`Author exists: ${slug}`);
      continue;
    }

    const frontmatter = {
      name: author.name,
      slug: slug,
    };

    // Only add bio placeholder if we have a real name
    if (author.name !== author.login) {
      frontmatter.bio = `Mage-OS contributor.`;
    }

    const authorContent = `---
${yaml.dump(frontmatter, { lineWidth: -1, quotingType: '"', forceQuotes: false }).trim()}
---
`;

    await writeFile(authorPath, authorContent);
    console.log(`Created author: ${slug}`);
  }
}

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
  // Remove markdown formatting and get plain text
  let text = body
    .replace(/^#+\s+.*/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/[*_`]/g, '') // Remove emphasis markers
    .replace(/\n+/g, ' ') // Convert newlines to spaces
    .trim();

  if (text.length <= maxLength) return text;

  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

function getYearFromFilename(filename) {
  const match = filename.match(/^(\d{4})-/);
  return match ? match[1] : '2025';
}

function getAuthorSlug(filename) {
  const authorLogin = postAuthorMap.get(filename);
  if (!authorLogin) {
    return 'mage-os-team'; // Default author
  }

  const author = authorsMap.get(authorLogin);
  if (!author) {
    return 'mage-os-team';
  }

  return author.slug;
}

function transformPost(filename, content) {
  const parsed = extractFrontmatter(content);
  if (!parsed) return null;

  const { frontmatter, body } = parsed;
  const year = getYearFromFilename(filename);

  // Transform categories
  const categories = frontmatter.categories || [];
  const primaryCategory = categories[0] || 'updates';
  const additionalCategories = categories.slice(1);

  // Parse date - handle both string and Date object
  let dateStr;
  if (frontmatter.date instanceof Date) {
    dateStr = frontmatter.date.toISOString();
  } else {
    dateStr = new Date(frontmatter.date + 'T00:00:00.000Z').toISOString();
  }

  // Get author slug for this post
  const authorSlug = getAuthorSlug(filename);

  // Build new frontmatter
  const newFrontmatter = {
    title: frontmatter.title,
    publishDate: dateStr,
    category: categoryMap[primaryCategory] || 'Updates',
    author: authorSlug,
    draft: false,
  };

  // Add excerpt
  newFrontmatter.excerpt = extractExcerpt(body);

  // Add tags if there are additional categories
  if (additionalCategories.length > 0) {
    newFrontmatter.tags = additionalCategories.map((c) => categoryMap[c] || c);
  }

  // Handle cover image
  if (frontmatter.coverImage) {
    newFrontmatter.image = `~/assets/images/blog/${year}/${frontmatter.coverImage}`;
  }

  // Update image references in body
  let updatedBody = body;

  // Fix markdown image references
  updatedBody = updatedBody.replace(/!\[([^\]]*)\]\((?!http)([^)]+)\)/g, (_, alt, src) => {
    // Strip 'images/' prefix if present since assets are stored directly in year folders
    const cleanSrc = src.replace(/^images\//, '');
    return `![${alt}](~/assets/images/blog/${year}/${cleanSrc})`;
  });

  // Generate new content
  const newContent = `---
${yaml.dump(newFrontmatter, { lineWidth: -1, quotingType: '"', forceQuotes: true }).trim()}
---
${updatedBody}`;

  return newContent;
}

async function migratePost(filename, sourceDir, targetDir) {
  const sourcePath = join(sourceDir, filename);
  const content = await readFile(sourcePath, 'utf-8');

  const transformed = transformPost(filename, content);
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
  // First, parse the WordPress export to get author data
  const parsed = await parseWordPressExport();
  if (!parsed) {
    console.error('Failed to parse WordPress export');
    process.exit(1);
  }

  // Generate author files
  await generateAuthorFiles();

  // Ensure target directory exists
  if (!existsSync(ASTRO_POSTS_DIR)) {
    await mkdir(ASTRO_POSTS_DIR, { recursive: true });
  }

  // Get all markdown files from year subdirectories (which have coverImage)
  const yearDirs = ['2021', '2022', '2023', '2024', '2025', '2026'];
  let allMdFiles = [];

  for (const year of yearDirs) {
    const yearDir = join(WP_POSTS_DIR, year);
    if (existsSync(yearDir)) {
      const files = await readdir(yearDir);
      const mdFiles = files
        .filter((f) => f.endsWith('.md') && !f.startsWith('.'))
        .map((f) => ({ file: f, sourceDir: yearDir }));
      allMdFiles = allMdFiles.concat(mdFiles);
    }
  }

  console.log(`\nFound ${allMdFiles.length} posts to migrate from year subdirectories`);

  let success = 0;
  let failed = 0;

  for (const { file, sourceDir } of allMdFiles) {
    try {
      if (await migratePost(file, sourceDir, ASTRO_POSTS_DIR)) {
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
