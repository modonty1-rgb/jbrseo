import type { ReactNode } from "react";

type WhyNowSavingsBandProps = {
  saveM: number;
  saveY: number;
  pct: number;
};

function fmt(n: number): string {
  return n.toLocaleString("ar-SA");
}

export function WhyNowSavingsBand({ saveM, saveY, pct }: WhyNowSavingsBandProps): ReactNode {
  const clampedPct = Math.max(0, Math.min(pct, 100));

  return (
    <div className="relative mx-auto mb-4 max-w-[960px] overflow-hidden rounded-[22px] bg-linear-to-br from-secondary/90 via-secondary to-secondary/90 px-6 py-10 text-center shadow-2xl">
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[.12em] text-white/40">توفيرك الفعلي مع مدونتي</p>

      <div className="mb-5 flex flex-wrap justify-center gap-0">
        <div className="text-center">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[.09em] text-white/40">شهرياً</p>
          <p className="text-[30px] font-bold leading-none text-violet-200 md:text-[40px] lg:text-[52px]">
            {fmt(saveM)} ريال
          </p>
        </div>
        <div className="mx-5 h-full w-px self-stretch bg-white/20" />
        <div className="text-center">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[.09em] text-white/40">سنوياً</p>
          <p className="text-[30px] font-bold leading-none text-emerald-300 md:text-[40px] lg:text-[52px]">
            {fmt(saveY)} ريال
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-[12px] text-white/40">نسبة التوفير مقارنةً بتوظيف فريق لنفس المهام</p>
        <div className="mx-auto h-2 w-60 overflow-hidden rounded-full bg-white/10">
          <svg className="h-full w-full" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width={clampedPct} height="2" rx="1" fill="url(#savingsGradient)" />
          </svg>
        </div>
        <p className="mt-2 text-[26px] font-black text-emerald-300">{pct}%</p>
      </div>

      <button className="mb-3 inline-flex items-center gap-2 rounded-[14px] bg-background px-7 py-3.5 text-[15px] font-extrabold text-accent shadow-lg">
        وفّر هذا الرقم ابتداءً من اليوم ←
      </button>
      <br />
      <p className="text-[12px] text-white/40">أول ١٤ يوم مجاناً · بدون بطاقة بنكية · إلغاء في أي وقت</p>
    </div>
  );
}

