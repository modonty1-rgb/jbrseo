import type { Metadata } from "next";
import { SliderController } from "./components/SliderController";
import { WhyNowDistributionBlock } from "./components/WhyNowDistributionBlock";
import { WhyNowCommentsBlock } from "./components/WhyNowCommentsBlock";
import { WhyNowDirectInquiryBlock } from "./components/WhyNowDirectInquiryBlock";
import { ExclusiveFeaturesBlock } from "./components/ExclusiveFeaturesBlock";
import { ArticleExtrasBlock } from "./components/ArticleExtrasBlock";
import { ClientPageBlock } from "./components/ClientPageBlock";
import { LeadsBlock } from "./components/LeadsBlock";
import { ActivityDashboardBlock } from "./components/ActivityDashboardBlock";
import { WhyNowTrustPills } from "./components/WhyNowTrustPills";

export const metadata: Metadata = {
  title: "كل ما تحصل عليه مع مدونتي",
  description:
    "استكشف كل الميزات: نشر المقالات، صفحة الشركة، قاعدة Leads، حملات الإيميل والواتساب، ولوحة التحكم الكاملة.",
};

export default function FeaturesPage() {
  return (
    <main dir="rtl">
      <section className="border-b border-border bg-background px-5 pb-6 pt-20 text-center">
        <div className="mx-auto max-w-[640px]">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[.12em] text-accent">
            كل ما تحصل عليه
          </p>
          <h1 className="mb-3  text-3xl text-foreground leading-tight md:text-4xl xl:text-5xl">
            مدونتي = فريق تسويق كامل
            <br />
            <em className="not-italic text-accent">باشتراك شهري واحد</em>
          </h1>
          <p className="mx-auto max-w-[480px] text-sm leading-relaxed text-muted-foreground">
            من الحاسبة وصفحة شركتك — وصولاً لقاعدة Leads والحملات التسويقية.
          </p>
        </div>
      </section>

      <div className="min-h-screen bg-background px-5 py-12 text-foreground">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="text-[11px] font-black uppercase tracking-[.12em] text-accent">
              احسب توفيرك الحقيقي
            </span>
          </div>
          <h2 className="mb-2 text-2xl leading-tight text-foreground md:text-3xl lg:text-4xl">
            ٦ موظفين أو{" "}
            <em className="not-italic text-accent">
              مدونتي؟
            </em>
          </h2>
          <p className="mx-auto mb-4 max-w-[480px] text-sm leading-relaxed text-muted-foreground">
            لإنتاج محتوى SEO احترافي ونشره وترويجه شهرياً — مدونتي تغني عن توظيف ٥ أشخاص بالكامل.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-bold text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            تشمل: كتابة · تصميم · SEO · سوشال ميديا · فيديو · نشر وترويج
          </div>
        </div>

        <SliderController />

        <WhyNowDistributionBlock />
        <WhyNowCommentsBlock />
        <WhyNowDirectInquiryBlock />
        <ExclusiveFeaturesBlock />
        <ArticleExtrasBlock />
        <ClientPageBlock />
        <LeadsBlock />

        <ActivityDashboardBlock />

        <WhyNowTrustPills />
      </div>
    </main>
  );
}
