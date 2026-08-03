"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/app/actions/auth";
import type { SupportedCountry } from "@/lib/landing-content.types";

const ALLOWED_COUNTRIES: SupportedCountry[] = ["SA", "EG"];

function assertCountry(country: string): asserts country is SupportedCountry {
  if (!ALLOWED_COUNTRIES.includes(country as SupportedCountry)) {
    throw new Error(`Invalid country: ${country}`);
  }
}

function revalidatePricing(country: SupportedCountry) {
  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/admin/pricing");
  revalidatePath(`/${country.toLowerCase()}`);
  revalidatePath(`/${country.toLowerCase()}/pricing`);
}

/** Read the meta row for a country (creates a blank one if missing). */
export async function getMeta(country: SupportedCountry) {
  assertCountry(country);
  const existing = await prisma.priceSectionMeta.findUnique({ where: { country } });
  if (existing) return existing;
  return prisma.priceSectionMeta.create({ data: { country } });
}

export type MetaPatch = Partial<{
  announcement: string;
  ctaHeadline: string;
  ctaSubheadline: string;
  trustItems: Prisma.InputJsonValue;
  uiStrings: Prisma.InputJsonValue;
}>;

export async function updateMeta(country: string, patch: MetaPatch) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  assertCountry(country);

  const dataToWrite: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) dataToWrite[key] = value;
  }
  if (Object.keys(dataToWrite).length === 0) return;

  const createData = { ...dataToWrite, country } as Prisma.PriceSectionMetaCreateInput;
  await prisma.priceSectionMeta.upsert({
    where: { country },
    create: createData,
    update: dataToWrite,
  });
  revalidatePricing(country);
}

