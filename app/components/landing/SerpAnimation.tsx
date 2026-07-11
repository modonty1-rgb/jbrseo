"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SERP_QUERIES = [
  "شركة مقاولات بالرياض",
  "عيادة أسنان بجدة",
  "متجر قهوة مختصة",
  "مكتب محاماة بالقاهرة",
];

const SERP_ROWS = {
  ad: { title: "منافس أعلى أداءً — موقعك في الخلف", url: "competitor-ads.com", ad: true },
  c2: { title: "دليل خدمات بدون تحديث منذ سنتين", url: "old-directory.net", ad: false },
  c3: { title: "مدوّنة عامة بدون أمثلة محلية", url: "generic-blog.com", ad: false },
  c4: { title: "صفحة ويكيبيديا للتعريف العام", url: "reference-site.org", ad: false },
  c5: { title: "منافس متخصص في خدمة مجاورة", url: "side-competitor.net", ad: false },
  you: { title: "نشاطك التجاري — حل عملائك الأول", url: "your-business.com", isYou: true, ad: false },
} as const;

type SerpKey = keyof typeof SERP_ROWS;
const INITIAL_ORDER: SerpKey[] = ["ad", "c2", "c3", "c4", "c5", "you"];
const ROW_H = 62;

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;
function toArabicDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

// StrictMode-safe SERP animation. Extracted from Landing so it's easy to
// re-enable later without touching the parent page. Not rendered anywhere
// currently — see Landing.tsx.
export function SerpAnimation() {
  const [queryIdx, setQueryIdx] = useState(0);
  const [order, setOrder] = useState<SerpKey[]>(INITIAL_ORDER);
  const orderRef = useRef<SerpKey[]>(INITIAL_ORDER);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function tick() {
      if (cancelled) return;
      const current = orderRef.current;
      const youIdx = current.indexOf("you");

      if (youIdx === 0) {
        timer = setTimeout(() => {
          if (cancelled) return;
          orderRef.current = INITIAL_ORDER;
          setOrder(INITIAL_ORDER);
          setQueryIdx((q) => (q + 1) % SERP_QUERIES.length);
          timer = setTimeout(tick, 900);
        }, 2800);
        return;
      }

      const next = current.slice();
      const tmp = next[youIdx - 1];
      next[youIdx - 1] = "you";
      next[youIdx] = tmp;
      orderRef.current = next;
      setOrder(next);

      timer = setTimeout(tick, 820);
    }

    timer = setTimeout(tick, 900);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <section className="max-w-[640px] mx-auto pt-[34px] px-[18px] pb-5">
      <div className="prev-serp-card bg-card border border-border rounded-[20px] shadow-[0_30px_60px_-36px_color-mix(in oklch, var(--foreground) 28%, transparent)] overflow-hidden">
        <div className="flex items-center gap-3 px-[22px] py-[18px] border-b border-b-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
          <div className="text-[15px] text-foreground flex-1 font-normal">
            {SERP_QUERIES[queryIdx]}
            <span className="inline-block w-[1.5px] h-4 bg-foreground align-[-3px] mr-0.5 animate-[prev-caret_1s_step-end_infinite]" />
          </div>
          <div data-st className="font-mono text-[11px] text-muted-foreground">بحث جوجل</div>
        </div>
        <div className="relative h-96 px-[14px] py-2.5 bg-card">
          {order.map((key, idx) => {
            const r = SERP_ROWS[key];
            const isYou = "isYou" in r && r.isYou;
            const won = isYou && idx === 0;
            const rising = isYou && idx > 0 && idx < 3;
            const youAboveAd = order.indexOf("you") < order.indexOf("ad");
            const showAd = "ad" in r && r.ad && !youAboveAd;

            const rankClass = cn(
              "w-[30px] h-[30px] rounded-lg flex items-center justify-center font-mono text-[13px] font-semibold shrink-0",
              won ? "bg-success text-success-foreground" : isYou ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
            );

            const titleClass = cn(
              "text-sm",
              isYou ? "font-semibold text-foreground" : idx < 2 ? "font-medium text-muted-foreground" : "font-medium text-muted-foreground",
            );

            const urlColorClass = isYou ? "text-success" : "text-muted-foreground";

            return (
              <div key={key} className={`prev-serp-row${isYou ? " you" : ""}${won ? " won" : ""}`} style={{ top: idx * ROW_H + 6 }}>
                <div className="flex items-center gap-3 h-full">
                  <div className={cn("prev-serp-rank", rankClass)}>#{toArabicDigits(idx + 1)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="prev-serp-titlebar flex items-center gap-[7px] flex-wrap min-w-0">
                      <span className={cn("prev-serp-title", titleClass)}>{r.title}</span>
                      {showAd && (
                        <span data-st className="text-[10px] font-semibold text-destructive bg-destructive/10 px-1.5 py-px rounded-[5px] font-mono">إعلان</span>
                      )}
                      {isYou && (
                        <span className="prev-serp-you-badge text-[11px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-md">موقعك</span>
                      )}
                    </div>
                    <div data-st className={cn("prev-serp-url font-mono text-[11.5px] mt-[3px] whitespace-nowrap overflow-hidden text-ellipsis", urlColorClass)}>{r.url}</div>
                  </div>
                  {won && (
                    <div data-st className="text-success text-[13px] font-semibold whitespace-nowrap animate-[prev-pop_.4s_ease_both]">المركز الأول ✓</div>
                  )}
                  {rising && (
                    <div data-st className="flex items-center gap-1 text-success text-[12px] font-semibold font-mono animate-[prev-up_1s_ease-in-out_infinite]">▲ يصعد</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div data-st className="text-center text-[13px] text-muted-foreground mt-4">
        من الصفحة الخامسة إلى الصفحة الأولى — هذا اللي نسوّيه لموقعك.
      </div>
    </section>
  );
}
