import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { getWhatsAppLink } from "@/lib/site-links";
import { FAQAccordion } from "./FAQAccordion";

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const DEFAULT_CTA = "تحدث معنا على واتساب";

export default function FAQ({ staticLanding, country, ctaLabel = DEFAULT_CTA, whatsappNumber }: { staticLanding: StaticLanding; country: SupportedCountry; ctaLabel?: string; whatsappNumber?: string }) {
  const f = staticLanding.faq;
  const waLink = getWhatsAppLink(country, whatsappNumber);
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="
        relative overflow-hidden border-t border-border bg-card
        px-5 pt-24 pb-20
        sm:px-8
        lg:px-10 lg:pt-[88px] lg:pb-[80px]
      "
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-[240px] w-[500px] -translate-x-1/2 rounded-full blur-[70px]"
        style={{ background: "color-mix(in oklch, var(--accent) 4%, transparent)" }}
      />

      <div className="relative mx-auto max-w-[760px]">
        <div className="relative z-10">
        <div className="landing-reveal-eyebrow mb-14 text-center">
          <div
            className="mb-4 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5"
            style={{
              background: "color-mix(in oklch, var(--accent) 8%, transparent)",
              boxShadow: "0 0 12px color-mix(in oklch, var(--accent) 40%, transparent), 0 0 24px color-mix(in oklch, var(--accent) 20%, transparent)",
            }}
          >
            <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-accent" aria-hidden />
            <span className="text-[12px] font-black uppercase tracking-[.12em] text-accent">{f.eyebrow}</span>
          </div>
          <h2
            id="faq-title"
            className="landing-reveal-title font-black tracking-[-0.03em] text-foreground"
            style={{ fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.1 }}
          >
            {f.title}{" "}
            <span className="text-accent">{f.subtitle}</span>
          </h2>
        </div>

        <FAQAccordion faqs={f.faqs} />

        <div
          className="rounded-[20px] border border-border px-6 py-7 text-center"
          style={{
            background: "color-mix(in oklch, var(--primary) 3%, transparent)",
            animation: "fadeUp .5s .4s ease both",
            opacity: 0,
          }}
        >
          <p className="mb-3.5 text-[15px] font-bold text-foreground">{f.ctaLabel}</p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2.5 rounded-full
              px-7 py-3 text-[15px] font-black text-success-foreground
              transition-all duration-200
              hover:-translate-y-0.5
            "
            style={{
              background: "var(--success)",
              boxShadow: "0 4px 20px color-mix(in oklch, var(--success) 30%, transparent)",
            }}
          >
            <WhatsAppIcon />
            {ctaLabel}
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}
