"use client";

import Link from "next/link";
import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent } from "@/lib/landing-content.types";
import { HeaderLogo } from "./HeaderLogo";
import HeaderActionsClient from "./HeaderActionsClient";

function DesktopNav({ navLinks }: { navLinks: StaticLanding["header"]["navLinks"] }) {
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

function HeaderActions({ staticLanding }: { staticLanding: StaticLanding }) {
  const { header, hero } = staticLanding;
  return (
    <HeaderActionsClient
      navLinks={header.navLinks}
      ctaLabel={header.ctaLabel}
      pricingHref={hero.ctaLink}
      seatsTotal={header.seats.total}
      seatsTaken={header.seats.taken}
      announcementPrefix={header.announcementPrefix}
      announcementSuffix={header.announcementSuffix}
    />
  );
}

export function LandingHeader({ content, staticLanding }: { content: LandingContent; staticLanding: StaticLanding }) {
  const { header, hero } = staticLanding;
  const remaining = header.seats.total - header.seats.taken;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div
        className="flex items-center justify-center gap-2.5 px-4 py-2 text-center text-[11.5px] font-bold"
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
        {header.announcementPrefix}
        <span
          className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-black"
          style={{ background: "oklch(0.65 0.18 142)", color: "#fff", minWidth: 22 }}
        >
          {remaining}
        </span>
        {header.announcementSuffix} {header.seats.total}
        <span className="mx-1 opacity-40">·</span>
        <Link
          href={hero.ctaLink}
          className="underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity"
        >
          {header.bookCta}
        </Link>
      </div>

      {/* ── MAIN NAV ── */}
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between px-5 py-3 sm:px-8 lg:px-10">

        {/* LOGO */}
        <HeaderLogo landingImages={content.landingImages} />

        {/* DESKTOP NAV */}
        <DesktopNav navLinks={header.navLinks} />

        {/* RIGHT ACTIONS (client) */}
        <HeaderActions staticLanding={staticLanding} />
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

