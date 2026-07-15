import Link from "next/link";
import { Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";

type Props = {
  pricingHref: string;
  whatsappLink: string;
  ctaLabel: string;
};

/**
 * Mobile-only bottom CTA — a Server Component. Always visible on ≤880px as a
 * fixed footer bar, so it needs no scroll JS or state. Both actions are links:
 * WhatsApp + the primary action to #pricing. The marketing layouts add matching
 * bottom padding on ≤880px so the bar never covers the footer.
 */
export function StickyMobileCTA({ pricingHref, whatsappLink, ctaLabel }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 hidden max-[880px]:flex items-stretch gap-2 border-t border-border bg-background px-3.5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))]">
      <Link
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="w-[52px] h-[52px] rounded-[13px] bg-success text-success-foreground inline-flex items-center justify-center shrink-0 no-underline"
      >
        <WhatsAppIcon className="w-[22px] h-[22px]" />
      </Link>
      <Link
        href={pricingHref}
        prefetch={false}
        className="flex-1 inline-flex items-center justify-center gap-2 bg-foreground text-background px-[18px] rounded-[13px] text-[15px] font-semibold no-underline min-h-[52px]"
      >
        <Sparkles className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        {ctaLabel}
      </Link>
    </div>
  );
}
