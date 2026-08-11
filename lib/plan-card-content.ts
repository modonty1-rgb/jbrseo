/**
 * Pricing card content per plan slug — the "identity" of each card:
 * persona line, hero-metric caption, curated bullets (with Lucide icons),
 * and (for the featured plan only) a motivational trust chip.
 *
 * This file is the SINGLE source of truth for what each card SAYS.
 * Numeric fields (price, articles/month) still come from Plan (DB).
 */
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";
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
  Code2,
  FileSearch,
  CalendarCheck,
  Mail,
  Stethoscope,
  UserCircle,
  LineChart,
  BellRing,
  CalendarRange,
  Flame,
  Flag,
} from "lucide-react";

/**
 * Any icon a bullet can carry.
 *
 * Widened from `LucideIcon` because Lucide ships no brand marks: WhatsApp is a specific
 * logo people recognise before they read the line next to it, and a generic speech bubble
 * standing in for it loses exactly that recognition. The project already keeps the
 * canonical glyph in `app/components/icons/WhatsAppIcon`; this type is what lets a bullet
 * use it. Both kinds render the same way — the renderer only ever passes `className`.
 */
export type PlanBulletIcon = ComponentType<{ className?: string }>;

export type PlanCardBullet = {
  icon: PlanBulletIcon;
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
  /**
   * Where the articles land, stated at the same weight as how many there are.
   *
   * These are the two questions a plan is actually compared on — how much content, and
   * where it goes — and the second was buried in a bullet list where the plan that
   * carries the integration looked no different from the one that does not. Every plan
   * sets it, so the three cards can be read straight across.
   *
   * `publishNote` carries the caveat that decides whether a buyer can use it at all: the
   * integration is an endpoint their developer connects, not something published on
   * their behalf.
   */
  publishTo: string;
  publishNote?: string;
  /**
   * Articles delivered each month to the customer's own site, over the integration.
   *
   * A second deliverable, not a rewording of the first: the platform count and this one
   * are different articles going to different places, so the card states both as counts
   * rather than describing one and naming the other. Absent means the plan does not reach
   * the customer's site at all.
   *
   * Multiplied by service months on the card, exactly as the platform count is — the free
   * month delivers like any other.
   */
  siteArticlesPerMonth?: number;
  /**
   * Whether the plan includes «طلّات مدونتي» — the promotional feed.
   *
   * Images and short videos, both: the section works like Instagram's, not like a video
   * feed, which is part of why it is not called ريلز or شورتس. Only verified businesses
   * publish to it — a clinic's advice, a shop's product — never the public.
   *
   * A monthly count, because "available" with no number is a hole in an agreement people
   * pay against: a starter customer who uploaded a hundred a month could ask where the
   * limit was written, and nothing on the card would answer. Khalid confirmed the tiers
   * on 2026-08-11 — 4 / 8 / 12.
   *
   * Third deliverable all the same, shown at the weight of the two article counts: a
   * buyer comparing plans is comparing what they receive, and a video feed is not a
   * footnote to that.
   *
   * ⚠️ Announced ahead of launch. The طلّات section is not live in Modonty yet, expected
   * within two days. Khalid was told this is a promise on a payment page and confirmed
   * the call. Tracked in `documents/tasks/PENDING-IDEAS-TODO.md`; if the section slips,
   * this flag is the first thing to pull from both plans.
   */
  reelsPerMonth?: number;
};

