import type { SupportedCountry } from "./landing-content.types";

export type NavLinkItem = { href: string; label: string };
export type FooterLinkItem = { label: string; href: string };

const NAV_SA: NavLinkItem[] = [
  { href: "/#outcomes", label: "النتائج" },
  { href: "/#how-it-works", label: "كيف نعمل" },
  { href: "/#faq", label: "الأسئلة" },
];

const NAV_EG: NavLinkItem[] = [
  { href: "/#outcomes", label: "النتائج" },
  { href: "/#how-it-works", label: "كيف نعمل" },
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
  { label: "من نحن", href: "/about" },
  { label: "الفريق", href: "/team" },
  { label: "المميزات", href: "/features" },
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
