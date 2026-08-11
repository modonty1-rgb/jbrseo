import type { SupportedCountry } from "./landing-content.types";

export type NavLinkItem = { href: string; label: string };
export type FooterLinkItem = { label: string; href: string };

/**
 * One navigation for both countries.
 *
 * `NAV_SA` and `NAV_EG` were byte-identical, kept apart against the day Egypt would get
 * its own wording — which the content decision has since ruled out: the whole site runs
 * unified Saudi copy, and only price and currency differ. Two identical arrays are a trap,
 * not a seam: an edit to one silently diverges the other.
 *
 * «الأسئلة» with the article, matching the footer link to the same section. The header
 * said «أسئلة» and the footer «الأسئلة» — one destination under two names.
 */
const NAV_LINKS: NavLinkItem[] = [
  { href: "/#case-study", label: "قصص نجاح" },
  { href: "/#social-proof", label: "الشهادات" },
  { href: "/features", label: "المميزات" },
  // Sits between the two full pages, before the on-page anchors: /features and /articles
  // both leave the landing, and grouping them keeps "leaves the page" from alternating
  // with "scrolls the page" as the eye runs right to left.
  { href: "/articles", label: "المقالات" },
  { href: "/#pricing", label: "الأسعار" },
  { href: "/#faq", label: "الأسئلة" },
];

function withBasePath<T extends { href: string }>(items: T[], basePath?: string): T[] {
  if (!basePath) return items;
  return items.map((item) =>
    item.href.startsWith("/#")
      ? { ...item, href: basePath + item.href.slice(1) }
      : item
  );
}

export function getNavLinks(_country: SupportedCountry, basePath?: string): NavLinkItem[] {
  return withBasePath(NAV_LINKS, basePath);
}

const FOOTER_LINKS: FooterLinkItem[] = [
  { label: "من نحن", href: "/about" },
  { label: "الفريق", href: "/team" },
  { label: "المميزات", href: "/features" },
  { label: "المقالات", href: "/articles" },
  { label: "قصص نجاح", href: "/#case-study" },
  { label: "الأسعار", href: "/#pricing" },
  { label: "الشهادات", href: "/#social-proof" },
  { label: "الأسئلة", href: "/#faq" },
  // Matches NAV_LINKS above — same destinations, same words.
];

export function getFooterLinks(_country?: SupportedCountry, basePath?: string): FooterLinkItem[] {
  return withBasePath(FOOTER_LINKS, basePath);
}

export const LEGAL_LINKS: FooterLinkItem[] = [
  { label: "سياسة الخصوصية", href: "/privacy" },
  { label: "شروط الاستخدام", href: "/terms" },
  { label: "خريطة الموقع", href: "/sitemap.xml" },
];

function waMeFromEnv(key: string, fallbackDigits: string): string {
  const raw = typeof process !== "undefined" ? process.env[key] : undefined;
  const digits = (raw ?? "").replace(/\D/g, "");
  return `https://wa.me/${digits || fallbackDigits}`;
}

const WHATSAPP_SA = waMeFromEnv("NEXT_PUBLIC_WHATSAPP_DEFAULT_SA", "966500000000");
const WHATSAPP_EG = waMeFromEnv("NEXT_PUBLIC_WHATSAPP_DEFAULT_EG", "201000000000");

function buildWhatsAppLinkFromNumber(raw: string): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export function getWhatsAppLink(country: SupportedCountry, overrideNumber?: string | null): string {
  const link = overrideNumber != null ? buildWhatsAppLinkFromNumber(String(overrideNumber).trim()) : "";
  if (link) return link;
  return country === "EG" ? WHATSAPP_EG : WHATSAPP_SA;
}
