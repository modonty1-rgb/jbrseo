import type { SupportedCountry } from "@/lib/landing-content.types";

/**
 * Master list of all admin routes — used by the breadcrumb resolver
 * to map any URL to a human-readable page title.
 */
export const ADMIN_NAV = [
  { href: "/admin", label: "المشتركون" },
  { href: "/admin/analytics", label: "لوحة التحليلات" },
  { href: "/admin/subscribers", label: "المشتركون" },
  { href: "/admin/content/hero", label: "الهيرو + شريط العملاء" },
  { href: "/admin/content/socialProof", label: "آراء العملاء" },
  { href: "/admin/content/faq", label: "الأسئلة الشائعة" },
  { href: "/admin/content/finalCta", label: "الدعوة النهائية" },
  { href: "/admin/content/team", label: "فريق العمل" },
  { href: "/admin/content/about", label: "من نحن" },
  { href: "/admin/content/privacy", label: "سياسة الخصوصية" },
  { href: "/admin/content/terms", label: "شروط الاستخدام" },
  { href: "/admin/settings", label: "بيانات الموقع" },
  { href: "/admin/content/header-footer", label: "الهيدر والفوتر" },
  { href: "/admin/settings/seo", label: "ظهور البحث (SEO)" },
  { href: "/admin/settings/social", label: "روابط السوشال" },
] as const;

export const COUNTRIES: { value: SupportedCountry; label: string }[] = [
  { value: "SA", label: "السعودية" },
  { value: "EG", label: "مصر" },
];
