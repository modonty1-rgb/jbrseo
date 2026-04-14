"use client";

import { useEffect, useState } from "react";
import Link from "@/app/components/link";
import { saveExitReason } from "@/app/actions/exitReason";

const REASONS = [
  { label: "💰  السعر مرتفع عليّ",          value: "السعر مرتفع عليّ" },
  { label: "🤔  لسه أفكر",                  value: "لسه أفكر" },
  { label: "💬  أبي أتكلم مع أحد أولاً",   value: "أبي أتكلم مع أحد أولاً" },
  { label: "⏰  مش وقتي الحين",             value: "مش وقتي الحين" },
];

type Step = "cta" | "survey" | "thanks";

interface ExitIntentPopupProps {
  ctaLink: string;
  whatsappLink?: string;
  country?: string;
}

export function ExitIntentPopup({ ctaLink, whatsappLink, country = "SA" }: ExitIntentPopupProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("cta");

  useEffect(() => {
    if (sessionStorage.getItem("exit-popup-shown")) return;

    let ready = false;
    const readyTimer = setTimeout(() => { ready = true; }, 5000);

    function onMouseLeave(e: MouseEvent) {
      if (!ready) return;
      if (e.clientY <= 10) show();
    }

    function onPopState() {
      if (!ready) return;
      show();
    }

    function show() {
      setVisible(true);
      sessionStorage.setItem("exit-popup-shown", "1");
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("popstate", onPopState);
    }

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("popstate", onPopState);

    return () => {
      clearTimeout(readyTimer);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  async function submitReason(reason: string) {
    setStep("thanks");
    void saveExitReason(reason, country);
    setTimeout(() => setVisible(false), 1800);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) setVisible(false); }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-7 text-foreground shadow-2xl sm:p-9"
        style={{ animation: "slideUp .25s ease both" }}
      >
        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="إغلاق"
        >
          ✕
        </button>

        {/* ── Step 1: CTA ── */}
        {step === "cta" && (
          <>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-primary">
              ✋ لحظة قبل ما تروح
            </p>
            <h2 className="mb-2 text-2xl font-black leading-snug text-foreground">
              خذ مقالك الأول — مجاناً
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              فريقنا يكتب لك مقال كامل محسّن لجوجل خلال ٧ أيام — بدون بطاقة ائتمان وبدون التزام.
            </p>
            <ul className="mb-6 space-y-2 text-sm text-foreground">
              {["مقال احترافي كامل مجاناً", "صفحة شركتك على الشبكة فوراً", "ضمان استرداد ١٤ يوم"].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="text-success">✓</span> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2.5">
              <Link
                href={ctaLink}
                onClick={() => setVisible(false)}
                className="flex items-center justify-center rounded-2xl bg-primary py-3.5 text-[15px] font-black text-primary-foreground shadow-md transition hover:-translate-y-0.5"
              >
                ابدأ مجاناً — بدون بطاقة
              </Link>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setVisible(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3 text-sm font-bold text-foreground transition hover:bg-muted"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  تحدث معنا على واتساب
                </a>
              )}
              <button
                onClick={() => setStep("survey")}
                className="text-center text-xs text-muted-foreground transition hover:text-foreground"
              >
                لا شكراً، سأكمل بدون محتوى
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Micro-survey ── */}
        {step === "survey" && (
          <>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-primary">
              ثانية واحدة بس 🙏
            </p>
            <h2 className="mb-2 text-xl font-black leading-snug text-foreground">
              ليش ما اشتركت؟
            </h2>
            <p className="mb-5 text-sm text-muted-foreground">
              رأيك يساعدنا نتحسن — ضغطة واحدة وخلاص.
            </p>
            <div className="flex flex-col gap-2.5">
              {REASONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => submitReason(value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-right text-sm font-bold text-foreground transition hover:border-primary hover:bg-primary/5"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setVisible(false)}
                className="mt-1 text-center text-xs text-muted-foreground transition hover:text-foreground"
              >
                تخطي
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Thanks ── */}
        {step === "thanks" && (
          <div className="py-4 text-center">
            <p className="mb-2 text-4xl">🙏</p>
            <h2 className="mb-2 text-xl font-black text-foreground">شكراً على رأيك!</h2>
            <p className="text-sm text-muted-foreground">سنعمل على التحسين بناءً على ملاحظاتك.</p>
          </div>
        )}

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
