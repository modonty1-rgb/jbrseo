"use client";

import { useState } from "react";
import Link from "@/app/components/link";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";

type NavLink = { href: string; label: string };

type HeaderMobileMenuProps = {
  navLinks: NavLink[];
  ctaLabel: string;
  pricingHref: string;
  bannerText: string;
};

export function HeaderMobileMenu({
  navLinks,
  ctaLabel,
  pricingHref,
  bannerText,
}: HeaderMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const showBanner = (bannerText ?? "").trim().length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-foreground transition-colors hover:bg-muted"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="4" y1="8" x2="20" y2="8" />
            <line x1="4" y1="16" x2="20" y2="16" />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-3/4 flex-col border-border/30 px-0 pt-6 sm:max-w-sm"
        showCloseButton={true}
      >
        <SheetHeader className="px-6 pb-4 text-right">
          <SheetTitle className="sr-only">القائمة المحمولة</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1 px-4" aria-label="القائمة المحمولة">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2.5 text-[14px] font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border/30 px-4 pt-4 space-y-2">
          {showBanner && (
            <div
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold"
              style={{
                background: "oklch(0.14 0.13 275 / 6%)",
                border: "1px solid oklch(0.14 0.13 275 / 15%)",
                color: "oklch(0.14 0.13 275)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "oklch(0.65 0.18 142)", animation: "pulse-hdr 1.8s ease infinite" }}
                aria-hidden
              />
              {(bannerText ?? "").trim()}
            </div>
          )}
          <Button asChild className="w-full rounded-xl font-black shadow-md shadow-primary/10">
            <Link href={pricingHref} onClick={() => setOpen(false)}>
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

