import type { OutcomeItem } from "@/app/content/landing/types";

type OutcomeCardProps = {
  item: OutcomeItem;
  index: number;
};

export function OutcomeCard({ item, index }: OutcomeCardProps) {
  return (
    <div
      className="
        outcomes-card group relative flex flex-col overflow-hidden
        rounded-[22px] border border-border bg-background
        px-[22px] pt-7 pb-6
        shadow-[0_2px_10px_color-mix(in_oklch,var(--foreground)_4%,transparent)]
        transition-all duration-200
        active:scale-[.98]
      "
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-[20px] opacity-60 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: `linear-gradient(to left, var(--${item.token}), transparent)` }}
      />
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] text-[22px] transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3"
        style={{
          background: `color-mix(in oklch, var(--${item.token}) 8%, transparent)`,
          border: `1.5px solid color-mix(in oklch, var(--${item.token}) 28%, transparent)`,
        }}
      >
        {item.icon}
      </div>
      <div
        className="mb-1.5 font-black leading-none tracking-[-0.03em]"
        style={{
          fontSize: 36,
          color: `var(--${item.token})`,
        }}
      >
        {item.metric}
      </div>
      <p className="mb-2.5 text-sm font-black leading-snug text-foreground">
        {item.title}
      </p>
      <div className="mb-3 h-px bg-border transition-colors duration-200" />
      <p className="flex-1 text-[13px] leading-[1.75] text-muted-foreground">
        {item.line}
      </p>
    </div>
  );
}
