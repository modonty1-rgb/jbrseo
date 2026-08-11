import { ShieldCheck } from "lucide-react";
import type { StaticLanding } from "@/app/content/landing/types";

type Props = {
  finalCtaData: StaticLanding["finalCta"];
  ctaLabel: string;
  whatsappLink: string;
  /**
   * The refund line, verbatim from `hero.trust[0]` — the same string the pricing cards
   * print, so the promise is worded identically wherever it appears.
   *
   * Deliberately NOT `finalCta.benefits` from the database, which holds
   * `["من غير بطاقة ائتمان", "ضمان استرداد ١٤ يوم"]`. The first is untrue — checkout asks
   * for a card — and the second drops the condition the policy actually carries
   * («لو ما فعّلنا حسابك»), turning a conditional refund into an unconditional one. The
   * last thing a reader sees before deciding is the worst place to overstate.
   */
  refundNote?: string;
};

/** Final CTA — DB-driven copy. Static, server-ready. */
export function FinalCtaSection({ finalCtaData, ctaLabel, whatsappLink, refundNote }: Props) {
  return (
    <section
        id="final-cta"
        className="max-w-270 mx-auto pt-15 px-5 md:px-7 pb-22.5"
      >
        <div className="bg-foreground rounded-[20px] md:rounded-[26px] px-5 py-8 md:px-10 md:py-11 text-center">
          <h2 className="text-[clamp(17px,5.0vw,26px)] md:text-[44px] font-semibold text-background leading-[1.2] md:leading-[1.15] mb-4 text-balance">
            {finalCtaData?.title1 ?? "منافسك يتصدّر الحين."}<br />
            {finalCtaData?.title2 ?? "وأنت؟"}
          </h2>
          {/* /85 and font-normal, not /70 and font-light. This is light text on the one
              inverted panel on the page, at the last moment the reader is still reading —
              the two settings that made it delicate also made it the faintest copy here. */}
          <p className="text-[14.5px] md:text-[17px] text-background/85 max-w-115 mx-auto mb-6 md:mb-8 leading-[1.7] text-pretty">
            {finalCtaData?.subtitle ?? "انضم لأوائل الشركات اللي اختارت المحتوى طريقاً للنمو — لا الإعلانات."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {/* #pricing, not /checkout: checkout needs a plan, and sending someone there
                without one lands them on a page asking a question this button skipped. */}
            <a href="#pricing" className="bg-background text-foreground px-7.5 py-4 rounded-[13px] text-base font-semibold no-underline">
              {ctaLabel}
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-background/10 text-background px-6.5 py-4 rounded-[13px] text-base font-medium no-underline border border-background/15">
              {finalCtaData?.wa ?? "كلّمنا على واتساب"}
            </a>
          </div>

          {/* The page's last decision point had nothing under the buttons. Every earlier
              ask — the plan cards, the checkout summary — carries the refund line, and the
              one place the reader is closest to committing was the one place it was
              missing. */}
          {refundNote && (
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-background/75">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
              <span>{refundNote}</span>
            </div>
          )}
        </div>
      </section>
  );
}
