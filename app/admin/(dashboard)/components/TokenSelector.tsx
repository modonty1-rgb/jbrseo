"use client";

import { useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

const TOKENS = [
  { value: "accent", label: "أزرق", active: "bg-blue-500/20 text-blue-400 border-blue-500/40" },
  { value: "success", label: "أخضر", active: "bg-green-500/20 text-green-400 border-green-500/40" },
  { value: "destructive", label: "أحمر", active: "bg-red-500/20 text-red-400 border-red-500/40" },
] as const;

function normalizeToken(raw: string | undefined): string {
  const t = (raw ?? "accent").trim();
  if (t === "accent" || t === "success" || t === "destructive") return t;
  return "accent";
}

type TokenSelectorProps = {
  name: string;
  defaultValue: string | undefined;
};

export function TokenSelector({ name, defaultValue }: TokenSelectorProps): ReactElement {
  const [val, setVal] = useState(() => normalizeToken(defaultValue));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <input type="hidden" name={name} value={val} />
      {TOKENS.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => setVal(t.value)}
          className={cn(
            "rounded border px-2.5 py-1 text-xs font-medium transition-colors",
            val === t.value ? t.active : "border-border text-muted-foreground hover:bg-muted/50",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
