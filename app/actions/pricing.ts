"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/app/actions/auth";
import type { SupportedCountry } from "@/lib/landing-content.types";

const ALLOWED_COUNTRIES: SupportedCountry[] = ["SA", "EG"];
const ALLOWED_SLUGS = ["presence", "starter", "growth", "scale"] as const;
type PlanSlug = (typeof ALLOWED_SLUGS)[number];

function assertCountry(country: string): asserts country is SupportedCountry {
  if (!ALLOWED_COUNTRIES.includes(country as SupportedCountry)) {
    throw new Error(`Invalid country: ${country}`);
  }
}

function assertSlug(slug: string): asserts slug is PlanSlug {
  if (!ALLOWED_SLUGS.includes(slug as PlanSlug)) {
    throw new Error(`Invalid plan slug: ${slug}`);
  }
}

function revalidatePricing(country: SupportedCountry) {
  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/admin/pricing");
  revalidatePath(`/${country.toLowerCase()}`);
  revalidatePath(`/${country.toLowerCase()}/pricing`);
}

/** Read all 4 plans for a country, ordered by displayOrder. */
export async function getAllPlans(country: SupportedCountry) {
  assertCountry(country);
  return prisma.plan.findMany({
    where: { country },
    orderBy: { displayOrder: "asc" },
  });
}

/** Read a single plan by (country, slug). */
export async function getPlan(country: SupportedCountry, slug: PlanSlug) {
  assertCountry(country);
  assertSlug(slug);
  return prisma.plan.findUnique({
    where: { country_slug: { country, slug } },
  });
}

/** Flip the `visible` flag for a single plan. */
export async function togglePlanVisibility(country: string, slug: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  assertCountry(country);
  assertSlug(slug);

  const current = await prisma.plan.findUnique({
    where: { country_slug: { country, slug } },
    select: { visible: true },
  });
  if (!current) throw new Error(`Plan not found: ${country}/${slug}`);

  await prisma.plan.update({
    where: { country_slug: { country, slug } },
    data: { visible: !current.visible },
  });
  revalidatePricing(country);
  return { visible: !current.visible };
}

/** Reorder plans by providing the desired slug sequence (1-based by index). */
export async function reorderPlans(country: string, slugs: string[]) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  assertCountry(country);
  if (slugs.length !== ALLOWED_SLUGS.length) {
    throw new Error(`Expected ${ALLOWED_SLUGS.length} slugs, got ${slugs.length}`);
  }
  for (const s of slugs) assertSlug(s);

  await prisma.$transaction(
    slugs.map((slug, idx) =>
      prisma.plan.update({
        where: { country_slug: { country, slug } },
        data: { displayOrder: idx + 1 },
      }),
    ),
  );
  revalidatePricing(country);
}

/**
 * Partial update for a plan. Only the fields present in `patch` are written —
 * the rest stay untouched. Empty strings ARE intentional clears (e.g. clearing
 * a badge); use `undefined` to skip a field entirely.
 */
export type PlanPatch = Partial<{
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  articlesLabel: string;
  ctaText: string;
  highlights: string[];
  badge: string | null;
  featuredBadge: string | null;
  visible: boolean;
}>;

export async function updatePlan(
  country: string,
  slug: string,
  patch: PlanPatch,
) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  assertCountry(country);
  assertSlug(slug);

  const dataToWrite: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) dataToWrite[key] = value;
  }
  if (Object.keys(dataToWrite).length === 0) return;

  await prisma.plan.update({
    where: { country_slug: { country, slug } },
    data: dataToWrite,
  });
  revalidatePricing(country);
}

/**
 * Form-submit wrapper for `updatePlan`. Reads FormData fields and assembles a
 * patch with only the fields the form actually carried.
 */
export async function updatePlanFromForm(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const country = (formData.get("country") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  assertCountry(country);
  assertSlug(slug);

  const patch: PlanPatch = {};

  const stringFields: Array<keyof PlanPatch> = [
    "name",
    "tagline",
    "articlesLabel",
    "ctaText",
  ];
  for (const f of stringFields) {
    const v = formData.get(f as string);
    if (typeof v === "string") (patch as Record<string, unknown>)[f] = v.trim();
  }

  // Nullable text fields — empty string clears them
  for (const f of ["badge", "featuredBadge"] as const) {
    const v = formData.get(f);
    if (typeof v === "string") {
      const t = v.trim();
      (patch as Record<string, unknown>)[f] = t === "" ? null : t;
    }
  }

  // Numeric fields
  for (const f of ["priceMonthly", "priceYearly"] as const) {
    const v = formData.get(f);
    if (typeof v === "string" && v !== "") {
      const n = Number(v);
      if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid number for ${f}: ${v}`);
      (patch as Record<string, unknown>)[f] = Math.floor(n);
    }
  }

  // Booleans (FormData sends "on" when checked, absent when unchecked)
  for (const f of ["visible"] as const) {
    if (formData.has(`__${f}_present`)) {
      (patch as Record<string, unknown>)[f] = formData.get(f) === "on";
    }
  }

  // Highlights — multiple inputs name="highlight"
  const highlightsRaw = formData.getAll("highlight");
  if (highlightsRaw.length > 0) {
    patch.highlights = highlightsRaw
      .map((h) => (typeof h === "string" ? h.trim() : ""))
      .filter((h) => h.length > 0);
  }

  await updatePlan(country, slug, patch);
}
