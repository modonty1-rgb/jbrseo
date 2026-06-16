"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, animate, useInView, AnimatePresence } from "motion/react";
import type { Plan as DBPlan } from "@prisma/client";
import type { StaticLanding } from "@/app/content/landing/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

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
};

const SERP_QUERIES = [
  "شركة مقاولات بالرياض",
  "عيادة أسنان بجدة",
  "متجر قهوة مختصة",
  "مكتب محاماة بالقاهرة",
];

const SERP_ROWS = {
  ad:  { title: "منافس أعلى أداءً — موقعك في الخلف", url: "competitor-ads.com", ad: true },
  c2:  { title: "دليل خدمات بدون تحديث منذ سنتين", url: "old-directory.net", ad: false },
  c3:  { title: "مدوّنة عامة بدون أمثلة محلية", url: "generic-blog.com", ad: false },
  c4:  { title: "صفحة ويكيبيديا للتعريف العام", url: "reference-site.org", ad: false },
  c5:  { title: "منافس متخصص في خدمة مجاورة", url: "side-competitor.net", ad: false },
  you: { title: "نشاطك التجاري — حل عملائك الأول", url: "your-business.com", isYou: true, ad: false },
} as const;

type SerpKey = keyof typeof SERP_ROWS;
const INITIAL_ORDER: SerpKey[] = ["ad", "c2", "c3", "c4", "c5", "you"];
const ROW_H = 62;
const ROW_INNER_H = 54;

