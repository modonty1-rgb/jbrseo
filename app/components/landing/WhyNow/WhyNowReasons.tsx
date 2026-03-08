type Reason = { icon: string; title: string; body: string };

export function WhyNowReasons({ reasons }: { reasons: readonly Reason[] }) {
  return (
    <div className="flex flex-col gap-4">
      {reasons.map((r, i) => (
        <div
          key={i}
          className="flex items-start gap-3.5 rounded-[14px] border border-border bg-card px-4 py-3.5 transition-all duration-200 hover:border-accent/35 hover:-translate-x-0.5"
          style={{ animation: `fadeUp .4s ${i * 0.1}s ease both`, opacity: 0 }}
        >
          <span className="mt-0.5 shrink-0 text-[22px]">{r.icon}</span>
          <div>
            <p className="mb-0.5 text-[14px] font-black text-foreground">{r.title}</p>
            <p className="text-[13px] leading-[1.65] text-muted-foreground">{r.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
