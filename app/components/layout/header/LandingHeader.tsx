import Link from "@/app/components/link";
import NextLink from "next/link";
import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent, SupportedCountry } from "@/lib/landing-content.types";
import { getNavLinks } from "@/lib/site-links";
import { HeaderLogo } from "@/app/components/layout/HeaderLogo";
import { ThemeToggle } from "@/app/components/layout/header/ThemeToggle";
import { HeaderMobileMenuLazy } from "@/app/components/layout/header/HeaderMobileMenuLazy";

type NavLinkItem = { href: string; label: string };

function DesktopNav({ navLinks }: { navLinks: NavLinkItem[] }) {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="القائمة الرئيسية">
      {navLinks.map(({ href, label }) => (
        <NextLink
          key={href}
          href={href}
          className="
            relative rounded-lg px-3 py-2
            text-[13.5px] font-semibold text-white/90
            transition-colors duration-200
            hover:bg-white/10 hover:text-white
            after:absolute after:bottom-1 after:start-3 after:end-3
            after:h-[2px] after:rounded-full after:bg-accent
            after:scale-x-0 after:transition-transform after:duration-200
            hover:after:scale-x-100
          "
        >
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
  navLinks?: NavLinkItem[];
};

export function LandingHeader({
  content,
  staticLanding,
  country,
  basePath = "",
  pricingHref = "/signup",
  navLinks: navLinksProp,
}: LandingHeaderProps) {
  const { header } = staticLanding;
  const navLinks = navLinksProp ?? getNavLinks(country, basePath);
  const ctaLabel = content.siteSettings.ctaLabel || DEFAULT_CTA;
  type HeaderWithBookCta = StaticLanding["header"] & { bookCta?: string };
  const bookCta = (header as HeaderWithBookCta).bookCta || ctaLabel;
  const headerBannerText = (header.bannerText ?? "").trim();
  const showBanner = headerBannerText.length > 0;
  const logoHref = basePath ? `${basePath}#hero` : "/#hero";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl max-md:backdrop-blur-sm"
      style={{ background: "oklch(0.12 0.14 275)" }}
    >
      {showBanner && (
        <div
          className="
            flex flex-wrap items-center justify-center gap-1.5
            px-3 py-2 text-center text-[11px] font-bold
            sm:px-4 sm:py-2.5 sm:text-[11.5px]
          "
          style={{
            background: "linear-gradient(to right, oklch(0.28 0.18 275), oklch(0.22 0.16 275))",
            color:        "#fff",
            letterSpacing: ".01em",
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "oklch(0.65 0.18 142)", animation: "pulse-hdr 1.8s ease infinite" }}
            aria-hidden
          />
          <span>{headerBannerText}</span>
          <span className="hidden sm:inline mx-1 opacity-40">·</span>
          <Link
            href={pricingHref}
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
      )}

      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
        <HeaderLogo logoHref={logoHref} />
        <DesktopNav navLinks={navLinks} />
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href={pricingHref}
            className="max-lg:hidden inline-flex items-center justify-center rounded-full px-5 py-2 font-black shadow-[0_4px_16px_oklch(0.14_0.13_275/20%)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_6px_24px_oklch(0.14_0.13_275/30%)]"
          >
            {ctaLabel}
          </Link>
          <div className="lg:hidden">
            <HeaderMobileMenuLazy
              navLinks={navLinks}
              ctaLabel={ctaLabel}
              pricingHref={pricingHref}
              bannerText={header.bannerText ?? ""}
            />
          </div>
        </div>
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

