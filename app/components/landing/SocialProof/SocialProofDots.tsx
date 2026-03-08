"use client";

type SocialProofDotsProps = {
  count: number;
  active: number;
  onSelect: (i: number) => void;
};

export function SocialProofDots({ count, active, onSelect }: SocialProofDotsProps) {
  return (
    <div className="mb-10 flex justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`شهادة ${i + 1}`}
          className="h-2 rounded-full border-none transition-all duration-200"
          style={{
            width: active === i ? 22 : 8,
            background: active === i ? "var(--accent)" : "var(--border)",
            cursor: "pointer",
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}
