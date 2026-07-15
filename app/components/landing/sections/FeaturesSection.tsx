import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  Store,
  Settings2,
  CheckCircle2,
  TrendingUp,
  Newspaper,
  Share2,
  Globe,
  CalendarClock,
  PhoneCall,
  Images,
  Star,
  MapPin,
} from "lucide-react";

/** Features / platform system. Static. No state, server-ready. */
export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-t-[var(--border)] bg-card">
        <div className="max-w-270 mx-auto px-7 py-8 md:py-14">
          <div className="text-center mb-5 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
              <span>منصة سعودية ١٠٠٪</span>
            </div>
            <h2 className="text-balance text-[clamp(20px,5.6vw,34px)] font-semibold tracking-[-1px] mb-3">
              نبني <span className="text-success">حضورك</span> — لا نبيع وعود
            </h2>
            <p className="hidden md:block text-[14.5px] text-muted-foreground max-w-145 mx-auto leading-[1.7]">
              حضور على منصة مدونتي + سوشال ميديا + موقعك (في الباقات الأعلى) —
              أرقام حقيقية من جوجل، لا شعارات.
            </p>
          </div>

          {/* 3-step horizontal grid — clear "who does what" story */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-5 mb-5 md:mb-8">
            {([
              {
                num: "٠١",
                title: "إحنا نجهّز كل شي",
                icon: Settings2,
                desc: "فريق محترف يشتغل ورا الكواليس: بحث كلمات مفتاحية · استراتيجية محتوى · كتابة متخصصة · تصميم صور · تحسين لجوجل — جاهز في لوحتك، بانتظار موافقتك للنشر على منصة مدونتي.",
              },
              {
                num: "٠٢",
                title: "أنت توافق بضغطة",
                icon: CheckCircle2,
                desc: "كل مقال يظهر في لوحتك قبل النشر. اعتمد، عدّل، أو ارفض — ما يُنشر شي على منصة مدونتي بدون إذنك. تحكّم كامل بلا صداع.",
              },
              {
                num: "٠٣",
                title: "العملاء يجونك من جوجل",
                icon: TrendingUp,
                desc: "زوّار حقيقيون يبحثون في جوجل عن خدمتك ويلاقونك — بلا إعلانات، بلا مطاردة. المقالات تنمو شهرياً وتجيب لك عملاء للأبد.",
              },
            ] as const).map((step, i) => (
              <div
                key={i}
                className="group relative rounded-xl md:rounded-2xl border border-border bg-background px-3 py-2.5 md:p-6 flex flex-row md:flex-col items-center md:items-stretch gap-2.5 md:gap-0 hover:border-success/40 hover:shadow-[0_20px_40px_-24px_color-mix(in_oklch,var(--success)_35%,transparent)] transition-all"
              >
                <div className="flex items-start justify-between md:mb-4 shrink-0">
                  <div className="w-7 h-7 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-success/10 flex items-center justify-center text-success">
                    <step.icon className="w-3.5 h-3.5 md:w-6 md:h-6" strokeWidth={2.2} aria-hidden />
                  </div>
                  <span className="hidden md:block font-mono text-[13px] text-muted-foreground tracking-[.5px] pt-1">{step.num}</span>
                </div>
                <h3 className="text-[13px] md:text-[19px] font-medium md:font-semibold text-foreground tracking-[-.3px] md:mb-2 flex-1 md:flex-none min-w-0">
                  {step.title}
                </h3>
                <p className="hidden md:block text-[13.5px] text-muted-foreground leading-[1.75] flex-1">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          {/* — end 3-step story — */}

          {/* Multi-channel distribution — the hook that pulls the customer */}
          <div className="mb-8 rounded-2xl border border-success/30 bg-gradient-to-br from-success/[0.07] to-transparent px-5 py-5">
            <div>
              <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-success font-bold tracking-[1.5px] mb-4">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
                <span>حضور رقمي كامل — بباقة واحدة</span>
              </div>
              <ul className="max-w-110 mx-auto space-y-2 mb-3">
                {[
                  {
                    icon: Newspaper,
                    name: "مقالاتك على منصة مدونتي",
                    desc: "مدوّنة عامة يقرأها عملاء كل المنصة",
                    tag: "مشمول",
                    variant: "included" as const,
                  },
                  {
                    icon: Share2,
                    name: "محتواك على سوشال مدونتي",
                    desc: "توزيع تلقائي على حسابات المنصة",
                    tag: "مشمول",
                    variant: "included" as const,
                  },
                  {
                    icon: Globe,
                    name: "ننشر على موقعك أنت",
                    desc: "نشر مباشر على دومينك الخاص",
                    tag: "الباقات الأعلى",
                    variant: "premium" as const,
                  },
                ].map((row, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center gap-2 md:gap-3 border-0 md:border rounded-none md:rounded-xl px-0 md:px-3 py-1.5 md:py-2.5",
                      row.variant === "premium"
                        ? "md:bg-success/[.06] md:border-success/40"
                        : "md:bg-card md:border-border",
                    )}
                  >
                    {/* Mobile: plain bullet dot. Desktop: icon chip. */}
                    <span className="md:hidden w-1.5 h-1.5 rounded-full bg-success shrink-0" aria-hidden />
                    <span
                      className={cn(
                        "shrink-0 hidden md:inline-flex items-center justify-center w-8 h-8 rounded-lg",
                        row.variant === "premium" ? "bg-success/15 text-success" : "bg-success/10 text-success",
                      )}
                    >
                      <row.icon className="w-4 h-4" strokeWidth={2.2} aria-hidden />
                    </span>
                    <div className="flex-1 min-w-0 text-right">
                      <div className="text-[13px] font-medium md:font-semibold text-foreground leading-tight truncate">{row.name}</div>
                      <div className="hidden md:block text-[11px] text-muted-foreground mt-0.5 leading-tight">{row.desc}</div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-[10px] font-mono font-bold px-2 py-1 rounded-full whitespace-nowrap",
                        row.variant === "premium"
                          ? "bg-success text-success-foreground"
                          : "hidden md:inline-flex bg-muted text-muted-foreground",
                      )}
                    >
                      {row.tag}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-center text-[12px] text-muted-foreground leading-[1.6] max-w-125 mx-auto">
                حضور رقمي على عدة قنوات — العميل يلاقيك من أكثر من مكان، وأنت تشتغل باقة واحدة.
              </p>
            </div>
          </div>

          {/* Dashboard — standalone card (Khalid 2026-07-15): it's not a
              publishing channel, it's the control room. */}
          <div className="mb-5 md:mb-8 rounded-2xl border border-border bg-background p-4 md:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-xl bg-success/15 text-success">
                <LayoutDashboard className="w-4.5 h-4.5 md:w-6 md:h-6" strokeWidth={2} aria-hidden />
              </span>
              <h3 className="text-[15px] md:text-[20px] font-semibold text-foreground tracking-[-.3px] leading-tight">
                لوحة تحكم <span className="text-success">خاصة فيك</span>
              </h3>
            </div>
            <ul className="space-y-1.5 md:space-y-2">
              {[
                "تتابع كل خطوة وكل اللي يصير في مقالاتك",
                "تقارير أداء حقيقية من جوجل",
                "اعتماد أو تعديل أي مقال بضغطة",
                "حملات إيميل تسويقية لعملائك",
              ].map((line, i) => (
                <li key={i} className="flex items-center gap-2 text-[13px] md:text-[13.5px] text-foreground leading-[1.6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Profile hook — collapse on mobile (closed = header line;
              open = pills + CTA), always fully visible on desktop. */}
          <details className="group mt-6 md:mt-10 mb-5 md:mb-8 rounded-2xl border-2 border-success/40 bg-gradient-to-br from-success/[.10] to-success/[.02] p-5 md:p-6 md:shadow-[0_24px_50px_-30px_color-mix(in_oklch,var(--success)_50%,transparent)] relative">
            <span className="absolute -top-3 right-5 bg-success text-success-foreground text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[.5px] shadow-sm inline-flex items-center gap-1 z-10">
              <Sparkles className="w-3 h-3" strokeWidth={2.5} aria-hidden />
              بونس
            </span>

            <summary className="cursor-pointer md:cursor-default list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <span className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-success/15 text-success">
                  <Store className="w-6 h-6" strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10.5px] text-success font-bold tracking-[1.5px] uppercase">Business Profile</div>
                  <h3 className="text-[15.5px] md:text-[22px] font-semibold text-foreground leading-tight tracking-[-.3px]">
                    صفحة عمل رسمية <span className="text-success">جاهزة من اليوم الأول</span>
                  </h3>
                </div>
                <ChevronDown className="md:hidden w-4 h-4 text-success shrink-0 animate-bounce group-open:animate-none group-open:rotate-180" strokeWidth={2.5} aria-hidden />
              </div>
            </summary>

            <div className="hidden group-open:block md:block mt-3 md:mt-0">
            <p className="hidden md:block text-[13px] text-muted-foreground leading-[1.7] mb-4 md:pr-13.5">
              مو بس مقالات — عندك <span className="text-foreground font-semibold">صفحة كاملة لنشاطك</span> على منصة مدونتي: بيانات، حجوزات، معرض، تقييمات — كل شي محضّر ومربوط بجوجل.
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2 mb-4">
              {[
                { icon: CalendarClock, label: "حجز مواعيد" },
                { icon: PhoneCall, label: "اتصال + واتساب" },
                { icon: Images, label: "معرض أعمال" },
                { icon: Star, label: "تقييمات العملاء" },
                { icon: MapPin, label: "موقعك على الخريطة" },
                { icon: Sparkles, label: "+١٥ خاصية أخرى" },
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2 rounded-lg bg-card/60 border border-border/60 px-2.5 py-2">
                  <f.icon className="w-3.5 h-3.5 text-success shrink-0" strokeWidth={2} aria-hidden />
                  <span className="text-[12px] text-foreground font-medium truncate">{f.label}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://www.modonty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-success text-success-foreground hover:bg-success/90 transition-colors px-4 py-2.5 rounded-xl text-[13px] font-semibold no-underline"
            >
              <span>شوف صفحة عميل حقيقي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
            </div>
          </details>

          {/* Exit CTA to full features page */}
          <div className="text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors px-5 py-2.5 rounded-xl text-[14px] font-semibold no-underline md:shadow-[0_16px_36px_-14px_color-mix(in_oklch,var(--foreground)_50%,transparent)]"
            >
              <span>شوف كل تفاصيل المنظومة</span>
              <span aria-hidden>←</span>
            </Link>
            <p className="mt-2 text-[12px] text-muted-foreground">
              منظومة متكاملة · جودة + تنبيهات + تقارير
            </p>
          </div>
        </div>
      </section>
  );
}
