import Link from "@/app/components/link";
import NextLink from "next/link";
import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent, SupportedCountry } from "@/lib/landing-content.types";
import { getNavLinks } from "@/lib/site-links";
import { HeaderLogo } from "@/app/components/layout/HeaderLogo";
import { ThemeToggle } from "@/app/components/layout/header/ThemeToggle";

type NavLinkItem = { href: string; label: string };

const LANDING_NAV_LINK_CLASS =
  "relative inline-flex min-h-11 w-full items-center justify-center rounded-lg px-2 py-2 text-center text-xs font-semibold text-foreground transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground sm:min-h-0 sm:px-3 sm:text-sm lg:inline-flex lg:w-auto after:absolute after:bottom-1 after:start-2 after:end-2 after:h-[2px] after:rounded-full after:bg-accent after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 sm:after:start-3 sm:after:end-3";

function DesktopNav({ navLinks }: { navLinks: NavLinkItem[] }) {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="القائمة الرئيسية">
      {navLinks.map(({ href, label }) => (
        <NextLink key={href} href={href} className={LANDING_NAV_LINK_CLASS}>
          {label}
        </NextLink>
      ))}
    </nav>
  );
}

function MobileNavRow({ navLinks }: { navLinks: NavLinkItem[] }) {
  return (
    <nav
      className="grid w-full grid-cols-3 gap-1 border-t border-border/80 px-3 pb-3 pt-2 lg:hidden"
      aria-label="القائمة الرئيسية"
    >
      {navLinks.map(({ href, label }) => (
        <NextLink key={href} href={href} className={LANDING_NAV_LINK_CLASS}>
          {label}
        </NextLink>
      ))}
    </nav>
  );
}

const DEFAULT_CTA = "ابدأ مجاناً — بدون بطاقة";

type LandingHeaderProps = {
  content: LandingContent;
  staticLanding: StaticLanding;
  country: SupportedCountry;
  basePath?: string;
  pricingHref?: string;
  navPrimaryCtaLabel?: string;
  navLinks?: NavLinkItem[];
};

export function LandingHeader({
  content,
  staticLanding,
  country,
  basePath = "",
  pricingHref = "/signup",
  navPrimaryCtaLabel,
  navLinks: navLinksProp,
}: LandingHeaderProps) {
  const { header } = staticLanding;
  const navLinks = navLinksProp ?? getNavLinks(country, basePath);
  const ctaLabel = content.siteSettings.ctaLabel || DEFAULT_CTA;
  const derivedPrimaryCtaLabel =
    pricingHref.includes("#pricing") || pricingHref.endsWith("/pricing")
      ? "شوف الأسعار"
      : ctaLabel;
  const primaryCtaLabel = navPrimaryCtaLabel ?? derivedPrimaryCtaLabel;
  type HeaderWithBookCta = StaticLanding["header"] & { bookCta?: string };
  const bookCta = (header as HeaderWithBookCta).bookCta || primaryCtaLabel;
  const headerBannerText = (header.bannerText ?? "").trim();
  const showBanner = headerBannerText.length > 0;
  const logoHref = basePath ? `${basePath}#hero` : "/#hero";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      {showBanner && (
        <div
          className="
            flex flex-wrap items-center justify-center gap-1.5
            px-3 py-2 text-center text-sm font-bold
            sm:px-4 sm:py-2.5
          "
          style={{
            background: "var(--accent)",
            color: "#fff",
            letterSpacing: ".01em",
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-white/60"
            style={{ animation: "pulse-hdr 1.8s ease infinite" }}
            aria-hidden
          />
          <span>{headerBannerText}</span>
          <span className="mx-1 hidden opacity-40 sm:inline">·</span>
          <Link
            href={pricingHref}
            className="
              inline-flex items-center gap-1 rounded-full
              border border-white/40 bg-white/15
              px-2.5 py-0.5 text-sm font-black
              transition-colors hover:bg-white/25
            "
          >
            <span>{bookCta}</span>
          </Link>
        </div>
      )}

      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-8 lg:px-10">
          <HeaderLogo logoHref={logoHref} />
          <DesktopNav navLinks={navLinks} />
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />
            <Link
              href={pricingHref}
              className="inline-flex max-w-[min(100%,11rem)] items-center justify-center truncate rounded-full bg-accent px-3 py-1.5 text-center text-[11px] font-black leading-tight text-accent-foreground shadow-[0_4px_16px_color-mix(in_oklch,var(--accent)_40%,transparent)] transition-all duration-200 hover:bg-accent/90 hover:scale-[1.03] sm:max-w-none sm:px-5 sm:py-2 sm:text-sm"
            >
              {primaryCtaLabel}
            </Link>
          </div>
        </div>
        <MobileNavRow navLinks={navLinks} />
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
