import type { SupportedCountry } from "@/lib/landing-content.types";

export const ADMIN_NAV = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/settings/seo", label: "SEO" },
  { href: "/admin/settings/social", label: "السوشال ميديا" },
  { href: "/admin/settings", label: "الإعدادات" },
  { href: "/admin/subscribers", label: "المشتركون" },
  { href: "/admin/content/hero", label: "قسم الهيرو" },
  { href: "/admin/content/trustbar", label: "شريط العملاء" },
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


/** صفحات per-country — تظهر في قائمة 🇸🇦 و 🇪🇬 في الـ top bar */
export const COUNTRY_NAV_ITEMS: { href: string; label: string; icon: string }[] = [
  { href: "/admin/settings/seo",           label: "SEO",                 icon: "🔍" },
  { href: "/admin/settings/social",        label: "السوشال ميديا",       icon: "📱" },
  { href: "/admin/content/header-footer",  label: "الهيدر + الشعار",     icon: "🔗" },
  { href: "/admin/content/hero",           label: "الهيرو",              icon: "✨" },
  { href: "/admin/content/whyNow",         label: "لماذا الآن",          icon: "📢" },
  { href: "/admin/content/howItWorks",     label: "كيف يعمل",            icon: "⚡" },
  { href: "/admin/content/outcomes",       label: "النتائج",             icon: "🎯" },
  { href: "/admin/content/faq",            label: "الأسئلة الشائعة",     icon: "❓" },
  { href: "/admin/content/finalCta",       label: "الدعوة النهائية",     icon: "🚀" },
  { href: "/admin/content/pricing",        label: "التسعير",             icon: "💰" },
];

/** خطط التسويق — تظهر في قائمة 📊 في الـ top bar */
export const MARKETING_TOP_NAV: { href: string; label: string; icon: string; disabled?: boolean }[] = [
  { href: "/admin/marketing/jbrseo-plan",  label: "خطة JBRSEO",      icon: "📊" },
  { href: "/admin/marketing/modony-plan",  label: "خطة Modonty",     icon: "🗒️" },
  { href: "",                              label: "تشغيل Modonty",    icon: "⚙️", disabled: true },
];

/** صفحات عالمية — تؤثر في السعودية ومصر معاً — تظهر في قائمة 🌍 في الـ top bar */
export const GLOBAL_TOP_NAV: { href: string; label: string; icon: string }[] = [
  { href: "/admin/settings",             label: "الإعدادات العامة",   icon: "⚙️" },
  { href: "/admin/content/socialProof",  label: "التستيمونيل",        icon: "⭐" },
  { href: "/admin/content/trustbar",     label: "شريط العملاء",       icon: "🏢" },
  { href: "/admin/content/about",        label: "من نحن",             icon: "📖" },
  { href: "/admin/content/team",         label: "فريق العمل",         icon: "👥" },
  { href: "/admin/content/privacy",      label: "سياسة الخصوصية",    icon: "🔒" },
  { href: "/admin/content/terms",        label: "شروط الاستخدام",     icon: "📄" },
  { href: "/admin/content/emojis",       label: "مرجع الرموز",        icon: "😀" },
];

export const COUNTRIES: { value: SupportedCountry; label: string }[] = [
  { value: "SA", label: "السعودية" },
  { value: "EG", label: "مصر" },
];
