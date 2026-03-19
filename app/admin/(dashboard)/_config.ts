export const ADMIN_NAV = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/settings/seo", label: "SEO" },
  { href: "/admin/settings", label: "الإعدادات" },
  { href: "/admin/subscribers", label: "المشتركون" },
  { href: "/admin/content/hero", label: "قسم الهيرو" },
  { href: "/admin/content/whyNow", label: "قسم لماذا الآن" },
  { href: "/admin/content/howItWorks", label: "قسم كيف يعمل" },
  { href: "/admin/content/outcomes", label: "قسم النتائج" },
  { href: "/admin/content/socialProof", label: "قسم الإثبات الاجتماعي" },
  { href: "/admin/content/faq", label: "قسم الأسئلة الشائعة" },
  { href: "/admin/content/finalCta", label: "قسم الدعوة النهائية" },
  { href: "/admin/content/header-footer", label: "الهيدر + الشعار" },
  { href: "/admin/content/pricing", label: "قسم التسعير" },
  { href: "/admin/content/privacy", label: "صفحة الخصوصية" },
  { href: "/admin/content/terms", label: "صفحة الشروط" },
  { href: "/admin/content/about", label: "من نحن" },
  { href: "/admin/content/team", label: "فريق العمل" },
  { href: "/admin/content/emojis", label: "مرجع الرموز (Emoji)" },
] as const;

export const SIDEBAR_GROUPS: { label: string; hrefs: readonly string[] }[] = [
  {
    label: "إعدادات الموقع",
    hrefs: [
      "/admin/settings/seo",
      "/admin/settings",
      "/admin/content/header-footer",
    ],
  },
  {
    label: "المحتوى الرئيسي",
    hrefs: [
      "/admin/content/hero",
      "/admin/content/whyNow",
      "/admin/content/howItWorks",
      "/admin/content/outcomes",
      "/admin/content/socialProof",
      "/admin/content/faq",
      "/admin/content/finalCta",
    ],
  },
  {
    label: "التسعير",
    hrefs: ["/admin/content/pricing"],
  },
  {
    label: "صفحات جانبية مهمه",
    hrefs: ["/admin/content/privacy", "/admin/content/terms", "/admin/content/about", "/admin/content/team"],
  },
  {
    label: "مركز المساعدة",
    hrefs: ["/admin/content/emojis"],
  },
];

import type { SupportedCountry } from "@/lib/landing-content.types";

export const COUNTRIES: { value: SupportedCountry; label: string }[] = [
  { value: "SA", label: "السعودية" },
  { value: "EG", label: "مصر" },
];
