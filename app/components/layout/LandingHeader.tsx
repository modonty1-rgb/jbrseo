"use client";

import Link from "next/link";
import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent, SupportedCountry } from "@/lib/landing-content.types";
import { getNavLinks } from "@/lib/site-links";
import { HeaderLogo } from "./HeaderLogo";
import HeaderActionsClient from "./HeaderActionsClient";

type NavLinkItem = { href: string; label: string };

function DesktopNav({ navLinks }: { navLinks: NavLinkItem[] }) {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="القائمة الرئيسية">
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="
            relative rounded-lg px-3 py-2
            text-[13.5px] font-semibold text-muted-foreground
            transition-colors duration-200
            hover:bg-muted/60 hover:text-foreground
            after:absolute after:bottom-1 after:start-3 after:end-3
            after:h-[2px] after:rounded-full after:bg-accent
            after:scale-x-0 after:transition-transform after:duration-200
            hover:after:scale-x-100
          "
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function HeaderActions({ staticLanding, navLinks, ctaLabel }: { staticLanding: StaticLanding; navLinks: NavLinkItem[]; ctaLabel: string }) {
  const { header } = staticLanding;
  return (
    <HeaderActionsClient
      navLinks={navLinks}
      ctaLabel={ctaLabel}
      pricingHref="/signup"
      seatsTotal={header.seats.total}
      seatsTaken={header.seats.taken}
      announcementPrefix={header.announcementPrefix}
      announcementSuffix={header.announcementSuffix}
    />
  );
}

const DEFAULT_CTA = "ابدأ مجاناً — بدون بطاقة";

export function LandingHeader({ content, staticLanding, country }: { content: LandingContent; staticLanding: StaticLanding; country: SupportedCountry }) {
  const { header } = staticLanding;
  const navLinks = getNavLinks(country);
  const ctaLabel = content.siteSettings.ctaLabel || DEFAULT_CTA;
  type HeaderWithBookCta = StaticLanding["header"] & { bookCta?: string };
  const bookCta = (header as HeaderWithBookCta).bookCta || ctaLabel;
  const remaining = header.seats.total - header.seats.taken;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div
        className="
          flex flex-wrap items-center justify-center gap-1.5
          px-3 py-2 text-center text-[11px] font-bold
          sm:px-4 sm:py-2.5 sm:text-[11.5px]
        "
        style={{
          background:   "linear-gradient(to left, oklch(0.14 0.13 275), oklch(0.32 0.16 275))",
          color:        "#fff",
          letterSpacing: ".01em",
        }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "oklch(0.65 0.18 142)", animation: "pulse-hdr 1.8s ease infinite" }}
          aria-hidden
        />
        <span>{header.announcementPrefix}</span>
        <span
          className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10.5px] font-black sm:text-[11px]"
          style={{ background: "oklch(0.65 0.18 142)", color: "#fff", minWidth: 22 }}
        >
          {remaining}
        </span>
        <span className="hidden sm:inline">
          {header.announcementSuffix} {header.seats.total}
        </span>
        <span className="hidden sm:inline mx-1 opacity-40">·</span>
        <Link
          href="/signup"
          className="
            inline-flex items-center gap-1 rounded-full
            border border-white/30 bg-white/10
            px-2.5 py-0.5 text-[10.5px] font-black
            shadow-sm transition-colors
            hover:bg-white/20
          "
        >
          <span>{bookCta}</span>
        </Link>
      </div>

      {/* ── MAIN NAV ── */}
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between px-5 py-3 sm:px-8 lg:px-10">

        {/* LOGO */}
        <HeaderLogo landingImages={content.landingImages} />

        {/* DESKTOP NAV */}
        <DesktopNav navLinks={navLinks} />

        {/* RIGHT ACTIONS (client) */}
        <HeaderActions staticLanding={staticLanding} navLinks={navLinks} ctaLabel={ctaLabel} />
      </div>

      <style>{`
        @keyframes pulse-hdr {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .5; transform: scale(1.5); }
        }
      `}</style>
    </header>
  );
}

