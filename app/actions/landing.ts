"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/app/actions/auth";
import type { SupportedCountry } from "@/lib/landing-content.types";
import {
  type GlobalSiteSettings,
  type SiteSettingsSeo,
} from "@/lib/site-settings.types";
import type { Prisma } from "@prisma/client";
import { upsertLandingSection } from "@/lib/landing-sections";
import { META_DESCRIPTION_MAX_CHARS } from "@/lib/seo-meta";

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

export async function updateSeoFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const redirectBase = (formData.get("redirect") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() ?? "";
  if (description.length > META_DESCRIPTION_MAX_CHARS) {
    const r = redirectBase ?? `/admin/settings/seo?country=${country}`;
    redirect(
      `${r}${r.includes("?") ? "&" : "?"}error=1&reason=seo_description_max`,
    );
  }
  const seo: SiteSettingsSeo = {
    title: (formData.get("title") as string)?.trim() ?? "",
    description,
    canonical: (formData.get("canonical") as string)?.trim() ?? "",
    ogImage: (formData.get("ogImage") as string)?.trim() ?? "",
    ogLocale: country === "EG" ? "ar_EG" : "ar_SA",
  };
  await upsertLandingSection(country as SupportedCountry, "seo", seo as unknown as Prisma.InputJsonValue);
  if (country === "SA") revalidateTag("global-seo", "default");
  revalidatePath("/admin");
  revalidateLanding(country);
  if (redirectBase) redirect(redirectBase + (redirectBase.includes("?") ? "&" : "?") + "saved=1");
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
