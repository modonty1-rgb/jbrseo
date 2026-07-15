import { ShieldCheck } from "lucide-react";

/** Activity-based refund pledge. Desktop-only. Static. No state, server-ready. */
export function GuaranteeSection() {
  return (
    <section
        className="hidden md:block bg-card border-t border-t-border border-b border-b-border"
      >
        <div className="max-w-230 mx-auto px-7 py-14">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-success/15 flex items-center justify-center mx-auto md:mx-0">
              <ShieldCheck className="w-9 h-9 md:w-11 md:h-11 text-success" strokeWidth={2} aria-hidden />
            </div>
            <div className="flex-1 text-center md:text-right w-full">
              <div className="font-mono text-[11px] text-success tracking-[1px] mb-2">تعهّدنا لك</div>
              <h3 className="text-[22px] md:text-[26px] font-semibold text-foreground tracking-[-.5px] leading-[1.35] mb-4">
                نضمن <span className="text-success">الجهد والشفافية</span> — تشوف الأثر بعينك في لوحتك
              </h3>
              <ul className="space-y-2.5 text-[14.5px] text-foreground leading-[1.7] mb-4 md:pr-1 list-none">
                {[
                  { k: "الالتزام بالنشر", v: "عدد مقالاتك الشهرية تُنشر بموعدها — بلا استثناء" },
                  { k: "معيار الجودة", v: "٢٨ فحصاً تلقائياً على كل مقال قبل النشر" },
                  { k: "الشفافية", v: "تقرير GA4 مباشر من لوحتك — أرقام حقيقية موثّقة من جوجل" },
                  { k: "الاستجابة", v: "على أي استفسار خلال ٢٤ ساعة كحد أقصى" },
                ].map((row, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 mt-1">
                      <path d="M5 12.5l5 5L20 7" />
                    </svg>
                    <span><span className="font-semibold text-foreground">{row.k}:</span> <span className="text-muted-foreground">{row.v}</span></span>
                  </li>
                ))}
              </ul>
              <p className="text-[12.5px] text-muted-foreground mt-3 max-w-140 mx-auto md:mx-0 leading-[1.6]">
                ما نعد بمركز رقم ١ في جوجل — لأن هذا يعتمد على منافسيك وتحديثات جوجل. نضمن اللي نتحكّم فيه ١٠٠٪: النشر · الجودة · التقارير · الاستجابة.
              </p>
            </div>
          </div>
        </div>
      </section>
  );
}
