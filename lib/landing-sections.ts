import "server-only";

import type { SupportedCountry } from "./landing-content.types";
import type { StaticLanding } from "@/app/content/landing/types";
import type { Prisma } from "@prisma/client";
import { optimizeCloudinaryStringsInJson } from "@/helpers/cloudinary";
import { prisma } from "./prisma";

const SECTION_KEYS = [
  "hero",
  "whyNow",
  "howItWorks",
  "outcomes",
  "socialProof",
  "faq",
  "finalCta",
  "header",
  "footer",
  "pricing",
  "pricingPage",
  "privacy",
  "terms",
  "about",
  "team",
  "seo",
  "ctaLabel",
  "pricingTeaser",
] as const;

export type LandingSectionKey = (typeof SECTION_KEYS)[number];

const SETTINGS_ONLY_KEYS = ["seo", "ctaLabel", "pricingTeaser"] as const;
export type StaticSectionKey = Exclude<LandingSectionKey, (typeof SETTINGS_ONLY_KEYS)[number]>;
export const STATIC_ONLY_KEYS: readonly StaticSectionKey[] = SECTION_KEYS.filter(
  (k): k is StaticSectionKey => !SETTINGS_ONLY_KEYS.includes(k as (typeof SETTINGS_ONLY_KEYS)[number]),
);

let landingDbUnavailableLogged = false;

export async function getLandingSectionOverride(
  country: SupportedCountry,
  section: LandingSectionKey,
): Promise<unknown | null> {
  try {
    const row = await prisma.landingSection.findUnique({
      where: { country_section: { country, section } },
    });
    return row ? (row.data as unknown) : null;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
    if (!landingDbUnavailableLogged) {
      landingDbUnavailableLogged = true;
      console.warn(
        "[landing-sections] Database unreachable (timeout / Atlas). Using static landing until the connection works.",
      );
    }
    return null;
  }
}

export async function upsertLandingSection<T extends Prisma.InputJsonValue>(
  country: SupportedCountry,
  section: LandingSectionKey,
  data: T,
): Promise<void> {
  const optimized = optimizeCloudinaryStringsInJson(data) as T;
  await prisma.landingSection.upsert({
    where: { country_section: { country, section } },
    create: { country, section, data: optimized },
    update: { data: optimized },
  });
}

export function mergeStaticWithOverrides(
  staticLanding: StaticLanding,
  overrides: Partial<Record<LandingSectionKey, unknown>>,
): StaticLanding {
  let merged: StaticLanding = { ...staticLanding };

  for (const key of STATIC_ONLY_KEYS) {
    const override = overrides[key];
    if (override === undefined || override === null) continue;

    const original = staticLanding[key as keyof StaticLanding];

    if (Array.isArray(original) || Array.isArray(override)) {
      // For array sections, take the override as-is.
      (merged as any)[key] = override;
    } else if (
      original &&
      typeof original === "object" &&
      override &&
      typeof override === "object"
    ) {
      // Shallow merge objects.
      (merged as any)[key] = { ...(original as any), ...(override as any) };
    } else {
      (merged as any)[key] = override;
    }
  }

  return merged;
}

export { SECTION_KEYS };

