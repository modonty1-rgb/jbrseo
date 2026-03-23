import Link from "@/app/components/link";
import { Button } from "@/app/components/ui/button";
import { WhatsApp } from "./PriceSectionIcons";

interface BottomCtaContent {
  headline: string;
  subheadline: string;
  primaryBtn: string;
  secondaryBtn: string;
  footnote: string;
}

interface PriceSectionBottomCtaProps {
  BOTTOM_CTA: BottomCtaContent;
  signupHref?: string;
  whatsappLink?: string;
}

const secondaryBtnClass = "px-7 py-4 rounded-xl text-sm font-bold text-primary-foreground border border-primary-foreground/25 bg-primary-foreground/10 cursor-pointer font-tajawal flex items-center gap-2 hover:bg-primary-foreground/15 transition-colors";

export function PriceSectionBottomCta({ BOTTOM_CTA, signupHref = "/signup", whatsappLink }: PriceSectionBottomCtaProps) {
  return (
    <div
      className="relative rounded-3xl px-8 py-14 text-center overflow-hidden"
      style={{ background: "var(--pricing-cta-bg)" }}
    >
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none bg-primary/15"
      />
      <h2 className="font-amiri text-4xl font-bold text-primary-foreground mb-3 leading-snug relative z-10">
        {BOTTOM_CTA.headline}
      </h2>
      <p className="text-sm text-primary-foreground/60 max-w-sm mx-auto mb-8 leading-loose relative z-10 whitespace-pre-line">
        {BOTTOM_CTA.subheadline}
      </p>
      <div className="flex gap-3 justify-center flex-wrap relative z-10">
        <Link
          href={signupHref}
          className="px-9 py-4 rounded-xl text-base font-extrabold bg-primary-foreground text-primary border-0 cursor-pointer font-tajawal shadow-lg hover:opacity-90 transition-opacity inline-block text-center"
        >
          {BOTTOM_CTA.primaryBtn}
        </Link>
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryBtnClass}
          >
            <WhatsApp /> {BOTTOM_CTA.secondaryBtn}
          </a>
        ) : (
          <Button type="button" className={secondaryBtnClass}>
            <WhatsApp /> {BOTTOM_CTA.secondaryBtn}
          </Button>
        )}
      </div>
      <p className="text-xs text-primary-foreground/30 mt-5 leading-relaxed relative z-10">
        {BOTTOM_CTA.footnote}
      </p>
    </div>
  );
}
