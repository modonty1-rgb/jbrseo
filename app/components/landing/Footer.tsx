"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { SITE_LOGO_URL } from "@/lib/constants";
import type { SupportedCountry } from "@/lib/landing-content.types";

const ICON_SIZE = 16;

const XIcon = ({ size = ICON_SIZE }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.65l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.25 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const TikTokIcon = ({ size = ICON_SIZE }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.83Z" />
  </svg>
);

type Props = {
  country: SupportedCountry;
  basePath: string;
  whatsappNumber?: string | null;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitterX?: string;
    youtube?: string;
    tiktok?: string;
  };
  footerTagline?: string;
  footerDesc?: string;
};

const HEADING_CLS =
  "text-[11px] text-background/55 tracking-[1.5px] mb-4 font-semibold";
const HEADING_STYLE: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace",
};

const LINK_CLS =
  "text-sm text-background/70 hover:text-background no-underline inline-flex items-center min-h-[44px] py-[10px] transition-colors duration-150";

const LINK_DARK_HOVER_CLS =
  "text-sm text-background/70 hover:text-background no-underline inline-flex items-center min-h-[44px] py-[10px] transition-colors duration-150";

const SOCIAL_CLS =
  "w-11 h-11 sm:w-[var(--tap)] sm:h-[var(--tap)] rounded-[var(--radius-md)] bg-background/5 border border-background/10 inline-flex items-center justify-center text-background/70 hover:text-background hover:bg-background/10 hover:border-background/40 transition-all duration-150";

function formatPhone(raw?: string | null): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("966") && digits.length === 12)
    return `+966 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  if (digits.startsWith("20") && digits.length === 12)
    return `+20 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  return digits ? `+${digits}` : "";
}

export function Footer({
  country,
  basePath,
  whatsappNumber,
  socialLinks,
  footerTagline,
  footerDesc,
}: Props) {
  const phone = formatPhone(whatsappNumber);
  const otherCountrySlug = country === "SA" ? "eg" : "sa";
  const otherCountryLabel = country === "SA" ? "🇪🇬 مصر" : "🇸🇦 السعودية";
  const year = "2026";

  const productLinks = [
    { label: "الخطوات", href: `${basePath}#how-it-works` },
    { label: "إيش تاخد فعلاً", href: `${basePath}#features` },
    { label: "الأسعار", href: `${basePath}#pricing` },
    { label: "الشهادات", href: `${basePath}#social-proof` },
    { label: "الأسئلة", href: `${basePath}#faq` },
  ];

  const waUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
    : "";
  const companyLinks = [
    { label: "من نحن", href: "/about", external: false },
    { label: "الفريق", href: "/team", external: false },
    ...(waUrl ? [{ label: "اتصل بنا", href: waUrl, external: true }] : []),
  ];

  const legalLinks = [
    { label: "سياسة الخصوصية", href: "/privacy" },
    { label: "شروط الاستخدام", href: "/terms" },
  ];

  const socials: { key: string; label: string; href?: string; icon: ReactNode }[] = [
    { key: "linkedin", label: "LinkedIn", href: socialLinks?.linkedin, icon: <Linkedin size={ICON_SIZE} strokeWidth={1.8} /> },
    { key: "twitterX", label: "X (Twitter)", href: socialLinks?.twitterX, icon: <XIcon /> },
    { key: "instagram", label: "Instagram", href: socialLinks?.instagram, icon: <Instagram size={ICON_SIZE} strokeWidth={1.8} /> },
    { key: "facebook", label: "Facebook", href: socialLinks?.facebook, icon: <Facebook size={ICON_SIZE} strokeWidth={1.8} /> },
    { key: "youtube", label: "YouTube", href: socialLinks?.youtube, icon: <Youtube size={ICON_SIZE} strokeWidth={1.8} /> },
    { key: "tiktok", label: "TikTok", href: socialLinks?.tiktok, icon: <TikTokIcon /> },
  ].filter((s) => !!s.href);

  return (
    <footer className="bg-foreground text-background/70">
      <div className="max-w-[1080px] mx-auto pt-12 sm:pt-[72px] px-5 sm:px-7 pb-7">
        <div className="prev-footer-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-x-6 gap-y-8 md:gap-[var(--space-9)] mb-10 md:mb-14">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <NextLink
              href={basePath}
              aria-label="الرئيسية"
              className="inline-flex items-center mb-[18px] no-underline"
            >
              <Image
                src={SITE_LOGO_URL}
                alt="شعار JBRSEO — منصة مدونتي"
                width={120}
                height={36}
                className="h-[34px] w-auto object-contain brightness-0 invert dark:invert-0"
              />
            </NextLink>
            {footerTagline && (
              <div className="text-[15px] font-semibold text-background mb-[10px]">
                {footerTagline}
              </div>
            )}
            {footerDesc && (
              <p className="text-[13px] text-background/70 leading-[1.8] max-w-[320px]">
                {footerDesc}
              </p>
            )}
          </div>

          {/* Product column */}
          <div>
            <div className={HEADING_CLS} style={HEADING_STYLE}>المنتج</div>
            <ul className="list-none p-0 m-0">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={LINK_CLS}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <div className={HEADING_CLS} style={HEADING_STYLE}>الشركة</div>
            <ul className="list-none p-0 m-0">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLS}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <NextLink href={l.href} className={LINK_CLS}>
                      {l.label}
                    </NextLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <div className={HEADING_CLS} style={HEADING_STYLE}>تواصل</div>
            <ul className="list-none p-0 m-0">
              {phone && whatsappNumber && (
                <li>
                  <a
                    href={`https://wa.me/${(whatsappNumber || "").replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${LINK_DARK_HOVER_CLS} inline-flex items-center min-h-[var(--tap)] py-[11px]`}
                    style={{ fontFamily: "'IBM Plex Mono',monospace", direction: "ltr" }}
                  >
                    {phone}
                  </a>
                </li>
              )}
              <li>
                <NextLink
                  href={`/${otherCountrySlug}`}
                  prefetch={false}
                  className={`${LINK_DARK_HOVER_CLS} !text-[13px]`}
                >
                  انتقل إلى {otherCountryLabel}
                </NextLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar: social + copyright + legal */}
        <div className="prev-footer-bottom flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[18px] pt-6 border-t border-t-background/10">
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className={SOCIAL_CLS}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}

          <div className="sm:ms-auto flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[13px] text-background/70">
            {legalLinks.map((l) => (
              <NextLink
                key={l.label}
                href={l.href}
                className="text-background/70 hover:text-background no-underline transition-colors duration-150"
              >
                {l.label}
              </NextLink>
            ))}
            <span className="text-xs" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>
              © {year} JBRSEO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
