import type { Metadata } from "next";
import Link from "next/link";

import { FeaturesStepperSection } from "@/app/components/features/FeaturesStepperSection";
import { Button } from "@/app/components/ui/button";

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
          <p className="mb-3 text-[11px] font-black uppercase tracking-[.12em] text-accent">أنت توافق فقط — الباقي علينا</p>
          <h1 className="mb-3  text-3xl text-foreground leading-tight md:text-4xl xl:text-5xl">
            اشترك اليوم —
            <br />
            <em className="not-italic text-accent">أول مقالك جاهز خلال ٧ أيام</em>
          </h1>
          <p className="mx-auto max-w-[480px] text-sm leading-relaxed text-muted-foreground">
            بدون كتابة · بدون خبرة تقنية · بدون عقود — فريقنا يكتب وينشر وأنت توافق فقط
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/sa/signup">ابدأ مجاناً — بدون بطاقة</Link>
            </Button>
            <Link
              href="/sa/pricing"
              className="text-sm text-muted-foreground underline transition-colors hover:text-foreground"
            >
              شوف الأسعار أولاً
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { n: "+١٩", l: "شركة في الشبكة" },
              { n: "٩٠ يوم", l: "لأول نتائج" },
              { n: "٩٦%", l: "توفير مقارنة بفريق" },
              { n: "١٤ يوم", l: "ضمان استرداد" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-sm font-medium text-foreground">{s.n}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <FeaturesStepperSection />
      </div>
    </main>
  );
}
