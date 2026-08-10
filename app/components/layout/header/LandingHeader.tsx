import NextLink from "next/link";
import { Sparkles } from "lucide-react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent, SupportedCountry } from "@/lib/landing-content.types";
import { getNavLinks } from "@/lib/site-links";
import { HeaderLogo } from "@/app/components/layout/HeaderLogo";
import { ThemeToggle } from "@/app/components/layout/header/ThemeToggle";
import { MobileMenu } from "@/app/components/layout/header/MobileMenu";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";

type NavLinkItem = { href: string; label: string };

const LANDING_NAV_LINK_CLASS =
  "relative inline-flex min-h-11 w-full items-center justify-center rounded-lg px-1 py-2 text-center text-[11.5px] font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white sm:min-h-0 sm:px-3 sm:text-sm lg:inline-flex lg:w-auto after:absolute after:bottom-1 after:start-2 after:end-2 after:h-[2px] after:rounded-full after:bg-accent after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 sm:after:start-3 sm:after:end-3";

function DesktopNav({ navLinks }: { navLinks: NavLinkItem[] }) {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="القائمة الرئيسية">
      {navLinks.map(({ href, label }) => (
        <NextLink key={href} href={href} prefetch={false} className={LANDING_NAV_LINK_CLASS}>
          {label}
        </NextLink>
      ))}
    </nav>
  );
}

const DEFAULT_CTA = DEFAULT_CTA_LABEL;

type LandingHeaderProps = {
  content: LandingContent;
  staticLanding: StaticLanding;
  country: SupportedCountry;
  basePath?: string;
  pricingHref?: string;
  navPrimaryCtaLabel?: string;
  navLinks?: NavLinkItem[];
  whatsappNumber?: string | null;
};

function buildWaLink(raw?: string | null): string {
  const digits = (raw || "966500000000").replace(/\D/g, "");
  return `https://wa.me/${digits || "966500000000"}`;
}

function formatPhone(raw?: string | null): string {
  const digits = (raw || "966500000000").replace(/\D/g, "");
  if (digits.startsWith("966") && digits.length === 12)
    return `+966 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  if (digits.startsWith("20") && digits.length === 12)
    return `+20 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  return `+${digits}`;
}

export function LandingHeader({
  content,
  staticLanding,
  country,
  basePath = "",
  // Follows basePath like every other link here. The fixed "/#pricing" default meant the
  // header's own CTA button — the loudest one on the page — kept pointing at "/", which
  // redirects to the country landing and drops the fragment on the way.
  pricingHref = basePath ? `${basePath}#pricing` : "/#pricing",
  navPrimaryCtaLabel,
  navLinks: navLinksProp,
  whatsappNumber,
}: LandingHeaderProps) {
  const { header } = staticLanding;
  const navLinks = navLinksProp ?? getNavLinks(country, basePath);
  const ctaLabel = content.siteSettings.ctaLabel || DEFAULT_CTA;
  const primaryCtaLabel = navPrimaryCtaLabel ?? ctaLabel;
  const logoHref = basePath ? `${basePath}#hero` : "/#hero";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-900 text-white">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex items-center justify-between gap-2 px-4 py-2 sm:px-8 lg:px-10">
          {/* Mobile: hamburger button (RTL start = physical right) → opens drawer
              Desktop: unchanged nav flow */}
          <div className="flex items-center gap-2 lg:hidden">
            <MobileMenu
              navLinks={navLinks}
              whatsappHref={buildWaLink(whatsappNumber)}
              phoneDisplay={formatPhone(whatsappNumber)}
            />
          </div>

          {/* Logo — pinned to the far side opposite the hamburger on mobile
              (ms-auto), start-anchor on desktop */}
          <div className="ms-auto lg:ms-0">
            <HeaderLogo logoHref={logoHref} />
          </div>

          <DesktopNav navLinks={navLinks} />

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop-only WhatsApp phone chip — mobile has it inside the drawer */}
            <a
              href={buildWaLink(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-white/70 transition-colors hover:border-success/70 hover:text-white lg:flex"
              dir="ltr"
              aria-label="تواصل عبر واتساب"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-success" />
              {formatPhone(whatsappNumber)}
            </a>
            {/* Theme toggle — desktop-only; mobile lives inside the drawer */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            {/* Hidden ≤880px — the sticky footer bar carries this CTA there.
                Uses the same 880px breakpoint (not lg) so 880–1024px still shows
                it, since the footer bar only appears at ≤880px. */}
            <a
              href={pricingHref}
              className="group hidden min-[881px]:inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-center text-[13px] font-black leading-tight text-accent-foreground shadow-[0_4px_16px_color-mix(in_oklch,var(--accent)_40%,transparent)] transition-all duration-200 hover:bg-accent/90 hover:scale-[1.03] sm:min-h-12 sm:px-5 sm:text-sm no-underline"
            >
              <Sparkles
                className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                strokeWidth={2.5}
                aria-hidden
              />
              {primaryCtaLabel}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
