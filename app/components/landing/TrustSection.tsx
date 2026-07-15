"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronDown, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ModontyTrustBundle } from "@/app/actions/modonty-client-logos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

const ALL_KEY = "__all__";
// Teaser count — the first N logos render on load; the rest reveal on click.
// Keeps the section short (Khalid's ask 2026-07-10). Same on desktop + mobile:
// desktop 5–6 cols → 4 fills the first row cleanly; mobile 2 cols → 4 = 2 rows.
const INITIAL_VISIBLE = 4;

type Props = {
  bundle: ModontyTrustBundle;
  ctaLabel: string;
};

export function TrustSection({ bundle, ctaLabel }: Props): ReactElement {
  const [activeKey, setActiveKey] = useState<string>(ALL_KEY);
  const [expanded, setExpanded] = useState(false);

  // Collapse back to the teaser view every time the visitor switches tabs.
  useEffect(() => {
    setExpanded(false);
  }, [activeKey]);

  const filteredLogos = useMemo(() => {
    if (activeKey === ALL_KEY) return bundle.logos;
    return bundle.logos.filter((l) => l.industryKey === activeKey);
  }, [activeKey, bundle.logos]);

  // Teaser order (collapsed "all" view) — Khalid's curation 2026-07-15:
  // Smile Town leads (echoes the case study right above); personal-photo
  // entries defer to the expanded grid where big tiles suit portraits.
  const teaserLogos = useMemo(() => {
    const score = (l: ModontyTrustBundle["logos"][number]) => {
      if (l.name.includes("سمايل تاون")) return 0;      // pinned first
      if (l.name.includes("محمد يسري")) return 2;       // portrait → expanded only
      if (l.name.includes("شيخ العرب")) return 2;       // portrait → expanded only
      return 1;
    };
    return [...bundle.logos].sort((a, b) => score(a) - score(b));
  }, [bundle.logos]);

  const visibleLogos = expanded
    ? filteredLogos
    : (activeKey === ALL_KEY ? teaserLogos : filteredLogos).slice(0, INITIAL_VISIBLE);
  const hiddenCount = Math.max(0, filteredLogos.length - INITIAL_VISIBLE);
  const canExpand = hiddenCount > 0;

  const tabs = useMemo(
    () => [{ key: ALL_KEY, label: "الكل", count: bundle.total }, ...bundle.industries],
    [bundle.industries, bundle.total],
  );

  return (
    <LazyMotion features={domAnimation}>
      <section
        className="relative border-y border-border/60 bg-card"
        aria-labelledby="trust-section-title"
      >
        <div className="relative max-w-[1080px] mx-auto px-7 py-8 md:py-14">
          {/* HEADER — clean, no live-badge overline, no misleading stat chips */}
          <div className="text-center mb-5 md:mb-12">
            <h2
              id="trust-section-title"
              className="text-balance text-[clamp(20px,5.8vw,36px)] md:text-4xl font-black text-foreground leading-tight tracking-tight mb-2 md:mb-3"
            >
              شركاء نبني حضورهم في البحث والذكاء الاصطناعي
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {bundle.total} علامة تجارية اختارتنا لبناء حضورها
            </p>
          </div>

          {/* FILTER — dropdown on mobile (only AFTER expanding the teaser —
              collapsed state is a passive glance, no controls), tabs on md+ */}
          <div className="mb-5 md:mb-10">
            <div className={expanded ? "block md:hidden" : "hidden"}>
              <MobileIndustryDropdown
                tabs={tabs}
                activeKey={activeKey}
                onChange={setActiveKey}
              />
            </div>

            {/* ── Desktop: horizontal tabs with animated pill background ── */}
            <div className="hidden md:flex justify-center">
              <div
                role="tablist"
                aria-label="فلترة حسب القطاع"
                className="inline-flex bg-muted/60 backdrop-blur-sm rounded-full p-1 gap-1 border border-border/70 shadow-sm"
              >
                {tabs.map((t) => {
                  const active = activeKey === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveKey(t.key)}
                      className={cn(
                        "relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap",
                        "transition-colors duration-200",
                        active ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground",
                      )}
                    >
                      {active && (
                        <m.span
                          layoutId="trust-tab-bg"
                          className="absolute inset-0 rounded-full bg-primary shadow-md"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        <span>{t.label}</span>
                        <span
                          className={cn(
                            "inline-flex items-center justify-center min-w-5 h-4 px-1 rounded-full text-[10px] font-bold",
                            active ? "bg-primary-foreground/25 text-primary-foreground" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {t.count}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* GRID — collapsed mobile = one compact glance-row of 4 (no captions);
              expanded mobile / desktop = the full 2-col grid with captions. */}
          <AnimatePresence mode="wait">
            <m.div
              key={activeKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-7",
                expanded ? "grid-cols-2" : "grid-cols-4 gap-x-2 gap-y-2",
              )}
            >
              {visibleLogos.map((logo, i) => (
                <LogoTile
                  key={logo.slug}
                  logo={logo}
                  index={i}
                  compact={!expanded}
                  className={!expanded && i === 3 ? "hidden md:flex" : undefined}
                />
              ))}
              {/* Mobile collapsed: 4th tile IS the expand button (+N) — saves
                  the separate button row below (WhatsApp-group-avatars pattern). */}
              {!expanded && canExpand && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  aria-expanded={false}
                  aria-label={`عرض كل العملاء — ${hiddenCount + 1} إضافي`}
                  className="md:hidden relative aspect-square w-full rounded-xl border border-border/40 bg-card flex flex-col items-center justify-center gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span className="font-mono text-[19px] font-bold text-foreground leading-none">+{hiddenCount + 1}</span>
                  <span className="text-[9.5px] text-muted-foreground font-medium">عميل</span>
                  <ChevronDown className="w-3.5 h-3.5 text-success animate-bounce" strokeWidth={2.5} aria-hidden />
                </button>
              )}
            </m.div>
          </AnimatePresence>

          {filteredLogos.length === 0 && (
            <div className="text-center text-muted-foreground py-14 text-sm">
              لا يوجد عملاء في هذا القطاع حالياً.
            </div>
          )}

          {/* REVEAL BUTTON — appears whenever the current tab has more clients than the teaser */}
          {canExpand && (
            <div className={cn("mt-5 md:mt-10 justify-center", expanded ? "flex" : "hidden md:flex")}>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 backdrop-blur-sm px-5 md:px-6 py-2.5 text-[13px] md:text-sm font-semibold text-foreground/85 hover:text-primary hover:border-primary/40 hover:bg-card hover:shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span>
                  {expanded ? "عرض أقل" : `شوف كل عملائنا (+${hiddenCount})`}
                </span>
                <svg
                  className={`w-4 h-4 opacity-70 transition-transform duration-300 group-hover:opacity-100 ${expanded ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* CTA — single primary action matching the hero CTA. 2026 best
              practice: place social proof next to the decision moment; repeat
              the exact hero phrasing so it feels frictionless when repeated. */}
          <div className="mt-7 md:mt-16 flex justify-center">
            <a
              href="#pricing"
              className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300 motion-reduce:transform-none motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span>{ctaLabel}</span>
              <ArrowLeft
                className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
                strokeWidth={2.5}
                aria-hidden
              />
            </a>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

// ─────────────────────────────────────────────────────────────────

function MobileIndustryDropdown({
  tabs,
  activeKey,
  onChange,
}: {
  tabs: Array<{ key: string; label: string; count: number }>;
  activeKey: string;
  onChange: (key: string) => void;
}): ReactElement {
  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0];
  return (
    <div className="md:hidden flex justify-center">
      <Select value={activeKey} onValueChange={onChange} dir="rtl">
        <SelectTrigger
          aria-label="فلترة حسب القطاع"
          className="!h-auto w-auto min-w-[220px] max-w-[85vw] gap-2 rounded-full border-primary/20 bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md focus:ring-2 focus:ring-primary/40 [&>svg]:opacity-90"
        >
          <SelectValue>
            <span className="inline-flex items-center gap-2">
              <span>{active.label}</span>
              <span className="inline-flex items-center justify-center min-w-5 h-4 px-1 rounded-full bg-primary-foreground/25 text-primary-foreground text-[10px] font-bold">
                {active.count}
              </span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-border/60 shadow-xl">
          {tabs.map((t) => (
            <SelectItem
              key={t.key}
              value={t.key}
              className="rounded-lg py-2.5 text-sm cursor-pointer data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[state=checked]:font-semibold"
            >
              <span className="inline-flex items-center gap-2">
                <span>{t.label}</span>
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-5 h-4 px-1 rounded-full text-[10px] font-bold",
                    activeKey === t.key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {t.count}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────

function LogoTile({ logo, index, compact = false, className }: { logo: ModontyTrustBundle["logos"][number]; index: number; compact?: boolean; className?: string }): ReactElement {
  return (
    <m.a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.022, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      title={logo.name}
      aria-label={`زيارة صفحة ${logo.name} على مدونتي`}
      className={cn("group flex flex-col items-center gap-2.5 md:gap-3 no-underline focus:outline-none", className)}
    >
      {/* CARD — thin frame; the visual weight lives in the inner chip below */}
      <div
        className={cn(
          "relative aspect-square w-full rounded-xl",
          "border border-border/40 bg-card overflow-hidden",
          "transition-[transform,border-color,box-shadow] duration-300 ease-out",
          "group-hover:-translate-y-1 group-focus:-translate-y-1",
          "group-hover:border-primary/40 group-focus:border-primary/40",
          "group-hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)] group-focus:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)]",
          "motion-reduce:transform-none motion-reduce:transition-none",
        )}
      >
        {/* Featured badge — gold gradient chip with a filled Lucide star.
            The white ring separates it from the card so it reads at a glance
            on any logo, in any theme (Vercel/GitHub-style "verified" pattern). */}
        {logo.isFeatured && (
          <div
            className={cn(
              "absolute top-1.5 end-1.5 z-20 w-6 h-6 md:w-[26px] md:h-[26px] rounded-full bg-linear-to-br from-amber-300 via-amber-400 to-amber-500 items-center justify-center shadow-[0_3px_10px_-2px_rgba(217,119,6,0.55)] ring-2 ring-white transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none motion-reduce:transition-none",
              compact ? "hidden md:flex" : "flex",
            )}
            aria-label="عميل مميّز"
            title="عميل مميّز"
          >
            <Star
              className="w-3 h-3 md:w-[13px] md:h-[13px] fill-white text-white"
              strokeWidth={0}
              aria-hidden
            />
          </div>
        )}

        {/* INNER CHIP — identical footprint for both real logos and initials,
            so a logo-less client no longer visually dominates its neighbours.
            Compact glance-row: logo fills the tile (minimal padding). */}
        {/* Compact: logo fills the whole tile with the SAME radius as the card. */}
        <div className={cn("absolute overflow-hidden", compact ? "inset-0 rounded-xl md:inset-2.5 md:rounded-lg" : "inset-2 md:inset-2.5 rounded-lg")}>
          {logo.logoUrl ? (
            <div className={cn(
              "w-full h-full flex items-center justify-center bg-white transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none",
              compact ? "p-1 md:p-3.5" : "p-3 md:p-3.5",
            )}>
              <Image
                src={logo.logoUrl}
                alt={logo.altText}
                width={200}
                height={200}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div
              aria-label={logo.altText}
              className="w-full h-full flex items-center justify-center font-black text-2xl md:text-3xl tracking-tight transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
              style={{
                background: `linear-gradient(135deg, hsl(${logo.initialsHue} 65% 92%) 0%, hsl(${logo.initialsHue} 60% 82%) 100%)`,
                color: `hsl(${logo.initialsHue} 55% 32%)`,
              }}
            >
              {logo.initials}
            </div>
          )}
        </div>
      </div>

      {/* CAPTION — hidden in the compact mobile glance-row; visible otherwise */}
      <div className={cn("w-full px-1 text-center", compact && "hidden md:block")}>
        <div className="text-[11.5px] md:text-[12.5px] leading-tight font-semibold text-foreground/90 group-hover:text-foreground transition-colors line-clamp-2">
          {logo.name}
        </div>
        {logo.industryLabel && (
          <div className="text-[10px] md:text-[10.5px] text-muted-foreground/80 mt-0.5 truncate">
            {logo.industryLabel}
          </div>
        )}
      </div>
    </m.a>
  );
}

