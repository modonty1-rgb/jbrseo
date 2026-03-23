import type { Metadata } from "next";
import type { LandingContent } from "@/lib/landing-content.types";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/constants";

const DEFAULT_DESCRIPTION =
  "مدونتي — منصة المحتوى العربي. مقالات تتصدر جوجل، صفحة شركتك في الشبكة، وقاعدة Leads مصنّفة — بدون كتابة حرف واحد.";

function trimStr(value: string | undefined | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Absolute URL for OG/Twitter; `siteBase` without trailing slash. */
export function toAbsoluteOgUrl(pathOrUrl: string, siteBase: string): string {
  const base = siteBase.replace(/\/$/, "");
  const t = trimStr(pathOrUrl);
  if (!t) return "";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  return t.startsWith("/") ? `${base}${t}` : `${base}/${t}`;
}

type BuildLandingOgArgs = {
  seo: LandingContent["seo"];
  canonical: string;
  /** Base site URL (e.g. https://www.jbrseo.com), no trailing slash */
  siteBase: string;
  /** Value passed to `metadata.title` (layout template may append `| JBRSEO`) */
  documentTitle: string;
};

/**
 * Open Graph + Twitter from CMS (`landingSection` seo per country).
 * Image: `ogImage` from backend, else `DEFAULT_OG_IMAGE_URL` (Cloudinary CDN).
 * All platform-specific fields (ogTitle, twitterTitle, etc.) derive from the
 * shared title/description/image — no redundant per-platform overrides stored.
 */
export function buildLandingOgMetadata(args: BuildLandingOgArgs): Pick<
  Metadata,
  "title" | "description" | "alternates" | "openGraph" | "twitter"
> {
  const { seo: s, canonical, siteBase, documentTitle } = args;

  const title = trimStr(documentTitle) || "JBRSEO";
  const description = trimStr(s.description) || DEFAULT_DESCRIPTION;
  const ogImageUrl = toAbsoluteOgUrl(s.ogImage, siteBase) || DEFAULT_OG_IMAGE_URL;

  return {
    title,
    description,
    alternates: { canonical, languages: { ar: canonical } },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: trimStr(s.ogLocale) || "ar_SA",
      siteName: "JBRSEO",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImageUrl, alt: title }],
    },
  };
}
