"use client";

import type { Testimonial } from "@/app/content/landing/types";
import { Avatar } from "@/app/components/Avatar";

type SocialProofTabsProps = {
  testimonials: readonly Testimonial[];
  active: number;
  onSelect: (i: number) => void;
};

export function SocialProofTabs({ testimonials, active, onSelect }: SocialProofTabsProps) {
  return (
    <div className="flex flex-row gap-2 lg:flex-col lg:gap-2.5">
      {testimonials.map((t, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="group relative flex flex-1 items-center gap-2 rounded-[14px] border border-border bg-card px-3 py-3 text-start transition-all duration-200 lg:w-full lg:gap-3 lg:px-4 lg:py-3.5"
          style={
            active === i
              ? {
                  borderColor: "color-mix(in oklch, var(--accent) 40%, transparent)",
                  boxShadow: "0 4px 20px color-mix(in oklch, var(--accent) 10%, transparent)",
                  background: "linear-gradient(135deg, color-mix(in oklch, var(--accent) 5%, transparent), transparent)",
                }
              : undefined
          }
          aria-pressed={active === i}
        >
          <div
            className="rounded-full border-2 transition-colors duration-200 shrink-0"
            style={{ borderColor: active === i ? "color-mix(in oklch, var(--accent) 40%, transparent)" : "transparent" }}
          >
            <Avatar name={t.name} src={t.avatarImg} size="sm" className="lg:h-10 lg:w-10" />
          </div>
          <div className="min-w-0 hidden sm:block lg:block">
            <p className="truncate text-[12px] font-black text-foreground lg:text-[13px]">{t.name}</p>
            <p className="truncate text-[10px] text-muted-foreground lg:text-[11px]">{t.company}</p>
          </div>
          <div className="min-w-0 block sm:hidden">
            <p className="truncate text-[11px] font-black text-foreground">{t.name.split(" ")[0]}</p>
          </div>
          <span
            aria-hidden
            className="absolute bottom-0 end-0 top-0 w-[3px] rounded-full transition-opacity duration-200"
            style={{ background: "var(--accent)", opacity: active === i ? 1 : 0 }}
          />
        </button>
      ))}
    </div>
  );
}
