import type { StaticLanding } from "@/app/content/landing/types";
import { toArabicDigits } from "../landing-helpers";

type Props = {
  hero: StaticLanding["hero"];
  clientsTotal: number;
  countrySlug: "sa" | "eg";
  ctaLabel: string;
  whatsappLink: string;
};

/**
 * Above-the-fold hero — pure static content (no state, no client hooks), so it
 * ships without "use client" and is server-renderable. The hero subtitle is the
 * mobile LCP element, so keeping this JS-free matters for load performance.
 */
export function HeroSection({ hero, clientsTotal, countrySlug, ctaLabel, whatsappLink }: Props) {
  return (
    <section className="max-w-190 mx-auto pt-18 md:pt-22 px-7 pb-5 md:pb-7 text-center">
      {/* Hard-coded hook (Khalid 2026-07-15) with the LIVE client count from
          trustBundle.total (real paying clients) — falls back to ٢٦ if the
          live count is unavailable. Dialect varies per country. */}
      <div className="inline-block text-center pt-[5px] px-3.5 pb-[5px] rounded-full border border-border bg-card font-mono text-[11.5px] text-muted-foreground tracking-[.3px] leading-[1.9] mb-4 md:mb-6.5">
        <span
          className="inline-block w-[7px] h-[7px] rounded-full bg-success me-2 align-middle shadow-[0_0_0_3px_color-mix(in oklch, var(--success) 16%, transparent)]"
        />
        <span className="text-success font-bold">+{toArabicDigits(clientsTotal > 0 ? clientsTotal : 26)}</span>
        {" شركة سعودية وعربية تبني حضورها على جوجل معنا — "}
        <span className="text-success font-bold">{countrySlug === "eg" ? "إمتى دورك؟" : "متى دورك؟"}</span>
      </div>
      <h1 className="text-[length:var(--font-5xl)] leading-[1.22] font-semibold tracking-[-2px] [text-wrap:balance] max-sm:text-[clamp(24px,8vw,32px)] max-sm:leading-[1.4] max-sm:tracking-[-1px]">
        {hero?.h1Line1 ?? "ابنِ حضورك على جوجل"}<br />
        <span
          className="relative inline-block text-success px-1 py-0 bg-[linear-gradient(180deg,transparent_0%,transparent_78%,color-mix(in oklch, var(--success) 16%, transparent)_78%,color-mix(in oklch, var(--success) 16%, transparent)_100%)]"
        >
          {hero?.h1Line2 ?? "بدون إعلانات · بدون فريق داخلي"}
        </span>
      </h1>
      <p className="text-[20px] leading-[1.7] text-muted-foreground mt-4 md:mt-6.5 mx-auto max-w-130 font-normal max-sm:text-[length:var(--font-md)] max-sm:[text-wrap:pretty]">
        {hero?.sub ?? "فريقنا يكتب محتوى سيو وينشره على موقعك. أنت توافق بضغطة — وجوجل يجيب لك العملاء كل يوم."}
      </p>
      <div className="flex gap-4.5 justify-center items-center mt-6 md:mt-8 flex-wrap">
        <a href="#pricing" className="bg-foreground text-background px-7 py-[15px] rounded-xl text-base font-medium no-underline">
          {ctaLabel}
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground text-[15px] font-medium no-underline inline-flex items-center gap-1.5 px-1 py-2 border-b border-b-transparent hover:border-b-foreground transition-[border-color,color] duration-150"
        >
          تواصل واتساب
          <span className="text-[18px] leading-none">←</span>
        </a>
      </div>
      <div className="inline-flex flex-wrap justify-center gap-4.5 mt-4 md:mt-5.5 text-[13px] text-muted-foreground">
        {(hero?.trust ?? ["استرداد ١٤ يوم", "شركة سعودية مسجّلة", "دعم عربي ١٠٠٪"]).map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5l5 5L20 7" />
            </svg>
            <span>{item}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
