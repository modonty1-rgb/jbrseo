import type { SupportedCountry } from "@/lib/landing-content.types";

/**
 * Master list of all admin routes — used by the breadcrumb resolver
 * to map any URL to a human-readable page title.
 */
export const ADMIN_NAV = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/subscribers", label: "المشتركون" },
  { href: "/admin/content/hero", label: "الهيرو + شريط العملاء" },
  { href: "/admin/content/whyNow", label: "لماذا الآن" },
  { href: "/admin/content/howItWorks", label: "كيف نشتغل" },
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

/** قائمة الأسعار — صفحة واحدة لكل دولة، كل شيء فيها. */
export const PRICING_NAV_ITEMS: { href: string; label: string; icon: string }[] = [
  { href: "/admin/pricing?country=SA", label: "السعودية (ر.س)", icon: "🇸🇦" },
  { href: "/admin/pricing?country=EG", label: "مصر (ج.م)",       icon: "🇪🇬" },
];

/** خطط التسويق — تظهر في قائمة 📊 في الـ top bar */
export const MARKETING_TOP_NAV: { href: string; label: string; icon: string; disabled?: boolean }[] = [
  { href: "/admin/marketing/jbrseo-plan", label: "خطة JBRSEO",  icon: "📊" },
  { href: "/admin/marketing/modony-plan", label: "خطة Modonty", icon: "🗒️" },
  { href: "",                             label: "تشغيل Modonty", icon: "⚙️", disabled: true },
];

/** ✨ الرئيسية — كل شيء يظهر للزائر على /sa و /eg (مرتب من الأعلى للأسفل في الصفحة) */
export const SECTIONS_NAV_ITEMS: { href: string; label: string; icon: string }[] = [
  { href: "/admin/content/hero",         label: "الهيرو + شريط العملاء", icon: "✨" },
  { href: "/admin/content/whyNow",       label: "لماذا الآن",            icon: "📢" },
  { href: "/admin/content/howItWorks",   label: "كيف نشتغل",             icon: "⚡" },
  { href: "/admin/content/socialProof",  label: "آراء العملاء",          icon: "⭐" },
  { href: "/admin/content/faq",          label: "الأسئلة الشائعة",       icon: "❓" },
  { href: "/admin/content/finalCta",     label: "الدعوة النهائية",       icon: "🚀" },
  { href: "/admin/content/team",         label: "فريق العمل",            icon: "👥" },
];

/** 📄 الصفحات الثابتة — قانونية + معلومات الشركة */
export const PAGES_NAV_ITEMS: { href: string; label: string; icon: string }[] = [
  { href: "/admin/content/about",   label: "من نحن",            icon: "📖" },
  { href: "/admin/content/privacy", label: "سياسة الخصوصية",   icon: "🔒" },
  { href: "/admin/content/terms",   label: "شروط الاستخدام",    icon: "📄" },
];

/** ⚙️ الإعدادات — تأثيرها على كل الموقع (تعدّل نادراً) */
export const SETTINGS_NAV_ITEMS: { href: string; label: string; icon: string }[] = [
  { href: "/admin/settings",              label: "بيانات الموقع",      icon: "⚙️" },
  { href: "/admin/content/header-footer", label: "الهيدر والفوتر",     icon: "🔗" },
  { href: "/admin/settings/social",       label: "روابط السوشال",      icon: "📱" },
  { href: "/admin/settings/seo",          label: "ظهور البحث (SEO)",   icon: "🔍" },
];

export const COUNTRIES: { value: SupportedCountry; label: string }[] = [
  { value: "SA", label: "السعودية" },
  { value: "EG", label: "مصر" },
];
