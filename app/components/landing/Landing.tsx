"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, animate, useInView, AnimatePresence } from "motion/react";
import type { Plan as DBPlan } from "@prisma/client";
import type { StaticLanding } from "@/app/content/landing/types";
import type { ModontyTrustBundle } from "@/app/actions/modonty-client-logos";
import type { ModontyImpactStats, ClientCaseStudyStats } from "@/lib/analytics/ga4";
import { TrustSection } from "./TrustSection";
import { getPlanCardContent } from "@/lib/plan-card-content";
import { FileText, ArrowLeft, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

type Props = {
  countrySlug: "sa" | "eg";
  staticLanding: StaticLanding;
  plans: DBPlan[];
  announcement: string;
  whatsappLink: string;
  signupHref: string;
  initialBilling: Billing;
  ctaLabel: string;
  trustBundle: ModontyTrustBundle;
  modontyImpact: ModontyImpactStats | null;
  caseStats: Record<string, ClientCaseStudyStats> | null;
};

const CALC_ROLES = [
  { key: "writer",   label: "كاتب محتوى SEO",      icon: "✍️", def: 2500, min: 2000, max: 12000 },
  { key: "designer", label: "مصمم جرافيك",         icon: "🎨", def: 3500, min: 2500, max: 12000 },
  { key: "seo",      label: "متخصص SEO",           icon: "🔍", def: 3500, min: 2500, max: 14000 },
  { key: "social",   label: "مدير سوشال ميديا",    icon: "📱", def: 3000, min: 2500, max: 12000 },
  { key: "video",    label: "مونتير / منتج فيديو", icon: "🎬", def: 3000, min: 2500, max: 14000 },
  { key: "dev",      label: "مطور مواقع",          icon: "💻", def: 4500, min: 3000, max: 18000 },
] as const;

const ARABIC_DIGITS = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"] as const;

const STYLE_BLOCK = `
html{scroll-behavior:smooth}
::selection{background:var(--foreground);color:var(--card)}
:focus{outline:none}
:focus-visible{outline:2px solid var(--success);outline-offset:3px;border-radius:var(--radius-sm)}
a:focus-visible,button:focus-visible{outline:2px solid var(--success);outline-offset:3px}
.prev-pricing-toggle button{min-height:var(--tap);padding:10px 18px}
@keyframes prev-caret{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes prev-up{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes prev-pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
@keyframes prev-sheet-in{from{transform:translateY(20px) scale(.98);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
.prev-serp-row{position:absolute;left:14px;right:14px;height:54px;border:1.5px solid transparent;border-radius:13px;padding:10px 12px;overflow:hidden;transition:top .55s cubic-bezier(.34,1.2,.34,1),box-shadow .4s,border-color .4s,background .4s}
.prev-serp-row.you{background:var(--card);border-color:var(--success);box-shadow:0 10px 26px -12px color-mix(in oklch, var(--success) 45%, transparent)}
.prev-serp-row.won{background:var(--card);border-color:var(--success);box-shadow:0 14px 30px -10px color-mix(in oklch, var(--success) 55%, transparent)}
.prev-faq-item{border-bottom:1px solid var(--border)}
.prev-faq-q{display:flex;justify-content:space-between;align-items:center;width:100%;padding:22px 0;font-size:16px;font-weight:500;color:var(--foreground);text-align:right}
.prev-faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease,padding .35s ease;font-size:14.5px;color:var(--muted-foreground);line-height:1.85;padding:0;font-weight:300;white-space:pre-line}
.prev-faq-item.open .prev-faq-a{max-height:2400px;padding:0 0 22px}
.prev-faq-toggle{font-size:22px;color:var(--muted-foreground);font-weight:300;transition:transform .3s ease;display:inline-block;line-height:1}
.prev-faq-item.open .prev-faq-toggle{transform:rotate(45deg)}
.prev-range{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer;height:22px;width:100%}
.prev-range::-webkit-slider-runnable-track{height:5px;border-radius:99px;background:transparent}
.prev-range::-webkit-slider-thumb{-webkit-appearance:none;height:20px;width:20px;border-radius:50%;background:var(--card);border:2px solid var(--success);box-shadow:0 2px 7px color-mix(in oklch, var(--success) 45%, transparent);margin-top:-8px}
.prev-range::-moz-range-thumb{height:18px;width:18px;border-radius:50%;background:var(--card);border:2px solid var(--success)}
.prev-calc-btn{width:26px;height:26px;border-radius:8px;background:var(--background);border:1px solid var(--border);color:var(--muted-foreground);font-size:18px;font-weight:500;line-height:1;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .12s ease;user-select:none}
.prev-calc-btn:hover:not(:disabled){background:var(--foreground);border-color:var(--foreground);color:var(--card)}
.prev-calc-btn:active:not(:disabled){transform:scale(.92)}
.prev-trust-pill{transition:all .2s}
.prev-trust-pill:hover{border-color:var(--success) !important;box-shadow:0 8px 20px -10px color-mix(in oklch, var(--success) 35%, transparent);transform:translateY(-1px)}
.prev-trust-pill:hover img{filter:grayscale(0%) !important;opacity:1 !important}
.prev-voice-btn{display:flex;align-items:center;gap:var(--space-3);width:100%;text-align:right;padding:12px 14px;border-radius:var(--radius-lg);border:1px solid var(--border);background:var(--card);transition:all .15s ease;cursor:pointer}
.prev-voice-btn:hover{border-color:var(--foreground)}
.prev-voice-btn.active{border-color:var(--success);background:color-mix(in oklch, var(--success) 8%, var(--background));box-shadow:0 8px 20px -14px color-mix(in oklch, var(--success) 45%, transparent)}
.prev-voice-btn.active .prev-voice-avatar{box-shadow:0 0 0 2px var(--success)}
.prev-voice-avatar{width:40px;height:40px;border-radius:50%;background:var(--border);flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--muted-foreground)}
.prev-voice-avatar img{width:100%;height:100%;object-fit:cover}
@media (max-width:640px){
  .prev-trust-metrics{grid-template-columns:1fr !important;gap:var(--space-6)}
  .prev-trust-metrics > div{border-right:none !important;border-bottom:1px solid var(--border);padding:var(--space-0) var(--space-0) var(--space-5) !important}
  .prev-trust-metrics > div:last-child{border-bottom:none;padding-bottom:0 !important}
}
@media (max-width:640px){
  .prev-hero-h1{font-size:42px !important;letter-spacing:-1.2px !important}
  .prev-hero-sub{font-size:var(--font-md) !important}
  .prev-h2{font-size:30px !important}
  .prev-math-num{font-size:36px !important}
  .prev-math-num-big{font-size:46px !important}
  .prev-pricing-grid{grid-template-columns:1fr !important}
  .prev-serp-card{margin:0 -8px}
  .prev-serp-row{height:52px;padding:8px 10px}
  .prev-serp-rank{width:26px !important;height:26px !important;font-size:12px !important}
  .prev-serp-titlebar{flex-wrap:nowrap !important;overflow:hidden}
  .prev-serp-title{font-size:13.5px !important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
  .prev-serp-url{font-size:10.5px !important}
  .prev-serp-row .prev-serp-you-badge{display:none !important}
  .prev-voice-metric{margin-inline-start:0 !important;order:3;width:100%;text-align:center}
  .prev-voices-grid{grid-template-columns:1fr !important;gap:var(--space-5) !important}
  .prev-voices-grid > div{min-width:0}
  .prev-voices-list{flex-direction:row !important;overflow-x:auto;overflow-y:hidden;padding-bottom:6px;scrollbar-width:none;max-width:100%;width:100%;-webkit-overflow-scrolling:touch}
  .prev-voices-list::-webkit-scrollbar{display:none}
  .prev-voices-list > button{min-width:220px;flex-shrink:0}
  .prev-footer-grid{grid-template-columns:1fr 1fr !important;gap:var(--space-7) !important}
  .prev-footer-grid > div:first-child{grid-column:1 / -1}
  .prev-calc-grid{grid-template-columns:1fr !important;row-gap:14px !important}
  body{padding-bottom:var(--space-11)}
  .prev-pricing-toggle button{min-height:var(--tap) !important;padding:10px 18px !important}
  .prev-trust-logos{gap:10px !important}
  .prev-trust-pill{min-width:104px !important;min-height:60px !important;padding:10px 14px !important}
  .prev-footer-bottom{flex-direction:column !important;align-items:flex-start !important;gap:14px !important}
  .prev-footer-bottom > div:last-child{margin-inline-start:0 !important;flex-wrap:wrap}
  .prev-cta-h2{font-size:var(--font-2xl) !important}
  .prev-nav-pad{padding:14px 16px !important}
  .prev-nav-cta{padding:8px 14px !important;font-size:var(--font-sm) !important}
  .prev-hero-pad{padding:60px 18px 18px !important}
}
`;

function toArabicDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

function ytEmbed(url?: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

/** GPU-friendly count-up — animates a number when scrolled into view. */
function CountUp({ to, prefix = "", suffix = "", duration = 1.6 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{toArabicDigits(Math.round(val))}{suffix}</span>;
}

/** Reusable fade-in-up wrapper for sections — animates once when in view. */
const FADE_IN_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const STAGGER_PARENT = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

type CaseStudy = {
  name: string;
  industry: string;
  tag: string;
  daysActive: number;
  startDate: string;
  endDate: string;
  heroStat: { big: string; label: string; sub: string };
  after: Array<{ label: string; value: string; sub?: string }>;
  quality: Array<{ k: string; v: string; sub: string }>;
};

const ARABIC_INDEX = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"] as const;
function toAr(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => ARABIC_INDEX[Number(d)]);
}
function formatMinSec(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${toAr(m)}:${toAr(String(s).padStart(2, "0"))}`;
}
function formatPct(x: number): string {
  return `${toAr(Math.round(x * 100))}٪`;
}

// Fallback values (used if GA4 fetch failed) — real numbers from probe on 2026-07-10.
const CASE_FALLBACK: Record<string, Omit<CaseStudy, "name" | "industry" | "tag" | "daysActive" | "startDate" | "endDate">> = {
  smileTown: {
    heroStat: { big: "٣١", label: "مريض حقيقي حجز موعد", sub: "بدون ريال إعلانات · آخر ٩٠ يوم" },
    after: [
      { label: "زوّار الموقع", value: "١٠٠", sub: "٩٠ يوم متتالي" },
      { label: "مشاهدات صفحات", value: "٣٨٢", sub: "قراءة عميقة" },
      { label: "ضغطات 'احجز موعد'", value: "٣١", sub: "🔥 مرضى فعليون" },
      { label: "زوّار من جوجل", value: "٨٣", sub: "organic · نية شراء" },
    ],
    quality: [
      { k: "متوسط الجلسة", v: "٢:٥٦", sub: "دقيقة · تصفح جاد" },
      { k: "معدل التفاعل", v: "٧٩٪", sub: "متوسط الصناعة ٥٠٪" },
      { k: "دول وصلها", v: "٥", sub: "مصر · السعودية · الإمارات..." },
      { k: "إعلانات مدفوعة", v: "٠ ر.س", sub: "كلها organic + شفهي" },
    ],
  },
  kimaZone: {
    heroStat: { big: "٦٨", label: "قارئ لمقال 'تصنيع مستحضرات'", sub: "زوّار يبحثون بأنفسهم · آخر ٩٠ يوم" },
    after: [
      { label: "زوّار الموقع", value: "٩٣", sub: "٥٨ زائر جديد" },
      { label: "مشاهدات صفحات", value: "٢٢٥", sub: "قراءة عميقة" },
      { label: "من جوجل مباشرة", value: "٧٦", sub: "🔥 organic search" },
      { label: "مقال واحد جذب", value: "٦٨", sub: "زائر يبحث عن تصنيع" },
    ],
    quality: [
      { k: "متوسط الجلسة", v: "٢:٣٢", sub: "دقيقة · قرّاء جادّون" },
      { k: "معدل التفاعل", v: "٨٠٪", sub: "متوسط الصناعة ٥٠٪" },
      { k: "دول وصلها", v: "٤", sub: "مصر · السعودية · الإمارات..." },
      { k: "إعلانات مدفوعة", v: "٠ ر.س", sub: "organic فقط" },
    ],
  },
  baqatek: {
    heroStat: { big: "٧٧٪", label: "من جوجل مباشرة", sub: "٥ دول وصلها المحتوى · آخر ٩٠ يوم" },
    after: [
      { label: "زوّار الموقع", value: "٨٨", sub: "٦٤ زائر جديد" },
      { label: "مشاهدات صفحات", value: "١٢٧", sub: "٩٩ جلسة" },
      { label: "من جوجل مباشرة", value: "٧٦", sub: "🔥 ٧٧٪ organic" },
      { label: "دول وصلها", value: "٥", sub: "🌍 السعودية · مصر · اليمن..." },
    ],
    quality: [
      { k: "متوسط الجلسة", v: "١:٣٧", sub: "دقيقة" },
      { k: "زوّار جدد", v: "٧٣٪", sub: "كلهم أول زيارة" },
      { k: "مقال واحد جذب", v: "٦٦", sub: "زائر عن باقات STC" },
      { k: "إعلانات مدفوعة", v: "٠ ر.س", sub: "صفر · organic فقط" },
    ],
  },
};

const CASE_META: Record<string, Pick<CaseStudy, "name" | "industry" | "tag" | "daysActive" | "startDate" | "endDate">> = {
  smileTown: {
    name: "عيادات سمايل تاون",
    industry: "طب الأسنان · السعودية",
    tag: "طب الأسنان",
    daysActive: 90,
    startDate: "قبل الاشتراك",
    endDate: "آخر ٩٠ يوم",
  },
  kimaZone: {
    name: "كيما زون",
    industry: "تصنيع مستحضرات التجميل · مصر",
    tag: "مصانع مستحضرات التجميل",
    daysActive: 90,
    startDate: "قبل الاشتراك",
    endDate: "آخر ٩٠ يوم",
  },
  baqatek: {
    name: "متجر باقتك",
    industry: "تجزئة · باقات الاتصالات · السعودية",
    tag: "تجزئة · اتصالات",
    daysActive: 90,
    startDate: "قبل الاشتراك",
    endDate: "آخر ٩٠ يوم",
  },
};

function buildSmileTown(s: ClientCaseStudyStats): CaseStudy {
  return {
    ...CASE_META.smileTown,
    tag: `طب الأسنان · ${toAr(s.bookingPageViews)} حجز`,
    heroStat: {
      big: toAr(s.bookingPageViews),
      label: "مريض حقيقي حجز موعد",
      sub: "بدون ريال إعلانات · آخر ٩٠ يوم",
    },
    after: [
      { label: "زوّار الموقع", value: toAr(s.users), sub: "٩٠ يوم متتالي" },
      { label: "مشاهدات صفحات", value: toAr(s.pageViews), sub: "قراءة عميقة" },
      { label: "ضغطات 'احجز موعد'", value: toAr(s.bookingPageViews), sub: "🔥 مرضى فعليون" },
      { label: "زوّار من جوجل", value: toAr(s.organicSessions), sub: "organic · نية شراء" },
    ],
    quality: [
      { k: "متوسط الجلسة", v: formatMinSec(s.avgSessionSeconds), sub: "دقيقة · تصفح جاد" },
      { k: "معدل التفاعل", v: formatPct(s.engagementRate), sub: "متوسط الصناعة ٥٠٪" },
      { k: "دول وصلها", v: toAr(s.countriesCount), sub: "مصر · السعودية · الإمارات..." },
      { k: "إعلانات مدفوعة", v: "٠ ر.س", sub: "كلها organic + شفهي" },
    ],
  };
}

function buildKimaZone(s: ClientCaseStudyStats): CaseStudy {
  return {
    ...CASE_META.kimaZone,
    heroStat: {
      big: toAr(s.topArticleUsers || s.users),
      label: "قارئ لمقال 'تصنيع مستحضرات'",
      sub: "زوّار يبحثون بأنفسهم · آخر ٩٠ يوم",
    },
    after: [
      { label: "زوّار الموقع", value: toAr(s.users), sub: `${toAr(s.sessions)} جلسة` },
      { label: "مشاهدات صفحات", value: toAr(s.pageViews), sub: "قراءة عميقة" },
      { label: "من جوجل مباشرة", value: toAr(s.organicSessions), sub: "🔥 organic search" },
      { label: "مقال واحد جذب", value: toAr(s.topArticleUsers), sub: `${toAr(s.topArticleViews)} مشاهدة` },
    ],
    quality: [
      { k: "متوسط الجلسة", v: formatMinSec(s.avgSessionSeconds), sub: "دقيقة · قرّاء جادّون" },
      { k: "معدل التفاعل", v: formatPct(s.engagementRate), sub: "متوسط الصناعة ٥٠٪" },
      { k: "دول وصلها", v: toAr(s.countriesCount), sub: "مصر · السعودية · الإمارات..." },
      { k: "إعلانات مدفوعة", v: "٠ ر.س", sub: "organic فقط" },
    ],
  };
}

function buildBaqatek(s: ClientCaseStudyStats): CaseStudy {
  return {
    ...CASE_META.baqatek,
    tag: `تجزئة · ${formatPct(s.organicPercent)} organic`,
    heroStat: {
      big: formatPct(s.organicPercent),
      label: "من جوجل مباشرة",
      sub: `${toAr(s.countriesCount)} دول وصلها المحتوى · آخر ٩٠ يوم`,
    },
    after: [
      { label: "زوّار الموقع", value: toAr(s.users), sub: `${toAr(s.sessions)} جلسة` },
      { label: "مشاهدات صفحات", value: toAr(s.pageViews), sub: `${toAr(s.sessions)} جلسة` },
      { label: "من جوجل مباشرة", value: toAr(s.organicSessions), sub: `🔥 ${formatPct(s.organicPercent)} organic` },
      { label: "دول وصلها", value: toAr(s.countriesCount), sub: "🌍 السعودية · مصر · اليمن..." },
    ],
    quality: [
      { k: "متوسط الجلسة", v: formatMinSec(s.avgSessionSeconds), sub: "دقيقة" },
      { k: "معدل التفاعل", v: formatPct(s.engagementRate), sub: "متوسط الصناعة ٥٠٪" },
      { k: "مقال واحد جذب", v: toAr(s.topArticleUsers), sub: `عن باقات STC` },
      { k: "إعلانات مدفوعة", v: "٠ ر.س", sub: "صفر · organic فقط" },
    ],
  };
}

function fallbackFor(key: "smileTown" | "kimaZone" | "baqatek"): CaseStudy {
  return { ...CASE_META[key], ...CASE_FALLBACK[key] };
}

function buildCaseStudies(caseStats: Record<string, ClientCaseStudyStats> | null): CaseStudy[] {
  const s = caseStats;
  return [
    s?.smileTown ? buildSmileTown(s.smileTown) : fallbackFor("smileTown"),
    s?.kimaZone ? buildKimaZone(s.kimaZone) : fallbackFor("kimaZone"),
    s?.baqatek ? buildBaqatek(s.baqatek) : fallbackFor("baqatek"),
  ];
}

function CaseStudiesSlider({ caseStats, clientsCount }: { caseStats: Record<string, ClientCaseStudyStats> | null; clientsCount: number }) {
  const studies = useMemo(() => buildCaseStudies(caseStats), [caseStats]);
  const [idx, setIdx] = useState(0);
  const c = studies[idx];
  const goTo = (i: number) => setIdx(((i % studies.length) + studies.length) % studies.length);

  return (
    <m.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      id="case-study"
      className="bg-background"
    >
      <div className="max-w-[1080px] mx-auto px-7 py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-success tracking-[1px] mb-3 bg-success/10 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            أرقام حقيقية من Google Analytics · آخر ٩٠ يوم
          </div>
          <h2 className="prev-h2 text-[38px] font-semibold tracking-[-1px] mb-3">
            نتائج تشوفها — <span className="text-success">مش وعود</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-[640px] mx-auto leading-[1.75]">
            {clientsCount > 0 ? (
              <>
                من أصل <span className="font-semibold text-foreground">{toAr(clientsCount)}+ نشاط سعودي وعربي</span> يستخدم منصتنا — هذي ٣ قصص بأرقام مقاسة من GA4 مباشرة، بإذن كل عميل.
              </>
            ) : (
              <>ثلاث قصص من ثلاثة قطاعات — كل رقم مقاس من GA4 مباشرة، بإذن كل عميل.</>
            )}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Client header */}
            <div className="flex items-center justify-between max-w-[880px] mx-auto mb-6 flex-wrap gap-3">
              <div>
                <div className="text-[20px] font-semibold text-foreground">{c.name}</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">{c.industry}</div>
              </div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span>{c.tag} · {c.daysActive} يوماً فقط</span>
              </div>
            </div>

            {/* HERO STAT — the one big proof number for this client */}
            <div className="max-w-[880px] mx-auto mb-6 bg-gradient-to-br from-success/10 to-transparent border-2 border-success/30 rounded-2xl p-6 md:p-8 text-center">
              <div className="font-mono text-[72px] md:text-[96px] font-semibold text-success leading-none tracking-[-3px]">
                {c.heroStat.big}
              </div>
              <div className="text-[18px] md:text-[20px] font-semibold text-foreground mt-3">
                {c.heroStat.label}
              </div>
              <div className="text-[13px] text-muted-foreground mt-1.5">
                {c.heroStat.sub}
              </div>
            </div>

            {/* Before ← → After grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-[880px] mx-auto mb-8">
              {/* BEFORE */}
              <div className="bg-card border border-border rounded-2xl p-5 md:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="font-mono text-[11px] text-muted-foreground tracking-[1px]">قبل الاشتراك</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{c.startDate}</div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "ظهور في جوجل", value: "صفر" },
                    { label: "مقالات منشورة", value: "٠" },
                    { label: "زوّار organic", value: "٠" },
                    { label: "إعلانات مدفوعة", value: "٠ ر.س" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between pb-2.5 border-b border-b-border last:border-b-0 last:pb-0">
                      <span className="text-[13px] text-muted-foreground">{row.label}</span>
                      <span className="font-mono text-[15px] font-semibold text-muted-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AFTER */}
              <div className="bg-foreground text-background border border-foreground rounded-2xl p-5 md:p-7 shadow-[0_24px_50px_-22px_color-mix(in oklch, var(--foreground) 50%, transparent)] relative">
                <span className="absolute -top-[11px] right-5 md:right-7 bg-success text-success-foreground text-[10.5px] font-semibold px-2.5 py-1 rounded-full tracking-[.3px]">
                  بعد {c.daysActive} يوم
                </span>
                <div className="flex items-center justify-between mb-5">
                  <div className="font-mono text-[11px] text-background/70 tracking-[1px]">بعد الاشتراك</div>
                  <div className="font-mono text-[11px] text-background/70">{c.endDate}</div>
                </div>
                <div className="space-y-3">
                  {c.after.map((row, i) => (
                    <div key={i} className="flex items-center justify-between pb-2.5 border-b border-b-background/10 last:border-b-0 last:pb-0">
                      <div>
                        <div className="text-[13px] text-background/70">{row.label}</div>
                        {row.sub && <div className="text-[10.5px] text-success font-mono mt-0.5">{row.sub}</div>}
                      </div>
                      <span className="font-mono text-[20px] font-semibold text-background">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Engagement quality strip */}
            <div className="max-w-[880px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {c.quality.map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="font-mono text-[26px] md:text-[28px] font-semibold text-foreground tracking-[-.5px]">{s.v}</div>
                  <div className="text-[12px] text-foreground font-medium mt-1">{s.k}</div>
                  <div className="text-[10.5px] text-muted-foreground mt-0.5 leading-tight">{s.sub}</div>
                </div>
              ))}
            </div>
          </m.div>
        </AnimatePresence>

        {/* Slider controls */}
        <div className="max-w-[880px] mx-auto flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => goTo(idx - 1)}
            aria-label="القصة السابقة"
            className="w-10 h-10 rounded-full bg-card border border-border hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <span className="text-[18px]">→</span>
          </button>
          <div className="flex items-center gap-2">
            {studies.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`القصة ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === idx ? "w-8 bg-success" : "w-2 bg-border hover:bg-muted-foreground",
                )}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(idx + 1)}
            aria-label="القصة التالية"
            className="w-10 h-10 rounded-full bg-card border border-border hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <span className="text-[18px]">←</span>
          </button>
        </div>

        <div className="text-center mt-6 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 text-[12px] text-muted-foreground">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5l5 5L20 7" />
            </svg>
            <span>الأرقام من Google Analytics 4 · Property ID موثّق · بإذن كل عميل</span>
          </div>
        </div>
      </div>
    </m.section>
  );
}

