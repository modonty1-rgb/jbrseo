"use server";

import { prisma } from "@/lib/prisma";
import type { SocialLinks } from "@/lib/landing-content.types";
import type { GlobalSiteSettings } from "@/lib/site-settings.types";
import { getLandingSectionOverride } from "@/lib/landing-sections";

export async function getGlobalSiteSettings(): Promise<GlobalSiteSettings | null> {
  const row = await prisma.siteSettings.findFirst();
  if (!row) return null;
  return {
    gtmId: row.gtmId ?? "",
    whatsappNumber: row.whatsappNumber ?? "",
  };
}

export async function getSocialLinksSettings(): Promise<SocialLinks> {
  const row = await getLandingSectionOverride("socialLinks");
  if (!row || typeof row !== "object" || Array.isArray(row)) return {};
  const raw = row as Record<string, unknown>;
  const val = (key: string): string | undefined => {
    const v = raw[key];
    if (typeof v !== "string") return undefined;
    const s = v.trim();
    return s || undefined;
  };
  return {
    facebook: val("facebook"),
    instagram: val("instagram"),
    linkedin: val("linkedin"),
    twitterX: val("twitterX"),
    youtube: val("youtube"),
    tiktok: val("tiktok"),
    snapchat: val("snapchat"),
  };
}

