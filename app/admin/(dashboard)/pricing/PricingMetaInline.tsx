"use client";

import { useState, useTransition, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { updateMeta } from "@/app/actions/pricing-meta";
import type { SupportedCountry } from "@/lib/landing-content.types";

type TrustItem = { icon: string; label: string };

type Props = {
  country: SupportedCountry;
  initial: {
    announcement: string;
    ctaHeadline: string;
    ctaSubheadline: string;
    trustItems: TrustItem[];
  };
};

export function PricingMetaInline({ country, initial }: Props): ReactElement {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [trustOpen, setTrustOpen] = useState(false);

  const [announcement, setAnnouncement] = useState(initial.announcement);
  const [ctaHeadline, setCtaHeadline] = useState(initial.ctaHeadline);
  const [ctaSubheadline, setCtaSubheadline] = useState(initial.ctaSubheadline);
  const [trustItems, setTrustItems] = useState<TrustItem[]>(initial.trustItems);

  const onSave = () => {
    setFeedback(null);
    startTransition(async () => {
      try {
        await updateMeta(country, {
          announcement: announcement.trim(),
          ctaHeadline: ctaHeadline.trim(),
          ctaSubheadline: ctaSubheadline.trim(),
          trustItems: trustItems
            .map((t) => ({ icon: t.icon.trim(), label: t.label.trim() }))
            .filter((t) => t.label || t.icon),
        });
        setFeedback({ kind: "ok", msg: "تم الحفظ ✓" });
        router.refresh();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "خطأ";
        setFeedback({ kind: "err", msg });
      }
    });
  };

  const inputCls =
    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "text-xs font-semibold text-muted-foreground";

  return (
    <section className="mb-6 rounded-xl border border-border bg-card/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-foreground">📢 إعلان + 🎯 دعوة + 🛡 ثقة</h2>
        <div className="flex items-center gap-3">
          {feedback && (
            <span
              className={`text-xs font-medium ${
                feedback.kind === "ok" ? "text-emerald-600" : "text-destructive"
              }`}
            >
              {feedback.msg}
            </span>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={isPending}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {isPending ? "جاري الحفظ…" : "حفظ"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className={labelCls}>📢 الإعلان أعلى قسم الأسعار</label>
          <input
            className={inputCls}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="مثل: أسعار التأسيس — أول ١٥٠ شركة"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>🎯 عنوان الدعوة السفلية</label>
          <input
            className={inputCls}
            value={ctaHeadline}
            onChange={(e) => setCtaHeadline(e.target.value)}
            placeholder="مستعد تبدأ؟"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>🎯 الفقرة تحت العنوان</label>
          <input
            className={inputCls}
            value={ctaSubheadline}
            onChange={(e) => setCtaSubheadline(e.target.value)}
            placeholder="جرّب 14 يوم بدون التزام"
          />
        </div>
      </div>

      <div className="mt-3 border-t border-border/40 pt-3">
        <button
          type="button"
          onClick={() => setTrustOpen((v) => !v)}
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <span>{trustOpen ? "▼" : "◀"}</span>
          <span>🛡 شارات الثقة ({trustItems.length})</span>
        </button>
        {trustOpen && (
          <div className="mt-2 space-y-2">
            {trustItems.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 text-xs tabular-nums text-muted-foreground">{i + 1}.</span>
                <input
                  className="h-9 w-16 rounded-md border border-input bg-background px-2 text-center text-sm"
                  value={t.icon}
                  onChange={(e) =>
                    setTrustItems((arr) =>
                      arr.map((item, idx) => (idx === i ? { ...item, icon: e.target.value } : item)),
                    )
                  }
                  placeholder="🔒"
                />
                <input
                  className={inputCls}
                  value={t.label}
                  onChange={(e) =>
                    setTrustItems((arr) =>
                      arr.map((item, idx) => (idx === i ? { ...item, label: e.target.value } : item)),
                    )
                  }
                  placeholder="تشفير كامل"
                />
                <button
                  type="button"
                  onClick={() => setTrustItems((arr) => arr.filter((_, idx) => idx !== i))}
                  className="shrink-0 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-xs text-destructive hover:bg-destructive/20"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setTrustItems((arr) => [...arr, { icon: "", label: "" }])}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted/40"
            >
              + إضافة شارة
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
