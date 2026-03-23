"use client";

import { Fragment, useState, type ReactElement } from "react";
import Link from "next/link";

import { SalaryCalculator } from "@/app/components/features/SalaryCalculator";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { num: "١", label: "الفريق يكتب", sub: "أنت توافق فقط" },
  { num: "٢", label: "ينتشر في الشبكة", sub: "جمهور موجود" },
  { num: "٣", label: "زوار يتحولون", sub: "لعملاء حقيقيين" },
  { num: "٤", label: "تشوف كل شيء", sub: "في لوحتك" },
] as const;

type StepWithNextProps = {
  onNext: () => void;
};

export function FeaturesStepperSection(): ReactElement {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="mb-6">
        <p className="mb-4 text-center text-xs text-muted-foreground">متى ترى النتائج؟</p>
        <div className="relative">
          <div className="absolute start-0 end-0 top-3 h-px bg-border/60" />
          <div className="relative grid grid-cols-5 gap-2">
            {[
              { time: "اليوم", event: "اشتركت", color: "bg-primary" },
              { time: "أسبوع ١", event: "استمارة + موافقة", color: "bg-primary/70" },
              { time: "شهر ١", event: "٣ مقالات + صفحتك", color: "bg-primary/50" },
              { time: "شهر ٣", event: "أول نتائج في جوجل", color: "bg-emerald-500" },
              { time: "شهر ٦", event: "نظام نمو كامل", color: "bg-emerald-600" },
            ].map((point) => (
              <div key={point.time} className="flex flex-col items-center gap-2">
                <div className={cn("relative z-10 h-3 w-3 rounded-full border-2 border-background", point.color)} />
                <div className="text-center">
                  <p className="text-[10px] font-medium text-foreground">{point.time}</p>
                  <p className="mt-0.5 text-[9px] leading-tight text-muted-foreground">{point.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="grid grid-cols-4 border-b border-border/60 bg-muted/20">
        {steps.map((step, i) => (
          <button
            key={step.label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "border-b-2 border-transparent px-2 py-3 text-center transition-all",
              active === i ? "border-primary bg-card" : "hover:bg-muted/40",
            )}
          >
            <div
              className={cn(
                "mx-auto mb-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                active === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {step.num}
            </div>
            <p className={cn("text-xs font-medium leading-tight", active === i ? "text-primary" : "text-muted-foreground")}>
              {step.label}
            </p>
            <p className="mt-0.5 hidden text-[10px] leading-tight text-muted-foreground sm:block">{step.sub}</p>
          </button>
        ))}
        </div>

        <div className="min-h-[340px] p-5">
        {active === 0 ? <StepWriting onNext={() => setActive(1)} /> : null}
        {active === 1 ? <StepNetwork onNext={() => setActive(2)} /> : null}
        {active === 2 ? <StepLeads onNext={() => setActive(3)} /> : null}
        {active === 3 ? <StepDashboard /> : null}
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-border/60 px-5 py-4">
        {[
          {
            q: "كم وقتي المطلوب؟",
            a: "١٥ دقيقة للاستمارة — ثم موافقة شهرية واحدة فقط",
            icon: "⏱️",
          },
          {
            q: "متى أرى نتائج؟",
            a: "٨٠٪ من عملائنا يرون نتائج عضوية خلال ٩٠ يوماً",
            icon: "📈",
          },
          {
            q: "لو ما عجبني؟",
            a: "ضمان استرداد كامل ١٤ يوم — بدون أسئلة",
            icon: "🛡️",
          },
        ].map((item) => (
          <div key={item.q} className="text-center">
            <div className="mb-1.5 text-xl">{item.icon}</div>
            <p className="mb-1 text-[10px] font-medium text-foreground">{item.q}</p>
            <p className="text-[10px] leading-relaxed text-muted-foreground">{item.a}</p>
          </div>
        ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 bg-muted/10 px-5 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">انضم للشبكة اليوم</p>
          <p className="text-xs text-muted-foreground">ضمان ١٤ يوم · إلغاء في أي وقت · بدون بطاقة</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sa/pricing" className="text-xs text-muted-foreground underline underline-offset-2">
            الأسعار
          </Link>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/sa/signup">ابدأ مجاناً</Link>
          </Button>
        </div>
        </div>
      </div>
    </>
  );
}

type FlowItem = { icon: string; label: string; sub: string; hl: boolean } | null;

const flowItems: FlowItem[] = [
  { icon: "📋", label: "استمارة", sub: "١٠ أسئلة", hl: false },
  null,
  { icon: "✍️", label: "الفريق يكتب", sub: "+ يصمم", hl: false },
  null,
  { icon: "✅", label: "أنت توافق", sub: "دورك هنا", hl: true },
  null,
  { icon: "🚀", label: "ينزل تلقائي", sub: "كل مكان", hl: false },
];

function StepWriting({ onNext }: StepWithNextProps): ReactElement {
  const rows: {
    icon: string;
    bg: string;
    title: string;
    desc: string;
    proof?: string;
  }[] = [
    {
      icon: "📝",
      bg: "bg-primary/10",
      title: "حتى ١٢ مقال شهرياً — SEO احترافي كامل",
      desc: "عنوان، وصف، كلمات مفتاحية، روابط داخلية — الفريق يتولى كل شيء",
      proof: "٨٠٪ من عملائنا يرون نتائج خلال ٩٠ يوماً",
    },
    {
      icon: "🎧",
      bg: "bg-accent/10",
      title: "نسخة صوتية تلقائية مع كل مقال",
      desc: "يرفع وقت الجلسة ويحسن إشارات SEO — بدون أي جهد منك",
    },
    {
      icon: "🚀",
      bg: "bg-primary/10",
      title: "ريلز جاهز + توزيع ٨ منصات تلقائياً",
      desc: "سناب، إنستغرام، تيك توك، X — يوم النشر بدون جهد",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-e-lg border-s-4 border-primary bg-muted/30 px-4 py-3 text-sm leading-relaxed text-foreground">
        دورك الوحيد: <strong>الموافقة.</strong> الفريق يكتب، يصمم، ينشر — أنت تضغط موافق.
      </div>

      <div className="grid grid-cols-7 items-center gap-1">
        {flowItems.map((item, i) =>
          item === null ? (
            <div key={`arrow-${i}`} className="text-center text-sm text-muted-foreground">
              ←
            </div>
          ) : (
            <div
              key={`flow-${item.label}`}
              className={cn(
                "rounded-lg p-2 text-center",
                item.hl ? "border border-primary/20 bg-primary/10" : "bg-muted/30",
              )}
            >
              <div className="mb-1 text-base">{item.icon}</div>
              <p className="text-[10px] font-medium leading-tight">{item.label}</p>
              <p className="mt-0.5 text-[9px] text-muted-foreground">{item.sub}</p>
            </div>
          ),
        )}
      </div>

      <div className="divide-y divide-border/40">
        {rows.map((row) => (
          <div key={row.title} className="flex gap-3 py-2.5">
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm", row.bg)}>{row.icon}</div>
            <div>
              <p className="text-xs font-medium text-foreground">{row.title}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{row.desc}</p>
              {row.proof ? <p className="mt-0.5 text-[10px] font-medium text-primary">{row.proof}</p> : null}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border/40 pt-4">
        <p className="mb-3 text-xs font-medium text-muted-foreground">احسب كم توفر مقارنة بتوظيف فريق:</p>
        <SalaryCalculator embedded />
      </div>

      <div className="flex justify-start pt-2">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          التالي: ينتشر في الشبكة
          <span className="text-base">←</span>
        </button>
      </div>
    </div>
  );
}

function StepNetwork({ onNext }: StepWithNextProps): ReactElement {
  const networkTags: { label: string; className: string }[] = [
    { label: "✅ وافقت", className: "border border-primary/20 bg-primary/10 text-primary" },
    { label: "موقعك + جوجل", className: "border border-border bg-muted/50 text-foreground" },
    { label: "صفحتك في مدونتي", className: "border border-border bg-muted/50 text-foreground" },
    { label: "٨ منصات اجتماعية", className: "border border-border bg-muted/50 text-foreground" },
    { label: "🔥 صفحة الرائجة", className: "border border-accent/20 bg-accent/10 text-accent-foreground" },
  ];

  const tabs = ["الكل", "حول", "الصور", "المتابعون", "التقييمات", "الريلز"];

  const rows = [
    {
      icon: "👥",
      bg: "bg-primary/10",
      title: "متابعون يتراكمون — جمهور دائم بدون تكلفة",
      desc: "كل مقال جديد يصل لمتابعيك تلقائياً بدون إعلانات ممولة",
    },
    {
      icon: "⭐",
      bg: "bg-accent/10",
      title: "شارة موثّق + تقييمات علنية = مصداقية فورية",
      desc: "تميّزك عن كل منافس غير مشترك في الشبكة",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-e-lg border-s-4 border-primary bg-muted/30 px-4 py-3 text-sm leading-relaxed text-foreground">
        <strong>لست وحدك على الإنترنت.</strong> مقالاتك تنضم لشبكة فيها +١٩ شركة عربية وزوار يومياً.
      </div>

      <div className="rounded-lg bg-muted/20 p-3">
        <p className="mb-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">رحلة مقالك بعد الموافقة</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {networkTags.map((tag, i) => (
            <Fragment key={tag.label}>
              {i === 1 ? <span className="text-xs text-muted-foreground">←</span> : null}
              <span className={cn("rounded-full px-2 py-0.5 text-[10px]", tag.className)}>{tag.label}</span>
            </Fragment>
          ))}
        </div>
        <p className="mt-2 rounded bg-card p-2 text-[10px] leading-relaxed text-muted-foreground">
          💡 صفحة الرائجة = مقالاتك أمام كل زوار مدونتي — بدون إعلانات ممولة
        </p>
      </div>

      <div className="overflow-hidden rounded-lg bg-muted/20">
        <div className="h-8 bg-linear-to-l from-primary/20 to-accent/20" />
        <div className="px-3 pb-2">
          <div className="mb-2 flex items-center gap-2">
            <div className="-mt-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-medium text-primary-foreground">
              ن
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-foreground">نخبة الاستشارات</span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">✓ موثّق</span>
              </div>
              <p className="text-[9px] text-muted-foreground">١٢ مقال · ٢٣ متابع · ★ ٥.٠ · الرياض</p>
            </div>
          </div>
          <div className="flex border-t border-border/40">
            {tabs.map((t, i) => (
              <div
                key={t}
                className={cn(
                  "flex-1 py-1.5 text-center text-[9px]",
                  i === 0 ? "border-b border-primary font-medium text-primary" : "text-muted-foreground",
                )}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/40">
        {rows.map((row) => (
          <div key={row.title} className="flex gap-3 py-2.5">
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm", row.bg)}>{row.icon}</div>
            <div>
              <p className="text-xs font-medium text-foreground">{row.title}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{row.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-start pt-2">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          التالي: زوار يتحولون لعملاء
          <span className="text-base">←</span>
        </button>
      </div>
    </div>
  );
}

function StepLeads({ onNext }: StepWithNextProps): ReactElement {
  const inbox = [
    {
      initials: "أ",
      color: "bg-blue-500/10 text-blue-700",
      name: "أحمد المطيري",
      tag: "ساخن",
      tagC: "bg-red-500/10 text-red-700",
      msg: "هل تقدمون خدمات للشركات الناشئة؟",
      time: "٥ د",
      dot: true,
    },
    {
      initials: "س",
      color: "bg-green-500/10 text-green-700",
      name: "سارة الدوسري",
      tag: "مهتم",
      tagC: "bg-amber-500/10 text-amber-700",
      msg: "ما الفرق بين الباقات؟",
      time: "٢ س",
      dot: true,
    },
    {
      initials: "م",
      color: "bg-amber-500/10 text-amber-700",
      name: "منى العجمي",
      tag: "مشترك",
      tagC: "bg-blue-500/10 text-blue-700",
      msg: "سأتواصل لاحقاً",
      time: "أمس",
      dot: false,
    },
  ];

  const leads = [
    {
      initials: "أ",
      name: "أحمد المطيري",
      tag: "ساخن",
      tagC: "bg-red-500/10 text-red-700",
      detail: "a.motairi@invest.sa · 0550123456 · WA ✓",
      score: 90,
      bar: "bg-red-600",
    },
    {
      initials: "س",
      name: "سارة الدوسري",
      tag: "مهتم",
      tagC: "bg-amber-500/10 text-amber-700",
      detail: "s.dosari@visionco.sa · WA ✓",
      score: 60,
      bar: "bg-amber-600",
    },
    {
      initials: "م",
      name: "منى العجمي",
      tag: "مشترك",
      tagC: "bg-blue-500/10 text-blue-700",
      detail: "m.ajmi@gulf-retail.com · لا واتساب",
      score: 30,
      bar: "bg-blue-600",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-r-lg border-r-4 border-primary bg-muted/30 px-4 py-3 text-sm leading-relaxed">
        <strong>كل سؤال = فرصة بيع.</strong> الزائر يسأل من المقال مباشرة — اسمه ورقمه يصلك تلقائياً.
      </div>

      <div className="rounded-lg bg-muted/20 p-3">
        <p className="mb-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">صندوق الوارد — من مقالاتك</p>
        <div className="divide-y divide-border/30">
          {inbox.map((item, i) => (
            <div key={i} className="flex items-center gap-2 py-2">
              <div className={cn("h-1.5 w-1.5 shrink-0 rounded-full", item.dot ? "bg-primary" : "bg-muted")} />
              <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-medium", item.color)}>
                {item.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium">{item.name}</span>
                  <span className={cn("rounded px-1 py-0.5 text-[8px]", item.tagC)}>{item.tag}</span>
                </div>
                <p className="truncate text-[9px] text-muted-foreground">{item.msg}</p>
              </div>
              <span className="shrink-0 text-[9px] text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-muted/20 p-3">
        <p className="mb-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">قاعدة Leads — مصنّفة تلقائياً بالنقاط</p>
        <div className="divide-y divide-border/30">
          {leads.map((lead, i) => (
            <div key={i} className="flex items-center gap-2 py-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-medium text-primary">
                {lead.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium">{lead.name}</span>
                  <span className={cn("rounded px-1 py-0.5 text-[8px]", lead.tagC)}>{lead.tag}</span>
                </div>
                <p className="truncate text-[9px] text-muted-foreground">{lead.detail}</p>
                <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", lead.bar)} style={{ width: `${lead.score}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-start pt-2">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          التالي: تشوف كل شيء في لوحتك
          <span className="text-base">←</span>
        </button>
      </div>
    </div>
  );
}

function StepDashboard(): ReactElement {
  const stats = [
    { n: "١٢", l: "مقال منشور", c: "text-primary" },
    { n: "+٣٨٠٪", l: "نمو الزيارات", c: "text-emerald-500" },
    { n: "٢٤", l: "lead جديد", c: "text-amber-500" },
    { n: "٦", l: "ساخن الآن", c: "text-red-500" },
  ];

  const sources = [
    { label: "جوجل", pct: 62, color: "bg-primary" },
    { label: "سوشيال", pct: 23, color: "bg-emerald-500" },
    { label: "مباشر", pct: 15, color: "bg-amber-500" },
  ];

  const events = [
    { icon: "👁", label: "مشاهدات المقالات" },
    { icon: "❤️", label: "إعجابات وتعليقات" },
    { icon: "⏱️", label: "وقت البقاء" },
    { icon: "📍", label: "عمق التمرير" },
    { icon: "🎯", label: "تصنيف Leads" },
    { icon: "📊", label: "+١٥ حدث آخر" },
  ];

  const barHeights = [35, 50, 45, 72, 85, 100];

  return (
    <div className="space-y-3">
      <div className="rounded-r-lg border-r-4 border-primary bg-muted/30 px-4 py-3 text-sm leading-relaxed">
        <strong>بيانات حقيقية متحققة.</strong> ٢٠+ حدث مُتتبَّع — متحقق منه عبر Google Tag Manager.
      </div>

      <span className="inline-block rounded border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] text-blue-700">
        ✓ Google Tag Manager — بيانات حقيقية لا تقديرات
      </span>

      <div className="grid grid-cols-4 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="rounded-lg bg-muted/30 p-2 text-center">
            <div className={cn("text-sm font-medium", s.c)}>{s.n}</div>
            <div className="mt-0.5 text-[9px] text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-muted/20 p-2">
          <p className="mb-2 text-[9px] font-medium">أداء المقالات — ٦ أشهر</p>
          <div className="flex h-8 items-end gap-0.5 rounded bg-card px-1">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-primary"
                style={{ height: `${h}%`, opacity: 0.4 + i * 0.12 }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-muted/20 p-2">
          <p className="mb-2 text-[9px] font-medium">مصادر الزيارات</p>
          {sources.map((s, i) => (
            <div key={i} className="mb-1 flex items-center gap-1 text-[9px]">
              <span className="w-10 text-muted-foreground">{s.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", s.color)} style={{ width: `${s.pct}%` }} />
              </div>
              <span className="w-5 text-left font-medium text-foreground">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {events.map((ev, i) => (
          <div key={i} className="rounded-lg bg-muted/20 p-2 text-center">
            <div className="mb-1 text-sm">{ev.icon}</div>
            <div className="text-[9px] leading-tight text-muted-foreground">{ev.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
