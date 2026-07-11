// Placeholder for Stage 3 — will be replaced by N-Genius Hosted Session iframe
// + Cloudflare Turnstile widget. Keeps the visual shape of the checkout form
// so we can validate spacing/hierarchy now.
export function PaymentPlaceholder() {
  return (
    <div className="rounded-xl border border-dashed border-info/40 bg-info/5 p-4">
      <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[2px] text-info">
        منطقة الدفع · N-Genius Hosted Session
      </p>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2.5 text-[12px] text-muted-foreground" dir="ltr">
          <span className="text-[10px] uppercase tracking-wider">Card number</span>
          <span className="font-mono">•••• •••• •••• 4242</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2.5 text-[12px] text-muted-foreground" dir="ltr">
            <span className="text-[10px] uppercase tracking-wider">Expiry</span>
            <span className="font-mono">MM/YY</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2.5 text-[12px] text-muted-foreground" dir="ltr">
            <span className="text-[10px] uppercase tracking-wider">CVV</span>
            <span className="font-mono">•••</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["MADA", "VISA", "MASTERCARD", "APPLE PAY"].map((brand) => (
          <span
            key={brand}
            className="rounded border border-border bg-background/60 px-2 py-0.5 font-mono text-[9.5px] tracking-wider text-muted-foreground"
          >
            {brand}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[10.5px] text-muted-foreground/80">
        سيُستبدل هذا العنصر بـ iframe الدفع الحقيقي في المرحلة ٣ (Cloudflare Turnstile + بيانات البطاقة داخل N-Genius).
      </p>
    </div>
  );
}
