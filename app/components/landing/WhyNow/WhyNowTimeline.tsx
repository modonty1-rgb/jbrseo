type Cost = {
  month: string;
  label: string;
  desc: string;
  value: string;
  icon: string;
  severity: number;
};

type Props = {
  costs: readonly Cost[];
  active: number;
  onSelect: (i: number) => void;
};

export function WhyNowTimeline({ costs, active, onSelect }: Props) {
  return (
    <div className="flex flex-col">
      {costs.map((item, i) => (
        <div
          key={i}
          className="flex gap-4 cursor-pointer py-1 group"
          onClick={() => onSelect(i)}
        >
          <div className="flex flex-col items-center shrink-0">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-base transition-all duration-250 shrink-0 relative z-10"
              style={{
                borderColor:   active === i ? "var(--accent)" : "var(--border)",
                background:    active === i ? "color-mix(in oklch, var(--accent) 8%, var(--background))" : "var(--background)",
                boxShadow:     active === i ? "0 0 0 4px color-mix(in oklch, var(--accent) 15%, transparent)" : "none",
              }}
            >
              {item.icon}
            </div>
            {i < costs.length - 1 && (
              <div
                className="w-[2px] flex-1 min-h-[20px] transition-colors duration-250"
                style={{ background: active === i ? "color-mix(in oklch, var(--accent) 30%, transparent)" : "var(--border)" }}
              />
            )}
          </div>

          <div className="flex-1 pb-6">
            <div className="mb-2 flex items-center gap-2.5">
              <span
                className="text-[11px] font-black uppercase tracking-[.06em] transition-colors duration-200"
                style={{ color: active === i ? "var(--accent)" : "var(--muted-foreground)" }}
              >
                {item.month}
              </span>
              <div className="flex gap-[3px]">
                {[1, 2, 3].map(n => (
                  <span
                    key={n}
                    className="h-[6px] w-[6px] rounded-full transition-colors duration-200"
                    style={{
                      background: n <= item.severity ? "var(--accent)" : "var(--border)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              className="overflow-hidden rounded-[14px] border p-4 transition-all duration-250"
              style={{
                borderColor: active === i ? "color-mix(in oklch, var(--accent) 35%, transparent)" : "var(--border)",
                boxShadow:   active === i ? "0 6px 24px color-mix(in oklch, var(--accent) 10%, transparent)" : "none",
                background:  "var(--background)",
              }}
            >
              <p className="mb-1.5 text-[15px] font-black text-foreground">{item.label}</p>

              {active === i && (
                <p
                  className="text-[13.5px] leading-[1.72] text-muted-foreground"
                  style={{ animation: "slide-in .3s ease both" }}
                >
                  {item.desc}
                </p>
              )}

              {active === i && (
                <span
                  className="mt-2.5 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black"
                  style={{
                    background: "color-mix(in oklch, var(--accent) 10%, var(--background))",
                    border:     "1px solid color-mix(in oklch, var(--accent) 20%, transparent)",
                    color:      "var(--accent)",
                  }}
                >
                  📉 {item.value}
                </span>
              )}

              {active === i && (
                <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-border">
                  <div
                    key={`bar-${active}`}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(to left, var(--accent), color-mix(in oklch, var(--accent) 50%, transparent))",
                      animation:  "grow-bar 3.2s linear both",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
