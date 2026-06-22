"use client";

import { useState, useTransition, type ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePlan } from "@/app/actions/pricing";
import type { SupportedCountry } from "@/lib/landing-content.types";

type PlanSlug = "presence" | "starter" | "growth" | "scale";

type Props = {
  country: SupportedCountry;
  slug: PlanSlug;
  initial: {
    name: string;
    tagline: string;
    priceMonthly: number;
    priceYearly: number;
    articlesLabel: string;
    ctaText: string;
    highlights: string[];
    badge: string | null;
    featuredBadge: string | null;
    visible: boolean;
  };
};

export function PlanEditForm({ country, slug, initial }: Props): ReactElement {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const [name, setName] = useState(initial.name);
  const [tagline, setTagline] = useState(initial.tagline);
  const [priceMonthly, setPriceMonthly] = useState(String(initial.priceMonthly));
  const [priceYearly, setPriceYearly] = useState(String(initial.priceYearly));
  const [articlesLabel, setArticlesLabel] = useState(initial.articlesLabel);
  const [ctaText, setCtaText] = useState(initial.ctaText);
  const [highlights, setHighlights] = useState<string[]>(initial.highlights);
  const [badge, setBadge] = useState(initial.badge ?? "");
  const [featuredBadge, setFeaturedBadge] = useState(initial.featuredBadge ?? "");
  const [visible, setVisible] = useState(initial.visible);

  const onSave = () => {
    setFeedback(null);
    startTransition(async () => {
      try {
        await updatePlan(country, slug, {
          name: name.trim(),
          tagline: tagline.trim(),
          priceMonthly: Math.max(0, Math.floor(Number(priceMonthly) || 0)),
          priceYearly: Math.max(0, Math.floor(Number(priceYearly) || 0)),
          articlesLabel: articlesLabel.trim(),
          ctaText: ctaText.trim(),
          highlights: highlights.map((h) => h.trim()).filter(Boolean),
          badge: badge.trim() === "" ? null : badge.trim(),
          featuredBadge: featuredBadge.trim() === "" ? null : featuredBadge.trim(),
          visible,
        });
        setFeedback({ kind: "ok", msg: "تم الحفظ بنجاح ✓" });
        router.refresh();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "خطأ غير متوقع";
        setFeedback({ kind: "err", msg });
      }
    });
  };

  const updateHighlight = (i: number, v: string) => {
    setHighlights((arr) => arr.map((h, idx) => (idx === i ? v : h)));
  };
  const removeHighlight = (i: number) => {
    setHighlights((arr) => arr.filter((_, idx) => idx !== i));
  };
  const addHighlight = () => {
    setHighlights((arr) => [...arr, ""]);
  };

  const labelCls = "text-sm font-medium text-foreground";
  const inputCls =
    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
  const cardCls = "rounded-lg border border-border bg-card p-4 shadow-sm";

  return (
    <div className="flex flex-col gap-4">
      {/* Identity */}
      <div className={cardCls}>
        <h2 className="mb-3 text-sm font-semibold text-foreground">الهوية الأساسية</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>الاسم</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>articlesLabel — وصف الكمية</label>
            <input
              className={inputCls}
              placeholder="٨ مقالات / شهر"
              value={articlesLabel}
              onChange={(e) => setArticlesLabel(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className={labelCls}>الجملة التحتية (tagline)</label>
            <textarea
              className={`${inputCls} min-h-[60px] resize-none py-2`}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className={cardCls}>
        <h2 className="mb-3 text-sm font-semibold text-foreground">السعر</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>سعر شهري (price.mo)</label>
            <input
              type="number"
              min={0}
              step={1}
              className={inputCls}
              value={priceMonthly}
              onChange={(e) => setPriceMonthly(e.target.value)}
              dir="ltr"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>سعر السنوي (price.yr — لكل شهر بالخصم)</label>
            <input
              type="number"
              min={0}
              step={1}
              className={inputCls}
              value={priceYearly}
              onChange={(e) => setPriceYearly(e.target.value)}
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={cardCls}>
        <h2 className="mb-3 text-sm font-semibold text-foreground">زر الدعوة (CTA)</h2>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>نص الزر</label>
          <input
            className={inputCls}
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="ابدأ الحين — ١٤ يوم ضمان كامل ✅"
          />
        </div>
      </div>

      {/* Badges */}
      <div className={cardCls}>
        <h2 className="mb-3 text-sm font-semibold text-foreground">الشارات</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>شارة عادية (badge)</label>
            <input
              className={inputCls}
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="مثلاً: للمؤسسات"
            />
            <p className="text-[11px] text-muted-foreground">اتركها فارغة لإخفاء الشارة.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>شارة مميزة (featuredBadge)</label>
            <input
              className={inputCls}
              value={featuredBadge}
              onChange={(e) => setFeaturedBadge(e.target.value)}
              placeholder="مثلاً: الأكثر اختياراً ✦"
            />
            <p className="text-[11px] text-muted-foreground">
              تُظهر الكرت كـ "الأكثر اختياراً". اتركها فارغة للإخفاء.
            </p>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className={cardCls}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            النقاط (highlights) — {highlights.length}
          </h2>
          <button
            type="button"
            onClick={addHighlight}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted/40"
          >
            + إضافة نقطة
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground w-6">{i + 1}.</span>
              <input
                className={inputCls}
                value={h}
                onChange={(e) => updateHighlight(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeHighlight(i)}
                className="shrink-0 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-xs text-destructive hover:bg-destructive/20"
                aria-label={`Remove highlight ${i + 1}`}
              >
                حذف
              </button>
            </div>
          ))}
          {highlights.length === 0 && (
            <p className="text-xs text-muted-foreground italic">لا يوجد نقاط — اضغط "إضافة نقطة" للبدء.</p>
          )}
        </div>
      </div>

      {/* Visibility */}
      <div className={cardCls}>
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
          />
          <span className="text-sm font-medium text-foreground">
            الخطة ظاهرة للزائر — {visible ? "✅ مُفعَّلة" : "❌ مخفية"}
          </span>
        </label>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-2 z-10 flex items-center justify-between gap-3 rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
        <Link
          href={`/admin/pricing?country=${country}`}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/40"
        >
          ← رجوع للقائمة
        </Link>
        <div className="flex items-center gap-3">
          {feedback && (
            <span
              className={`text-xs font-medium ${feedback.kind === "ok" ? "text-emerald-600" : "text-destructive"}`}
            >
              {feedback.msg}
            </span>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={isPending}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60"
          >
            {isPending ? "جاري الحفظ…" : "حفظ التعديلات"}
          </button>
        </div>
      </div>
    </div>
  );
}
