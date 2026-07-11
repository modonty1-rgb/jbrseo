import { ShieldCheck } from "lucide-react";

type Props = {
  planName: string;
  planTagline?: string | null;
  totalDisplay: string;   // formatted with currency, e.g. "1,725 ر.س"
  billingLabel: string;   // "سنوي" | "شهري"
};

// Sticky-eligible summary card — right on desktop, top on mobile.
// Rule Q2: no VAT breakdown. Show one total + inclusive-VAT note.
export function CheckoutSummary({ planName, planTagline, totalDisplay, billingLabel }: Props) {
  return (
    <aside className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6">
      <p className="mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[2px] text-muted-foreground">
        باقتك المختارة
      </p>
      <h2 className="mb-1 text-2xl font-black tracking-tight text-foreground">
        {planName}
      </h2>
      {planTagline && (
        <p className="mb-5 text-[13px] leading-relaxed text-muted-foreground">
          {planTagline}
        </p>
      )}

      <div className="rounded-xl border border-border bg-background/60 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-semibold text-foreground">
            الإجمالي · {billingLabel}
          </span>
          <span dir="ltr" className="font-mono text-xl font-black text-success">
            {totalDisplay}
          </span>
        </div>
        <p className="mt-1.5 text-[11.5px] text-muted-foreground">
          السعر شامل ضريبة القيمة المضافة ١٥٪
        </p>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-success/25 bg-success/5 px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
        <div>
          <p className="text-[12.5px] font-semibold text-success">
            استرداد ١٤ يوم مضمون
          </p>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
            إذا لم نلتزم بإعداد حسابك خلال ١٤ يوم، يحق لك الاسترداد الكامل.
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5 text-[12px] text-muted-foreground">
        <li className="flex items-start gap-1.5">
          <span className="mt-0.5 text-success" aria-hidden>✓</span>
          <span>ملكية المحتوى ١٠٠٪ لك</span>
        </li>
        <li className="flex items-start gap-1.5">
          <span className="mt-0.5 text-success" aria-hidden>✓</span>
          <span>دعم عربي حقيقي في توقيتك</span>
        </li>
        <li className="flex items-start gap-1.5">
          <span className="mt-0.5 text-success" aria-hidden>✓</span>
          <span>ترقية مرنة في أي وقت</span>
        </li>
      </ul>
    </aside>
  );
}
