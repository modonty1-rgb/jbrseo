import "server-only";

import type { SupportedCountry } from "./landing-content.types";
import type { StaticLanding } from "@/app/content/landing/types";
import type { Prisma } from "@prisma/client";
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
] as const;

export type LandingSectionKey = (typeof SECTION_KEYS)[number];

export async function getLandingSectionOverride(
  country: SupportedCountry,
  section: LandingSectionKey,
): Promise<unknown | null> {
  const row = await prisma.landingSection.findUnique({
    where: { country_section: { country, section } },
  });
  return row ? (row.data as unknown) : null;
}

export async function upsertLandingSection<T extends Prisma.InputJsonValue>(
  country: SupportedCountry,
  section: LandingSectionKey,
  data: T,
): Promise<void> {
  await prisma.landingSection.upsert({
    where: { country_section: { country, section } },
    create: { country, section, data },
    update: { data },
  });
}

export function mergeStaticWithOverrides(
  staticLanding: StaticLanding,
  overrides: Partial<Record<LandingSectionKey, unknown>>,
): StaticLanding {
  let merged: StaticLanding = { ...staticLanding };

  for (const key of SECTION_KEYS) {
    const override = overrides[key];
    if (override === undefined || override === null) continue;

    const original = staticLanding[key];

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

