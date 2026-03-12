import Link from "@/app/components/link";
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
}

export function PriceSectionBottomCta({ BOTTOM_CTA }: PriceSectionBottomCtaProps) {
  return (
    <div
      className="relative rounded-3xl px-8 py-14 text-center overflow-hidden"
      style={{ background: "linear-gradient(145deg,#1e1b4b 0%,#312e81 60%,#1e1b4b 100%)", boxShadow: "0 24px 72px rgba(109,40,217,.22)" }}
    >
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(167,139,250,.15) 0%,transparent 65%)" }}
      />
      <h2 className="font-amiri text-4xl font-bold text-white mb-3 leading-snug relative z-10">
        {BOTTOM_CTA.headline}
      </h2>
      <p className="text-sm text-white/60 max-w-sm mx-auto mb-8 leading-loose relative z-10 whitespace-pre-line">
        {BOTTOM_CTA.subheadline}
      </p>
      <div className="flex gap-3 justify-center flex-wrap relative z-10">
        <Link
          href="/signup"
          className="px-9 py-4 rounded-xl text-base font-extrabold bg-white text-violet-700 border-0 cursor-pointer font-tajawal shadow-lg shadow-black/20 hover:opacity-90 transition-opacity inline-block text-center"
        >
          {BOTTOM_CTA.primaryBtn}
        </Link>
        <button className="px-7 py-4 rounded-xl text-sm font-bold text-white border border-white/25 bg-white/10 cursor-pointer font-tajawal flex items-center gap-2 hover:bg-white/15 transition-colors">
          <WhatsApp /> {BOTTOM_CTA.secondaryBtn}
        </button>
      </div>
      <p className="text-xs text-white/30 mt-5 leading-relaxed relative z-10">
        {BOTTOM_CTA.footnote}
      </p>
    </div>
  );
}
