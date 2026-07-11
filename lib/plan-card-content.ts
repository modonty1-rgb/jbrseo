/**
 * Pricing card content per plan slug — the "identity" of each card:
 * persona line, hero-metric caption, curated bullets (with Lucide icons),
 * and (for the featured plan only) a motivational trust chip.
 *
 * This file is the SINGLE source of truth for what each card SAYS.
 * Numeric fields (price, articles/month) still come from Plan (DB).
 */
import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  TrendingUp,
  Crown,
  LayoutTemplate,
  Share2,
  Megaphone,
  ShieldCheck,
  MessageCircle,
  Link2,
  CalendarCheck,
  Mail,
  Stethoscope,
  UserCircle,
  LineChart,
  Timer,
  CalendarRange,
  Flame,
} from "lucide-react";

export type PlanCardBullet = {
  icon: LucideIcon;
  text: string;
  /** True → uses accent styling (bg/color) — reserve for THE card's key adds. */
  highlight?: boolean;
};

export type PlanTrustChip = {
  icon: LucideIcon;
  label: string;
  body: string;
};

export type PlanCardContent = {
  persona: string;
  personaIcon: LucideIcon;
  heroCaption: string;
  bulletsLabel: string;
  bullets: PlanCardBullet[];
  /** Present on the "featured" plan only — motivational, NOT persona-targeting. */
  trustChip?: PlanTrustChip;
  /** Slug-specific CTA override; when true, CTA routes to WhatsApp (consultation) instead of signup. */
  ctaAsConsultation?: boolean;
};

const PLAN_CARD_CONTENT: Record<string, PlanCardContent> = {
  starter: {
    persona: "للنشاط الجديد الحابس على أول عملاء من قوقل",
    personaIcon: Sparkles,
    heroCaption: "بحث + كتابة + تصميم + نشر — كامل",
    bulletsLabel: "اللي بتحصل عليه:",
    bullets: [
      { icon: LayoutTemplate, text: "صفحة عميل احترافية (بديل موقع إلكتروني)", highlight: true },
      { icon: Share2, text: "نشر على منصة مدونتي" },
      { icon: Megaphone, text: "سوشال ميديا مدونتي" },
      { icon: ShieldCheck, text: "شارة «موثّق» + بيانات قانونية" },
      { icon: MessageCircle, text: "زر واتساب + سؤال مباشر تحت المقال" },
    ],
    // Intentionally NO trustChip — the entry tier stays a baseline, no persona pitch.
  },

  growth: {
    persona: "للنشاط الجاد اللي يبي يتوسّع بسرعة",
    personaIcon: TrendingUp,
    heroCaption: "ضعف الانطلاقة · نشر أسرع · حملات إيميل",
    bulletsLabel: "كل اللي في الانطلاقة +",
    bullets: [
      { icon: Link2, text: "رابط لموقعك الخاص (للمتاجر/المواقع)", highlight: true },
      { icon: CalendarCheck, text: "نظام حجوزات «احجز الآن»", highlight: true },
      { icon: Mail, text: "٤ حملات إيميل ماركتنق شهرياً" },
      { icon: Sparkles, text: "محتواك جاهز للذكاء الاصطناعي" },
      { icon: Stethoscope, text: "توثيق مؤهلات الكاتب (طبي/مالي/قانوني)" },
    ],
    trustChip: {
      icon: Flame,
      label: "الأفضل قيمة مقابل السعر",
      body: "القرار الاقتصادي الذكي",
    },
  },

  scale: {
    persona: "مشروع سيو كامل مع مدير حساب مخصص",
    personaIcon: Crown,
    heroCaption: "استراتيجية شاملة · نشر في نفس اليوم",
    bulletsLabel: "كل اللي في الزخم +",
    bullets: [
      { icon: UserCircle, text: "مدير حساب مخصص لك", highlight: true },
      { icon: Mail, text: "٨ حملات إيميل ماركتنق شهرياً" },
      { icon: LineChart, text: "صلاحية على Google Search Console (أرقام قوقل الرسمية)" },
      { icon: Timer, text: "رد على استفساراتك خلال ٤ ساعات" },
      { icon: CalendarRange, text: "جلسة استراتيجية ربع سنوية" },
    ],
    // No trustChip — the top tier speaks for itself; no need to fence buyers in.
    ctaAsConsultation: true,
  },
};

export function getPlanCardContent(slug: string): PlanCardContent | null {
  return PLAN_CARD_CONTENT[slug] ?? null;
}
