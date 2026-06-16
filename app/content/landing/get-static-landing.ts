import "server-only";

import type { StaticLanding } from "./types";
import { STATIC_ONLY_KEYS, getLandingSectionOverride } from "@/lib/landing-sections";

/**
 * DB is the single source of truth for visitor content.
 * Every section must have a row in LandingSection (seeded via admin or the one-off seed script).
 * Missing rows render as undefined — components must handle that or the admin must fill them.
 */
export async function getStaticLandingWithOverrides(): Promise<StaticLanding> {
  const entries = await Promise.all(
    STATIC_ONLY_KEYS.map(async (section) => {
      const data = await getLandingSectionOverride(section);
      return [section, data] as const;
    }),
  );

  const result: Partial<StaticLanding> = {};
  for (const [section, value] of entries) {
    if (value !== null && value !== undefined) {
      (result as Record<string, unknown>)[section] = value;
    }
  }
  return result as StaticLanding;
}
