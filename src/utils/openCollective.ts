import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

// Open Collective API response types
export interface OpenCollectiveMember {
  MemberId: number;
  createdAt: string;
  type: 'USER' | 'ORGANIZATION';
  role: 'ADMIN' | 'HOST' | 'BACKER';
  isActive: boolean;
  totalAmountDonated: number;
  currency?: string;
  lastTransactionAt: string;
  lastTransactionAmount: number;
  profile: string;
  name: string;
  company: string | null;
  description: string | null;
  image: string | null;
  email: null;
  twitter: string | null;
  github: string | null;
  website: string | null;
  tier?: string;
}

export type PartnerTier = 'platinum' | 'gold' | 'silver' | 'bronze';

export interface Partner {
  id: number;
  name: string;
  tier: PartnerTier;
  logoUrl: string | null;
  profileUrl: string;
  website: string | null;
  description: string | null;
  totalDonated: number;
  isActive: boolean;
  joinedAt: Date;
  lastTransactionAt: Date;
}

// Tier ID mapping from Open Collective
const PARTNER_TIER_IDS: Record<PartnerTier, number> = {
  platinum: 48128,
  gold: 48129,
  silver: 48130,
  bronze: 48131,
};

const TIER_PRIORITY: Record<PartnerTier, number> = {
  platinum: 1,
  gold: 2,
  silver: 3,
  bronze: 4,
};

const BASE_URL = 'https://opencollective.com/mage-os/members/all.json';
const CACHE_FILE = path.join(process.cwd(), '.cache/partners.json');
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes for dev

interface CachedData {
  timestamp: number;
  partners: Partner[];
}

function ensureCacheDir(): void {
  const cacheDir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
}

function readCache(): CachedData | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    return data;
  } catch {
    return null;
  }
}

function writeCache(partners: Partner[]): void {
  ensureCacheDir();
  const data: CachedData = {
    timestamp: Date.now(),
    partners,
  };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}

// Fetch partners for a specific tier
async function fetchTierPartners(tier: PartnerTier): Promise<Partner[]> {
  const tierId = PARTNER_TIER_IDS[tier];
  const url = `${BASE_URL}?TierId=${tierId}&limit=100`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mage-OS-Website/1.0',
    },
  });

  if (!response.ok) {
    console.warn(`[Partners] Failed to fetch ${tier} partners: ${response.status}`);
    return [];
  }

  const members: OpenCollectiveMember[] = await response.json();

  return members
    .filter((m) => m.isActive && m.name !== 'Incognito')
    .map((m) => ({
      id: m.MemberId,
      name: m.name,
      tier,
      logoUrl: m.image || null,
      profileUrl: m.profile,
      website: m.website,
      description: m.description,
      totalDonated: m.totalAmountDonated,
      isActive: m.isActive,
      joinedAt: new Date(m.createdAt),
      lastTransactionAt: new Date(m.lastTransactionAt),
    }));
}

// Fetch all partners from all tiers
async function fetchAllPartners(): Promise<Partner[]> {
  const tiers: PartnerTier[] = ['platinum', 'gold', 'silver', 'bronze'];

  const results = await Promise.allSettled(tiers.map((tier) => fetchTierPartners(tier)));

  const partners: Partner[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      partners.push(...result.value);
    } else {
      console.warn(`[Partners] Failed to fetch ${tiers[index]} partners:`, result.reason);
    }
  });

  // Sort by tier priority, then by total donated (descending)
  return partners.sort((a, b) => {
    const tierDiff = TIER_PRIORITY[a.tier] - TIER_PRIORITY[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return b.totalDonated - a.totalDonated;
  });
}

// YAML fallback types
interface YamlPartner {
  name: string;
  logo: string;
  url: string;
}

interface YamlPartnersData {
  platinum?: YamlPartner[];
  gold?: YamlPartner[];
  silver?: YamlPartner[];
  bronze?: YamlPartner[];
}