export function Landing(props: Props) {
  const { countrySlug, staticLanding, plans, announcement, whatsappLink, signupHref, initialBilling, ctaLabel, trustBundle, modontyImpact, caseStats } = props;

  const country = countrySlug === "eg" ? "EG" : "SA";
  const currency = country === "EG" ? "ج.م" : "ر.س";

  // ─── Pricing plans (DB) ───
  const visiblePlans = useMemo(
    () => [...plans].filter((p) => p.visible).sort((a, b) => a.displayOrder - b.displayOrder),
    [plans],
  );

  // ─── FAQ items (DB) ───
  const faqs = staticLanding.faq?.faqs ?? [];

  // ─── Final CTA (DB) ───
  const finalCtaData = staticLanding.finalCta;

  // ─── Team (DB) ───
  const coreTeam = (staticLanding.team?.coreTeam ?? []).filter((m) => m.name?.trim());
  const executionTeam = (staticLanding.team?.executionTeam ?? []).filter((m) => m.name?.trim());

  // ─── Social proof voices (DB) ───
  const voices = (staticLanding.socialProof?.testimonials ?? []).filter(
    (t) => t.name?.trim() || t.quote?.trim(),
  );
  const socialProofTitle = staticLanding.socialProof?.title ?? "أصوات حقيقية من السوق";
  const socialProofSubtitle =
    staticLanding.socialProof?.subtitle ?? "تجارب مبكرة من شركات آمنت بالفكرة من الأول";
  const socialProofEyebrow = staticLanding.socialProof?.eyebrow ?? "شهادات";

  // ─── State ───
  const [billing, setBilling] = useState<Billing>(initialBilling);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [calcOpen, setCalcOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [salaries, setSalaries] = useState<Record<string, number>>(
    () => Object.fromEntries(CALC_ROLES.map((r) => [r.key, r.def])),
  );

  // ─── Calculator math ───
  const teamMonthly = Object.values(salaries).reduce((a, b) => a + b, 0);
  const teamAnnual = teamMonthly * 12;
  const SUB_ANNUAL = 12468;
  const saveAmt = Math.max(0, teamAnnual - SUB_ANNUAL);
  const savePct = teamAnnual > 0 ? Math.max(0, Math.round((1 - SUB_ANNUAL / teamAnnual) * 100)) : 0;

  // ─── Math section (annual comparison: full team vs featured plan, DB-driven) ───
  const mathTeamMonthly = CALC_ROLES.reduce((sum, r) => sum + r.def, 0);
  const mathTeamAnnual = mathTeamMonthly * 12;
  const featuredPlan = visiblePlans.find(
    (p) => !!p.featuredBadge && p.featuredBadge.trim() !== "" && p.priceMonthly > 0,
  );
  const fallbackPaidPlan = visiblePlans.find((p) => p.priceMonthly > 0);
  const mathPlan = featuredPlan ?? fallbackPaidPlan;
  // priceYearly stores monthly-equivalent on annual billing; annual total = × 12.
  const mathPlanMonthlyOnAnnual = mathPlan
    ? mathPlan.priceYearly > 0 ? mathPlan.priceYearly : mathPlan.priceMonthly
    : 0;
  const mathPlanAnnual = mathPlanMonthlyOnAnnual * 12;
  const mathPlanName = mathPlan?.name ?? "مدونتي";
  const mathSavePct = mathTeamAnnual > 0 && mathPlanAnnual > 0
    ? Math.round((1 - mathPlanAnnual / mathTeamAnnual) * 100)
    : 0;

  // ─── Render ───
  return (
    <LazyMotion features={domAnimation} strict>
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: STYLE_BLOCK }} />

      {/* ─── HERO ─── */}
      <section className="prev-hero-pad max-w-[760px] mx-auto pt-[88px] px-7 pb-7 text-center">
        <div className="inline-flex items-center gap-2 pt-[5px] pe-3 pb-[5px] ps-[14px] rounded-full border border-border bg-card font-mono text-[11.5px] text-muted-foreground tracking-[.3px] mb-[26px]">
          <span
            className="w-[7px] h-[7px] rounded-full bg-success shrink-0 shadow-[0_0_0_3px_color-mix(in oklch, var(--success) 16%, transparent)]"
          />
          <span>{staticLanding.hero?.proof ?? "سيو بالاشتراك الشهري · السعودية ومصر"}</span>
        </div>
        <h1 className="prev-hero-h1 text-[length:var(--font-5xl)] leading-[1.08] font-semibold tracking-[-2px]">
          {staticLanding.hero?.h1Line1 ?? "ابنِ حضورك على جوجل"}<br />
          <span
            className="relative inline-block text-success px-1 py-0 bg-[linear-gradient(180deg,transparent_0%,transparent_78%,color-mix(in oklch, var(--success) 16%, transparent)_78%,color-mix(in oklch, var(--success) 16%, transparent)_100%)]"
          >
            {staticLanding.hero?.h1Line2 ?? "بدون إعلانات · بدون فريق داخلي"}
          </span>
        </h1>
        <p className="prev-hero-sub text-[20px] leading-[1.7] text-muted-foreground mt-[26px] mx-auto max-w-[520px] font-normal">
          {staticLanding.hero?.sub ?? "فريقنا يكتب محتوى سيو وينشره على موقعك. أنت توافق بضغطة — وجوجل يجيب لك العملاء كل يوم."}
        </p>
        <div className="flex gap-[18px] justify-center items-center mt-8 flex-wrap">
          <Link href={signupHref} className="bg-foreground text-background px-7 py-[15px] rounded-xl text-base font-medium no-underline">
            {ctaLabel}
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-[15px] font-medium no-underline inline-flex items-center gap-1.5 px-1 py-2 border-b border-b-transparent transition-[border-color,color] duration-150"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = "var(--foreground)";
              e.currentTarget.style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = "transparent";
              e.currentTarget.style.color = "var(--muted-foreground)";
            }}
          >
            تواصل واتساب
            <span className="text-[18px] leading-none">←</span>
          </a>
        </div>
        <div className="inline-flex flex-wrap justify-center gap-[18px] mt-[22px] text-[13px] text-muted-foreground">
          {(staticLanding.hero?.trust ?? ["بدون بطاقة", "إلغاء بأي وقت", "دعم عربي ١٠٠٪"]).map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12.5l5 5L20 7" />
              </svg>
              <span>{item}</span>
            </span>
          ))}
        </div>

      </section>

      {/* ─── CASE STUDIES SLIDER · GA4-verified proof, placed right after hero ─── */}
      <CaseStudiesSlider caseStats={caseStats} clientsCount={trustBundle.total} />

      {/* ─── MODONTY IMPACT BAR · live GA4 platform-wide numbers ─── */}
      {modontyImpact && (
        <m.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-background"
        >
          <div className="max-w-[1080px] mx-auto px-7 py-14">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] text-success tracking-[1px] mb-3 bg-success/10 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                لايف من Google Analytics · يتحدّث كل ٥ دقائق
              </div>
              <h2 className="prev-h2 text-[32px] md:text-[38px] font-semibold tracking-[-1px]">
                مدونتي بالأرقام — <span className="text-success">لايف الآن</span>
              </h2>
              <p className="text-[14px] text-muted-foreground mt-2">
                هذي كل الأثر الرقمي عبر منصة مدونتي — تراكمياً منذ الإطلاق. تقدر تتحقّق من الأرقام مباشرة على الموقع.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-foreground to-[color-mix(in_oklch,var(--foreground)_88%,var(--success))] text-background overflow-hidden shadow-[0_30px_60px_-30px_color-mix(in_oklch,var(--foreground)_60%,transparent)]">
              <div className="grid grid-cols-1 md:grid-cols-[1.4fr_2fr_auto] divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-background/10">

                {/* Grand total hero */}
                <div className="flex flex-col items-center justify-center px-6 py-8">
                  <div className="font-mono text-[52px] md:text-[64px] font-black leading-none tracking-[-2px] text-background">
                    {modontyImpact.grandTotal.toLocaleString("en-US")}
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-background/60 tracking-[1.5px]">الأثر الرقمي</div>
                </div>

                {/* Secondary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-x-reverse divide-background/10">
                  <div className="flex flex-col items-center justify-center py-5 px-2">
                    <div className="font-mono text-[20px] md:text-[22px] font-bold text-background">{modontyImpact.users.toLocaleString("en-US")}</div>
                    <div className="mt-1 text-[10px] text-background/50">مستخدم</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-5 px-2">
                    <div className="font-mono text-[20px] md:text-[22px] font-bold text-background">{modontyImpact.sessions.toLocaleString("en-US")}</div>
                    <div className="mt-1 text-[10px] text-background/50">جلسة</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-5 px-2">
                    <div className="font-mono text-[20px] md:text-[22px] font-bold text-background">{modontyImpact.pageViews.toLocaleString("en-US")}</div>
                    <div className="mt-1 text-[10px] text-background/50">مشاهدة</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-5 px-2">
                    <div className="font-mono text-[20px] md:text-[22px] font-bold text-background">{modontyImpact.interactions.toLocaleString("en-US")}</div>
                    <div className="mt-1 text-[10px] text-background/50">تفاعل حقيقي</div>
                  </div>
                </div>

                {/* Google trust anchor */}
                <div className="flex flex-col items-center justify-center gap-2 bg-background/[0.04] px-6 py-5 min-w-[140px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" aria-label="Google">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <p className="text-center text-[10px] leading-tight text-background/55">
                    موثّق من<br />
                    <span className="font-semibold text-background/80">Google Analytics</span>
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                    ✓ بيانات حقيقية
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-[12px] text-muted-foreground mb-4">
                <span>Property ID: <span className="font-mono">538167732</span></span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>تحقّق بنفسك من مصدرين مستقلّين ↓</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[720px] mx-auto">
                <a
                  href="https://datastudio.google.com/s/nBnyGkiUdGw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-muted hover:border-success/40 transition-all px-5 py-4 text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 shrink-0" aria-label="Google">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <div className="text-right">
                    <div className="text-[14px] font-semibold leading-tight">تقرير Google الرسمي</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Looker Studio · مباشر من جوجل</div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-success transition-colors">↗</span>
                </a>
                <a
                  href="https://www.modonty.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-muted hover:border-success/40 transition-all px-5 py-4 text-foreground"
                >
                  <span
                    className="shrink-0 inline-flex items-center justify-center"
                    style={{ background: "#fff", padding: "4px 8px", borderRadius: 8, width: 112, height: 32 }}
                  >
                    <Image
                      src="https://res.cloudinary.com/dfegnpgwx/image/upload/f_auto,q_auto,w_240/v1769683590/modontyLogo_ftf4yf.png"
                      alt="Modonty"
                      width={96}
                      height={24}
                      style={{ width: "auto", height: 24, objectFit: "contain", maxWidth: "100%" }}
                    />
                  </span>
                  <div className="text-right">
                    <div className="text-[14px] font-semibold leading-tight">شوف منصة مدونتي</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">الموقع الحقيقي · عملاء · مقالات</div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-success transition-colors">↗</span>
                </a>
              </div>
            </div>
          </div>
        </m.section>
      )}

      {/* ─── GUARANTEE — activity-based (things we 100% control), no risky ranking promise ─── */}
      <m.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card border-t border-t-border border-b border-b-border"
      >
        <div className="max-w-[920px] mx-auto px-7 py-14">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-success/15 flex items-center justify-center text-[38px] md:text-[46px] mx-auto md:mx-0">
              🛡️
            </div>
            <div className="flex-1 text-center md:text-right w-full">
              <div className="font-mono text-[11px] text-success tracking-[1px] mb-2">تعهّدنا لك</div>
              <h3 className="text-[22px] md:text-[26px] font-semibold text-foreground tracking-[-.5px] leading-[1.35] mb-4">
                نضمن <span className="text-success">الجهد والشفافية</span> — تشوف الأثر بعينك في لوحتك
              </h3>
              <ul className="space-y-2.5 text-[14.5px] text-foreground leading-[1.7] mb-4 md:pr-1 list-none">
                {[
                  { k: "الالتزام بالنشر", v: "عدد مقالاتك الشهرية تُنشر بموعدها — بلا استثناء" },
                  { k: "معيار الجودة", v: "٢٨ فحصاً تلقائياً على كل مقال قبل النشر" },
                  { k: "الشفافية", v: "تقرير GA4 مباشر من لوحتك — أرقام حقيقية موثّقة من جوجل" },
                  { k: "الاستجابة", v: "على أي استفسار خلال ٢٤ ساعة كحد أقصى" },
                ].map((row, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 mt-1">
                      <path d="M5 12.5l5 5L20 7" />
                    </svg>
                    <span><span className="font-semibold text-foreground">{row.k}:</span> <span className="text-muted-foreground">{row.v}</span></span>
                  </li>
                ))}
              </ul>
              <div className="inline-flex items-center gap-2 bg-success/10 text-success text-[13.5px] font-semibold px-4 py-2.5 rounded-lg leading-[1.6]">
                <span>لو أخللنا بأي واحد خلال ٣ شهور — الشهر الرابع خدمة مجاناً.</span>
              </div>
              <p className="text-[12.5px] text-muted-foreground mt-3 max-w-[560px] mx-auto md:mx-0 leading-[1.6]">
                ما نعد بمركز رقم ١ في جوجل — لأن هذا يعتمد على منافسيك وتحديثات جوجل. نضمن اللي نتحكّم فيه ١٠٠٪: النشر · الجودة · التقارير · الاستجابة.
              </p>
            </div>
          </div>
        </div>
      </m.section>

      {/* ─── SAUDI IDENTITY CARD · answers "من أنتم؟" — critical for Saudi buyer ─── */}
      <m.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-background"
      >
        <div className="max-w-[920px] mx-auto px-7 py-14">
          {/* Section title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-success tracking-[1px] mb-3 bg-success/10 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              من نحن — بشفافية كاملة
            </div>
            <h2 className="prev-h2 text-[32px] md:text-[38px] font-semibold tracking-[-1px]">
              شركة سعودية <span className="text-success">مسجّلة رسمياً</span>
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-[560px] mx-auto mt-2 leading-[1.7]">
              كل تفاصيلنا القانونية معلنة — تقدر تتحقّق منها بجوالك في ٣٠ ثانية عبر بوّابة وزارة التجارة السعودية.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Header — flag + country + verified badge */}
            <div className="flex items-center justify-between gap-3 flex-wrap px-6 py-4 border-b border-b-border bg-gradient-to-l from-transparent to-success/5">
              <div className="flex items-center gap-2.5">
                <span className="text-[22px]" aria-hidden>🇸🇦</span>
                <span className="text-[13px] font-medium text-muted-foreground">المملكة العربية السعودية</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l5 5L20 7" />
                </svg>
                موثّقة لدى وزارة التجارة
              </div>
            </div>

            {/* Body — flex-col so we can reorder on mobile (address above cert) vs desktop (cert first) */}
            <div className="p-6 md:p-7 flex flex-col">
              {/* Legal entity + 4 badges (always first) */}
              <div className="order-1">
                <div className="text-[11px] font-mono text-muted-foreground tracking-wide mb-1.5">الكيان القانوني</div>
                <div className="text-[20px] font-semibold text-foreground leading-tight">
                  شركة جبر الجنوبية للمقاولات
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-[12px] font-semibold text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    نشط
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-foreground">
                    <span className="text-muted-foreground font-mono text-[10.5px]">CR</span>
                    <bdi className="font-mono">4030524305</bdi>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-foreground">
                    <span className="text-muted-foreground font-mono text-[10.5px]">رأس المال</span>
                    ٨,٠٠٠,٠٠٠ ﷼
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-foreground">
                    <span className="text-muted-foreground font-mono text-[10.5px]">تأسست</span>
                    ٢٠٢٣
                  </span>
                </div>
              </div>

              {/* Google Maps address — order-2 on mobile (right after badges), order-4 on desktop (bottom) */}
              <a
                href="https://www.google.com/maps?q=21.502370834350586,39.1859245300293"
                target="_blank"
                rel="noopener noreferrer"
                className="group order-2 md:order-4 mt-6 flex items-start gap-3 pt-5 border-t border-t-border/60 hover:opacity-90 transition-opacity"
                aria-label="افتح موقع الشركة على خرائط جوجل"
              >
                <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm">
                  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Google Maps">
                    <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z" fill="#EA4335"/>
                    <circle cx="12" cy="10" r="3" fill="#fff"/>
                    <path d="M4 10c0-.7.09-1.38.26-2.03L12 10 4.26 12.03A8.02 8.02 0 0 1 4 10z" fill="#FBBC05" opacity="0.9"/>
                    <path d="M20 10c0 .95-.17 1.86-.47 2.7L12 10l7.53-2.7c.3.85.47 1.75.47 2.7z" fill="#4285F4" opacity="0.85"/>
                    <path d="M12 2c-2.44 0-4.62 1.1-6.08 2.83L12 10 5.92 4.83A7.98 7.98 0 0 1 12 2z" fill="#34A853" opacity="0.85"/>
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10.5px] text-muted-foreground font-mono tracking-wide leading-none mb-1">العنوان — اضغط للفتح في خرائط جوجل</div>
                  <div className="text-[13px] font-medium text-foreground leading-[1.6] group-hover:text-success transition-colors">
                    شارع أبو بكر الصديق · حي الشرفية · جدة · المملكة العربية السعودية
                  </div>
                </div>
                <span className="shrink-0 text-muted-foreground group-hover:text-success transition-colors mt-1.5">↗</span>
              </a>

              {/* Full-width certificate — order-3 on mobile (bottom), order-2 on desktop (middle) */}
              <div className="order-3 md:order-2 mt-6 bg-white rounded-xl p-3 sm:p-4 shadow-sm ring-1 ring-border/50">
                <Image
                  src="/trust/jabr-cr-certificate.png"
                  alt="شهادة السجل التجاري الرسمية · وزارة التجارة السعودية · شركة جبر الجنوبية للمقاولات · الرقم الموحّد 7036024383"
                  width={2573}
                  height={1818}
                  className="block w-full h-auto rounded-lg"
                  sizes="(max-width: 920px) 92vw, 860px"
                  priority={false}
                />
              </div>
              <p className="order-4 md:order-3 mt-2.5 text-center text-[12px] text-muted-foreground leading-[1.6]">
                شهادة السجل التجاري الرسمية · <span className="text-foreground font-semibold">امسح الـ QR بجوالك</span> للتحقّق المباشر من وزارة التجارة السعودية
              </p>
            </div>

          </div>
        </div>
      </m.section>

      {/* ─── TRUST SECTION — live from Modonty's real paying clients ─── */}
      {trustBundle.logos.length > 0 && (
        <TrustSection bundle={trustBundle} ctaLabel={ctaLabel} signupHref={signupHref} />
      )}

      {/* ─── MATH — compact side-by-side comparison for non-technical visitor ─── */}
      <m.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-background"
      >
        <div className="max-w-[1080px] mx-auto px-7 py-14">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-success tracking-[1.5px] mb-3 bg-success/10 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              قارن بنفسك
            </div>
            <h2 className="prev-h2 text-[30px] md:text-[36px] font-semibold tracking-[-1px] mb-3">
              محتوى جوجل يحتاج <span className="text-success">فريق كامل</span>
            </h2>
            <p className="text-[14.5px] text-muted-foreground leading-[1.7] max-w-[560px] mx-auto">
              ست وظائف مختلفة — أو اشتراك واحد يعمل نفس شغلهم.
            </p>
            <p className="text-[11.5px] text-muted-foreground/70 font-mono mt-2">
              الأرقام بعملتك المحلية · تُطبَّق على السوق السعودي والمصري
            </p>
          </div>

          {/* Two cards side-by-side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-4 items-stretch">
            {/* Card 1 — Internal team */}
            <div className="rounded-2xl border border-border bg-card p-5 flex flex-col">
              <div className="mb-4 flex items-start gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-foreground font-semibold text-[13px] font-mono shrink-0">١</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold text-foreground leading-tight">توظّف الفريق بنفسك</div>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wide">
                    <span className="w-1 h-1 rounded-full bg-destructive" aria-hidden />
                    الحد الأدنى للرواتب
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mb-4 flex-1">
                {CALC_ROLES.map((r) => (
                  <li key={r.key} className="flex items-center justify-between gap-2 pb-1.5 border-b border-b-border/50 last:border-b-0 last:pb-0">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-[15px] shrink-0" aria-hidden>{r.icon}</span>
                      <span className="text-[12.5px] text-foreground truncate">{r.label}</span>
                    </span>
                    <span className="font-mono text-[12.5px] text-muted-foreground shrink-0">
                      <bdi>{formatNum(r.def)}</bdi>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t-2 border-t-border mt-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Yearly (primary — right in RTL) */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive" aria-hidden />
                      <span className="text-[11px] font-mono text-destructive tracking-wide font-bold">سنوياً</span>
                    </div>
                    <div className="font-mono text-[24px] md:text-[26px] font-bold text-destructive tracking-[-1px] leading-none">
                      <bdi>{formatNum(mathTeamAnnual)}</bdi>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1.5">بعملتك المحلية</div>
                  </div>
                  {/* Monthly (secondary — left in RTL) */}
                  <div className="border-r border-r-border/60 pr-4">
                    <div className="inline-flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" aria-hidden />
                      <span className="text-[11px] font-mono text-muted-foreground tracking-wide">شهرياً</span>
                    </div>
                    <div className="font-mono text-[18px] md:text-[20px] font-semibold text-foreground tracking-[-.5px] leading-none">
                      <bdi>{formatNum(mathTeamMonthly)}</bdi>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider "أو" — horizontal on desktop, decorative on mobile */}
            <div className="flex md:flex-col items-center justify-center gap-2 py-1 md:py-0 md:px-1">
              <div className="flex-1 md:h-full md:w-px h-px w-full bg-border" />
              <span className="bg-background px-3 py-1 font-mono text-[13px] font-bold text-muted-foreground tracking-[3px] shrink-0">أو</span>
              <div className="flex-1 md:h-full md:w-px h-px w-full bg-border" />
            </div>

            {/* Card 2 — Modonty subscription */}
            <div className="rounded-2xl border-2 border-success bg-gradient-to-br from-success/[0.10] to-success/[0.02] p-5 shadow-[0_24px_50px_-22px_color-mix(in_oklch,var(--success)_40%,transparent)] relative flex flex-col">
              <span className="absolute -top-3 right-5 bg-success text-success-foreground text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[.5px] shadow-sm">
                ✨ الأذكى
              </span>

              <div className="mb-4 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-success text-success-foreground font-semibold text-[13px] font-mono shrink-0">٢</span>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-foreground leading-tight truncate">اشتراك مدونتي — {mathPlanName}</div>
                  <div className="text-[11.5px] text-muted-foreground">كل شغل الفريق · بلا صداع توظيف</div>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4 flex-1">
                {[
                  "مقالات SEO محسّنة لجوجل",
                  "تصميم صور ومحتوى بصري",
                  "متابعة الترتيب لايف",
                  "لوحة تحكم · تقارير · اعتماد بضغطة",
                ].map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] text-foreground leading-[1.55]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 mt-0.5">
                      <path d="M5 12.5l5 5L20 7" />
                    </svg>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t-2 border-t-success/30 mt-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Yearly (primary — right in RTL) */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden />
                      <span className="text-[11px] font-mono text-success tracking-wide font-bold">سنوياً</span>
                    </div>
                    <div className="font-mono text-[28px] md:text-[32px] font-bold text-success tracking-[-1.5px] leading-none">
                      <bdi>{formatNum(mathPlanAnnual)}</bdi>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1.5">بعملتك المحلية</div>
                  </div>
                  {/* Monthly (secondary — left in RTL) */}
                  <div className="border-r border-r-success/30 pr-4">
                    <div className="inline-flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" aria-hidden />
                      <span className="text-[11px] font-mono text-muted-foreground tracking-wide">شهرياً</span>
                    </div>
                    <div className="font-mono text-[18px] md:text-[20px] font-semibold text-foreground tracking-[-.5px] leading-none">
                      <bdi>{formatNum(mathPlanMonthlyOnAnnual)}</bdi>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Savings pill + CTA — single row on desktop */}
          {mathTeamAnnual > mathPlanAnnual && mathPlanAnnual > 0 && (
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2 bg-success/15 border border-success/40 text-success text-[14px] font-semibold px-4 py-2.5 rounded-full">
                <span className="text-[16px]" aria-hidden>💰</span>
                <span>
                  توفير <bdi className="font-mono font-bold">{formatNum(mathTeamAnnual - mathPlanAnnual)}</bdi>
                  <span className="text-success/80 mx-1.5">·</span>
                  {mathSavePct}٪
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCalcOpen(true)}
                aria-label="حاسبة التوفير"
                className="inline-flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer px-5 py-2.5 rounded-xl text-[14px] font-semibold shadow-[0_16px_36px_-14px_color-mix(in_oklch,var(--foreground)_50%,transparent)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
                  <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
                  <line x1="8" y1="7" x2="16" y2="7" />
                  <circle cx="8.5" cy="12" r=".6" fill="currentColor" />
                  <circle cx="12" cy="12" r=".6" fill="currentColor" />
                  <circle cx="15.5" cy="12" r=".6" fill="currentColor" />
                </svg>
                <span>احسب بأرقام سوقك</span>
                <span aria-hidden>←</span>
              </button>
            </div>
          )}

          <p className="mt-4 text-center text-[12px] text-muted-foreground max-w-[520px] mx-auto leading-[1.7]">
            المقالات ملكك للأبد — حتى لو ألغيت الاشتراك، تظل في موقعك تجيب لك زوّار.
          </p>
        </div>
      </m.section>

      {/* ─── FEATURES — reframed as a Saudi platform, production system (not "writing") ─── */}
      <section id="features" className="border-t border-t-[var(--border)] bg-card">
        <div className="max-w-[1080px] mx-auto px-7 py-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
              <Image
                src="/logos/flag-sa.svg"
                alt="السعودية"
                width={20}
                height={14}
                className="h-3.5 w-5 rounded-[2px] ring-1 ring-black/10 object-cover"
              />
              <span>منصة سعودية ١٠٠٪</span>
              <span className="text-success/60" aria-hidden>·</span>
              <span className="text-success/80 font-mono text-[10.5px]">CR 4030524305</span>
            </div>
            <h2 className="prev-h2 text-[30px] md:text-[34px] font-semibold tracking-[-1px] mb-3">
              نبني <span className="text-success">حضورك</span> — لا نبيع وعود
            </h2>
            <p className="text-[14.5px] text-muted-foreground max-w-[580px] mx-auto leading-[1.7]">
              حضور على منصة مدونتي + سوشال ميديا + موقعك (في الباقات الأعلى) —
              أرقام حقيقية من جوجل، لا شعارات.
            </p>
          </div>

          {/* 3-step horizontal grid — clear "who does what" story */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-8">
            {[
              {
                num: "٠١",
                title: "إحنا نجهّز كل شي",
                icon: "⚙️",
                desc: "فريق محترف يشتغل ورا الكواليس: بحث كلمات مفتاحية · استراتيجية محتوى · كتابة متخصصة · تصميم صور · تحسين لجوجل — جاهز في لوحتك، بانتظار موافقتك للنشر على منصة مدونتي.",
              },
              {
                num: "٠٢",
                title: "أنت توافق بضغطة",
                icon: "✅",
                desc: "كل مقال يظهر في لوحتك قبل النشر. اعتمد، عدّل، أو ارفض — ما يُنشر شي على منصة مدونتي بدون إذنك. تحكّم كامل بلا صداع.",
              },
              {
                num: "٠٣",
                title: "العملاء يجونك من جوجل",
                icon: "📈",
                desc: "زوّار حقيقيون يبحثون في جوجل عن خدمتك ويلاقونك — بلا إعلانات، بلا مطاردة. المقالات تنمو شهرياً وتجيب لك عملاء للأبد.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-border bg-background p-6 flex flex-col hover:border-success/40 hover:shadow-[0_20px_40px_-24px_color-mix(in_oklch,var(--success)_35%,transparent)] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-[26px] leading-none" aria-hidden>
                    {step.icon}
                  </div>
                  <span className="font-mono text-[13px] text-muted-foreground tracking-[.5px] pt-1">{step.num}</span>
                </div>
                <h3 className="text-[19px] font-semibold text-foreground tracking-[-.3px] mb-2">
                  {step.title}
                </h3>
                <p className="text-[13.5px] text-muted-foreground leading-[1.75] flex-1">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Multi-channel distribution — the hook that pulls the customer */}
          <div className="mb-8 rounded-2xl border border-success/30 bg-gradient-to-br from-success/[0.07] to-transparent px-5 py-5">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-success font-bold tracking-[1.5px] mb-3">
                <span className="text-[13px]" aria-hidden>✨</span>
                <span>مقالك ما ينزل في مكان واحد</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 text-[13px] text-foreground font-medium">
                  <span aria-hidden>🌐</span>
                  <span>منصة مدونتي</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 text-[13px] text-foreground font-medium">
                  <span aria-hidden>📱</span>
                  <span>سوشال ميديا مدونتي</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-success/10 border border-success/40 rounded-full px-3 py-1.5 text-[13px] text-success font-semibold">
                  <span aria-hidden>🔥</span>
                  <span>موقعك أنت</span>
                  <span className="text-[10px] font-mono bg-success/20 px-1.5 py-0.5 rounded-full">في الباقات الأعلى</span>
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-[1.6] max-w-[500px] mx-auto">
                حضور رقمي على عدة قنوات — العميل يلاقيك من أكثر من مكان، وأنت تشتغل باقة واحدة.
              </p>
            </div>
          </div>

          {/* Exit CTA to full features page */}
          <div className="text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors px-5 py-2.5 rounded-xl text-[14px] font-semibold no-underline shadow-[0_16px_36px_-14px_color-mix(in_oklch,var(--foreground)_50%,transparent)]"
            >
              <span>شوف كل تفاصيل المنظومة</span>
              <span aria-hidden>←</span>
            </Link>
            <p className="mt-2 text-[12px] text-muted-foreground">
              ٤ منظومات متكاملة · ٢٨ فحص جودة لكل مقال · ٢٣ تنبيه فوري
            </p>
          </div>
        </div>
      </section>

      {/* ─── PAYMENT TRUST (Network International anchor · single bar) ─── */}
      <m.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="border-t border-t-[var(--border)] border-b border-b-[var(--border)] bg-card"
      >
        <div className="max-w-[1080px] mx-auto px-7 py-14">
          <div className="rounded-2xl border border-border overflow-hidden shadow-[0_20px_50px_-30px_color-mix(in_oklch,var(--foreground)_25%,transparent)]">
            {/* Tier 1 — Gateway anchor (green-tinted so it reads as the credibility anchor) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-6 py-5 bg-success/[0.08] border-b border-b-success/20">
              <div className="text-center sm:text-right">
                <div className="font-mono text-[11px] text-success tracking-[2px] mb-1 font-bold">SECURE PAYMENTS</div>
                <div className="text-[15px] font-semibold text-foreground leading-tight">
                  الدفع الآمن عبر <span className="text-success">Network International</span>
                </div>
                <div className="text-[11.5px] text-muted-foreground mt-0.5 font-mono">
                  أكبر معالج دفع في الشرق الأوسط · LSE:NETW
                </div>
              </div>
              <div className="shrink-0 inline-flex items-center justify-center bg-white rounded-lg ring-1 ring-black/10 shadow-sm w-[150px] h-11 px-3">
                <Image
                  src="/logos/network-international.svg"
                  alt="Network International"
                  width={556}
                  height={126}
                  className="w-[126px] h-[28px] object-contain"
                />
              </div>
            </div>

            {/* Tier 2 — Payment methods, each in a white pill so brand colors render on both themes */}
            <div className="bg-background px-6 py-6">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-5">
                {/* Saudi cluster (RTL — appears first) */}
                <div className="inline-flex items-center gap-2.5 flex-wrap justify-center">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-foreground/80 tracking-wide font-semibold">
                    <Image
                      src="/logos/flag-sa.svg"
                      alt="السعودية"
                      width={24}
                      height={16}
                      className="h-4 w-6 rounded-[2px] ring-1 ring-black/10 object-cover"
                    />
                    <span>السعودية</span>
                  </span>
                  {[
                    { src: "/logos/mada.svg", alt: "مدى" },
                    { src: "/logos/visa.svg", alt: "Visa" },
                    { src: "/logos/mastercard.svg", alt: "Mastercard" },
                    { src: "/logos/apple-pay.svg", alt: "Apple Pay" },
                    { src: "/logos/stcpay.svg", alt: "STC Pay" },
                    { src: "/logos/tamara.svg", alt: "Tamara" },
                  ].map((logo) => (
                    <div key={logo.alt} className="h-11 bg-white rounded-lg ring-1 ring-black/5 shadow-sm flex items-center justify-center px-3">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={200}
                        height={44}
                        unoptimized
                        style={{ height: 22, width: "auto", objectFit: "contain" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <span className="hidden md:inline-block w-px h-10 bg-border" aria-hidden />

                {/* Egypt cluster */}
                <div className="inline-flex items-center gap-2.5 flex-wrap justify-center">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-foreground/80 tracking-wide font-semibold">
                    <Image
                      src="/logos/flag-eg.svg"
                      alt="مصر"
                      width={24}
                      height={16}
                      className="h-4 w-6 rounded-[2px] ring-1 ring-black/10 object-cover"
                    />
                    <span>مصر</span>
                  </span>
                  {[
                    { src: "/logos/instapay.svg", alt: "InstaPay" },
                    { src: "/logos/saib-bank.png", alt: "saib" },
                  ].map((logo) => (
                    <div key={logo.alt} className="h-11 bg-white rounded-lg ring-1 ring-black/5 shadow-sm flex items-center justify-center px-3">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={200}
                        height={44}
                        unoptimized
                        style={{ height: 22, width: "auto", objectFit: "contain" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tier 3 — Trust badges (stronger contrast) */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-3.5 border-t border-t-border bg-card">
              <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <span className="font-semibold">PCI DSS Level 1</span>
              </span>
              <span className="text-muted-foreground/50" aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l5 5L20 7" />
                </svg>
                <span className="font-semibold">3D Secure</span>
              </span>
              <span className="text-muted-foreground/50" aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l5 5L20 7" />
                </svg>
                <span>بيانات كارتك لا تلمس خوادمنا</span>
              </span>
            </div>
          </div>
        </div>
      </m.section>

      {/* ─── PRICING (DB Plan model) ─── */}
      <section id="pricing" className="max-w-[1080px] mx-auto px-7 py-20">
        <div className="text-center mb-[34px]">
          <h2 className="prev-h2 text-[38px] font-semibold tracking-[-1px]">باقات تنمو معك</h2>
          <p className="text-[15px] text-muted-foreground mt-3">
            ابدأ بالباقة الأنسب — ترقّى متى ما احتجت، بدون التزام.
          </p>
          <div className="mt-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-success transition-colors border-b border-b-transparent hover:border-b-success/40 pb-0.5"
            >
              <span>عندك سؤال قبل الاشتراك؟</span>
              <span className="font-semibold text-success">نتكلم على واتساب</span>
              <span>←</span>
            </a>
          </div>
          <div className="prev-pricing-toggle inline-flex bg-muted rounded-[11px] p-1 mt-6 text-sm font-medium">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-[18px] py-2 rounded-lg",
                billing === "monthly" ? "bg-card text-foreground shadow-[0_1px_3px_color-mix(in oklch, var(--foreground) 8%, transparent)]" : "bg-transparent text-muted-foreground",
              )}
            >
              شهري
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={cn(
                "px-[18px] py-2 rounded-lg",
                billing === "annual" ? "bg-card text-foreground shadow-[0_1px_3px_color-mix(in oklch, var(--foreground) 8%, transparent)]" : "bg-transparent text-muted-foreground",
              )}
            >
              سنوي · ادفع 12 استلم 18
            </button>
          </div>
        </div>

        <m.div
          className="prev-pricing-grid grid gap-[14px]"
          variants={STAGGER_PARENT}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{ gridTemplateColumns: `repeat(${Math.min(visiblePlans.length, 4)}, 1fr)` }}
        >
          {visiblePlans.map((p) => {
            const featured = !!p.featuredBadge && p.featuredBadge.trim() !== "";
            const price = billing === "annual" ? p.priceYearly : p.priceMonthly;
            const annualTotal = p.priceYearly * 12;
            const effectiveMonthly = Math.round(annualTotal / 18);
            const content = getPlanCardContent(p.slug);
            if (!content) return null;
            const PersonaIcon = content.personaIcon;
            const isConsultation = !!content.ctaAsConsultation;

            return (
              <m.div
                key={p.id}
                variants={STAGGER_CHILD}
                className={cn(
                  "rounded-[18px] px-[22px] py-[26px] relative border-2 bg-card text-foreground",
                  featured
                    ? "border-success ring-2 ring-success/30 shadow-[0_24px_50px_-22px_color-mix(in_oklch,var(--success)_60%,transparent)]"
                    : "border-border",
                )}
              >
                {featured && (
                  <span className="absolute -top-[12px] right-[24px] bg-success text-success-foreground text-[10.5px] font-bold px-3 py-1 rounded-full tracking-[.3px] inline-flex items-center gap-1.5">
                    <Flame className="w-3 h-3" strokeWidth={2.5} />
                    {p.featuredBadge}
                  </span>
                )}

                {/* Persona */}
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground mb-1.5">
                  <PersonaIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{content.persona}</span>
                </div>

                {/* Plan name */}
                <div className="text-[20px] font-extrabold text-foreground mb-5 tracking-[-0.3px]">
                  {p.name}
                </div>

                {/* Hero metric — articles/month */}
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 mb-5 rounded-xl border",
                  featured ? "bg-success/10 border-success/30" : "bg-foreground/[.03] border-border",
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    featured ? "bg-success/20 text-success" : "bg-foreground/5 text-muted-foreground",
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-mono text-[17px] font-extrabold leading-tight",
                      featured ? "text-success" : "text-foreground",
                    )}>
                      {p.articlesLabel || "—"}
                    </div>
                    <div className="text-[11.5px] text-muted-foreground mt-1 leading-tight">
                      {content.heroCaption}
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-4xl font-semibold tracking-[-1.5px] text-foreground">{billing === "annual" ? formatNum(annualTotal) : price}</span>
                  <span className="text-xs text-muted-foreground">{currency}/{billing === "annual" ? "سنوياً" : "شهر"}</span>
                </div>
                <div className={cn(
                  "text-[12.5px] mt-2 min-h-5 font-mono font-bold text-success items-center gap-1.5 w-fit",
                  billing === "annual" && p.priceYearly > 0 ? "inline-flex" : "hidden",
                  featured && "bg-success/15 px-2.5 py-1 rounded-md",
                )}>
                  {billing === "annual" && p.priceYearly > 0 ? `يصير ${formatNum(effectiveMonthly)} ${currency}/شهر · ٦ شهور هدية` : " "}
                </div>
                <Link
                  href={isConsultation ? whatsappLink : `${signupHref}?plan=${p.slug}`}
                  target={isConsultation ? "_blank" : undefined}
                  rel={isConsultation ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex items-center justify-center gap-2 p-[13px] rounded-[11px] text-[14px] no-underline mt-[18px] mb-[22px] border font-bold",
                    featured ? "bg-success text-success-foreground border-transparent" : "bg-background text-foreground border-border",
                  )}
                >
                  <span>{isConsultation ? "احجز جلسة استشارة" : (p.ctaText || `ابدأ بـ${p.name}`)}</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                {/* Bullets label */}
                <div className="text-[11.5px] text-muted-foreground mb-3 font-semibold pb-3 border-b border-border">
                  {content.bulletsLabel}
                </div>

                {/* Bullets */}
                <div className="flex flex-col gap-3 mb-5">
                  {content.bullets.map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className={cn(
                        "flex gap-2.5 items-start text-[13px] leading-[1.5]",
                        b.highlight ? "text-foreground font-medium" : "text-muted-foreground",
                      )}>
                        <div className={cn(
                          "w-[22px] h-[22px] rounded-md flex items-center justify-center shrink-0",
                          b.highlight ? "bg-success/15 text-success" : "bg-foreground/[.04] text-muted-foreground",
                        )}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="pt-[2px]">{b.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Trust chip — featured plan only, motivational (not persona) */}
                {content.trustChip && (
                  <div className="mt-auto p-3 rounded-lg bg-foreground/[.02] border border-border flex gap-2.5 items-start text-[11.5px] leading-[1.5]">
                    <content.trustChip.icon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <div>
                      <span className="text-success font-bold">{content.trustChip.label}</span>
                      <span className="text-foreground/75"> — {content.trustChip.body}</span>
                    </div>
                  </div>
                )}
              </m.div>
            );
          })}
        </m.div>
      </section>

      {/* ─── SOCIAL PROOF VOICES (DB) ─── */}
      {voices.length > 0 && (() => {
        const safeIdx = Math.min(selectedVoice, voices.length - 1);
        const v = voices[safeIdx];
        const embedUrl = ytEmbed(v.videoUrl);
        const initials = (v.name ?? "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
        return (
          <m.section
            id="social-proof"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-t-[var(--border)] bg-background"
          >
            <div className="max-w-[1080px] mx-auto px-7 py-14">
              <div className="text-center mb-10">
                {/* Trust badge — matches structure of other sections */}
                <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
                  <span className="text-[13px]" aria-hidden>⭐</span>
                  <span>{socialProofEyebrow || "شهادات صادرة بإذن أصحابها"}</span>
                  <span className="text-success/60" aria-hidden>·</span>
                  <span className="text-success/80 font-mono text-[10.5px]">لا سيناريو</span>
                </div>
                <h2 className="prev-h2 text-[30px] md:text-[34px] font-semibold tracking-[-1px] mb-3">
                  شهادات <span className="text-success">تشوفها</span> — لا وعود تسمعها
                </h2>
                <p className="text-[14.5px] text-muted-foreground max-w-[580px] mx-auto leading-[1.7]">
                  نفس العملاء اللي شفت أرقامهم في قصص النجاح فوق — الحين اسمعهم بأصواتهم.
                </p>
              </div>

              {/* Slider single-view — same pattern as CaseStudiesSlider up top */}
              <div className="max-w-[860px] mx-auto">
                <AnimatePresence mode="wait">
                  <m.div
                    key={safeIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-[0_20px_50px_-30px_color-mix(in_oklch,var(--foreground)_25%,transparent)]"
                  >
                    <div className="relative aspect-video bg-foreground">
                      {embedUrl ? (
                        <iframe
                          key={embedUrl}
                          src={embedUrl}
                          title={`${v.name} — ${v.company}`}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0 block"
                        />
                      ) : v.mediaImage ? (
                        <Image
                          src={v.mediaImage}
                          alt={v.name ?? ""}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-[13px]">
                          لا يوجد فيديو
                        </div>
                      )}
                    </div>
                    <div className="px-6 md:px-8 py-6">
                      {v.quote && (
                        <p className="text-[16px] md:text-[17px] leading-[1.85] text-foreground font-normal mb-5">
                          «{v.quote}»
                        </p>
                      )}
                      <div className="flex items-center gap-3 pt-4 border-t border-t-border flex-wrap">
                        <span className="prev-voice-avatar w-11 h-11">
                          {v.avatarImg ? (
                            <Image src={v.avatarImg} alt={v.name ?? ""} width={44} height={44} unoptimized />
                          ) : (
                            <span className="text-[15px]">{initials}</span>
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[15px] font-semibold text-foreground">{v.name}</div>
                          <div className="text-[13px] text-muted-foreground mt-0.5">
                            {[v.role, v.company].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                        {v.metric && (
                          <div className="ms-auto bg-success/10 text-success text-xs font-semibold px-3 py-1.5 rounded-full font-mono">
                            {v.metric}
                          </div>
                        )}
                      </div>
                    </div>
                  </m.div>
                </AnimatePresence>

                {/* Slider controls — arrows + dots (same pattern as CaseStudiesSlider) */}
                {voices.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setSelectedVoice(((safeIdx - 1) % voices.length + voices.length) % voices.length)}
                      aria-label="الشهادة السابقة"
                      className="w-10 h-10 rounded-full bg-card border border-border hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <span className="text-[18px]">→</span>
                    </button>
                    <div className="flex items-center gap-2">
                      {voices.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedVoice(i)}
                          aria-label={`الشهادة ${i + 1}`}
                          className={cn(
                            "h-2 rounded-full transition-all",
                            i === safeIdx ? "w-8 bg-success" : "w-2 bg-border hover:bg-muted-foreground",
                          )}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedVoice((safeIdx + 1) % voices.length)}
                      aria-label="الشهادة التالية"
                      className="w-10 h-10 rounded-full bg-card border border-border hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <span className="text-[18px]">←</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </m.section>
        );
      })()}

      {/* ─── TEAM — "faces that guarantee your presence" (aligned with slogan + CR) ─── */}
      {(coreTeam.length > 0 || executionTeam.length > 0) && (
        <m.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-t-[var(--border)] bg-card"
        >
          <div className="max-w-[1080px] mx-auto px-7 py-14">
            <div className="text-center mb-10">
              {/* Trust badge — legal accountability */}
              <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
                <Image
                  src="/logos/flag-sa.svg"
                  alt="السعودية"
                  width={20}
                  height={14}
                  className="h-3.5 w-5 rounded-[2px] ring-1 ring-black/10 object-cover"
                />
                <span>مسؤولون قانونياً</span>
                <span className="text-success/60" aria-hidden>·</span>
                <span className="text-success/80 font-mono text-[10.5px]">CR 4030524305</span>
              </div>
              <h2 className="prev-h2 text-[30px] md:text-[34px] font-semibold tracking-[-1px] mb-3">
                الوجوه اللي <span className="text-success">تضمن</span> حضورك
              </h2>
              <p className="text-[14.5px] text-muted-foreground max-w-[580px] mx-auto leading-[1.7]">
                هؤلاء وقّعوا تعهّد &laquo;حضور لا وعود&raquo; — تقدر تسائلهم شخصياً على كل مقال.
              </p>
            </div>

            {coreTeam.length > 0 && (
              <div
                className={cn(
                  "grid grid-cols-1 gap-4",
                  coreTeam.length >= 2 && "md:grid-cols-2",
                  executionTeam.length > 0 && "mb-8",
                )}
              >
                {coreTeam.map((m, i) => {
                  const initials = m.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
                  return (
                    <div
                      key={i}
                      className="group bg-background border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-success/40 hover:shadow-[0_20px_40px_-24px_color-mix(in_oklch,var(--success)_30%,transparent)] transition-all"
                    >
                      <div className="shrink-0 w-16 h-16 md:w-[76px] md:h-[76px] rounded-full overflow-hidden bg-muted flex items-center justify-center ring-2 ring-success/15">
                        {m.avatarUrl ? (
                          <Image src={m.avatarUrl} alt={m.name} width={76} height={76} unoptimized className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[22px] font-semibold text-muted-foreground">{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <div className="text-[16px] font-semibold text-foreground">{m.name}</div>
                          <span className="inline-flex items-center gap-1 bg-success/10 text-success text-[10px] font-mono font-bold px-2 py-0.5 rounded-full tracking-wide">
                            <span className="w-1 h-1 rounded-full bg-success" aria-hidden />
                            <span>مسؤول</span>
                          </span>
                        </div>
                        <div className="text-[13px] text-muted-foreground mb-2">{m.role}</div>
                        {m.bio && (
                          <p className="text-[12.5px] text-muted-foreground leading-[1.7]">{m.bio}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {executionTeam.length > 0 && (
              <div>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground tracking-[1.5px]">
                    <span className="w-6 h-px bg-border" aria-hidden />
                    <span>فريق التنفيذ</span>
                    <span className="w-6 h-px bg-border" aria-hidden />
                  </div>
                </div>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {executionTeam.map((m, i) => {
                    const initials = m.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
                    return (
                      <div
                        key={i}
                        className="bg-background border border-border rounded-xl p-3 flex flex-col items-center text-center gap-2 hover:border-muted-foreground/50 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          {m.avatarUrl ? (
                            <Image src={m.avatarUrl} alt={m.name} width={56} height={56} unoptimized className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[15px] font-semibold text-muted-foreground">{initials}</span>
                          )}
                        </div>
                        <div className="min-w-0 w-full">
                          <div className="text-[12.5px] font-semibold text-foreground truncate">{m.name}</div>
                          <div className="text-[10.5px] text-muted-foreground truncate mt-0.5">{m.role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </m.section>
      )}

      {/* ─── FAQ — grouped by tag (leverages FaqItem.tag from DB) ─── */}
      {faqs.length > 0 && (() => {
        // Group by tag, preserving first-appearance order.
        const grouped = new Map<string, typeof faqs>();
        for (const item of faqs) {
          const tag = (item.tag || "").trim() || "عام";
          if (!grouped.has(tag)) grouped.set(tag, []);
          grouped.get(tag)!.push(item);
        }
        const groups = Array.from(grouped.entries());
        return (
          <m.section
            id="faq"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-t-[var(--border)] bg-card"
          >
            <div className="max-w-[760px] mx-auto px-7 py-14">
              <div className="text-center mb-8">
                {/* Trust badge — matches structure of other sections */}
                <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
                  <span className="text-[13px]" aria-hidden>💬</span>
                  <span>إجابات مباشرة · بلا لف</span>
                  <span className="text-success/60" aria-hidden>·</span>
                  <span className="text-success/80 font-mono text-[10.5px]">{toArabicDigits(faqs.length)} سؤال</span>
                </div>
                <h2 className="prev-h2 text-[30px] md:text-[34px] font-semibold tracking-[-1px] mb-3">
                  اقتنع <span className="text-success">قبل</span> ما تبدأ
                </h2>
                <p className="text-[14.5px] text-muted-foreground max-w-[520px] mx-auto leading-[1.7]">
                  كل سؤال يجيك في بالك — مقسّم حسب الموضوع للوصول السريع.
                </p>
              </div>

              {/* Category filter chips — jump to group */}
              {groups.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  {groups.map(([tag, items]) => (
                    <a
                      key={tag}
                      href={`#faq-group-${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-1.5 bg-background border border-border hover:border-success/50 hover:bg-success/5 transition-colors text-[12px] font-medium text-foreground px-3 py-1.5 rounded-full"
                    >
                      <span>{tag}</span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
                        {toArabicDigits(items.length)}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {/* Grouped accordion */}
              <div className="space-y-6">
                {groups.map(([tag, items]) => (
                  <div key={tag} id={`faq-group-${encodeURIComponent(tag)}`} className="scroll-mt-24">
                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="w-1 h-4 rounded-full bg-success" aria-hidden />
                      <span className="font-mono text-[11px] text-success font-bold tracking-[1.5px]">{tag}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        · {toArabicDigits(items.length)} سؤال
                      </span>
                    </div>
                    <div className="rounded-2xl border border-border bg-background overflow-hidden divide-y divide-border">
                      {items.map((item) => {
                        // Stable global index for openFaq state (faqs order preserved).
                        const flatIdx = faqs.indexOf(item);
                        const isOpen = openFaq === flatIdx;
                        return (
                          <div key={flatIdx} className={`prev-faq-item${isOpen ? " open" : ""} px-5`}>
                            <button
                              className="prev-faq-q"
                              onClick={() => setOpenFaq(isOpen ? null : flatIdx)}
                            >
                              <span>{item.q}</span>
                              <span className="prev-faq-toggle">{isOpen ? "×" : "+"}</span>
                            </button>
                            <div className="prev-faq-a">{item.a}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center text-[13px] text-muted-foreground">
                ما لقيت إجابتك؟{" "}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-success font-semibold no-underline border-b border-b-success/30 pb-px"
                >
                  تواصل معنا على واتساب ←
                </a>
              </div>
            </div>
          </m.section>
        );
      })()}

      {/* ─── FINAL CTA (DB) ─── */}
      <m.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1080px] mx-auto pt-[60px] px-7 pb-[90px]"
      >
        <div className="bg-foreground rounded-[26px] px-10 py-[72px] text-center">
          <h2 className="prev-cta-h2 text-[44px] font-semibold text-background tracking-[-1.5px] leading-[1.15] mb-4">
            {finalCtaData?.title1 ?? "منافسك يتصدّر الحين."}<br />
            {finalCtaData?.title2 ?? "وأنت؟"}
          </h2>
          <p className="text-[17px] text-background/70 max-w-[460px] mx-auto mb-8 leading-[1.7] font-light">
            {finalCtaData?.subtitle ?? "انضم لأوائل الشركات اللي اختارت المحتوى طريقاً للنمو — لا الإعلانات."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={signupHref} className="bg-background text-foreground px-[30px] py-4 rounded-[13px] text-base font-semibold no-underline">
              {ctaLabel}
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-background/10 text-background px-[26px] py-4 rounded-[13px] text-base font-medium no-underline border border-background/15">
              {finalCtaData?.wa ?? "كلّمنا على واتساب"}
            </a>
          </div>
        </div>
      </m.section>

      {/* ─── CALCULATOR MODAL (spring · compact) ─── */}
      <AnimatePresence>
      {calcOpen && (() => {
        const calcModontyAnnual = mathPlanAnnual > 0 ? mathPlanAnnual : 12468;
        const calcSaveAmt = Math.max(0, teamAnnual - calcModontyAnnual);
        const calcSavePct = teamAnnual > 0 ? Math.max(0, Math.round((1 - calcModontyAnnual / teamAnnual) * 100)) : 0;
        return (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) setCalcOpen(false); }}
          className="fixed inset-0 z-[70] bg-[color-mix(in oklch, var(--foreground) 42%, transparent)] backdrop-blur-[5px] flex items-center justify-center p-[18px]"
        >
          <m.div
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 230 }}
            className="bg-card rounded-[18px] max-w-[620px] w-full max-h-[88vh] overflow-auto"
          >
            {/* Header — compact */}
            <div className="pt-[18px] px-[22px] pb-[14px] border-b border-b-muted flex items-center justify-between gap-3">
              <div className="text-base font-semibold">كم يكلّفك البديل فعلاً؟</div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSalaries(Object.fromEntries(CALC_ROLES.map((r) => [r.key, r.def])))}
                  className="bg-transparent border-none text-[11.5px] text-muted-foreground cursor-pointer px-2 py-1 font-mono"
                >
                  reset
                </button>
                <button
                  onClick={() => setCalcOpen(false)}
                  aria-label="إغلاق"
                  className="bg-transparent border-none text-xl text-muted-foreground cursor-pointer leading-none px-1.5 py-0.5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Result strip — compact, on top so visible without scroll */}
            <div className="pt-4 px-[22px] pb-[18px] bg-foreground text-background">
              <div className="flex items-center justify-between gap-[18px]">
                {/* RIGHT (RTL start): Modonty — emphasized */}
                <div>
                  <div className="inline-flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span className="text-[11.5px] text-success font-semibold tracking-[.3px]">
                      مدونتي · {mathPlanName}
                    </span>
                  </div>
                  <div className="font-mono text-[22px] font-semibold text-background">
                    {formatNum(calcModontyAnnual)} <span className="text-xs text-background/60 font-normal">{currency}/سنة</span>
                  </div>
                  <div className="text-[13px] text-background/60 mt-1.5 font-mono">
                    بدلاً من <span className="line-through decoration-destructive text-background/50 font-medium">{formatNum(teamAnnual)}</span>
                  </div>
                </div>
                {/* LEFT (RTL end): Saving % */}
                <div className="text-left ps-[14px] border-s border-s-background/10">
                  <div className="text-[11px] text-background/60 font-mono tracking-[.5px] mb-[3px]">التوفير</div>
                  <div className="font-mono text-[26px] font-semibold text-success leading-none">{calcSavePct}٪</div>
                  <div className="text-xs text-background/60 mt-[5px] font-mono">
                    = {formatNum(calcSaveAmt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Sliders — 2-col grid desktop, compact */}
            <div className="pt-[14px] px-[22px] pb-1">
              <div className="prev-calc-grid grid grid-cols-2 gap-x-[22px] gap-y-[14px]">
                {CALC_ROLES.map((r) => {
                  const value = salaries[r.key] ?? r.def;
                  const pct = ((value - r.min) / (r.max - r.min)) * 100;
                  const STEP = 500;
                  const bump = (delta: number) => {
                    setSalaries((prev) => {
                      const cur = prev[r.key] ?? r.def;
                      const next = Math.max(r.min, Math.min(r.max, cur + delta));
                      return { ...prev, [r.key]: next };
                    });
                  };
                  const atMin = value <= r.min;
                  const atMax = value >= r.max;
                  return (
                    <div key={r.key}>
                      <div className="flex justify-between items-baseline text-xs mb-1.5">
                        <span className="text-muted-foreground font-medium">{r.label}</span>
                        <span className="font-mono text-xs text-foreground">{formatNum(value)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`أنقص ${r.label}`}
                          onClick={() => bump(-STEP)}
                          disabled={atMin}
                          className={cn("prev-calc-btn", atMin ? "opacity-35 cursor-not-allowed" : "opacity-100 cursor-pointer")}
                        >
                          −
                        </button>
                        <div className="relative h-[18px] flex-1">
                          <div className="absolute top-[7px] left-0 right-0 h-1 rounded-full bg-muted" />
                          <div className="absolute top-[7px] right-0 h-1 rounded-full bg-success" style={{ width: `${pct}%` }} />
                          <input
                            type="range"
                            className="prev-range absolute top-0 left-0 right-0"
                            min={r.min}
                            max={r.max}
                            step={100}
                            value={value}
                            onChange={(e) => setSalaries((prev) => ({ ...prev, [r.key]: Number(e.target.value) }))}
                          />
                        </div>
                        <button
                          type="button"
                          aria-label={`زِد ${r.label}`}
                          onClick={() => bump(STEP)}
                          disabled={atMax}
                          className={cn("prev-calc-btn", atMax ? "opacity-35 cursor-not-allowed" : "opacity-100 cursor-pointer")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 px-[22px] pb-[22px]">
              <a
                href="#pricing"
                onClick={() => setCalcOpen(false)}
                className="block text-center bg-success text-success-foreground p-3 rounded-[10px] text-[14.5px] font-semibold no-underline"
              >
                شوف الباقة المناسبة لك ←
              </a>
            </div>
          </m.div>
        </m.div>
        );
      })()}
      </AnimatePresence>
    </>
    </LazyMotion>
  );
}
