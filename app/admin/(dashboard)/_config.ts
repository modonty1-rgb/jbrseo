export const ADMIN_NAV = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/settings/seo", label: "SEO" },
  { href: "/admin/settings/images", label: "الصور" },
  { href: "/admin/settings/tracking", label: "التتبع" },
  { href: "/admin/settings/general", label: "عام" },
  { href: "/admin/subscribers", label: "المشتركون" },
] as const;

export const SIDEBAR_GROUPS: { label: string; hrefs: readonly string[] }[] = [
  { label: "إعدادات الموقع", hrefs: ["/admin/settings/seo", "/admin/settings/images", "/admin/settings/tracking", "/admin/settings/general"] },
  { label: "المشتركون", hrefs: ["/admin/subscribers"] },
];

import type { SupportedCountry } from "@/lib/landing-content.types";

export const COUNTRIES: { value: SupportedCountry; label: string }[] = [
  { value: "SA", label: "السعودية" },
  { value: "EG", label: "مصر" },
];
