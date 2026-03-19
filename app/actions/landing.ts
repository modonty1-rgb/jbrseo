"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/app/actions/auth";
import type { SupportedCountry } from "@/lib/landing-content.types";
import {
  DEFAULT_SITE_SETTINGS_JSON,
  type GlobalSiteSettings,
  type SiteSettingsSeo,
} from "@/lib/site-settings.types";
import type { Prisma } from "@prisma/client";
import { getLandingSectionOverride, upsertLandingSection } from "@/lib/landing-sections";

const ALLOWED_COUNTRIES: SupportedCountry[] = ["SA", "EG"];

function assertCountry(country: string): asserts country is SupportedCountry {
  if (!ALLOWED_COUNTRIES.includes(country as SupportedCountry)) {
    throw new Error("Invalid country");
  }
}

function revalidateLanding(country: string) {
  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");
}

function revalidateAllLanding() {
  revalidateTag("landing-SA", "default");
  revalidateTag("landing-EG", "default");
  revalidatePath("/");
  revalidatePath("/pricing");
}

export async function getGlobalSiteSettings(): Promise<GlobalSiteSettings | null> {
  const row = await prisma.siteSettings.findFirst();
  if (!row) return null;
  return {
    gtmId: row.gtmId ?? "",
    hotjarId: row.hotjarId ?? "",
    fbPixelId: row.fbPixelId ?? "",
    whatsappNumber: row.whatsappNumber ?? "",
  };
}

const SEO_FORM_KEYS = [
  "title", "description", "canonical", "ogLocale", "ogTitle", "ogDescription",
  "ogImage", "ogImageWidth", "ogImageHeight", "ogType", "ogSiteName",
  "twitterCard", "twitterTitle", "twitterDescription", "twitterImage",
] as const;

export async function updateSeoFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const currentRaw = await getLandingSectionOverride(country as SupportedCountry, "seo");
  const current: SiteSettingsSeo = currentRaw && typeof currentRaw === "object" && !Array.isArray(currentRaw)
    ? { ...DEFAULT_SITE_SETTINGS_JSON.seo, ...(currentRaw as Record<string, string>) }
    : { ...DEFAULT_SITE_SETTINGS_JSON.seo };
  const seo = { ...current };
  for (const key of SEO_FORM_KEYS) {
    (seo as Record<string, string>)[key] = (formData.get(key) as string)?.trim() ?? "";
  }
  await upsertLandingSection(country as SupportedCountry, "seo", seo as unknown as Prisma.InputJsonValue);
  revalidatePath("/admin");
  revalidateLanding(country);
  const r = (formData.get("redirect") as string)?.trim();
  if (r) redirect(r + (r.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateImagesFormData(_formData: FormData) {
  if (!(await isAdmin())) return;
  revalidatePath("/admin");
}

export async function updateTrackingFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const gtmId = (formData.get("gtmId") as string)?.trim() ?? "";
  const hotjarId = (formData.get("hotjarId") as string)?.trim() ?? "";
  const fbPixelId = (formData.get("fbPixelId") as string)?.trim() ?? "";
  const row = await prisma.siteSettings.findFirst();
  if (row) {
    await prisma.siteSettings.update({
      where: { id: row.id },
      data: { gtmId, hotjarId, fbPixelId },
    });
  } else {
    await prisma.siteSettings.create({
      data: { gtmId, hotjarId, fbPixelId, whatsappNumber: "" },
    });
  }
  revalidatePath("/admin");
  revalidateAllLanding();
  const r = (formData.get("redirect") as string)?.trim();
  if (r) redirect(r + (r.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateSiteSettingsFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const ctaLabel = (formData.get("ctaLabel") as string)?.trim() || "ابدأ مجاناً — بدون بطاقة";
  const whatsappNumber = (formData.get("whatsappNumber") as string)?.trim() ?? "";
  const row = await prisma.siteSettings.findFirst();
  if (row) {
    await prisma.siteSettings.update({
      where: { id: row.id },
      data: { whatsappNumber },
    });
  } else {
    await prisma.siteSettings.create({
      data: { gtmId: "", hotjarId: "", fbPixelId: "", whatsappNumber },
    });
  }
  await upsertLandingSection(country as SupportedCountry, "ctaLabel", { ctaLabel });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidateAllLanding();
  const r = (formData.get("redirect") as string)?.trim();
  if (r) redirect(r + (r.includes("?") ? "&" : "?") + "saved=1");
}
