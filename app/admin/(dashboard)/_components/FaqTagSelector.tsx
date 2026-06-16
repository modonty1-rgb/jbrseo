"use client";

import { useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

const FAQ_TAGS = ["النتائج", "الخدمة", "الاشتراك", "التسعير", "الخطة", "لمن؟"] as const;

function isPresetTag(v: string): boolean {
  return (FAQ_TAGS as readonly string[]).includes(v);
}

type FaqTagSelectorProps = {
  name: string;
  defaultValue: string;
};

export function FaqTagSelector({ name, defaultValue }: FaqTagSelectorProps): ReactElement {
  const [val, setVal] = useState(() => defaultValue.trim());
  const preset = isPresetTag(val);

  return (
    <div className="flex flex-wrap items-center gap-1">
      <input type="hidden" name={name} value={val} readOnly aria-hidden />
      {FAQ_TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => setVal(tag)}
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
            val === tag
              ? "border-primary/40 bg-primary/20 text-primary"
              : "border-border text-muted-foreground hover:bg-muted/50",
          )}
        >
          {tag}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setVal("")}
        className={cn(
          "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
          !preset
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:bg-muted/50",
        )}
      >
        مخصص
      </button>
      {!preset && (
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="min-w-22 max-w-40 rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="وسم مخصص"
          aria-label="وسم مخصص"
        />
      )}
    </div>
  );
}
