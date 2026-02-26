import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { landing } from "@/app/content/landing";

export const metadata = {
  title: "خطة الأسعار — مدونتي",
  description: "اختر الباقة المناسبة: ستارتر، غروث، أو سكيل. ادفع 12، استلم 18 شهراً.",
};

export default function PricingPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
          خطة الأسعار — قريباً
        </h1>
        <p className="mb-8 text-muted-foreground">
          نعمل على تجهيز صفحة الأسعار. اختر الباقة المناسبة من البطاقات أدناه عند الإطلاق.
        </p>
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {landing.pricingTeaser.plans.map((plan) => (
            <span
              key={plan.name}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
            >
              {plan.name}
            </span>
          ))}
        </div>
        <Button asChild>
          <Link href="/">{landing.hero.cta}</Link>
        </Button>
      </div>
    </div>
  );
}