const PLAN_CARD_CONTENT: Record<string, PlanCardContent> = {
  // الباقة الرابعة (المدخل) — تبقى محت التحكم (تُشغَّل/تُوقَف من الأدمن). محتواها
  // الفعلي (الاسم/المميزات) في قاعدة البيانات؛ هنا هويتها البصرية فقط، مثل البقية.
  presence: {
    publishTo: "منصة مدونتي وقنواتها",
    persona: "لصاحب النشاط اللي يبي يبدأ حضوره على جوجل بأقل تكلفة",
    personaIcon: Flag,
    heroCaption: "مقال واحد شهري — بداية حضورك على جوجل",
    bulletsLabel: "اللي بتحصل عليه:",
    bullets: [
      { icon: LayoutTemplate, text: "صفحة تعريفية لنشاطك محسّنة لجوجل", highlight: true },
      { icon: Share2, text: "مقالك ينتشر تلقائياً على منصتين" },
      { icon: Link2, text: "رابط خاص فيك تشاركه مع عملائك" },
      { icon: LineChart, text: "تشوف كم واحد قرأ مقالك" },
      { icon: MessageCircle, text: "فريق الدعم يجاوب على أسئلتك" },
    ],
    // No trustChip — entry tier stays a baseline, like الانطلاقة.
  },

  starter: {
    reelsPerMonth: 4,
    publishTo: "منصة مدونتي وقنواتها",
    persona: "للنشاط الجديد الحابس على أول عملاء من قوقل",
    personaIcon: Sparkles,
    heroCaption: "بحث + كتابة + تصميم + نشر — كامل",
    bulletsLabel: "اللي بتحصل عليه:",
    bullets: [
      { icon: LayoutTemplate, text: "صفحة عميل احترافية (بديل موقع إلكتروني)", highlight: true },
      { icon: Share2, text: "نشر على منصة مدونتي" },
      // "المقال الرئيسي", not "سوشال ميديا مدونتي".
      // The bare line let a reader assume every article they get is posted to the social
      // accounts — four a month, each with its own push. Only the pillar piece is
      // distributed, so the bullet names it. A buyer who discovers the limit after paying
      // treats it as a broken promise; one who reads it here treats it as the offer.
      { icon: Megaphone, text: "المقال الرئيسي ينشر على حسابات مدونتي" },
      { icon: ShieldCheck, text: "شارة «موثّق» + بيانات قانونية" },
      // The real WhatsApp mark, not a generic bubble: the logo is the thing a reader
      // recognises before reading the line, and it is half of what this bullet promises.
      { icon: WhatsAppIcon, text: "زر واتساب + سؤال مباشر تحت المقال" },
    ],
    // Intentionally NO trustChip — the entry tier stays a baseline, no persona pitch.
  },

  growth: {
    publishTo: "على موقعك أنت",
    // No "يحتاج مطوّر" — Khalid's call. The verb still says who acts: "تسحبها" is the
    // customer's, so the line does not promise that we publish onto their site.
    publishNote: "عبر ربط برمجي تسحبها فيه",
    siteArticlesPerMonth: 3,
    reelsPerMonth: 8,
    persona: "للنشاط الجاد اللي يبي يتوسّع بسرعة",
    personaIcon: TrendingUp,
    heroCaption: "ضعف الانطلاقة · نشر أسرع · حملات إيميل",
    bulletsLabel: "كل اللي في الانطلاقة +",
    bullets: [
      // "تسحب فيه" — the customer is the subject, deliberately.
      // The alternative phrasings all imply we publish onto their site, which is not what
      // happens: we hand over an endpoint and their site reads from it. A plan bullet
      // that leaves a buyer expecting us to touch their website is a support ticket at
      // best and a refund at worst, and the parenthetical says who does the work so the
      // expectation is set before the money moves, not after.
      // The "(للمتاجر/المواقع)" qualifier is gone: it named who the feature is for on a
      // card that no longer sorts readers by type, and the row above already states the
      // integration in full.
      { icon: Link2, text: "رابط لموقعك الخاص", highlight: true },
      { icon: CalendarCheck, text: "نظام حجوزات «احجز الآن»", highlight: true },
      // "الإيميلات من عندك" — the customer supplies the list.
      // Two wrong readings were possible and both cost us: bare, it sounded like we own an
      // audience and will mail it on their behalf; as "لمشتركينك" it sounded like the
      // subscribers Modonty collects from their articles. Neither is the deal — they hand
      // over their own contacts and we run the campaigns. A buyer who finds that out after
      // paying has been sold something else.
      // "ماركتنق" dropped with it: a transliteration where Arabic has the word.
      { icon: Mail, text: "٤ حملات إيميل شهرياً — الإيميلات من عندك" },
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
    publishTo: "على موقعك أنت",
    publishNote: "عبر ربط برمجي تسحبها فيه",
    siteArticlesPerMonth: 4,
    reelsPerMonth: 12,
    persona: "مشروع سيو كامل مع مدير حساب مخصص",
    personaIcon: Crown,
    heroCaption: "استراتيجية شاملة · نشر في نفس اليوم",
    bulletsLabel: "كل اللي في الزخم +",
    bullets: [
      // The same integration as الزخم, so it is named the same way. `bulletsLabel` says
      // "كل اللي في الزخم +", which technically covers it — but the API is the reason a
      // developer-led buyer chooses either plan, and a feature that decides the purchase
      // should not be inherited silently from the card next door.
      // ⚠️ Same pre-launch note as `growth` above — pull both together if it slips.
      { icon: UserCircle, text: "مدير حساب مخصص لك", highlight: true },
      // Same clarification as الزخم — the customer supplies the list.
      { icon: Mail, text: "٨ حملات إيميل شهرياً — الإيميلات من عندك" },
      // Was access to Search Console, first in Latin and then translated. Both versions
      // sold a tool rather than an outcome, and the tool is one the buyer does not use:
      // an owner who does not know GA4 from GTM reads "صلاحية على أدوات مشرفي المواقع"
      // as homework, not as value. A delivered report is the same information with the
      // work already done — and a document is something they can hold, forward and act
      // on without learning an interface.
      { icon: FileSearch, text: "تقرير شامل لموقعك — مشاكل السيو وحلولها" },
      // Was "رد على استفساراتك خلال ٤ ساعات", removed rather than reworded.
      // The bullet above it promises a dedicated account manager, so a four-hour reply
      // time read as a limit on that person rather than a benefit — the top plan
      // apparently making you wait. It was also a support metric where every other line
      // on this card is a deliverable.
      // The alerts replace it because they ladder: five on الانطلاقة, twelve on الزخم,
      // twenty-two here, so the number itself is the upgrade argument. And unlike team
      // permissions — the other candidate — it opens no scope: it is a count of
      // notifications, not a roles-and-seats feature to define and support.
      { icon: BellRing, text: "٢٢ تنبيه على تيليجرام — تعرف بأي حدث لحظتها" },
      { icon: CalendarRange, text: "جلسة استراتيجية ربع سنوية" },
    ],
    // No trustChip — the top tier speaks for itself; no need to fence buyers in.
    //
    // `ctaAsConsultation` removed. It routed this card's only button to WhatsApp, which
    // put a conversation between the most expensive plan and its own checkout — at the
    // exact moment a decided buyer wanted to pay. A consultation gate earns its place
    // when the scope has to be quoted; here the price is published (17,994) and the
    // deliverables are fixed — three videos, twenty-two alerts, an account manager,
    // 26+ checks — so there was nothing left to quote. It also left this card without the
    // instalment button and the payment footer its neighbours carry, so the top tier
    // looked like the least finished of the three.
    // Talking is still offered, as a text link under the buttons rather than instead of
    // them: secondary for the buyer who wants it, out of the way for the one who does not.
  },
};

export function getPlanCardContent(slug: string): PlanCardContent | null {
  return PLAN_CARD_CONTENT[slug] ?? null;
}
