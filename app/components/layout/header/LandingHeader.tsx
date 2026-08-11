import NextLink from "next/link";
import { Sparkles } from "lucide-react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent, SupportedCountry } from "@/lib/landing-content.types";
import { getNavLinks, getWhatsAppLink } from "@/lib/site-links";
import { HeaderLogo } from "@/app/components/layout/HeaderLogo";
import { ThemeToggle } from "@/app/components/layout/header/ThemeToggle";
import { MobileMenu } from "@/app/components/layout/header/MobileMenu";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";

type NavLinkItem = { href: string; label: string };

// This nav is `hidden lg:flex`, so every `sm:` and `w-full` variant here described a state
// it can never be in — the styles below are the only ones that ever applied.
const LANDING_NAV_LINK_CLASS =
  "relative inline-flex items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white after:absolute after:bottom-1 after:start-3 after:end-3 after:h-[2px] after:rounded-full after:bg-accent after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100";

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

/**
 * The number as a human reads it, derived from the same link the button opens.
 *
 * This used to be two functions that each re-parsed the raw prop and each fell back to a
 * literal `966500000000` when it was empty — a number that looks real, formats as
 * `+966 50 000 0000`, and opens a WhatsApp chat with nobody. `(site)/layout.tsx` never
 * passed the prop, so every page under it printed exactly that.
 *
 * Now `getWhatsAppLink` resolves it once — database number first, then the country
 * default — and the label is read back off the resolved link, so the text and the href
 * cannot disagree. It also respects `country`, which the old header ignored: an Egyptian
 * reader was shown the Saudi fallback in the header and the Egyptian number in the footer.
 */
function formatPhone(waLink: string): string | null {
  const digits = waLink.replace(/\D/g, "");
  if (!digits) return null;
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
  // Falls back to the settings row when the caller does not pass the prop — `(site)`
  // layout did not, which is how the placeholder number reached six live pages.
  const waLink = getWhatsAppLink(country, whatsappNumber ?? content.siteSettings?.whatsappNumber);
  const phoneDisplay = formatPhone(waLink);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-900 text-white">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex items-center justify-between gap-2 px-4 py-2 sm:px-8 lg:px-10">
          {/* Mobile: hamburger button (RTL start = physical right) → opens drawer
              Desktop: unchanged nav flow */}
          <div className="flex items-center gap-2 lg:hidden">
            <MobileMenu
              navLinks={navLinks}
              whatsappHref={waLink}
              phoneDisplay={phoneDisplay ?? ""}
            />
          </div>

          {/* Logo — pinned to the far side opposite the hamburger on mobile
              (ms-auto), start-anchor on desktop */}
          <div className="ms-auto lg:ms-0">
            <HeaderLogo logoHref={logoHref} />
          </div>

          <DesktopNav navLinks={navLinks} />

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop-only WhatsApp phone chip — mobile has it inside the drawer. Hidden
                outright when no number resolves: an empty chip is better than a made-up one. */}
            {phoneDisplay && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-white/70 transition-colors hover:border-success/70 hover:text-white lg:flex"
                dir="ltr"
                aria-label="تواصل عبر واتساب"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 text-success" />
                {phoneDisplay}
              </a>
            )}
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