function loadFallbackData(): Partner[] {
  try {
    const yamlPath = path.join(process.cwd(), 'src/data/partners.yaml');
    if (!fs.existsSync(yamlPath)) {
      console.warn('[Partners] YAML fallback file not found');
      return [];
    }
    const content = fs.readFileSync(yamlPath, 'utf-8');
    const data = yaml.load(content) as YamlPartnersData;

    const partners: Partner[] = [];
    const tiers: PartnerTier[] = ['platinum', 'gold', 'silver', 'bronze'];

    tiers.forEach((tier) => {
      const tierPartners = data[tier] || [];
      tierPartners.forEach((p, index) => {
        partners.push({
          id: -(index + 1), // Negative IDs for fallback
          name: p.name,
          tier,
          logoUrl: null, // YAML uses local paths, not URLs
          profileUrl: p.url,
          website: p.url,
          description: null,
          totalDonated: 0,
          isActive: true,
          joinedAt: new Date(),
          lastTransactionAt: new Date(),
        });
      });
    });

    return partners;
  } catch (error) {
    console.error('[Partners] Failed to load fallback data:', error);
    return [];
  }
}

// Main function to get partners with caching
export async function getPartners(options?: { skipCache?: boolean }): Promise<Partner[]> {
  const isDev = import.meta.env.DEV;

  // In dev mode, use cache if valid
  if (isDev && !options?.skipCache) {
    const cached = readCache();
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log('[Partners] Using cached data');
      return cached.partners.map((p) => ({
        ...p,
        joinedAt: new Date(p.joinedAt),
        lastTransactionAt: new Date(p.lastTransactionAt),
      }));
    }
  }

  console.log('[Partners] Fetching from Open Collective API...');

  try {
    const partners = await fetchAllPartners();

    // Cache results in dev mode
    if (isDev && partners.length > 0) {
      writeCache(partners);
    }

    if (partners.length === 0) {
      console.warn('[Partners] No partners from API, using fallback');
      return loadFallbackData();
    }

    return partners;
  } catch (error) {
    console.error('[Partners] API fetch failed, using fallback:', error);
    return loadFallbackData();
  }
}

// Group partners by tier for grid display
export function groupPartnersByTier(partners: Partner[]): Record<PartnerTier, Partner[]> {
  return {
    platinum: partners.filter((p) => p.tier === 'platinum'),
    gold: partners.filter((p) => p.tier === 'gold'),
    silver: partners.filter((p) => p.tier === 'silver'),
    bronze: partners.filter((p) => p.tier === 'bronze'),
  };
}

// Helper to get initials for fallback display
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// Community stats interface
export interface CommunityStats {
  totalContributors: number;
  communityMembers: number;
  professionalMembers: number;
  partnerCompanies: number;
  totalContributions: number;
}

// Fetch community stats from Open Collective (includes all contributors, active and past)
export async function getCommunityStats(): Promise<CommunityStats> {
  const url = `${BASE_URL}?limit=500`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mage-OS-Website/1.0',
      },
    });

    if (!response.ok) {
      console.warn(`[Stats] Failed to fetch members: ${response.status}`);
      return getDefaultStats();
    }

    const members: OpenCollectiveMember[] = await response.json();

    // Filter out incognito and count unique contributors
    const validMembers = members.filter((m) => m.name !== 'Incognito');

    // Count by tier (includes both active and inactive)
    const communityMembers = validMembers.filter((m) => m.tier === 'Community Member').length;
    const professionalMembers = validMembers.filter((m) => m.tier === 'Professional Member').length;
    const partnerCompanies = validMembers.filter((m) =>
      ['Bronze Partner', 'Silver Partner', 'Gold Partner', 'Platinum Partner'].includes(m.tier || '')
    ).length;

    // Total unique contributors (all tiers including one-time donors with null tier)
    const totalContributors = validMembers.length;

    // Calculate total contributions from unique members (by MemberId to avoid double-counting)
    const uniqueMembers = new Map<number, number>();
    for (const member of validMembers) {
      const existing = uniqueMembers.get(member.MemberId) || 0;
      // Take the max in case same member appears in multiple tiers
      uniqueMembers.set(member.MemberId, Math.max(existing, member.totalAmountDonated));
    }
    const totalContributions = Array.from(uniqueMembers.values()).reduce((sum, amount) => sum + amount, 0);

    return {
      totalContributors,
      communityMembers,
      professionalMembers,
      partnerCompanies,
      totalContributions,
    };
  } catch (error) {
    console.error('[Stats] Failed to fetch community stats:', error);
    return getDefaultStats();
  }
}

// Default stats as fallback
function getDefaultStats(): CommunityStats {
  return {
    totalContributors: 170,
    communityMembers: 80,
    professionalMembers: 65,
    partnerCompanies: 10,
    totalContributions: 106000,
  };
}

