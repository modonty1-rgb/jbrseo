"use client";

import { useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

const LEVELS = [
  { value: "1", label: "خفيف", active: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
  { value: "2", label: "متوسط", active: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
  { value: "3", label: "حرج", active: "bg-red-500/20 text-red-400 border-red-500/40" },
] as const;

function normalizeSeverity(raw: string | number | undefined): string {
  const s = String(raw ?? "1").trim();
  if (s === "1" || s === "2" || s === "3") return s;
  return "1";
}

type SeverityToggleProps = {
  name: string;
  defaultValue: string | number | undefined;
};

export function SeverityToggle({ name, defaultValue }: SeverityToggleProps): ReactElement {
  const [val, setVal] = useState(() => normalizeSeverity(defaultValue));

  return (
    <div className="flex flex-wrap items-center gap-1">
      <input type="hidden" name={name} value={val} />
      {LEVELS.map((l) => (
        <button
          key={l.value}
          type="button"
          onClick={() => setVal(l.value)}
          className={cn(
            "rounded border px-2 py-0.5 text-[10px] font-medium transition-colors",
            val === l.value
              ? l.active
              : "border-border text-muted-foreground hover:bg-muted/50",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
