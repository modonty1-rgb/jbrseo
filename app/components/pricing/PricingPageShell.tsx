import type { PricingContent } from "@/app/content/landing/price-section-types";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { getWhatsAppLink } from "@/lib/site-links";
import { PricingBillingSection } from "@/app/components/pricing/PricingBillingSection";
import { PricingFaqExcerpt } from "@/app/components/pricing/PricingFaqExcerpt";

type Props = {
  pricing: PricingContent;
  pricingPage: StaticLanding["pricingPage"];
  faq: StaticLanding["faq"];
  country: SupportedCountry;
  highlightPlanId?: string | null;
  signupHrefBase?: string;
  whatsappHref?: string;
};

export function PricingPageShell({
  pricing,
  pricingPage,
  faq,
  country,
  highlightPlanId = null,
  signupHrefBase = "/signup",
  whatsappHref,
}: Props) {
  const { PLANS, TRUST_ITEMS, BOTTOM_CTA, UI } = pricing;
  const currency = country === "EG" ? "ج.م" : "ر.س";
  const featuredPlan =
    PLANS.find((p) => p.featured) ?? PLANS[1] ?? PLANS[0];
  const primaryHref = `${signupHrefBase}?plan=${featuredPlan.id}`;
  const secondaryHref = whatsappHref ?? getWhatsAppLink(country);
  const safeHighlight =
    highlightPlanId && PLANS.some((p) => p.id === highlightPlanId)
      ? highlightPlanId
      : null;

  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {UI.banner12Title}
          </p>
          <h1 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {pricingPage.h1}
          </h1>
          <p className="mb-6 max-w-xl text-sm text-muted-foreground leading-relaxed">
            {pricingPage.intro}
          </p>
        
          <p className="mb-6 text-[11px] text-muted-foreground">
            بدون بطاقة ائتمان · إلغاء في أي وقت · ضمان استرجاع ١٤ يوم
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-[13px] font-black text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              ابدأ مع خطة {featuredPlan.name}
            </a>
            <a
              href={secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-[12px] font-semibold text-foreground hover:bg-muted/60"
            >
              تواصل معنا أولاً على واتساب
            </a>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 text-right">
          <h2 className="mb-1 text-sm font-extrabold tracking-tight text-foreground">
            اختر الخطة المناسبة لمرحلة نشاطك
          </h2>
          <p className="text-[11px] text-muted-foreground">
            جميع الباقات تشمل إعداد المحتوى، النشر، والتحسين لمحركات البحث.
          </p>
        </div>

        <PricingBillingSection plans={PLANS} ui={UI} currency={currency} signupHrefBase={signupHrefBase} />

        <div className="mt-10 grid gap-4 border-t border-border/60 pt-6 text-[12px] text-muted-foreground sm:grid-cols-3">
          <div>
            <p className="font-semibold text-foreground mb-1">
              عقد مرن
            </p>
            <p>لا عقود طويلة الأجل — يمكنك الإلغاء أو تغيير الخطة في أي وقت.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">
              ملكية المحتوى
            </p>
            <p>كل المقالات والبيانات تبقى مملوكة لك ١٠٠٪ حتى بعد الإلغاء.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">
              دعم عربي حقيقي
            </p>
            <p>فريق دعم عربي في توقيت منطقتك لمساعدتك في أي وقت.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card/80 px-4 py-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {UI.trustTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-[11px] text-muted-foreground">
            {TRUST_ITEMS.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1"
              >
                <span aria-hidden>{item.icon}</span>
                <span>{item.label}</span>
              </span>
            ))}
          </div>
          <div className="w-full max-w-xl text-[11px] text-muted-foreground">
            <p className="font-semibold">{BOTTOM_CTA.headline}</p>
            <p className="mt-1 whitespace-pre-line">{BOTTOM_CTA.subheadline}</p>
          </div>
        </div>

        <PricingFaqExcerpt faq={faq} />
      </section>
    </main>
  );
}
