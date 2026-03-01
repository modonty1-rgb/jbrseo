"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { useThemeOptional } from "@/app/helpers/useTheme";
import type { LandingContent } from "@/lib/landing-content.types";
import { PRICING_CTA_LINK } from "@/lib/constants";

const DEFAULT_LOGO = "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg";

const NAV_LINKS = [
  { href: "/#why-now", label: "لماذا الآن" },
  { href: "/#how-it-works", label: "كيف نعمل" },
  { href: "/#outcomes", label: "النتائج" },
  { href: "/#social-proof", label: "الشهادات" },
  { href: "/#pricing", label: "الأسعار" },
  { href: "/#faq", label: "الأسئلة" },
];

export function LandingHeader({ content }: { content: LandingContent }) {
  const [open, setOpen] = useState(false);
  const ctx = useThemeOptional();
  const theme = ctx?.theme ?? "light";
  const logoUrl =
    theme === "dark"
      ? (content.landingImages.logoWhite || DEFAULT_LOGO)
      : (content.landingImages.logoLight || content.landingImages.logoWhite || DEFAULT_LOGO);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-xl shadow-sm shadow-primary/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/#hero"
          className="flex shrink-0 items-center gap-2"
          aria-label="مدونتي — الرئيسية"
        >
          <Image
            src={logoUrl}
            alt="مدونتي"
            width={110}
            height={34}
            className="h-8 w-auto md:h-9"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground sm:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative transition-colors duration-200 hover:text-foreground after:absolute after:bottom-0 after:start-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            asChild
            size="default"
            className="hidden rounded-full px-5 shadow-md shadow-primary/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg sm:inline-flex"
          >
            <Link href={PRICING_CTA_LINK}>{content.landing.hero.cta}</Link>
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-foreground transition-colors hover:bg-muted sm:hidden"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={
          "overflow-hidden border-t border-border/30 transition-all duration-300 ease-out sm:hidden " +
          (open ? "max-h-96 opacity-100" : "max-h-0 opacity-0")
        }
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          <div className="mt-2 border-t border-border/30 pt-3">
            <Button
              asChild
              className="w-full rounded-lg shadow-md shadow-primary/10"
            >
              <Link href={PRICING_CTA_LINK} onClick={() => setOpen(false)}>
                {content.landing.hero.cta}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
