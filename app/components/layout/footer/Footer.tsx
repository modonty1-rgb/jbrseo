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
import { HeaderLogo } from "@/app/components/layout/HeaderLogo";

const BRAND_NAME = "JBRSEO";
const COPYRIGHT = "© جميع الحقوق محفوظة — JBRSEO";
const WA_LABEL = "تواصل على واتساب";

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#25d366" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type FooterProps = {
  content: LandingContent;
  staticLanding: StaticLanding;
  country: SupportedCountry;
  basePath?: string;
};

export function Footer({ content, staticLanding, country, basePath }: FooterProps) {
  const footer = staticLanding.footer;
  const footerLinks = getFooterLinks(country, basePath);
  const waLink = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);
  const homeHref = basePath ? `${basePath}#hero` : "/#hero";

  const socialLinks = [
    { href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL,  label: "Facebook",    Icon: SocialFacebookOutline },
    { href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL, label: "Instagram",   Icon: Instagram             },
    { href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL,  label: "LinkedIn",    Icon: Linkedin              },
    { href: process.env.NEXT_PUBLIC_SOCIAL_TWITTER_X_URL, label: "X (Twitter)", Icon: Twitter               },
    { href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL,   label: "YouTube",     Icon: Youtube               },
    { href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL,    label: "TikTok",      Icon: TiktokLogoLight       },
    { href: process.env.NEXT_PUBLIC_SOCIAL_SNAPCHAT_URL,  label: "Snapchat",    Icon: RoundSnapchat         },
  ].filter((item) => item.href);

  const headerBg = "oklch(0.12 0.14 275)";
  return (
    <footer
      role="contentinfo"
      className="relative overflow-hidden border-t border-white/10 text-white"
      style={{ fontFamily: "'Tajawal', sans-serif", background: headerBg }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[.06]"
        style={{
          backgroundImage:
            "linear-gradient(to left, transparent, color-mix(in oklab, white 15%, transparent), transparent), linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "100% 1px, 48px 48px, 48px 48px",
          backgroundRepeat: "no-repeat, repeat, repeat",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/2 h-[200px] w-[600px] -translate-x-1/2 rounded-full bg-white/5 blur-[80px]"
      />
      <div className="relative z-10 mx-auto max-w-[1100px] px-5 pt-14 pb-10 sm:px-8 lg:px-10">

        {/* ── TOP GRID ── */}
        <div className="grid grid-cols-1 gap-8 pb-10 border-b border-border sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">

          {/* BRAND COL */}
          <div>
            <div className="mb-1">
              <HeaderLogo logoHref={homeHref} />
            </div>

            <p className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-emerald-400 before:content-[''] before:inline-block before:h-[1.5px] before:w-4 before:shrink-0 before:rounded-full before:bg-emerald-400">
              {footer.tagline}
            </p>

            <p className="mb-5 max-w-[240px] text-[13px] leading-[1.75] text-white/75">
              {footer.desc}
            </p>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold text-white bg-white/10 border border-white/20 transition-all duration-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-400"
            >
              <WhatsAppIcon />
              {WA_LABEL}
            </a>
          </div>

          {/* NAV COL */}
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-white/60">
              روابط سريعة
            </p>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((l, i) => (
                <li key={i}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-1.5 text-[13.5px] font-semibold text-white/75 transition-colors duration-200 hover:text-white before:content-[''] before:inline-block before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-transparent before:transition-colors group-hover:before:bg-emerald-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIALS COL */}
          {socialLinks.length > 0 && (
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-white/60">
                تابعنا
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ href, label, Icon }) => (
                  <Link
                    key={label}
                    href={href as string}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-white/20 bg-white/5 text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 hover:border-white/30 hover:text-white"
                  >
                    <Icon className="h-[15px] w-[15px]" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
          <p className="text-[12px] text-white/65">
            {COPYRIGHT}
          </p>
          <nav className="flex gap-5">
            {LEGAL_LINKS.map((l, i) => (
              <Link
                key={i}
                href={l.href}
                className="text-[12px] text-white/65 transition-colors duration-200 hover:text-white"
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

