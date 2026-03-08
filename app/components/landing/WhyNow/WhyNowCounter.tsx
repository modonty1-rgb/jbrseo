type Props = { days: number };

export function WhyNowCounter({ days }: Props) {
  return (
    <div
      className="rounded-[20px] px-6 py-7 text-center text-white"
      style={{
        background:  "linear-gradient(135deg, var(--primary), color-mix(in oklch, var(--primary) 85%, black))",
        boxShadow:   "0 16px 48px color-mix(in oklch, var(--primary) 25%, transparent)",
      }}
    >
      <p className="mb-2 text-[12px] font-bold uppercase tracking-[.06em] opacity-70">
        متوسط التأخير قبل البدء بالمحتوى
      </p>
      <div className="flex items-end justify-center gap-1.5">
        <span
          className="font-black leading-none tracking-[-0.04em]"
          style={{
            fontSize: "clamp(56px, 8vw, 72px)",
            animation: "tick 1s ease-in-out infinite",
          }}
        >
          {days}
        </span>
        <span className="pb-3.5 text-[22px] font-black opacity-70">يوم</span>
      </div>
      <p className="mt-1.5 text-[13px] opacity-65">
        بناءً على تجربتنا مع أكثر من ٢٠٠ نشاط تجاري في السعودية ومصر
      </p>
      <span
        className="mt-3.5 inline-block rounded-full px-3.5 py-1.5 text-[11px] font-bold"
        style={{ background: "color-mix(in oklch, white 12%, transparent)" }}
      >
        ⚠ كل يوم تنتظر = يوم يتقدم فيه منافسك
      </span>
    </div>
  );
}
