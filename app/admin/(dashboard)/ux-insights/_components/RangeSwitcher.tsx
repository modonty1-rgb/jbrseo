"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RANGE_OPTIONS } from "../_helpers/format";

/** The one interactive control on the page — swaps the ?days window. */
export function RangeSwitcher({ current }: { current: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const select = (days: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("days", String(days));
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  };

  return (
    <div
      className={`inline-flex rounded-lg border border-border bg-card p-0.5 ${pending ? "opacity-60" : ""}`}
      role="group"
      aria-label="اختيار المدى الزمني"
    >
      {RANGE_OPTIONS.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => select(d)}
          aria-pressed={d === current}
          className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
            d === current
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {d} يوم
        </button>
      ))}
    </div>
  );
}
