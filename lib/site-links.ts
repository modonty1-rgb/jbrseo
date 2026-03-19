import type { SupportedCountry } from "./landing-content.types";

export type NavLinkItem = { href: string; label: string };
export type FooterLinkItem = { label: string; href: string };

const NAV_SA: NavLinkItem[] = [
  { href: "/about", label: "من نحن" },
  { href: "/#why-now", label: "لماذا الآن" },
  { href: "/#how-it-works", label: "كيف نعمل" },
  { href: "/#outcomes", label: "النتائج" },
  { href: "/#social-proof", label: "الشهادات" },
  { href: "/#pricing", label: "الأسعار" },
  { href: "/#faq", label: "الأسئلة" },
];

const NAV_EG: NavLinkItem[] = [
  { href: "/about", label: "من نحن" },
  { href: "/#why-now", label: "ليه دلوقتي" },
  { href: "/#how-it-works", label: "كيف نعمل" },
  { href: "/#outcomes", label: "النتائج" },
  { href: "/#social-proof", label: "الشهادات" },
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

export function getNavLinks(country: SupportedCountry, basePath?: string): NavLinkItem[] {
  const raw = country === "EG" ? NAV_EG : NAV_SA;
  return withBasePath(raw, basePath);
}

const FOOTER_LINKS: FooterLinkItem[] = [
  { label: "كيف نعمل", href: "/#how-it-works" },
  { label: "النتائج", href: "/#outcomes" },
  { label: "الأسعار", href: "/#pricing" },
  { label: "الشهادات", href: "/#social-proof" },
  { label: "الأسئلة", href: "/#faq" },
];

export function getFooterLinks(_country?: SupportedCountry, basePath?: string): FooterLinkItem[] {
  return withBasePath(FOOTER_LINKS, basePath);
}

export const LEGAL_LINKS: FooterLinkItem[] = [
  { label: "سياسة الخصوصية", href: "/privacy" },
  { label: "شروط الاستخدام", href: "/terms" },
];

const WHATSAPP_SA = "https://wa.me/966500000000";
const WHATSAPP_EG = "https://wa.me/201000000000";

function buildWhatsAppLinkFromNumber(raw: string): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export function getWhatsAppLink(country: SupportedCountry, overrideNumber?: string | null): string {
  const link = overrideNumber != null ? buildWhatsAppLinkFromNumber(String(overrideNumber).trim()) : "";
  if (link) return link;
  return country === "EG" ? WHATSAPP_EG : WHATSAPP_SA;
}
