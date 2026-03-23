export function WhyNowTrustPills() {
  return (
    <div className="mx-auto flex max-w-[960px] flex-wrap justify-center gap-2">
      {["🔒 بياناتك ملكك دائماً", "💬 دعم عربي ١٠٠٪", "↩️ ضمان ١٤ يوم", "⚡ نشر خلال ٧٢ ساعة"].map((p) => (
        <span
          key={p}
          className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[12px] font-bold text-muted-foreground"
        >
          {p}
        </span>
      ))}
    </div>
  );
}

