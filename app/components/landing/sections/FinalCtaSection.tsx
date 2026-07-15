import type { StaticLanding } from "@/app/content/landing/types";

type Props = {
  finalCtaData: StaticLanding["finalCta"];
  ctaLabel: string;
  whatsappLink: string;
};

/** Final CTA — DB-driven copy. Static, server-ready. */
export function FinalCtaSection({ finalCtaData, ctaLabel, whatsappLink }: Props) {
  return (
    <section
        id="final-cta"
        className="max-w-270 mx-auto pt-15 px-7 pb-22.5"
      >
        <div className="bg-foreground rounded-[20px] md:rounded-[26px] px-5 py-10 md:px-10 md:py-18 text-center">
          <h2 className="text-[clamp(17px,5.0vw,26px)] md:text-[44px] font-semibold text-background tracking-[-1px] md:tracking-[-1.5px] leading-[1.2] md:leading-[1.15] mb-4 [text-wrap:balance]">
            {finalCtaData?.title1 ?? "منافسك يتصدّر الحين."}<br />
            {finalCtaData?.title2 ?? "وأنت؟"}
          </h2>
          <p className="text-[14.5px] md:text-[17px] text-background/70 max-w-115 mx-auto mb-6 md:mb-8 leading-[1.7] font-light [text-wrap:pretty]">
            {finalCtaData?.subtitle ?? "انضم لأوائل الشركات اللي اختارت المحتوى طريقاً للنمو — لا الإعلانات."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="#pricing" className="bg-background text-foreground px-7.5 py-4 rounded-[13px] text-base font-semibold no-underline">
              {ctaLabel}
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-background/10 text-background px-6.5 py-4 rounded-[13px] text-base font-medium no-underline border border-background/15">
              {finalCtaData?.wa ?? "كلّمنا على واتساب"}
            </a>
          </div>
        </div>
      </section>
  );
}