const CALC_ROLES = [
  { key: "writer",   label: "كاتب محتوى SEO",      def: 4500, min: 2500, max: 12000 },
  { key: "designer", label: "مصمم جرافيك",         def: 7000, min: 2000, max: 12000 },
  { key: "seo",      label: "متخصص SEO",           def: 6000, min: 3000, max: 14000 },
  { key: "social",   label: "مدير سوشال ميديا",    def: 5500, min: 2500, max: 12000 },
  { key: "video",    label: "مونتير / منتج فيديو", def: 6000, min: 2500, max: 14000 },
  { key: "dev",      label: "مطور مواقع",          def: 8000, min: 3000, max: 18000 },
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
@keyframes prev-fab-in{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes prev-sheet-in{from{transform:translateY(20px) scale(.98);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
.prev-serp-row{position:absolute;left:14px;right:14px;height:${ROW_INNER_H}px;border:1.5px solid transparent;border-radius:13px;padding:10px 12px;overflow:hidden;transition:top .55s cubic-bezier(.34,1.2,.34,1),box-shadow .4s,border-color .4s,background .4s}
.prev-serp-row.you{background:var(--card);border-color:var(--success);box-shadow:0 10px 26px -12px color-mix(in oklch, var(--success) 45%, transparent)}
.prev-serp-row.won{background:var(--card);border-color:var(--success);box-shadow:0 14px 30px -10px color-mix(in oklch, var(--success) 55%, transparent)}
.prev-faq-item{border-bottom:1px solid var(--border)}
.prev-faq-q{display:flex;justify-content:space-between;align-items:center;width:100%;padding:22px 0;font-size:16px;font-weight:500;color:var(--foreground);text-align:right}
.prev-faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease,padding .35s ease;font-size:14.5px;color:var(--muted-foreground);line-height:1.85;padding:0;font-weight:300}
.prev-faq-item.open .prev-faq-a{max-height:600px;padding:0 0 22px}
.prev-faq-toggle{font-size:22px;color:var(--muted-foreground);font-weight:300;transition:transform .3s ease;display:inline-block;line-height:1}
.prev-faq-item.open .prev-faq-toggle{transform:rotate(45deg)}
.prev-range{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer;height:22px;width:100%}
.prev-range::-webkit-slider-runnable-track{height:5px;border-radius:99px;background:transparent}
.prev-range::-webkit-slider-thumb{-webkit-appearance:none;height:20px;width:20px;border-radius:50%;background:var(--card);border:2px solid var(--success);box-shadow:0 2px 7px color-mix(in oklch, var(--success) 45%, transparent);margin-top:-8px}
.prev-range::-moz-range-thumb{height:18px;width:18px;border-radius:50%;background:var(--card);border:2px solid var(--success)}
.prev-systems-teaser{position:relative;overflow:hidden;background:var(--foreground);color:var(--card);border-radius:24px;padding:48px 36px;text-align:center}
.prev-systems-teaser::before{content:"";position:absolute;top:-100px;right:-100px;width:280px;height:280px;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklch, var(--success) 28%, transparent),transparent 70%);pointer-events:none}
.prev-systems-teaser::after{content:"";position:absolute;bottom:-110px;left:-80px;width:240px;height:240px;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklch, var(--success) 16%, transparent),transparent 70%);pointer-events:none}
.prev-st-eyebrow{position:relative;display:inline-flex;align-items:center;gap:var(--space-2);font-family:'IBM Plex Mono',monospace;font-size:var(--font-xs);color:var(--success);letter-spacing:1;margin-bottom:18px;font-weight:600}
.prev-st-eyebrow::before{content:"";width:6px;height:6px;border-radius:99px;background:var(--success)}
.prev-st-icons{position:relative;display:flex;justify-content:center;gap:14px;margin-bottom:22px;flex-wrap:wrap}
.prev-st-ico{width:48px;height:48px;border-radius:13px;background:color-mix(in oklch, var(--card-foreground) 6%, transparent);border:1px solid color-mix(in oklch, var(--card-foreground) 10%, transparent);display:inline-flex;align-items:center;justify-content:center;font-size:22px}
.prev-st-title{position:relative;font-size:28px;font-weight:600;letter-spacing:-.7px;line-height:1.25;margin-bottom:14px;max-width:560px;margin-inline:auto}
.prev-st-title .accent{color:var(--success)}
.prev-st-sub{position:relative;font-size:14.5px;color:var(--muted-foreground);max-width:540px;margin:0 auto 26px;line-height:1.75}
.prev-st-stats{position:relative;display:inline-flex;flex-wrap:wrap;justify-content:center;gap:18px;margin-bottom:26px}
.prev-st-stat{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--muted-foreground);display:inline-flex;align-items:center;gap:7px}
.prev-st-stat b{color:var(--card);font-weight:600;font-size:14px}
.prev-st-stat-sep{width:4px;height:4px;border-radius:99px;background:color-mix(in oklch, var(--card-foreground) 18%, transparent)}
.prev-st-cta{position:relative;display:inline-flex;align-items:center;gap:8px;background:var(--success);color:var(--card);padding:13px 24px;border-radius:12px;font-size:14.5px;font-weight:600;text-decoration:none;transition:all .15s ease;box-shadow:0 14px 30px -14px color-mix(in oklch, var(--success) 60%, transparent)}
.prev-st-cta:hover{background:var(--success);transform:translateY(-1px)}
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
.prev-team-core-card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:28px 26px;display:flex;align-items:center;gap:var(--space-5);transition:all .2s ease}
.prev-team-core-card:hover{border-color:var(--foreground);box-shadow:0 24px 50px -28px color-mix(in oklch, var(--foreground) 18%, transparent);transform:translateY(-1px)}
.prev-team-core-avatar{width:88px;height:88px;border-radius:50%;flex-shrink:0;overflow:hidden;background:var(--border);display:flex;align-items:center;justify-content:center}
.prev-team-core-avatar img{width:100%;height:100%;object-fit:cover}
.prev-team-exec-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 16px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:var(--space-3);transition:all .15s ease}
.prev-team-exec-card:hover{border-color:var(--muted-foreground);transform:translateY(-1px)}
.prev-team-exec-avatar{width:64px;height:64px;border-radius:50%;overflow:hidden;background:var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted-foreground);font-weight:600;font-size:18px}
.prev-team-exec-avatar img{width:100%;height:100%;object-fit:cover}
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
  .prev-how-grid{grid-template-columns:1fr !important}
  .prev-how-cell{border-right:none !important;border-bottom:1px solid var(--border);padding:var(--space-6) var(--space-0)}
  .prev-how-cell:last-child{border-bottom:none}
  .prev-serp-card{margin:0 -8px}
  .prev-serp-row{height:52px;padding:8px 10px}
  .prev-serp-rank{width:26px !important;height:26px !important;font-size:12px !important}
  .prev-serp-titlebar{flex-wrap:nowrap !important;overflow:hidden}
  .prev-serp-title{font-size:13.5px !important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
  .prev-serp-url{font-size:10.5px !important}
  .prev-serp-row .prev-serp-you-badge{display:none !important}
  .prev-voice-metric{margin-inline-start:0 !important;order:3;width:100%;text-align:center}
  .prev-why-grid{grid-template-columns:1fr !important}
  .prev-voices-grid{grid-template-columns:1fr !important;gap:var(--space-5) !important}
  .prev-voices-grid > div{min-width:0}
  .prev-voices-list{flex-direction:row !important;overflow-x:auto;overflow-y:hidden;padding-bottom:6px;scrollbar-width:none;max-width:100%;width:100%;-webkit-overflow-scrolling:touch}
  .prev-voices-list::-webkit-scrollbar{display:none}
  .prev-voices-list > button{min-width:220px;flex-shrink:0}
  .prev-team-core-grid{grid-template-columns:1fr !important}
  .prev-team-exec-grid{grid-template-columns:repeat(2,1fr) !important}
  .prev-feature-row{grid-template-columns:1fr !important;gap:var(--space-6) !important}
  .prev-feature-row > .prev-feat-mock{order:1 !important}
  .prev-footer-grid{grid-template-columns:1fr 1fr !important;gap:var(--space-7) !important}
  .prev-footer-grid > div:first-child{grid-column:1 / -1}
  .prev-calc-grid{grid-template-columns:1fr !important;row-gap:14px !important}
  .prev-fab{display:none !important}
  .prev-systems-teaser{padding:36px 22px;border-radius:var(--radius-xl)}
  .prev-st-title{font-size:22px;letter-spacing:-.5px}
  .prev-st-sub{font-size:13.5px}
  .prev-st-ico{width:42px;height:42px;font-size:19px}
  .prev-st-stats{gap:var(--space-3)}
  body{padding-bottom:var(--space-11)}
  .prev-feature-row{gap:18px !important}
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

export function Landing(props: Props) {
  const { countrySlug, staticLanding, plans, announcement, whatsappLink, signupHref, initialBilling, ctaLabel } = props;

  const country = countrySlug === "eg" ? "EG" : "SA";
  const currency = country === "EG" ? "ج.م" : "ر.س";

  // ─── Pricing plans (DB) ───
  const visiblePlans = useMemo(
    () => [...plans].filter((p) => p.visible).sort((a, b) => a.displayOrder - b.displayOrder),
    [plans],
  );

  // ─── Trust bar logos (DB hero) ───
  const trustClients = staticLanding.hero?.trustBarClients ?? [];

  // ─── FAQ items (DB) ───
  const faqs = staticLanding.faq?.faqs ?? [];

  // ─── Why Now costs (DB) ───
  const whyNowCosts = staticLanding.whyNow?.costs ?? [];

  // ─── How It Works steps (DB) ───
  const howSteps = staticLanding.howItWorks?.steps ?? [];

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
  const [queryIdx, setQueryIdx] = useState(0);
  const [order, setOrder] = useState<SerpKey[]>(INITIAL_ORDER);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [calcOpen, setCalcOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [fabVisible, setFabVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const viewportH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const nearTop = y < 320;
      const nearBottom = y + viewportH > docH - 600;
      setFabVisible(!nearTop && !nearBottom);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [salaries, setSalaries] = useState<Record<string, number>>(
    () => Object.fromEntries(CALC_ROLES.map((r) => [r.key, r.def])),
  );

  // ─── SERP animation ───
  // StrictMode-safe: side effects (timers) live OUTSIDE setState callbacks,
  // and a ref tracks current order so the tick function reads fresh data
  // without re-subscribing to state.
  const orderRef = useRef<SerpKey[]>(INITIAL_ORDER);
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function tick() {
      if (cancelled) return;
      const current = orderRef.current;
      const youIdx = current.indexOf("you");

      if (youIdx === 0) {
        // hold at top → reset + cycle query
        timer = setTimeout(() => {
          if (cancelled) return;
          orderRef.current = INITIAL_ORDER;
          setOrder(INITIAL_ORDER);
          setQueryIdx((q) => (q + 1) % SERP_QUERIES.length);
          timer = setTimeout(tick, 900);
        }, 2800);
        return;
      }

      const next = current.slice();
      const tmp = next[youIdx - 1];
      next[youIdx - 1] = "you";
      next[youIdx] = tmp;
      orderRef.current = next;
      setOrder(next);

      timer = setTimeout(tick, 820);
    }

    timer = setTimeout(tick, 900);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

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

      {/* ─── LIVE SERP ─── */}
      <section className="max-w-[640px] mx-auto pt-[34px] px-[18px] pb-5">
        <div className="prev-serp-card bg-card border border-border rounded-[20px] shadow-[0_30px_60px_-36px_color-mix(in oklch, var(--foreground) 28%, transparent)] overflow-hidden">
          <div className="flex items-center gap-3 px-[22px] py-[18px] border-b border-b-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            <div className="text-[15px] text-foreground flex-1 font-normal">
              {SERP_QUERIES[queryIdx]}
              <span className="inline-block w-[1.5px] h-4 bg-foreground align-[-3px] mr-0.5 animate-[prev-caret_1s_step-end_infinite]" />
            </div>
            <div data-st className="font-mono text-[11px] text-muted-foreground">بحث جوجل</div>
          </div>
          <div className="relative h-96 px-[14px] py-2.5 bg-card">
            {order.map((key, idx) => {
              const r = SERP_ROWS[key];
              const isYou = "isYou" in r && r.isYou;
              const won = isYou && idx === 0;
              const rising = isYou && idx > 0 && idx < 3;
              const youAboveAd = order.indexOf("you") < order.indexOf("ad");
              const showAd = "ad" in r && r.ad && !youAboveAd;

              const rankClass = cn(
                "w-[30px] h-[30px] rounded-lg flex items-center justify-center font-mono text-[13px] font-semibold shrink-0",
                won ? "bg-success text-success-foreground" : isYou ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
              );

              const titleClass = cn(
                "text-sm",
                isYou ? "font-semibold text-foreground" : idx < 2 ? "font-medium text-muted-foreground" : "font-medium text-muted-foreground",
              );

              const urlColorClass = isYou ? "text-success" : "text-muted-foreground";

              return (
                <div key={key} className={`prev-serp-row${isYou ? " you" : ""}${won ? " won" : ""}`} style={{ top: idx * ROW_H + 6 }}>
                  <div className="flex items-center gap-3 h-full">
                    <div className={cn("prev-serp-rank", rankClass)}>#{toArabicDigits(idx + 1)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="prev-serp-titlebar flex items-center gap-[7px] flex-wrap min-w-0">
                        <span className={cn("prev-serp-title", titleClass)}>{r.title}</span>
                        {showAd && (
                          <span data-st className="text-[10px] font-semibold text-destructive bg-destructive/10 px-1.5 py-px rounded-[5px] font-mono">إعلان</span>
                        )}
                        {isYou && (
                          <span className="prev-serp-you-badge text-[11px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-md">موقعك</span>
                        )}
                      </div>
                      <div data-st className={cn("prev-serp-url font-mono text-[11.5px] mt-[3px] whitespace-nowrap overflow-hidden text-ellipsis", urlColorClass)}>{r.url}</div>
                    </div>
                    {won && (
                      <div data-st className="text-success text-[13px] font-semibold whitespace-nowrap animate-[prev-pop_.4s_ease_both]">المركز الأول ✓</div>
                    )}
                    {rising && (
                      <div data-st className="flex items-center gap-1 text-success text-[12px] font-semibold font-mono animate-[prev-up_1s_ease-in-out_infinite]">▲ يصعد</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div data-st className="text-center text-[13px] text-muted-foreground mt-4">
          من الصفحة الخامسة إلى الصفحة الأولى — هذا اللي نسوّيه لموقعك.
        </div>
      </section>

      {/* ─── TRUST SECTION (DB + curated) ─── moved up: best-practice = logos within first scroll */}
      {trustClients.length > 0 && (
        <m.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-t-[var(--border)] border-b border-b-[var(--border)] bg-card"
        >
          <div className="max-w-[1080px] mx-auto px-7 py-14">
            <div className="text-center mb-8">
              <div data-st className="font-mono text-xs text-muted-foreground tracking-[1.5px]">من ائتمنّا</div>
            </div>
            <div className="prev-trust-logos flex flex-wrap justify-center items-center gap-[14px] max-w-[960px] mx-auto">
              {trustClients.map((client, i) => {
                const hasLogo = !!(client.logoUrl && client.logoUrl.trim());
                const card = (
                  <div
                    className={cn(
                      "prev-trust-pill border border-border rounded-[14px] bg-card transition-all duration-200 inline-flex items-center justify-center min-h-[72px] min-w-[132px] gap-2.5",
                      hasLogo ? "px-6 py-4" : "px-[22px] py-[14px]",
                      client.href ? "cursor-pointer" : "cursor-default",
                    )}
                    title={client.name}
                  >
                    {hasLogo ? (
                      <Image
                        src={client.logoUrl}
                        alt={`شعار ${client.name}`}
                        width={120}
                        height={44}
                        className="h-10 w-auto max-w-[100px] object-contain grayscale opacity-85 transition-[filter,opacity] duration-[.25s]"
                      />
                    ) : (
                      <span className="text-[14.5px] text-foreground font-semibold tracking-[-.2px]">{client.name}</span>
                    )}
                  </div>
                );
                return client.href ? (
                  <a key={i} href={client.href} target="_blank" rel="noopener noreferrer" className="no-underline">
                    {card}
                  </a>
                ) : (
                  <div key={i}>{card}</div>
                );
              })}
            </div>
          </div>
        </m.section>
      )}

      {/* ─── HOW (DB) ─── */}
      {howSteps.length > 0 && (
        <section id="how-it-works" className="max-w-[880px] mx-auto px-7 py-[72px]">
          <div className="prev-how-grid grid text-center" style={{ gridTemplateColumns: `repeat(${Math.min(howSteps.length, 3)}, 1fr)` }}>
            {howSteps.slice(0, 3).map((step, i) => (
              <div key={i} className={cn("prev-how-cell px-[14px] py-0", i < Math.min(howSteps.length, 3) - 1 && "border-r border-r-[var(--border)]")}>
                <div className="font-mono text-[13px] text-muted-foreground mb-3">{step.num || toArabicDigits(`0${i + 1}`)}</div>
                <div className="text-xl font-semibold mb-2">{step.title}</div>
                <div className="text-sm text-muted-foreground leading-[1.6] max-w-[200px] mx-auto">{step.line}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── WHY NOW (DB) ─── */}
      {whyNowCosts.length > 0 && (
        <m.section
          id="outcomes"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-t-[var(--border)] border-b border-b-[var(--border)] bg-card"
        >
          <div className="max-w-[1080px] mx-auto px-7 py-20 text-center">
            <h2 className="prev-h2 text-[38px] font-semibold tracking-[-1px] mb-[14px]">
              {staticLanding.whyNow?.title1 ?? "كل شهر تأخير له ثمن"}
            </h2>
            <p className="text-base text-muted-foreground mb-12 max-w-[520px] mx-auto">
              {staticLanding.whyNow?.subtitle ?? "منافسك بدأ من ٣ شهور. كل يوم تتأخر = خطوة يكسبها هو."}
            </p>
            <div className="prev-why-grid grid gap-7 text-right max-w-[880px] mx-auto" style={{ gridTemplateColumns: `repeat(${Math.min(whyNowCosts.length, 3)}, 1fr)` }}>
              {whyNowCosts.slice(0, 3).map((cost, i) => {
                const isLast = i === Math.min(whyNowCosts.length, 3) - 1;
                return (
                  <div key={i} className={cn("px-[22px] py-0 border-r-2", isLast ? "border-r-[var(--success)]" : "border-r-[var(--border)]")}>
                    <div className={cn("font-mono text-xs tracking-[.5px] mb-3", isLast ? "text-success" : "text-muted-foreground")}>{cost.month}</div>
                    <div className="text-[18px] font-semibold mb-2.5">{cost.label}</div>
                    <div className="text-sm text-muted-foreground leading-[1.7]">{cost.desc}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 font-mono text-xs text-muted-foreground tracking-[1px]">
              الحل ↓
            </div>
          </div>
        </m.section>
      )}

      {/* ─── MATH ─── */}
      <m.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-background"
      >
        <div className="max-w-[880px] mx-auto px-7 py-20 text-center">
          <h2 data-st className="prev-h2 text-[38px] font-semibold tracking-[-1px] mb-[14px]">الرياضيات بسيطة.</h2>
          <p data-st className="text-base text-muted-foreground mb-[14px]">عشان تتصدّر جوجل تحتاج فريق ٦ وظائف. أو اشتراك واحد.</p>
          <div className="inline-block font-mono text-[11px] text-muted-foreground tracking-[.5px] border border-border px-3 py-[5px] rounded-full mb-9">
            المقارنة سنوياً
          </div>
          <div className="flex items-center justify-center gap-7 flex-wrap">
            <div className="text-center">
              <div data-st className="text-[13px] text-muted-foreground mb-2.5">فريق محتوى داخلي كامل</div>
              <div className="prev-math-num font-mono text-[46px] font-medium text-muted-foreground tracking-[-1.5px] line-through decoration-destructive decoration-2">
                {formatNum(mathTeamAnnual)}
              </div>
              <div data-st className="text-xs text-muted-foreground mt-1.5">{currency} / سنوياً</div>
            </div>
            <div data-st className="text-[30px] text-muted-foreground font-light">←</div>
            <div className="text-center">
              <div className="text-[13px] text-success font-medium mb-2.5">مدونتي — {mathPlanName}</div>
              <div className="prev-math-num-big font-mono text-[60px] font-semibold text-foreground tracking-[-2px]">
                {formatNum(mathPlanAnnual)}
              </div>
              <div data-st className="text-xs text-muted-foreground mt-1.5">{currency} / سنوياً</div>
            </div>
          </div>
          {mathSavePct > 0 && (
            <div className="inline-flex items-center gap-2 bg-success/10 text-success text-sm font-semibold px-[18px] py-2.5 rounded-full mt-10">
              توفير يصل إلى {mathSavePct}٪ — ومحتوى يبقى ملكك للأبد
            </div>
          )}
        </div>
      </m.section>

      {/* ─── FEATURES → OUTCOMES (in-code product mockups) ─── */}
      <section id="features" className="border-t border-t-[var(--border)] bg-card">
        <div className="max-w-[1080px] mx-auto px-7 py-[88px]">
          <div className="text-center mb-14">
            <div className="font-mono text-xs text-muted-foreground tracking-[1px] mb-3">إيش بتاخد فعلاً</div>
            <h2 className="prev-h2 text-[38px] font-semibold tracking-[-1px] mb-3">
              مش مجرد مقالات — منظومة كاملة.
            </h2>
            <p className="text-base text-muted-foreground max-w-[560px] mx-auto">
              لوحة واحدة، تتابع منها من اقتراح الفكرة لحد أول مركز في جوجل.
            </p>
          </div>

          <div className="prev-features-grid grid gap-16">
            {/* Row 1 — Editor */}
            <div className="prev-feature-row grid grid-cols-2 gap-12 items-center">
              <div>
                <div className="font-mono text-[11px] text-success tracking-[1px] mb-[14px]">٠١ — الكتابة</div>
                <h3 className="text-[26px] font-semibold mb-[14px] tracking-[-.5px]">مقالات SEO جاهزة — مش قوالب.</h3>
                <p className="text-[15px] text-muted-foreground leading-[1.85]">
                  كاتب متخصص في قطاعك يكتب لك المقال، يبحث الكلمات، يحط الـ headings، ويسلمه جاهز للنشر — بدون ما تكتب حرف.
                </p>
              </div>
              <div className="prev-feat-mock bg-background border border-border rounded-2xl p-[22px] shadow-[0_24px_50px_-32px_color-mix(in oklch, var(--foreground) 18%, transparent)]">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-b-[var(--border)]">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span className="font-mono text-[11px] text-muted-foreground">article-draft.md</span>
                  <span className="ms-auto text-[11px] text-success font-semibold">✓ جاهز</span>
                </div>
                <div className="text-base font-semibold mb-2 text-foreground">أفضل ٧ تقنيات لزراعة الأسنان ٢٠٢٦</div>
                <div className="h-1.5 bg-foreground rounded-full w-full mb-1.5" />
                <div className="h-1.5 bg-border rounded-full w-[92%] mb-1.5" />
                <div className="h-1.5 bg-border rounded-full w-[78%] mb-[14px]" />
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10.5px] font-mono bg-card border border-border px-2 py-[3px] rounded-md text-muted-foreground"># ١٢٠٠ كلمة</span>
                  <span className="text-[10.5px] font-mono bg-card border border-border px-2 py-[3px] rounded-md text-muted-foreground"># ٨ headings</span>
                  <span className="text-[10.5px] font-mono bg-success/10 border border-success/30 px-2 py-[3px] rounded-md text-success"># SEO ٩٢/١٠٠</span>
                </div>
              </div>
            </div>

            {/* Row 2 — Approval (alternate) */}
            <div className="prev-feature-row grid grid-cols-2 gap-12 items-center">
              <div className="prev-feat-mock bg-background border border-border rounded-2xl p-[22px] shadow-[0_24px_50px_-32px_color-mix(in oklch, var(--foreground) 18%, transparent)] order-none">
                <div className="flex items-center gap-2 mb-[18px] pb-3 border-b border-b-[var(--border)]">
                  <span className="font-mono text-[11px] text-muted-foreground">قائمة المراجعة</span>
                  <span className="ms-auto text-[10.5px] font-semibold text-muted-foreground bg-card border border-border px-2 py-[3px] rounded-md">٣ بانتظار اعتمادك</span>
                </div>
                {[
                  { title: "مقدمة الشركة — نسخة محدثة", state: "بانتظار", color: "var(--destructive)", bg: "color-mix(in oklch, var(--destructive) 10%, transparent)" },
                  { title: "أفضل ٧ تقنيات للزراعة", state: "معتمد", color: "var(--success)", bg: "color-mix(in oklch, var(--success) 12%, transparent)" },
                  { title: "صفحة الفروع — Cairo", state: "بانتظار", color: "var(--destructive)", bg: "color-mix(in oklch, var(--destructive) 10%, transparent)" },
                ].map((row, i) => (
                  <div key={i} className={cn("flex items-center gap-2.5 py-3", i < 2 && "border-b border-b-[var(--border)]")}>
                    <span className="w-7 h-7 rounded-md bg-card border border-border inline-flex items-center justify-center text-[11px] text-muted-foreground font-mono">0{i + 1}</span>
                    <span className="text-[13px] text-foreground flex-1 font-medium">{row.title}</span>
                    <span className="text-[10.5px] font-semibold px-2 py-[3px] rounded-md font-mono" style={{ color: row.color, background: row.bg }}>{row.state}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="font-mono text-[11px] text-success tracking-[1px] mb-[14px]">٠٢ — الاعتماد</div>
                <h3 className="text-[26px] font-semibold mb-[14px] tracking-[-.5px]">وافق بنقرة — قبل ما يُنشر.</h3>
                <p className="text-[15px] text-muted-foreground leading-[1.85]">
                  كل مقال يدخل قائمتك للمراجعة. اعتمد، عدّل، أو ارفض. ما يطلع شي للعلن بدون موافقتك.
                </p>
              </div>
            </div>

            {/* Row 3 — Monitor */}
            <div className="prev-feature-row grid grid-cols-2 gap-12 items-center">
              <div>
                <div className="font-mono text-[11px] text-success tracking-[1px] mb-[14px]">٠٣ — المتابعة</div>
                <h3 className="text-[26px] font-semibold mb-[14px] tracking-[-.5px]">شوف ترتيبك يطلع في جوجل.</h3>
                <p className="text-[15px] text-muted-foreground leading-[1.85]">
                  لوحة مباشرة من Google Search Console — كلماتك، ترتيبك، الظهور، النقرات. الأرقام اللي تهمك، بدون تعقيد.
                </p>
              </div>
              <div className="prev-feat-mock bg-background border border-border rounded-2xl p-[22px] shadow-[0_24px_50px_-32px_color-mix(in oklch, var(--foreground) 18%, transparent)]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-[11px] text-muted-foreground">الترتيب — آخر ٣٠ يوم</span>
                  <span className="ms-auto text-xs font-semibold text-success">▲ +١٤ مركز</span>
                </div>
                <svg viewBox="0 0 240 80" className="w-full h-20 block">
                  <defs>
                    <linearGradient id="prev-feat-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--success)" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="var(--success)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,68 L30,60 L60,62 L90,48 L120,46 L150,30 L180,28 L210,16 L240,10 L240,80 L0,80 Z" fill="url(#prev-feat-grad)" />
                  <path d="M0,68 L30,60 L60,62 L90,48 L120,46 L150,30 L180,28 L210,16 L240,10" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {[[30,60],[60,62],[90,48],[120,46],[150,30],[180,28],[210,16],[240,10]].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="2.5" fill="var(--card)" stroke="var(--success)" strokeWidth="1.5" />
                  ))}
                </svg>
                <div className="grid grid-cols-3 gap-2.5 mt-[14px] pt-[14px] border-t border-t-[var(--border)]">
                  {[
                    { k: "الظهور", v: "12.4K" },
                    { k: "النقرات", v: "1,089" },
                    { k: "الترتيب", v: "#3" },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="font-mono text-base font-semibold text-foreground">{s.v}</div>
                      <div className="text-[10.5px] text-muted-foreground mt-0.5">{s.k}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SYSTEMS TEASER → /features ─── */}
      <m.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="px-7 py-[60px]"
      >
        <div className="max-w-[920px] mx-auto">
          <div className="prev-systems-teaser">
            <div className="prev-st-eyebrow">جولة كاملة على المنتج</div>
            <div className="prev-st-icons">
              <span className="prev-st-ico" aria-hidden>📊</span>
              <span className="prev-st-ico" aria-hidden>🌐</span>
              <span className="prev-st-ico" aria-hidden>✍️</span>
              <span className="prev-st-ico" aria-hidden>🛠️</span>
            </div>
            <h2 className="prev-st-title">
              ٤ منظومات متكاملة —<br />
              <span className="accent">في اشتراك واحد</span>
            </h2>
            <p className="prev-st-sub">
              لوحة تحكّمك · صفحتك العامة · مقالاتك · التصاميم والإنتاج. كل واحدة فيها مجموعات من المزايا الجاهزة.
            </p>
            <div className="prev-st-stats">
              <span className="prev-st-stat"><b>٢٣</b> تنبيه فوري</span>
              <span className="prev-st-stat-sep"></span>
              <span className="prev-st-stat"><b>٢٨</b> فحص جودة / مقال</span>
              <span className="prev-st-stat-sep"></span>
              <span className="prev-st-stat"><b>YMYL</b> للقطاعات الحسّاسة</span>
            </div>
            <a href="/features" className="prev-st-cta">
              <span>شوف كل التفاصيل</span>
              <span className="text-[18px] leading-none">←</span>
            </a>
          </div>
        </div>
      </m.section>

      {/* ─── PAYMENT TRUST (banks + methods + honest banner) ─── */}
      <m.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="border-t border-t-[var(--border)] border-b border-b-[var(--border)] bg-card"
      >
        <div className="max-w-[1080px] mx-auto px-7 py-14">
          <div data-st className="flex flex-col items-center gap-8">
              <div className="text-center">
                <div className="font-mono text-[12px] text-success tracking-[2px] mb-2">SECURE PAYMENTS</div>
                <div className="text-[20px] font-semibold text-foreground tracking-[-.3px]">الدفع الآمن عبر</div>
              </div>

              {/* Country-grouped clusters — shadcn Card per region */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Saudi card */}
                <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-[16px] font-semibold text-foreground">السعودية</CardTitle>
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tracking-[1px]">
                        <span className="text-[16px]" aria-hidden>🇸🇦</span>
                        <span>SA</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-5 place-items-center">
                      {[
                        { src: "/logos/snb.svg", alt: "SNB" },
                        { src: "/logos/mada.svg", alt: "mada" },
                        { src: "/logos/sadad.png", alt: "سداد" },
                        { src: "/logos/stcpay.svg", alt: "stc pay" },
                        { src: "/logos/tamara.svg", alt: "tamara" },
                      ].map((logo) => (
                        <div key={logo.alt} className="h-10 w-full flex items-center justify-center">
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={96}
                            height={36}
                            className="max-h-8 max-w-full w-auto h-auto object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Egypt card */}
                <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-[16px] font-semibold text-foreground">مصر</CardTitle>
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tracking-[1px]">
                        <span className="text-[16px]" aria-hidden>🇪🇬</span>
                        <span>EG</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-5 place-items-center">
                      {[
                        { src: "/logos/saib-bank.png", alt: "saib" },
                        { src: "/logos/instapay.svg", alt: "InstaPay" },
                      ].map((logo) => (
                        <div key={logo.alt} className="h-10 w-full flex items-center justify-center">
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={96}
                            height={36}
                            className="max-h-8 max-w-full w-auto h-auto object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Global accepted — Visa / Mastercard */}
              <div className="flex items-center gap-4">
                <div className="text-[13px] text-muted-foreground font-medium">يُقبل أيضًا</div>
                <div className="flex items-center gap-5">
                  {[
                    { src: "/logos/visa.svg", alt: "Visa" },
                    { src: "/logos/mastercard.svg", alt: "Mastercard" },
                  ].map((logo) => (
                    <div key={logo.alt} className="h-7 w-16 flex items-center justify-center">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={64}
                        height={28}
                        className="max-h-7 max-w-full w-auto h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Honest banner */}
              <div data-st className="inline-flex items-center gap-2 bg-success/10 text-success text-[14px] font-medium px-4 py-2.5 rounded-full">
                <span className="font-mono font-semibold">صادقون</span>
                <span className="opacity-55">·</span>
                <span>دي تجارب مبكرة — إحنا بنبني سمعتنا معاك</span>
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

            return (
              <m.div
                key={p.id}
                variants={STAGGER_CHILD}
                className={cn(
                  "rounded-[18px] px-[22px] py-[26px] relative border",
                  featured
                    ? "bg-foreground border-foreground text-background shadow-[0_24px_50px_-22px_color-mix(in oklch, var(--foreground) 50%, transparent)]"
                    : "bg-card border-border text-foreground",
                )}
              >
                {featured && (
                  <span className="absolute -top-[11px] right-[22px] bg-success text-success-foreground text-[10.5px] font-semibold px-2.5 py-1 rounded-full tracking-[.3px]">
                    {p.featuredBadge}
                  </span>
                )}
                <div className={cn("text-sm font-semibold", featured ? "text-background" : "text-foreground")}>{p.name}</div>
                <p className={cn("text-[12.5px] mt-2 mb-5 leading-[1.6] min-h-[50px]", featured ? "text-background/70" : "text-muted-foreground")}>
                  {p.tagline || p.hook || ""}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className={cn("font-mono text-4xl font-semibold tracking-[-1.5px]", featured ? "text-background" : "text-foreground")}>{price}</span>
                  <span className={cn("text-xs", featured ? "text-background/70" : "text-muted-foreground")}>{currency}/شهر</span>
                </div>
                <div className={cn("text-[11.5px] mt-1.5 min-h-4 font-mono", featured ? "text-background/70" : "text-muted-foreground")}>
                  {billing === "annual" && p.priceYearly > 0 ? `سنوياً ${formatNum(annualTotal)}` : " "}
                </div>
                <Link
                  href={`${signupHref}?plan=${p.slug}`}
                  className={cn(
                    "block text-center p-[11px] rounded-[10px] text-[13.5px] no-underline mt-[18px] mb-[22px] border",
                    featured ? "bg-success text-success-foreground font-semibold border-transparent" : "bg-background text-foreground font-medium border-border",
                  )}
                >
                  {p.ctaText || (featured ? `ابدأ بـ${p.name}` : "ابدأ الحين")}
                </Link>
                <div className={cn("border-t mb-[18px]", featured ? "border-t-background/10" : "border-t-[var(--border)]")} />
                {(p.highlights ?? []).slice(0, 5).map((h, i) => (
                  <div key={i} className={cn("flex gap-[9px] mb-[11px] text-[13px] leading-[1.5]", featured ? "text-background/70" : "text-muted-foreground")}>
                    <span className="text-success shrink-0">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
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
            <div className="max-w-[1080px] mx-auto px-7 py-20">
              <div className="text-center mb-12">
                <div className="font-mono text-xs text-muted-foreground tracking-[1px] mb-3">
                  {socialProofEyebrow}
                </div>
                <h2 className="prev-h2 text-[38px] font-semibold tracking-[-1px] mb-3">
                  {socialProofTitle}
                </h2>
                <p className="text-base text-muted-foreground">{socialProofSubtitle}</p>
              </div>

              <div
                className="prev-voices-grid grid gap-8 items-start"
                style={{ gridTemplateColumns: "320px 1fr" }}
              >
                {/* RIGHT (RTL first child): list */}
                <div>
                  <div className="font-mono text-[10.5px] text-muted-foreground tracking-[1px] mb-2.5 ps-1">
                    اضغط لتبديل الشهادة ↓
                  </div>
                <div className="prev-voices-list flex flex-col gap-2.5">
                  {voices.map((voice, i) => {
                    const isActive = i === safeIdx;
                    const voiceInitials = (voice.name ?? "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedVoice(i)}
                        className={`prev-voice-btn${isActive ? " active" : ""}`}
                      >
                        <span className="prev-voice-avatar">
                          {voice.avatarImg ? (
                            <Image
                              src={voice.avatarImg}
                              alt={voice.name ?? ""}
                              width={40}
                              height={40}
                              unoptimized
                            />
                          ) : (
                            <span className="text-sm">{voiceInitials}</span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                            {voice.name}
                          </span>
                          <span className="block text-xs text-muted-foreground mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                            {voice.company || voice.role}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                </div>

                {/* LEFT: media + quote */}
                <div className="bg-card border border-border rounded-[20px] overflow-hidden shadow-[0_24px_50px_-30px_color-mix(in oklch, var(--foreground) 18%, transparent)]">
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
                  <div className="px-7 py-[26px]">
                    {v.quote && (
                      <p className="text-[17px] leading-[1.85] text-foreground font-normal mb-[18px]">
                        «{v.quote}»
                      </p>
                    )}
                    <div className="prev-voice-attr flex items-center gap-3 pt-4 border-t border-t-[var(--border)] flex-wrap">
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
                        <div className="prev-voice-metric ms-auto bg-[color-mix(in oklch, var(--success) 8%, var(--background))] text-success text-xs font-semibold px-3 py-1.5 rounded-full font-mono">
                          {v.metric}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </m.section>
        );
      })()}

      {/* ─── TEAM (DB) ─── */}
      {(coreTeam.length > 0 || executionTeam.length > 0) && (
        <m.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-t-[var(--border)] bg-card"
        >
          <div className="max-w-[1080px] mx-auto px-7 py-20">
            <div className="text-center mb-12">
              <div className="font-mono text-xs text-muted-foreground tracking-[1px] mb-3">
                الفريق
              </div>
              <h2 className="prev-h2 text-[38px] font-semibold tracking-[-1px] mb-3">
                وراء الكلام
              </h2>
              <p className="text-base text-muted-foreground">
                ناس حقيقية تكتب وتنشر وتتابع — مش algorithms.
              </p>
            </div>

            {coreTeam.length > 0 && (
              <div
                className={cn("prev-team-core-grid grid gap-[18px]", executionTeam.length > 0 && "mb-[42px]")}
                style={{ gridTemplateColumns: `repeat(${Math.min(coreTeam.length, 2)}, 1fr)` }}
              >
                {coreTeam.map((m, i) => {
                  const initials = m.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
                  return (
                    <div key={i} className="prev-team-core-card">
                      <div className="prev-team-core-avatar">
                        {m.avatarUrl ? (
                          <Image src={m.avatarUrl} alt={m.name} width={88} height={88} unoptimized />
                        ) : (
                          <span className="text-[26px] font-semibold text-muted-foreground">{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[17px] font-semibold text-foreground mb-1">{m.name}</div>
                        <div className="text-[13.5px] text-muted-foreground">{m.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {executionTeam.length > 0 && (
              <div
                className="prev-team-exec-grid grid gap-[14px]"
                style={{ gridTemplateColumns: `repeat(${Math.min(executionTeam.length, 4)}, 1fr)` }}
              >
                {executionTeam.map((m, i) => {
                  const initials = m.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
                  return (
                    <div key={i} className="prev-team-exec-card">
                      <div className="prev-team-exec-avatar">
                        {m.avatarUrl ? (
                          <Image src={m.avatarUrl} alt={m.name} width={64} height={64} unoptimized />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{m.name}</div>
                        <div className="text-xs text-muted-foreground leading-[1.5]">{m.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </m.section>
      )}

      {/* ─── FAQ (DB) ─── */}
      {faqs.length > 0 && (
        <m.section
          id="faq"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-t-[var(--border)] bg-card"
        >
          <div className="max-w-[720px] mx-auto px-7 py-20">
            <div className="text-center mb-[42px]">
              <div data-st className="font-mono text-xs text-muted-foreground tracking-[1px] mb-3">أسئلة شائعة</div>
              <h2 className="prev-h2 text-[38px] font-semibold tracking-[-1px]">
                {staticLanding.faq?.title ?? "اقتنع قبل ما تبدأ"}
              </h2>
            </div>
            <div>
              {faqs.map((item, i) => (
                <div key={i} className={`prev-faq-item${openFaq === i ? " open" : ""}`}>
                  <button className="prev-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.q}</span>
                    <span className="prev-faq-toggle">{openFaq === i ? "×" : "+"}</span>
                  </button>
                  <div className="prev-faq-a">{item.a}</div>
                </div>
              ))}
            </div>
            <div className="mt-9 text-center text-sm text-muted-foreground">
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
      )}

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

      {/* ─── FAB ─── */}
      <button
        onClick={() => setCalcOpen(true)}
        aria-label="حاسبة التوفير"
        className={cn(
          "prev-fab fixed bottom-6 left-6 z-[60] flex items-center gap-2.5 bg-foreground text-background border-none cursor-pointer px-[18px] py-[14px] rounded-full shadow-[0_16px_36px_-10px_color-mix(in oklch, var(--foreground) 50%, transparent)] text-sm font-medium font-[inherit] transition-[transform,opacity] duration-200 ease-out",
          fabVisible ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-[120%] opacity-0 pointer-events-none",
        )}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
          <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <circle cx="8.5" cy="12" r=".6" fill="currentColor" />
          <circle cx="12" cy="12" r=".6" fill="currentColor" />
          <circle cx="15.5" cy="12" r=".6" fill="currentColor" />
          <circle cx="8.5" cy="16.5" r=".6" fill="currentColor" />
          <circle cx="12" cy="16.5" r=".6" fill="currentColor" />
          <circle cx="15.5" cy="16.5" r=".6" fill="currentColor" />
        </svg>
        احسب توفيرك
      </button>

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
