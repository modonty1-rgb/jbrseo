"use server";

import { unstable_cache } from "next/cache";

import { modontyDb } from "@/lib/modontyDb";

export type ModontyLogoItem = {
  slug: string;
  name: string;
  logoUrl: string | null; // null = no real logo → UI shows initials pill
  initials: string;       // 1–2 chars fallback ("أح" · "MB")
  initialsHue: number;    // 0–360, deterministic per name — used for placeholder color
  altText: string;
  href: string;
  isFeatured: boolean;
  industryKey: string;
  industryLabel: string;
};

export type ModontyIndustryTab = {
  key: string;
  label: string;
  count: number;
};

export type ModontyTrustBundle = {
  logos: ModontyLogoItem[];
  industries: ModontyIndustryTab[];
  total: number;
};

const MODONTY_PUBLIC_ORIGIN =
  process.env.NEXT_PUBLIC_MODONTY_SITE_URL?.replace(/\/+$/, "") ??
  "https://www.modonty.com";

// A client is considered logo-less if their `logoMediaId` is unset OR they
// were auto-assigned Modonty's default `og-image` placeholder. UI shows an
// initials pill for these.
function isRealLogo(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return !/og-image|placeholder/i.test(trimmed);
}

// Strip common Arabic/English honorifics before deriving initials so we
// don't end up with pills like "دك" for every doctor.
const TITLE_STRIPPERS: RegExp[] = [
  /^الدكتور\s+/,
  /^دكتور\s+/,
  /^أ\.?\s*د\.?\s*/,
  /^ا\.?\s*د\.?\s*/,
  /^اد\s*\/?\s*/,
  /^د\s*[.\/]\s*/,
  /^د\s+/,
  /^Dr\.?\s+/i,
  /^Prof\.?\s+/i,
  /^عيادة\s+/,
  /^عيادات\s+/,
  /^شركة\s+/,
  /^مؤسسة\s+/,
  /^متجر\s+/,
  /^دار\s+/,
];

function extractInitials(name: string): string {
  let clean = name.trim();
  for (const rx of TITLE_STRIPPERS) {
    clean = clean.replace(rx, "").trim();
  }
  if (!clean) return "؟";
  const chars = [...clean].filter((c) => c.trim());
  return chars.slice(0, 2).join("") || "؟";
}

function makeIndustryKey(name: string | null | undefined): string | null {
  const n = (name ?? "").trim();
  return n || null;
}

// Deterministic hue (0–360) from client name — same client always gets the
// same placeholder color, but two neighboring clients look distinct.
function hashHue(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h) % 360;
}

// Featured first, then the rest, each half alphabetical.
//
// This used to interleave them — featured clients spread evenly through the list so the
// landing's top four were not a row of gold stars. That made sense when the landing
// showed a slice of everyone; now it shows a deliberate four and links to the full wall,
// so those four should be the ones chosen to represent the roster rather than whoever
// sorted first. The star badge is dropped in the teaser for the same reason: a mark that
// applies to every tile marks nothing.
function featuredFirst<T extends { isFeatured: boolean }>(items: T[]): T[] {
  return [...items.filter((x) => x.isFeatured), ...items.filter((x) => !x.isFeatured)];
}

async function fetchTrustBundle(): Promise<ModontyTrustBundle> {
  const rows = await modontyDb.modontyClient.findMany({
    where: {
      subscriptionStatus: "ACTIVE",
      paymentStatus: "PAID",
    },
    select: {
      slug: true,
      name: true,
      isFeatured: true,
      logoMedia: { select: { url: true, altText: true } },
      industry: { select: { name: true } },
    },
  });

  // Step 1: bucket raw industry counts (before top-N folding)
  const rawCounts = new Map<string, number>();
  for (const r of rows) {
    const key = makeIndustryKey(r.industry?.name);
    if (!key) continue;
    rawCounts.set(key, (rawCounts.get(key) ?? 0) + 1);
  }

  // Step 2: keep the top-N largest industries as their own tab; the rest
  // fold into a single "أخرى" tab. Mobile-friendly (max ~5 visible tabs
  // once "الكل" is added).
  const TOP_N = 3;
  const OTHER_KEY = "__other__";
  const OTHER_LABEL = "أخرى";
  const topIndustryKeys = new Set(
    [...rawCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_N)
      .map(([k]) => k),
  );

  const alphabetical: ModontyLogoItem[] = rows
    .map((r) => {
      const cleanName = r.name.trim();
      const rawKey = makeIndustryKey(r.industry?.name);
      const hasReal = isRealLogo(r.logoMedia?.url);
      const tabKey = rawKey
        ? (topIndustryKeys.has(rawKey) ? rawKey : OTHER_KEY)
        : "";
      return {
        slug: r.slug,
        name: cleanName,
        logoUrl: hasReal ? r.logoMedia!.url : null,
        initials: extractInitials(cleanName),
        initialsHue: hashHue(cleanName),
        altText: r.logoMedia?.altText?.trim() || `شعار ${cleanName}`,
        href: `${MODONTY_PUBLIC_ORIGIN}/${encodeURIComponent(r.slug)}`,
        isFeatured: !!r.isFeatured,
        industryKey: tabKey,
        industryLabel: rawKey ?? "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "ar"));

  // Featured first: the landing takes the first four, and those four are the ones
  // marked as worth showing.
  const logos = featuredFirst(alphabetical);

  // Step 3: build the tab list — top-N industries sorted by count desc,
  // then "أخرى" at the end if any client folded there.
  const tabCounts = new Map<string, number>();
  for (const l of logos) {
    if (!l.industryKey) continue;
    tabCounts.set(l.industryKey, (tabCounts.get(l.industryKey) ?? 0) + 1);
  }

  const industries: ModontyIndustryTab[] = [];
  for (const [k, c] of [...tabCounts.entries()]
    .filter(([k]) => k !== OTHER_KEY)
    .sort((a, b) => b[1] - a[1])) {
    industries.push({ key: k, label: k, count: c });
  }
  const otherCount = tabCounts.get(OTHER_KEY) ?? 0;
  if (otherCount > 0) {
    industries.push({ key: OTHER_KEY, label: OTHER_LABEL, count: otherCount });
  }

  return {
    logos,
    industries,
    total: logos.length,
  };
}

const getTrustBundleCached = unstable_cache(
  fetchTrustBundle,
  // Bumped with the ordering change — the old key holds the interleaved list.
  ["modonty-trust-bundle-v12-featured-first"],
  { revalidate: 60, tags: ["modonty-client-logos"] },
);

export async function getModontyTrustBundle(): Promise<ModontyTrustBundle> {
  return getTrustBundleCached();
}
