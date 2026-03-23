"use client";

import { Button } from "@/app/components/ui/button";

type SocialProofDotsProps = {
  count: number;
  active: number;
  onSelect: (i: number) => void;
};

export function SocialProofDots({ count, active, onSelect }: SocialProofDotsProps) {
  return (
    <div className="mb-10 flex justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <Button
          key={i}
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSelect(i)}
          aria-label={`شهادة ${i + 1}`}
          className="h-2 min-w-0 shrink-0 rounded-full border-0 p-0 shadow-none transition-all duration-200 hover:bg-transparent"
          style={{
            width: active === i ? 22 : 8,
            background: active === i ? "var(--accent)" : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}
