import type { TrustItem } from "@/app/content/landing/price-section-types";

interface TrustBarProps {
  items: TrustItem[];
  title: string;
}

export function TrustBar({ items, title }: TrustBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-8 py-7 mb-14 shadow-sm">
      <p className="text-center text-xs font-bold text-gray-300 tracking-widest uppercase mb-5">{title}</p>
      <div className="grid grid-cols-5 gap-2.5 max-sm:grid-cols-2">
        {items.map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 py-4 px-3 bg-stone-50 border border-gray-200 rounded-2xl text-center text-xs font-bold text-gray-500">
            <span className="text-2xl">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
