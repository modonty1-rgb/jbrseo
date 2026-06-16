"use client";

import { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import type { LandingContent, SupportedCountry } from "@/lib/landing-content.types";
import { getNavLinks } from "@/lib/site-links";
import { SITE_LOGO_URL } from "@/lib/constants";
import { ThemeToggle } from "@/app/components/layout/header/ThemeToggle";

type Props = {
  country: SupportedCountry;
  content: LandingContent;
  basePath: string;
  pricingHref: string;
};

function buildWaLink(raw?: string | null): string {
  const digits = (raw || "966500000000").replace(/\D/g, "");
  return `https://wa.me/${digits || "966500000000"}`;
}

function formatPhone(raw?: string | null): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("966") && digits.length === 12)
    return `+966 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  if (digits.startsWith("20") && digits.length === 12)
    return `+20 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  return digits ? `+${digits}` : "";
}

export function Navbar({ country, content, basePath, pricingHref }: Props) {
  const navLinks = getNavLinks(country, basePath);
  const whatsappNumber = content.siteSettings?.whatsappNumber ?? "";
  const phone = formatPhone(whatsappNumber);
  const waLink = buildWaLink(whatsappNumber);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-card text-card-foreground border-b border-border">
      <div className="max-w-[1080px] mx-auto px-4 md:px-7 py-[14px] flex items-center justify-between gap-3 md:gap-[14px]">
        {/* Right (RTL start): Hamburger (mobile) + Logo + nav (desktop) */}
        <div className="preview-nav-brand flex items-center gap-3 md:gap-7 min-w-0 flex-1">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            className="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] -ms-2 rounded-lg hover:bg-muted transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          <NextLink
            href={basePath}
            aria-label="الرئيسية"
            className="inline-flex items-center no-underline shrink-0"
          >
            <Image
              className="preview-nav-logo h-[28px] md:h-[34px] w-auto object-contain"
              src={SITE_LOGO_URL}
              alt="شعار JBRSEO — منصة مدونتي"
              width={120}
              height={36}
              priority
            />
          </NextLink>

          {/* Nav links — desktop only */}
          <nav
            className="preview-nav-links hidden md:flex items-center gap-1 min-w-0 overflow-x-auto"
            aria-label="القائمة الرئيسية"
          >
            {navLinks.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                className="preview-nav-link text-sm font-medium text-card-foreground/75 no-underline py-[6px] px-[10px] rounded-lg transition-[color,background] duration-150"
              >
                {link.label}
              </NextLink>
            ))}
          </nav>
        </div>

        {/* Left (RTL end): WA + CTA */}
        <div className="preview-nav-actions flex items-center gap-2 md:gap-[10px]">
          {phone && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="preview-nav-wa hidden sm:inline-flex"
              aria-label={`تواصل عبر واتساب — ${phone}`}
            >
              <span className="preview-nav-wa-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <span className="preview-nav-wa-phone">{phone}</span>
            </a>
          )}

          {/* WhatsApp icon-only — mobile (when full pill is hidden) */}
          {phone && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`تواصل عبر واتساب — ${phone}`}
              className="sm:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full bg-[#25D366] text-white"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}

          <div className="preview-nav-theme [&_button]:!h-9 [&_button]:!w-9 [&_button]:!border-border [&_button]:!bg-muted [&_button]:!text-card-foreground hover:[&_button]:!bg-muted/70">
            <ThemeToggle />
          </div>

          <NextLink
            href={pricingHref}
            className="bg-card-foreground text-card py-[10px] px-3 md:px-[18px] rounded-[var(--radius-md)] text-[13px] md:text-sm font-semibold no-underline whitespace-nowrap min-h-[44px] inline-flex items-center hover:bg-card-foreground/90"
          >
            ابدأ الحين
          </NextLink>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        id="mobile-nav-menu"
        className={`md:hidden overflow-hidden border-t border-border bg-card transition-[max-height,opacity] duration-300 ease-out ${
          menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav
          className="px-4 py-3 flex flex-col gap-1"
          aria-label="القائمة الرئيسية (الجوال)"
        >
          {navLinks.map((link) => (
            <NextLink
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-[15px] font-medium text-card-foreground no-underline py-3 px-3 rounded-lg hover:bg-muted min-h-[44px] inline-flex items-center"
            >
              {link.label}
            </NextLink>
          ))}
        </nav>
      </div>

      <style>{`
        .preview-nav-link { white-space: nowrap; }
        .preview-nav-links a:hover { color: var(--card-foreground); background: var(--muted); }
        .preview-nav-links { scrollbar-width: none; }
        .preview-nav-links::-webkit-scrollbar { display: none; }
        .preview-nav-wa {
          align-items: center;
          gap: 8px;
          padding: 7px 10px 7px 12px;
          border-radius: 99px;
          border: 1px solid color-mix(in oklch, var(--success) 35%, transparent);
          background: color-mix(in oklch, var(--success) 12%, transparent);
          color: var(--success);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          font-weight: 500;
          text-decoration: none;
          direction: ltr;
          transition: all .15s ease;
        }
        .preview-nav-wa:hover {
          background: var(--success);
          border-color: var(--success);
          color: var(--success-foreground);
          box-shadow: 0 10px 24px -12px color-mix(in oklch, var(--success) 60%, transparent);
          transform: translateY(-1px);
        }
        .preview-nav-wa-icon {
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 99px;
          background: var(--success);
          color: var(--success-foreground);
          flex-shrink: 0;
          transition: all .15s ease;
        }
        .preview-nav-wa:hover .preview-nav-wa-icon {
          background: var(--success-foreground);
          color: var(--success);
        }
      `}</style>
    </header>
  );
}
