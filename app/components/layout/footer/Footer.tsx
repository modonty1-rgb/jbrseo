import Link from "@/app/components/link";
import type { LandingContent } from "@/lib/landing-content.types";
import type { StaticLanding } from "@/app/content/landing/types";
import { SocialFacebookOutline } from "@/app/components/icons/facebook";
import { Instagram } from "@/app/components/icons/instagram";
import { Linkedin } from "@/app/components/icons/linkedin";
import { Twitter } from "@/app/components/icons/twitter";
import { Youtube } from "@/app/components/icons/youtube";
import { RoundSnapchat } from "@/app/components/icons/snapchat";
import { TiktokLogoLight } from "@/app/components/icons/tiktok";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { getFooterLinks, getWhatsAppLink, LEGAL_LINKS } from "@/lib/site-links";
import { WhatsAppTrackLink } from "@/app/components/shared/WhatsAppTrackLink";
import Image from "next/image";
import { HeaderLogo } from "@/app/components/layout/HeaderLogo";
import { MODONTY_LOGO_URL } from "@/lib/constants";
import { COMPANY } from "@/lib/company";

const COPYRIGHT = "© جميع الحقوق محفوظة — JBRSEO";
const WA_LABEL = "تواصل على واتساب";
// MODONTY_LOGO_URL is imported below from `@/lib/constants` — was shadowed by a local
// constant here that hard-coded `w_144,c_fit`, capping the served image at 144px wide
// and forcing a square-collapse inside any rectangular container. Single source of truth.

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type FooterProps = {
  content: LandingContent;
  staticLanding: StaticLanding;
  country: SupportedCountry;
  basePath?: string;
};

/**
 * Column headings. Was `text-[10px] font-black uppercasest` — `uppercasest` is not a class
 * and never was, so it compiled to nothing; the correctly spelled `uppercase` would have
 * done nothing either, because Arabic has no letter case. 10px at font-black is also below
 * the size where a heavy Arabic weight stays legible — the dots and the joins fill in. 11px
 * at bold reads as a heading without shouting.
 */
const HEADING_CLS = "mb-4 text-[11px] font-bold text-white/55";

