"use client";

import { useState, useEffect } from "react";
import Link from "@/app/components/link";
import { Button } from "@/app/components/ui/button";
import { ThemeToggle } from "@/app/components/layout/ThemeToggle";

type NavLink = { href: string; label: string };

type HeaderActionsClientProps = {
  navLinks: NavLink[];
  ctaLabel: string;
  pricingHref: string;
  seatsTotal: number;
  seatsTaken: number;
  announcementPrefix: string;
  announcementSuffix: string;
};

export default function HeaderActionsClient({
  navLinks,
  ctaLabel,
  pricingHref,
  seatsTotal,
  seatsTaken,
  announcementPrefix,
  announcementSuffix,
}: HeaderActionsClientProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const remaining = seatsTotal - seatsTaken;

  return (
    <>
      <div className="flex items-center gap-2.5">
        <ThemeToggle />

        <Button
          asChild
          size="default"
          className="hidden rounded-full px-5 font-black shadow-[0_4px_16px_oklch(0.14_0.13_275/20%)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_6px_24px_oklch(0.14_0.13_275/30%)] lg:inline-flex"
        >
          <Link href={pricingHref}>{ctaLabel}</Link>
        </Button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="
            inline-flex h-9 w-9 items-center justify-center
            rounded-lg border border-border/60 bg-card/60
            text-foreground transition-colors hover:bg-muted
            lg:hidden
          "
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

      <div
        className="w-full overflow-hidden border-t border-border/30 transition-all duration-300 ease-out lg:hidden"
        style={{ maxHeight: open ? 480 : 0, opacity: open ? 1 : 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex flex-col gap-1 px-4 py-3" aria-label="القائمة المحمولة">
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

          <div className="mt-2 border-t border-border/30 pt-3 space-y-2">
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
              {announcementPrefix} {remaining} {announcementSuffix} {seatsTotal}
            </div>

            <Button asChild className="w-full rounded-xl font-black shadow-md shadow-primary/10">
              <Link href={pricingHref} onClick={() => setOpen(false)}>
                {ctaLabel}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}