// Format contributions as a readable string (e.g., "€106K+")
export function formatContributions(amount: number): string {
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M+`;
  } else if (amount >= 1000) {
    return `€${Math.floor(amount / 1000)}K+`;
  }
  return `€${amount}+`;
}

// Individual member types
export type MemberTier = 'community' | 'professional';

export interface IndividualMember {
  id: number;
  name: string;
  tier: MemberTier;
  imageUrl: string | null;
  profileUrl: string;
  website: string | null;
  twitter: string | null;
  github: string | null;
  description: string | null;
  totalDonated: number;
  isActive: boolean;
  joinedAt: Date;
}

// Tier ID mapping for individual members
const MEMBER_TIER_IDS: Record<MemberTier, number> = {
  community: 44722,
  professional: 44723,
};

const MEMBERS_CACHE_FILE = path.join(process.cwd(), '.cache/members.json');

interface CachedMembersData {
  timestamp: number;
  members: IndividualMember[];
}

function readMembersCache(): CachedMembersData | null {
  try {
    if (!fs.existsSync(MEMBERS_CACHE_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(MEMBERS_CACHE_FILE, 'utf-8'));
    return data;
  } catch {
    return null;
  }
}

function writeMembersCache(members: IndividualMember[]): void {
  ensureCacheDir();
  const data: CachedMembersData = {
    timestamp: Date.now(),
    members,
  };
  fs.writeFileSync(MEMBERS_CACHE_FILE, JSON.stringify(data, null, 2));
}

// Fetch members for a specific tier
async function fetchTierMembers(tier: MemberTier): Promise<IndividualMember[]> {
  const tierId = MEMBER_TIER_IDS[tier];
  const url = `${BASE_URL}?TierId=${tierId}&limit=500`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mage-OS-Website/1.0',
    },
  });

  if (!response.ok) {
    console.warn(`[Members] Failed to fetch ${tier} members: ${response.status}`);
    return [];
  }

  const members: OpenCollectiveMember[] = await response.json();

  return members
    .filter((m) => m.isActive && m.name !== 'Incognito')
    .map((m) => ({
      id: m.MemberId,
      name: m.name,
      tier,
      imageUrl: m.image || null,
      profileUrl: m.profile,
      website: m.website,
      twitter: m.twitter,
      github: m.github,
      description: m.description,
      totalDonated: m.totalAmountDonated,
      isActive: m.isActive,
      joinedAt: new Date(m.createdAt),
    }));
}

// Fetch all individual members (community and professional)
export async function getIndividualMembers(options?: { skipCache?: boolean }): Promise<IndividualMember[]> {
  const isDev = import.meta.env.DEV;

  // In dev mode, use cache if valid
  if (isDev && !options?.skipCache) {
    const cached = readMembersCache();
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log('[Members] Using cached data');
      return cached.members.map((m) => ({
        ...m,
        joinedAt: new Date(m.joinedAt),
      }));
    }
  }

  console.log('[Members] Fetching from Open Collective API...');

  try {
    const tiers: MemberTier[] = ['professional', 'community'];
    const results = await Promise.allSettled(tiers.map((tier) => fetchTierMembers(tier)));

    const members: IndividualMember[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        members.push(...result.value);
      } else {
        console.warn(`[Members] Failed to fetch ${tiers[index]} members:`, result.reason);
      }
    });

    // Sort by tier (professional first), then by name
    const sorted = members.sort((a, b) => {
      if (a.tier !== b.tier) {
        return a.tier === 'professional' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    // Cache results in dev mode
    if (isDev && sorted.length > 0) {
      writeMembersCache(sorted);
    }

    return sorted;
  } catch (error) {
    console.error('[Members] API fetch failed:', error);
    return [];
  }
}

// Group members by tier
export function groupMembersByTier(members: IndividualMember[]): Record<MemberTier, IndividualMember[]> {
  return {
    professional: members.filter((m) => m.tier === 'professional'),
    community: members.filter((m) => m.tier === 'community'),
  };
}

// Calculate partnership stats
export interface PartnershipStats {
  totalPartners: number;
  totalContributions: number;
  platinumCount: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
}

export function calculatePartnerStats(partners: Partner[]): PartnershipStats {
  const grouped = groupPartnersByTier(partners);
  return {
    totalPartners: partners.length,
    totalContributions: partners.reduce((sum, p) => sum + p.totalDonated, 0),
    platinumCount: grouped.platinum.length,
    goldCount: grouped.gold.length,
    silverCount: grouped.silver.length,
    bronzeCount: grouped.bronze.length,
  };
}
