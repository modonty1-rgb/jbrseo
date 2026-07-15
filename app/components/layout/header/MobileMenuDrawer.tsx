"use client";

import NextLink from "next/link";
import Image from "next/image";
import {
  Phone,
  TrendingUp,
  MessageSquareQuote,
  Sparkles,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
  SheetFooter,
} from "@/app/components/ui/sheet";
import { ThemeToggle } from "@/app/components/layout/header/ThemeToggle";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";
import { SITE_LOGO_URL } from "@/lib/constants";

export type MobileMenuNavLink = { href: string; label: string };

export type MobileMenuDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navLinks: MobileMenuNavLink[];
  whatsappHref: string;
  phoneDisplay: string;
};

// Href → icon map. Icons are chosen for semantic match, not decoration:
//   case-study    → TrendingUp        (client growth results, not "sparkle")
//   social-proof  → MessageSquareQuote (real testimonials in quote form)
//   features      → Sparkles           (product highlights)
//   pricing       → CreditCard         (JBRSEO is a payment gateway)
//   faq           → HelpCircle         (questions)
const NAV_ICON: Record<string, LucideIcon> = {
  "#case-study": TrendingUp,
  "#social-proof": MessageSquareQuote,
  "/features": Sparkles,
  "#pricing": CreditCard,
  "#faq": HelpCircle,
};

function iconFor(href: string): LucideIcon {
  const match = Object.keys(NAV_ICON).find((k) => href.endsWith(k));
  return match ? NAV_ICON[match] : HelpCircle;
}

/**
 * The mobile drawer body (shadcn Sheet on Radix Dialog). Split out of
 * {@link MobileMenu} so its heavy JS (Radix Dialog + icons) can be lazy-loaded
 * (`ssr: false`) only once the visitor first reaches for the hamburger — the
 * trigger button stays in the eager shell. Fully controlled via open/onOpenChange.
 *
 * Four distinct regions:
 *   Header → brand (logo + tagline) — anchors identity, not a generic "قائمة"
 *   Body   → nav rows with icon + label + chevron (RTL end) — proper affordance
 *   Trust  → 14-day refund chip — reinforces conversion in the KSA context
 *   Footer → WhatsApp CTA (primary) + phone/theme row (secondary)
 */
export function MobileMenuDrawer({
  open,
  onOpenChange,
  navLinks,
  whatsappHref,
  phoneDisplay,
}: MobileMenuDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-[86%] max-w-sm flex-col gap-0 border-neutral-800 bg-neutral-950 p-0 text-white"
      >
        {/* Header — brand block. pe-14 reserves the built-in close-button slot. */}
        <SheetHeader className="border-b border-neutral-800 p-4 pe-14 text-start sm:text-start">
          <div className="flex items-center gap-3">
            <Image
              src={SITE_LOGO_URL}
              alt="JBRSEO"
              width={104}
              height={28}
              className="h-7 w-auto object-contain"
              priority={false}
            />
          </div>
          <SheetTitle className="text-[13px] font-medium text-white/60">
            بوابة الدفع لمنصة مدونتي
          </SheetTitle>
          <SheetDescription className="sr-only">
            روابط التنقل، تواصل مباشر عبر واتساب، وإعدادات العرض.
          </SheetDescription>
        </SheetHeader>

        {/* Body — nav rows. Each row: icon (leading) + label + chevron (trailing
            end/RTL start-visually-left). Divide-y gives Salla-style separation. */}
        <nav
          aria-label="روابط القائمة"
          className="flex flex-1 flex-col divide-y divide-neutral-900 overflow-y-auto px-2"
        >
          {navLinks.map((link, i) => {
            const Icon = iconFor(link.href);
            return (
              <NextLink
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={() => onOpenChange(false)}
                style={{ animationDelay: `${120 + i * 55}ms`, animationFillMode: "both" }}
                className="group flex min-h-14 items-center gap-3 rounded-lg px-3 text-[15px] font-semibold text-white/90 transition-colors hover:bg-white/[0.04] active:bg-white/[0.06] animate-in fade-in slide-in-from-right-4 duration-400 ease-out no-underline"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/70 transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                </span>
                <span className="flex-1">{link.label}</span>
                <ChevronLeft
                  className="h-4 w-4 text-white/30 transition-transform group-hover:-translate-x-0.5 group-hover:text-white/60"
                  strokeWidth={2}
                  aria-hidden
                />
              </NextLink>
            );
          })}

          {/* Trust chip — after nav, before footer. Bridges "explore" to
              "convert" by surfacing the refund guarantee inside the drawer. */}
          <div
            style={{
              animationDelay: `${120 + navLinks.length * 55}ms`,
              animationFillMode: "both",
            }}
            className="mt-3 flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/[0.06] px-3 py-2.5 animate-in fade-in slide-in-from-right-4 duration-400 ease-out"
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
            <span className="text-[12.5px] font-semibold text-white/85">
              ضمان استرداد ١٤ يوم
            </span>
          </div>
        </nav>

        {/* Footer — primary CTA on top, secondary utility row below. */}
        <SheetFooter className="flex flex-col gap-3 border-t border-neutral-800 bg-neutral-950/95 p-4 sm:flex-col sm:justify-start">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onOpenChange(false)}
            className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-success px-4 text-[15px] font-bold text-success-foreground shadow-[0_10px_25px_-12px_color-mix(in_oklch,var(--success)_65%,transparent)] transition-all hover:bg-success/90 active:scale-[0.98] no-underline"
          >
            <WhatsAppIcon className="h-5 w-5" />
            تواصل عبر واتساب
          </a>
          <div className="flex items-center justify-between gap-3">
            <a
              href={`tel:${phoneDisplay.replace(/\s+/g, "")}`}
              onClick={() => onOpenChange(false)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-[13px] font-semibold text-white/75 transition-colors hover:text-white no-underline"
              dir="ltr"
            >
              <Phone className="h-4 w-4" strokeWidth={2.25} />
              {phoneDisplay}
            </a>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-white/55">
                الوضع
              </span>
              <ThemeToggle />
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
