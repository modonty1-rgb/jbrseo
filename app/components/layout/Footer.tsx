import Link from "next/link";
import Image from "next/image";
import type { LandingContent } from "@/lib/landing-content.types";
import { SocialFacebookOutline } from "@/app/components/icons/facebook";
import { Instagram } from "@/app/components/icons/instagram";
import { Linkedin } from "@/app/components/icons/linkedin";
import { Twitter } from "@/app/components/icons/twitter";
import { Youtube } from "@/app/components/icons/youtube";
import { RoundSnapchat } from "@/app/components/icons/snapchat";
import { TiktokLogoLight } from "@/app/components/icons/tiktok";

const DEFAULT_LOGO = "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg";

export function Footer({ content }: { content: LandingContent }) {
  const { footer, landingImages } = content;
  const logoUrl = landingImages.logoWhite || DEFAULT_LOGO;
  const socialLinks = [
    { href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL, label: "Facebook", Icon: SocialFacebookOutline },
    { href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL, label: "Instagram", Icon: Instagram },
    { href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL, label: "LinkedIn", Icon: Linkedin },
    { href: process.env.NEXT_PUBLIC_SOCIAL_TWITTER_X_URL, label: "X (Twitter)", Icon: Twitter },
    { href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL, label: "YouTube", Icon: Youtube },
    { href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL, label: "TikTok", Icon: TiktokLogoLight },
    { href: process.env.NEXT_PUBLIC_SOCIAL_SNAPCHAT_URL, label: "Snapchat", Icon: RoundSnapchat },
  ].filter((item) => item.href);

  return (
    <footer className="relative overflow-hidden bg-card landing-grain" role="contentinfo">
      {/* Accent gradient separator */}
      <div aria-hidden className="h-px bg-linear-to-r from-transparent via-accent/40 to-transparent" />

      {/* Subtle radial glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 start-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2.5 sm:items-start">
          <Link href="/#hero" aria-label={`${footer.brandName} — الرئيسية`}>
            <Image
              src={logoUrl}
              alt={footer.brandName}
              width={100}
              height={32}
              className="h-8 w-auto transition-opacity hover:opacity-80"
            />
          </Link>
          <p className="text-xs text-muted-foreground/70">{footer.copyright}</p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:items-end">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:justify-end">
            <Link href="/#pricing" className="transition-colors duration-200 hover:text-foreground">
              الأسعار
            </Link>
            <Link href="/#social-proof" className="transition-colors duration-200 hover:text-foreground">
              الشهادات
            </Link>
            <Link href="/#faq" className="transition-colors duration-200 hover:text-foreground">
              الأسئلة
            </Link>
          </nav>
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 text-muted-foreground sm:justify-end">
              {socialLinks.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href as string}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/30 text-xs transition-all duration-200 hover:scale-110 hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-md hover:shadow-accent/10"
                >
                  <Icon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
