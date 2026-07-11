import Link from "@/app/components/link";
import NextLink from "next/link";
import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent, SupportedCountry } from "@/lib/landing-content.types";
import { getNavLinks } from "@/lib/site-links";
import { HeaderLogo } from "@/app/components/layout/HeaderLogo";
import { ThemeToggle } from "@/app/components/layout/header/ThemeToggle";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";

type NavLinkItem = { href: string; label: string };

const LANDING_NAV_LINK_CLASS =
  "relative inline-flex min-h-11 w-full items-center justify-center rounded-lg px-1 py-2 text-center text-[10px] font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white sm:min-h-0 sm:px-3 sm:text-sm lg:inline-flex lg:w-auto after:absolute after:bottom-1 after:start-2 after:end-2 after:h-[2px] after:rounded-full after:bg-accent after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 sm:after:start-3 sm:after:end-3";

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
      className="grid w-full grid-cols-5 gap-1 border-t border-white/10 px-3 pb-3 pt-2 lg:hidden"
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
  pricingHref = "/signup",
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
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2  sm:px-8 lg:px-10">
          <HeaderLogo logoHref={logoHref} />
          <DesktopNav navLinks={navLinks} />
          <div className="flex items-center gap-2 sm:gap-2.5">
            <a
              href={buildWaLink(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-white/70 transition-colors hover:border-success/70 hover:text-white lg:flex"
              dir="ltr"
              aria-label="تواصل عبر واتساب"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-success" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {formatPhone(whatsappNumber)}
            </a>
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
    </header>
  );
}
