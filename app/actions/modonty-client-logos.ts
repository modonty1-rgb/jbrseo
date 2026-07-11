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

// Distribute featured clients evenly through the list so the teaser view (top
// 4) isn't a row of solid gold-star cards. Featured land at positions 0,
// step, 2·step, … where step = floor(total / featuredCount). Rest fills in.
function interleaveFeatured<T extends { isFeatured: boolean }>(items: T[]): T[] {
  const featured = items.filter((x) => x.isFeatured);
  const regular = items.filter((x) => !x.isFeatured);
  if (featured.length === 0 || regular.length === 0) return items;

  const total = items.length;
  const step = Math.max(1, Math.floor(total / featured.length));
  const result: T[] = [];
  let fi = 0;
  let ri = 0;
  for (let i = 0; i < total; i++) {
    if (i % step === 0 && fi < featured.length) {
      result.push(featured[fi++]);
    } else if (ri < regular.length) {
      result.push(regular[ri++]);
    } else if (fi < featured.length) {
      result.push(featured[fi++]);
    }
  }
  return result;
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

  // Interleave featured through the full list so the teaser "first 4" isn't a
  // uniform gold-star row. Filtered tabs inherit spread positions from this
  // order — good enough for the small subsets each tab holds.
  const logos = interleaveFeatured(alphabetical);

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
  ["modonty-trust-bundle-v11-interleaved"],
  { revalidate: 60, tags: ["modonty-client-logos"] },
);

export async function getModontyTrustBundle(): Promise<ModontyTrustBundle> {
  return getTrustBundleCached();
}
