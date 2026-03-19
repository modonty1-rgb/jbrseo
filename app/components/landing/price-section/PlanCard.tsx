import Link from "@/app/components/link";
import type { Plan, PricingUI } from "@/app/content/landing/price-section-types";
import { Icon } from "@/app/components/Icon";
import { Check, WhatsApp } from "./PriceSectionIcons";

interface PlanCardProps {
  plan: Plan;
  annual: boolean;
  currency: string;
  ui: PricingUI;
  id?: string;
  pricingHrefBase?: string;
  whatsappLink?: string;
  className?: string;
}

export function PlanCard({ plan, annual, currency, ui, id, pricingHrefBase = "/pricing", whatsappLink, className }: PlanCardProps) {
  const mo = plan.price.mo;
  const price = annual ? plan.price.yr : mo;
  const savings = mo > 0 ? (mo - plan.price.yr) * 12 : 0;
  const F = plan.featured;

  const cardCls = F
    ? "relative flex flex-col rounded-2xl p-8 -translate-y-4 hover:-translate-y-6 transition-transform duration-200 shadow-2xl border-0 overflow-visible"
    : "relative flex flex-col rounded-2xl p-6 bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-150 overflow-visible";

  return (
    <div
      id={id}
      className={className ? `${cardCls} ${className}` : cardCls}
      style={F ? { background: "var(--pricing-featured-bg)" } : {}}
    >
      {plan.badge && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-primary-foreground text-xs font-extrabold px-4 py-1.5 rounded-full whitespace-nowrap z-10"
          style={{ background: plan.badgeGold ? "var(--pricing-badge-gold)" : "var(--pricing-badge-featured)" }}
        >
          {plan.badge}
        </div>
      )}

      <span
        className="inline-flex items-center text-xs font-extrabold px-3 py-1 rounded-lg mb-3 w-fit"
        style={{ background: plan.accentBg, color: plan.accent }}
      >
        {plan.name}
      </span>

      <p className={`text-sm font-semibold leading-relaxed mb-5 ${F ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {plan.persona}
      </p>

      <div className="mb-1">
        {mo === 0 ? (
          <div className={`text-5xl font-black leading-none tracking-tight ${F ? "text-primary-foreground" : "text-foreground"}`}>
            {ui.freeLabel}
          </div>
        ) : (
          <>
            {annual && (
              <div className={`text-sm line-through mb-0.5 ${F ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {mo.toLocaleString()} {currency}
              </div>
            )}
            <div className="flex items-end gap-1">
              <span className={`text-5xl font-black leading-none tracking-tight ${F ? "text-primary-foreground" : "text-foreground"}`}>
                {price.toLocaleString()}
              </span>
              <span className={`text-sm pb-2 ${F ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {currency} {ui.perMonth}
              </span>
            </div>

            {annual && savings > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full w-fit
                  ${F ? "bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/25" : "bg-success/15 text-success-foreground border border-success/30"}`}>
                  <Icon emoji="✓" /> {ui.savedYearly.replace("{n}", savings.toLocaleString()).replace("{c}", currency)}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full w-fit
                  ${F ? "bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25" : "bg-(--pricing-banner-bg) text-foreground border border-(--pricing-banner-border)"}`}>
                  {ui.offer12_18}
                </span>
              </div>
            )}
            <p className={`text-xs mt-1.5 ${F ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {annual ? ui.billingAnnual.replace("{n}", (price * 12).toLocaleString()).replace("{c}", currency) : ui.billingMonthly}
            </p>
          </>
        )}
      </div>

      <span
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mt-3 mb-5 w-fit border ${F ? "bg-primary/20 border-primary-foreground/30" : ""}`}
        style={F ? { color: plan.accent } : { background: plan.accentBg, color: plan.accent, borderColor: `${plan.accent}28` }}
      >
        <Icon emoji="✦" /> {plan.articles}
      </span>

      <div className={`h-px w-full mb-4 ${F ? "bg-primary-foreground/10" : "bg-border"}`} />

      <span
        className={`inline-flex items-center justify-center w-full py-3.5 px-4 rounded-xl text-sm font-extrabold border-0 font-tajawal
          ${plan.ctaClass === "btn-ghost"    ? "bg-transparent border border-border text-muted-foreground"
          : plan.ctaClass === "btn-blue"     ? "bg-primary text-primary-foreground shadow-md"
          : plan.ctaClass === "btn-featured" ? "bg-accent text-accent-foreground font-extrabold text-base shadow-lg"
          : "text-primary-foreground shadow-md"}`}
        style={
          plan.ctaClass === "btn-gold" ? { background: "var(--pricing-badge-gold)" } : {}
        }
      >
        {plan.cta}
      </span>

      {plan.guarantee && (
        <p className={`text-xs text-center mt-2 mb-4 leading-relaxed ${F ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          {ui.guarantee}
        </p>
      )}
      {!plan.guarantee && <div className="mb-4" />}

      <div className={`h-px w-full mb-4 ${F ? "bg-primary-foreground/10" : "bg-border"}`} />

      <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${F ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
        {ui.youGet}
      </p>
      <div className="flex flex-col gap-2.5">
        {plan.highlights.map((feat, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <Check color={plan.accent} />
            <span className={`text-sm leading-relaxed font-medium ${F ? "text-primary-foreground/85" : "text-foreground"}`}>
              {feat}
            </span>
          </div>
        ))}
      </div>

      {plan.sections && plan.sections.length > 0 && (
        <>
          <div className={`h-px w-full mt-4 ${F ? "bg-primary-foreground/10" : "bg-border"}`} />
          <Link
            href={`${pricingHrefBase}?plan=${plan.id}`}
            className={`text-xs font-bold mt-3 inline-block underline underline-offset-2 ${F ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-primary hover:text-primary/90"}`}
          >
            {ui.moreDetails}
          </Link>
        </>
      )}

      {plan.id === "scale" && (
        <>
          <div className="h-px w-full bg-border mt-4 mb-3" />
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-success/15 border border-success/30 rounded-xl py-2.5 px-4 text-sm font-bold text-success-foreground cursor-pointer hover:bg-success/25 transition-colors"
            >
              <WhatsApp /> {ui.whatsapp}
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 bg-success/15 border border-success/30 rounded-xl py-2.5 px-4 text-sm font-bold text-success-foreground cursor-pointer">
              <WhatsApp /> {ui.whatsapp}
            </div>
          )}
        </>
      )}
    </div>
  );
}