export function Footer({ content, staticLanding, country, basePath }: FooterProps) {
  const footer = staticLanding.footer;
  const footerLinks = getFooterLinks(country, basePath);
  const waLink = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);
  const homeHref = basePath ? `${basePath}#hero` : "/#hero";

  const social = content.siteSettings?.socialLinks ?? {};
  const socialLinks = [
    { href: social.facebook, label: "Facebook", Icon: SocialFacebookOutline },
    { href: social.instagram, label: "Instagram", Icon: Instagram },
    { href: social.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: social.twitterX, label: "X (Twitter)", Icon: Twitter },
    { href: social.youtube, label: "YouTube", Icon: Youtube },
    { href: social.tiktok, label: "TikTok", Icon: TiktokLogoLight },
    { href: social.snapchat, label: "Snapchat", Icon: RoundSnapchat },
  ].filter((item) => item.href);

  return (
    /* No inline `fontFamily`. Tajawal already arrives from <body> via next/font, which
       serves it under a hashed family name; naming the string "Tajawal" here asked the
       browser for a face by a name next/font never registers, so it fell through to
       sans-serif until the system happened to have Tajawal installed.

       The dark slab is deliberate and not theme-driven: `bg-neutral-900` with white-alpha
       text holds in both themes, and the footer reads as the page's floor rather than as a
       fourth light band after three. That is why the tokens are bypassed here — it is the
       one surface on the site that does not follow the theme. */
    <footer
      role="contentinfo"
      className="relative overflow-hidden border-t border-white/10 bg-neutral-900 text-white"
    >
      {/* Subtle dot pattern — evenly spaced tiny dots at 5% opacity for a gentle premium texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0",
        }}
      />
      {/* Soft ambient glow at top — hairline of the brand accent, fades quickly. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/40 to-transparent"
      />
      {/* Gentle bottom fade — smoothes the footer's lower edge without a hard shape. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/40"
      />
      <div className="relative z-10 mx-auto max-w-[1100px] px-5 pt-14 pb-24 sm:px-8 lg:px-10">

        {/* ── TOP GRID: 4 cols on lg (Brand · Explore · Contact · Follow) ── */}
        <div className="grid grid-cols-1 gap-10 pb-10 border-b border-white/10 sm:grid-cols-2 lg:grid-cols-4">

          {/* COL 1 — BRAND */}
          <div>
            <div className="mb-4">
              <HeaderLogo logoHref={homeHref} />
            </div>
            <div className="mb-3 flex items-start gap-1.5">
              <span
                aria-hidden
                className="mt-1.5 inline-block h-[1.5px] w-4 shrink-0 rounded-full bg-success"
              />
              {/* `font-boldr` — a typo that silently compiled to nothing, so the tagline has
                  been rendering at normal weight since it was written. */}
              <p className="text-balance text-sm font-bold text-success">
                {footer.tagline}
              </p>
            </div>
            <p className="max-w-[260px] text-sm leading-[1.75] text-white/75">
              {footer.desc}
            </p>
          </div>

          {/* COL 2 — EXPLORE */}
          <div>
            {/* IBM Plex Mono ships no Arabic glyphs. Every heading here asked for it and got
                a mid-string fallback instead: the browser substitutes a different face for
                the Arabic, which drops the letter-joining that makes Arabic readable. The
                mono face is right for the email address below and wrong for every word. */}
            <p className={HEADING_CLS}>استكشف</p>
            <ul className="flex flex-col">
              {footerLinks.map((l, i) => (
                <li key={i}>
                  <Link
                    href={l.href}
                    className="group flex min-h-11 items-center gap-1.5 py-1 text-sm font-semibold text-white/70 transition-colors duration-200 hover:text-white before:content-[''] before:inline-block before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-transparent before:transition-colors group-hover:before:bg-success"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — CONTACT */}
          <div>
            <p className={HEADING_CLS}>تواصل</p>
            <div className="flex flex-col gap-3 items-start">
              <WhatsAppTrackLink
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-success bg-success px-4 text-sm font-bold text-success-foreground transition-all duration-200 hover:bg-success/90"
              >
                <WhatsAppIcon />
                {WA_LABEL}
              </WhatsAppTrackLink>
              {/* The one place the mono face belongs: an address the reader may have to copy
                  character by character, where a fixed pitch makes rn / m and l / 1 distinct.
                  `dir="ltr"` as an attribute rather than an inline style — an email address
                  does not mirror, and the attribute is what assistive tech reads. */}
              <a
                href="mailto:support@jbrseo.com"
                dir="ltr"
                className="font-mono inline-flex min-h-11 items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                support@jbrseo.com
              </a>
            </div>
          </div>

          {/* COL 4 — FOLLOW + POWERED BY */}
          <div>
            {socialLinks.length > 0 && (
              <>
                <p className={HEADING_CLS}>تابعنا</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {socialLinks.map(({ href, label, Icon }) => (
                    <Link
                      key={label}
                      href={href as string}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </>
            )}
            {/* Powered by Modonty — compact, tasteful */}
            <div className={socialLinks.length > 0 ? "pt-5 border-t border-white/10" : ""}>
              <Link
                href="https://modonty.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="خدمة مقدّمة من منصة مدونتي"
                className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <span className="text-[12px] text-white/70">مدعوم بمنصة</span>
                <Image
                  src={MODONTY_LOGO_URL}
                  alt="شعار مدونتي"
                  width={140}
                  height={44}
                  unoptimized
                  className="object-contain"
                  style={{ height: 44, width: 140 }}
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ── TRUST STRIP (SA only): CR + gov logos, centered ── */}
        {country === "SA" && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 py-6 border-b border-white/10">
            <Image
              src="/logos/mc-saudi.svg"
              alt="وزارة التجارة — المملكة العربية السعودية"
              width={70}
              height={24}
              className="opacity-90"
              style={{ height: 24, width: "auto", objectFit: "contain" }}
              unoptimized
            />
            <span className="h-3 w-px bg-white/20" aria-hidden />
            <Image
              src="/logos/business-sa.svg"
              alt="المركز السعودي للتنافسية والأعمال"
              width={124}
              height={24}
              className="opacity-90"
              style={{ height: 24, width: "auto", objectFit: "contain" }}
              unoptimized
            />
            <span className="h-3 w-px bg-white/20" aria-hidden />
            {/* Read from COMPANY, not typed here. This footer printed ٧٠٤٠٦٠٢٠٩١ while
                lib/company.ts and the CR certificate itself both say 7036024383 — two
                different registration numbers under the same label, on the page that is
                supposed to prove who we are. Latin digits like the identity card in
                SaudiIdentity: this is a figure people paste into the ministry's portal. */}
            <p className="text-xs text-white/70">
              سجل تجاري <span dir="ltr" className="tabular-nums">{COMPANY.unifiedNumber}</span>
            </p>
          </div>
        )}

        {/* ── BOTTOM ROW: copyright + legal only ── */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-sm text-white/70">{COPYRIGHT}</p>
          <nav className="flex flex-wrap justify-center gap-x-5">
            {LEGAL_LINKS.map((l, i) => (
              <Link
                key={i}
                href={l.href}
                className="inline-flex min-h-11 items-center text-sm text-white/70 transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
