"use client";

import type { ReactElement } from "react";
import type { Testimonial } from "@/app/content/landing/types";
import { Avatar } from "@/app/components/Avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { cn } from "@/lib/utils";

type SocialProofTabsProps = {
  testimonials: readonly Testimonial[];
  active: number;
  onSelect: (i: number) => void;
};

const triggerClass =
  "group relative flex h-auto w-full flex-1 flex-col items-stretch justify-start gap-0 rounded-[14px] border border-border bg-card p-0 text-start shadow-none transition-all duration-200 lg:w-full " +
  "data-[state=active]:border-[color-mix(in_oklch,var(--accent)_40%,transparent)] " +
  "data-[state=active]:shadow-[0_4px_20px_color-mix(in_oklch,var(--accent)_10%,transparent)] " +
  "data-[state=active]:bg-[linear-gradient(135deg,color-mix(in_oklch,var(--accent)_5%,transparent),transparent)]";

export function SocialProofTabs({ testimonials, active, onSelect }: SocialProofTabsProps): ReactElement {
  return (
    <Tabs
      value={String(active)}
      onValueChange={(v) => onSelect(Number(v))}
      className="flex w-full flex-row gap-2 lg:flex-col lg:gap-2.5"
    >
      <TabsList className="flex h-auto w-full flex-row gap-2 bg-transparent p-0 lg:flex-col lg:gap-2.5">
        {testimonials.map((t, i) => (
          <TabsTrigger key={i} value={String(i)} className={triggerClass}>
            <span className="relative flex w-full items-center gap-2 px-3 py-3 lg:gap-3 lg:px-4 lg:py-3.5">
              <div
                className={cn(
                  "shrink-0 rounded-full border-2 transition-colors duration-200",
                  active === i ? "border-[color-mix(in_oklch,var(--accent)_40%,transparent)]" : "border-transparent",
                )}
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
                className="absolute bottom-0 end-0 top-0 w-[3px] rounded-full bg-accent opacity-0 transition-opacity duration-200 group-data-[state=active]:opacity-100"
              />
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {testimonials.map((_, i) => (
        <TabsContent key={i} value={String(i)} className="hidden" tabIndex={-1} aria-hidden />
      ))}
    </Tabs>
  );
}
