import "server-only";

import type { Prisma } from "@prisma/client";
import { optimizeCloudinaryStringsInJson } from "@/helpers/cloudinary";
import { prisma } from "./prisma";

const SECTION_KEYS = [
  "hero",
  "socialProof",
  "faq",
  "finalCta",
  "header",
  "footer",
  "pricingPage",
  "privacy",
  "terms",
  "about",
  "team",
  "seo",
  "ctaLabel",
  "pricingTeaser",
  "socialLinks",
  "featuresComparison",
] as const;

export type LandingSectionKey = (typeof SECTION_KEYS)[number];

const SETTINGS_ONLY_KEYS = ["seo", "ctaLabel", "pricingTeaser", "socialLinks"] as const;
export type StaticSectionKey = Exclude<LandingSectionKey, (typeof SETTINGS_ONLY_KEYS)[number]>;
export const STATIC_ONLY_KEYS: readonly StaticSectionKey[] = SECTION_KEYS.filter(
  (k): k is StaticSectionKey => !SETTINGS_ONLY_KEYS.includes(k as (typeof SETTINGS_ONLY_KEYS)[number]),
);

let landingDbUnavailableLogged = false;

export async function getLandingSectionOverride(
  section: LandingSectionKey,
): Promise<unknown | null> {
  try {
    const row = await prisma.landingSection.findUnique({
      where: { section },
    });
    return row ? (row.data as unknown) : null;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
    if (!landingDbUnavailableLogged) {
      landingDbUnavailableLogged = true;
      console.error(
        "[landing-sections] Database unreachable — check MongoDB Atlas connection string and network access list.",
        error,
      );
    }
    return null;
  }
}

export async function upsertLandingSection<T extends Prisma.InputJsonValue>(
  section: LandingSectionKey,
  data: T,
): Promise<void> {
  const optimized = optimizeCloudinaryStringsInJson(data) as T;
  await prisma.landingSection.upsert({
    where: { section },
    create: { section, data: optimized },
    update: { data: optimized },
  });
}

export { SECTION_KEYS };
