"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/app/actions/auth";
import type { SupportedCountry } from "@/lib/landing-content.types";
import {
  DEFAULT_SITE_SETTINGS_JSON,
  type SiteSettingsImages,
  type SiteSettingsJson,
} from "@/lib/site-settings.types";

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

const GLOBAL_COUNTRY = "GLOBAL";

export async function getSiteSettings(country: string): Promise<SiteSettingsJson> {
  assertCountry(country);
  const row = await prisma.siteSettings.findUnique({ where: { country } });
  if (!row) return { ...DEFAULT_SITE_SETTINGS_JSON };
  return row as unknown as SiteSettingsJson;
}

export async function getGlobalLogos(): Promise<{ logoWhite: string; logoLight: string }> {
  const row = await prisma.siteSettings.findUnique({ where: { country: GLOBAL_COUNTRY } });
  if (!row) return { logoWhite: "", logoLight: "" };
  const data = row as unknown as SiteSettingsJson;
  return {
    logoWhite: data.images?.logoWhite?.trim() ?? "",
    logoLight: data.images?.logoLight?.trim() ?? "",
  };
}

async function upsertSiteSettings(country: string, data: SiteSettingsJson) {
  const payload = {
    seo: data.seo,
    tracking: data.tracking,
    site: data.site,
    images: data.images,
    pricingTeaser: data.pricingTeaser,
  };
  await prisma.siteSettings.upsert({
    where: { country },
    create: { country, ...payload },
    update: payload,
  });
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
  const current = await getSiteSettings(country);
  const seo = { ...current.seo };
  for (const key of SEO_FORM_KEYS) {
    (seo as Record<string, string>)[key] = (formData.get(key) as string)?.trim() ?? "";
  }
  await upsertSiteSettings(country, { ...current, seo });
  revalidatePath("/admin");
  revalidateLanding(country);
  const r = (formData.get("redirect") as string)?.trim();
  if (r) redirect(r + (r.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateImagesFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  const keysJson = formData.get("keys") as string;
  if (!country || !keysJson) return;
  assertCountry(country);
  let keys: string[];
  try {
    keys = JSON.parse(keysJson) as string[];
  } catch {
    return;
  }
  const ALLOWED_IMAGE_KEYS = new Set([
    "contactAvatar",
    "sectionHero",
    "sectionWhyNow",
    "sectionHowItWorks",
    "sectionOutcomes",
    "sectionSocialProof",
    "sectionFaq",
    "sectionFinalCta",
  ]);
  const current = await getSiteSettings(country);
  const images: SiteSettingsImages = { ...current.images };
  for (const key of keys) {
    if (ALLOWED_IMAGE_KEYS.has(key)) {
      images[key as keyof SiteSettingsImages] = (formData.get(`u_${key}`) as string) ?? "";
    }
  }
  await upsertSiteSettings(country, { ...current, images });
  revalidatePath("/admin");
  revalidateLanding(country);
  const r = (formData.get("redirect") as string)?.trim();
  if (r) redirect(r + (r.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateTrackingFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const current = await getSiteSettings(country);
  const tracking = {
    gtmId: (formData.get("gtmId") as string)?.trim() ?? "",
    hotjarId: (formData.get("hotjarId") as string)?.trim() ?? "",
    fbPixelId: (formData.get("fbPixelId") as string)?.trim() ?? "",
  };
  await upsertSiteSettings(country, { ...current, tracking });
  revalidatePath("/admin");
  revalidateLanding(country);
}

export async function updateSiteSettingsFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const current = await getSiteSettings(country);
  const showSectionCounter = formData.get("showSectionCounter") === "true";
  await upsertSiteSettings(country, {
    ...current,
    site: { showSectionCounter },
  });
  const globalLogoWhite = (formData.get("logoWhite") as string)?.trim() ?? "";
  const globalRow = await prisma.siteSettings.findUnique({ where: { country: GLOBAL_COUNTRY } });
  const globalCurrent = globalRow
    ? (globalRow as unknown as SiteSettingsJson)
    : { ...DEFAULT_SITE_SETTINGS_JSON };
  await upsertSiteSettings(GLOBAL_COUNTRY, {
    ...globalCurrent,
    images: { ...globalCurrent.images, logoWhite: globalLogoWhite },
  });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidateTag(`landing-SA`, "default");
  revalidateTag(`landing-EG`, "default");
  revalidatePath("/");
  const r = (formData.get("redirect") as string)?.trim();
  if (r) redirect(r + (r.includes("?") ? "&" : "?") + "saved=1");
}
