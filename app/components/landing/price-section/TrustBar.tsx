import type { TrustItem } from "@/app/content/landing/price-section-types";
import { Icon } from "@/app/components/Icon";
import { Card } from "@/app/components/ui/card";

interface TrustBarProps {
  items: TrustItem[];
  title: string;
}

export function TrustBar({ items, title }: TrustBarProps) {
  const colCount = items.length;
  return (
    <Card className="mb-14 flex flex-col items-center rounded-2xl border border-border bg-background px-8 py-7 shadow-sm">
      <p className="text-center text-xs font-bold text-muted-foreground tracking-widest uppercase mb-5">{title}</p>
      <div
        className="w-full grid gap-2.5 grid-cols-[repeat(var(--trust-cols),minmax(0,1fr))] max-sm:grid-cols-2"
        style={{ "--trust-cols": colCount } as React.CSSProperties}
      >
        {items.map(({ icon, label }, i) => (
          <Card
            key={`${label}-${i}`}
            className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-muted px-3 py-4 text-center text-xs font-bold text-muted-foreground shadow-none"
          >
            <Icon emoji={icon} className="w-6 h-6 mb-1" />
            <span>{label}</span>
          </Card>
        ))}
      </div>
    </Card>
  );
}
