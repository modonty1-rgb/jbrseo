import "server-only";
import { DEFAULT_OG_IMAGE_URL } from "./constants";
import { getLandingSectionOverride } from "./landing-sections";

/**
 * The share image for the whole site — one value, edited from the admin.
 *
 * `ogImage` is the ONE field this file reads from the `seo` section, and reading it is
 * safe where reading the others is not: a title, a description and a canonical belong to
 * a specific country page, but the share image is a brand asset that is the same for
 * every page on the domain. Everything else here stays a fixed default on purpose (see
 * the note on getGlobalSeo below).
 *
 * Empty in the admin ⇒ the packaged logo, so a blank field never leaves a link bare.
 */
export async function getSiteOgImageUrl(): Promise<string> {
  try {
    const override = await getLandingSectionOverride("seo");
    if (override && typeof override === "object" && !Array.isArray(override)) {
      const value = (override as Record<string, unknown>).ogImage;
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  } catch {
    // A share image is never worth a 500 — fall through to the packaged one.
  }
  return DEFAULT_OG_IMAGE_URL;
}

/** Ready to spread into a page's `openGraph.images` / `twitter.images`. */
export async function siteOgImages() {
  return [{ url: await getSiteOgImageUrl(), width: 1200, height: 630, alt: "JBRSEO" }];
}

/**
 * Global root-layout SEO — fixed defaults only.
 * Per-country SEO (SA/EG) is handled independently in each country page via getLandingContent().
 * Do NOT read title/description/canonical from LandingSection here — that would bleed one
 * country's settings into the root. Only the share image is shared across the domain.
 */
export async function getGlobalSeo() {
  return {
    title: "JBRSEO | خبراء السيو لنمو أعمالك",
    // Rewritten in JBRSEO's voice. It opened with «مدونتي — منصة المحتوى العربي» and
    // named another brand's Leads database, and this is the description every page
    // without its own inherits — including the five checkout pages, whose link previews
    // therefore introduced the reader to a company they had not chosen to pay.
    // «Leads» also sat as a Latin run inside an Arabic sentence.
    description:
      "جبر سيو — محتوى عربي يجيب لك عملاء من جوجل: مقالات تُكتب وتُنشر وتُقاس شهرياً، وتقارير أرقامها من جوجل نفسه. لأصحاب الأعمال في السعودية ومصر.",
    ogImage: await getSiteOgImageUrl(),
    canonical: "",
  };
}
