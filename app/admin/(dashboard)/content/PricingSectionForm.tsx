"use client";

import { useState, useEffect, useCallback } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { PricingContent, Plan, Section as PlanSection, TrustItem, PricingBottomCta, PricingUI } from "@/app/content/landing/price-section-types";
import { updatePricingSection } from "@/app/actions/content-sections";

const PLAN_IDS = ["free", "starter", "growth", "scale"] as const;

type Props = {
  section: StaticLanding["pricing"];
  country: SupportedCountry;
};

function clonePricing(s: PricingContent): PricingContent {
  return JSON.parse(JSON.stringify(s));
}

type MainTab = "general" | "plans";
type PlanBlockKey = 0 | 1 | 2; // 0=main, 1=highlights, 2=sections

export function PricingSectionForm({ section, country }: Props) {
  const [data, setData] = useState<PricingContent>(() => clonePricing(section));
  const [activeTab, setActiveTab] = useState<MainTab>("general");
  const [planIndex, setPlanIndex] = useState(0);
  const [planBlockOpen, setPlanBlockOpen] = useState<PlanBlockKey | null>(0);
  const [uiStringsOpen, setUiStringsOpen] = useState(false);

  useEffect(() => {
    setData(clonePricing(section));
  }, [section]);

  const plan = data.PLANS[planIndex] ?? data.PLANS[0];
  const setPlan = useCallback(
    (updater: (p: Plan) => Plan) => {
      setData((prev) => {
        const next = clonePricing(prev);
        const i = planIndex;
        if (next.PLANS[i]) next.PLANS[i] = updater(next.PLANS[i]);
        return next;
      });
    },
    [planIndex],
  );

  const setGlobal = useCallback(<K extends keyof PricingContent>(key: K, value: PricingContent[K]) => {
    setData((prev) => ({ ...clonePricing(prev), [key]: value }));
  }, []);

  const setBottomCta = useCallback((key: keyof PricingBottomCta, value: string) => {
    setData((prev) => ({
      ...clonePricing(prev),
      BOTTOM_CTA: { ...prev.BOTTOM_CTA, [key]: value },
    }));
  }, []);

  const setUi = useCallback((key: keyof PricingUI, value: string) => {
    setData((prev) => ({
      ...clonePricing(prev),
      UI: { ...prev.UI, [key]: value },
    }));
  }, []);

  const addTrustItem = () => {
    setData((prev) => ({
      ...clonePricing(prev),
      TRUST_ITEMS: [...prev.TRUST_ITEMS, { icon: "", label: "" }],
    }));
  };
  const setTrustItem = (i: number, field: "icon" | "label", value: string) => {
    setData((prev) => {
      const next = clonePricing(prev);
      const arr = [...next.TRUST_ITEMS];
      arr[i] = { ...arr[i], [field]: value };
      next.TRUST_ITEMS = arr;
      return next;
    });
  };
  const removeTrustItem = (i: number) => {
    setData((prev) => ({
      ...clonePricing(prev),
      TRUST_ITEMS: prev.TRUST_ITEMS.filter((_, j) => j !== i),
    }));
  };

  const addHighlight = () => setPlan((p) => ({ ...p, highlights: [...(p.highlights ?? []), ""] }));
  const setHighlight = (i: number, v: string) => {
    setPlan((p) => {
      const h = [...(p.highlights ?? [])];
      h[i] = v;
      return { ...p, highlights: h };
    });
  };
  const removeHighlight = (i: number) => {
    setPlan((p) => ({
      ...p,
      highlights: (p.highlights ?? []).filter((_, j) => j !== i),
    }));
  };

  const addSection = () =>
    setPlan((p) => ({
      ...p,
      sections: [...(p.sections ?? []), { title: "", icon: "", features: [] }],
    }));
  const setSection = (secIndex: number, field: keyof PlanSection, value: string | string[]) => {
    setPlan((p) => {
      const secs = [...(p.sections ?? [])];
      if (!secs[secIndex]) return p;
      secs[secIndex] = { ...secs[secIndex], [field]: value };
      return { ...p, sections: secs };
    });
  };
  const setSectionFeature = (secIndex: number, featIndex: number, value: string) => {
    setPlan((p) => {
      const secs = [...(p.sections ?? [])];
      const sec = secs[secIndex];
      if (!sec) return p;
      const f = [...(sec.features ?? [])];
      f[featIndex] = value;
      secs[secIndex] = { ...sec, features: f };
      return { ...p, sections: secs };
    });
  };
  const addSectionFeature = (secIndex: number) => {
    setPlan((p) => {
      const secs = [...(p.sections ?? [])];
      const sec = secs[secIndex];
      if (!sec) return p;
      secs[secIndex] = { ...sec, features: [...(sec.features ?? []), ""] };
      return { ...p, sections: secs };
    });
  };
  const removeSectionFeature = (secIndex: number, featIndex: number) => {
    setPlan((p) => {
      const secs = [...(p.sections ?? [])];
      const sec = secs[secIndex];
      if (!sec) return p;
      secs[secIndex] = { ...sec, features: (sec.features ?? []).filter((_, j) => j !== featIndex) };
      return { ...p, sections: secs };
    });
  };
  const removeSection = (secIndex: number) => {
    setPlan((p) => ({
      ...p,
      sections: (p.sections ?? []).filter((_, j) => j !== secIndex),
    }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const dataInput = form.querySelector('input[name="data"]') as HTMLInputElement;
    if (dataInput) dataInput.value = JSON.stringify(data);
    const fd = new FormData(form);
    await updatePricingSection(fd);
  }

  const labelCls = "flex flex-col gap-1 text-xs font-semibold text-muted-foreground";
  const inputCls = "rounded-md border border-border bg-background px-2 py-1 text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="pricing" />
      <input type="hidden" name="redirect" value={`/admin/content/pricing?country=${country}`} />
      <input type="hidden" name="data" value="" />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">تعديل قسم التسعير</h2>
        <a
          href={`/admin/content/pricing?country=${country}&useDefault=1`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          تحميل القيم الافتراضية
        </a>
      </div>

      {/* Top-level tabs */}
      <div className="flex gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === "general" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          عام
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === "plans" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          البطاقات
        </button>
      </div>

      {activeTab === "general" && (
        <div className="space-y-4">
          {/* Group 1: إعلان وثقة */}
          <div className="rounded-md border border-border bg-muted/20 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">شريط الإعلان وعناصر الثقة</h3>
            <label className={labelCls}>
              نص الإعلان
              <input
                className={inputCls}
                value={data.ANNOUNCEMENT}
                onChange={(e) => setGlobal("ANNOUNCEMENT", e.target.value)}
              />
            </label>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground">عناصر الثقة</span>
                <button type="button" onClick={addTrustItem} className="text-xs text-primary hover:underline">
                  + إضافة
                </button>
              </div>
              <div className="space-y-2">
                {data.TRUST_ITEMS.map((t, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      className={`${inputCls} w-16`}
                      placeholder="أيقونة"
                      value={t.icon}
                      onChange={(e) => setTrustItem(i, "icon", e.target.value)}
                    />
                    <input
                      className={`${inputCls} flex-1`}
                      placeholder="تسمية"
                      value={t.label}
                      onChange={(e) => setTrustItem(i, "label", e.target.value)}
                    />
                    <button type="button" onClick={() => removeTrustItem(i)} className="text-xs text-destructive hover:underline">
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Group 2: نداء الحسم أسفل البطاقات */}
          <div className="rounded-md border border-border bg-muted/20 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">نداء الحسم أسفل البطاقات</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["headline", "subheadline", "primaryBtn", "secondaryBtn", "footnote"] as const).map((k) => (
                <label key={k} className={labelCls}>
                  {k === "headline" ? "عنوان" : k === "subheadline" ? "نص فرعي" : k === "primaryBtn" ? "زر أساسي" : k === "secondaryBtn" ? "زر ثانوي" : "حاشية"}
                  <input
                    className={inputCls}
                    value={data.BOTTOM_CTA[k]}
                    onChange={(e) => setBottomCta(k, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Group 3: نصوص الواجهة (collapsible) */}
          <div className="rounded-md border border-border bg-muted/20 overflow-hidden">
            <button
              type="button"
              onClick={() => setUiStringsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-3 text-right text-xs font-bold uppercase text-muted-foreground hover:bg-muted/30"
            >
              نصوص الواجهة (تفاصيل)
              <span className="text-sm" aria-hidden>{uiStringsOpen ? "▼" : "◀"}</span>
            </button>
            {uiStringsOpen && (
              <div className="p-4 pt-0 grid gap-2 sm:grid-cols-2">
                {(["freeLabel", "perMonth", "youGet", "moreDetails", "guarantee", "whatsapp", "trustTitle"] as const).map((k) => (
                  <label key={k} className={labelCls}>
                    {k}
                    <input
                      className={inputCls}
                      value={data.UI[k]}
                      onChange={(e) => setUi(k, e.target.value)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "plans" && (
        <>
          <div className="flex flex-wrap gap-2">
            {PLAN_IDS.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => { setPlanIndex(i); setPlanBlockOpen(0); }}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  planIndex === i ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {data.PLANS[i]?.name ?? id}
              </button>
            ))}
          </div>

          {plan && (
            <div className="mt-4 space-y-2">
              {([["معلومات البطاقة والسعر", 0], ["عناصر التمييز", 1], ["تفاصيل أكثر", 2]] as const).map(([title, key]) => (
                <div key={key} className="rounded-md border border-border bg-muted/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPlanBlockOpen(planBlockOpen === key ? null : key)}
                    className="w-full flex items-center justify-between px-4 py-3 text-right text-xs font-bold uppercase text-muted-foreground hover:bg-muted/30"
                  >
                    {title}
                    <span className="text-sm" aria-hidden>{planBlockOpen === key ? "▼" : "◀"}</span>
                  </button>
                  {planBlockOpen === key && (
                    <div className="p-4 pt-0 border-t border-border">
                      {key === 0 && (
                        <div className="grid gap-2 sm:grid-cols-2">
              <label className={labelCls}>
                اسم الخطة
                <input
                  className={inputCls}
                  value={plan.name}
                  onChange={(e) => setPlan((p) => ({ ...p, name: e.target.value }))}
                />
              </label>
              <label className={labelCls}>
                persona
                <input
                  className={inputCls}
                  value={plan.persona}
                  onChange={(e) => setPlan((p) => ({ ...p, persona: e.target.value }))}
                />
              </label>
              <label className={labelCls}>
                price (شهري)
                <input
                  type="number"
                  className={inputCls}
                  value={plan.price.mo}
                  onChange={(e) => setPlan((p) => ({ ...p, price: { ...p.price, mo: parseInt(e.target.value, 10) || 0 } }))}
                />
              </label>
              <label className={labelCls}>
                price (سنوي)
                <input
                  type="number"
                  className={inputCls}
                  value={plan.price.yr}
                  onChange={(e) => setPlan((p) => ({ ...p, price: { ...p.price, yr: parseInt(e.target.value, 10) || 0 } }))}
                />
              </label>
              <label className={labelCls}>
                cta
                <input className={inputCls} value={plan.cta} onChange={(e) => setPlan((p) => ({ ...p, cta: e.target.value }))} />
              </label>
              <label className={labelCls}>
                ctaClass
                <select
                  className={inputCls}
                  value={plan.ctaClass}
                  onChange={(e) => setPlan((p) => ({ ...p, ctaClass: e.target.value }))}
                >
                  <option value="btn-ghost">btn-ghost</option>
                  <option value="btn-blue">btn-blue</option>
                  <option value="btn-featured">btn-featured</option>
                  <option value="btn-gold">btn-gold</option>
                </select>
              </label>
              <label className={labelCls}>
                articles
                <input
                  className={inputCls}
                  value={plan.articles}
                  onChange={(e) => setPlan((p) => ({ ...p, articles: e.target.value }))}
                />
              </label>
              <label className={labelCls}>
                badge
                <input
                  className={inputCls}
                  value={plan.badge ?? ""}
                  onChange={(e) => setPlan((p) => ({ ...p, badge: e.target.value || null }))}
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={plan.featured}
                  onChange={(e) => setPlan((p) => ({ ...p, featured: e.target.checked }))}
                />
                <span className="text-xs font-semibold text-muted-foreground">featured</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={plan.badgeGold ?? false}
                  onChange={(e) => setPlan((p) => ({ ...p, badgeGold: e.target.checked }))}
                />
                <span className="text-xs font-semibold text-muted-foreground">badgeGold</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={plan.guarantee}
                  onChange={(e) => setPlan((p) => ({ ...p, guarantee: e.target.checked }))}
                />
                <span className="text-xs font-semibold text-muted-foreground">guarantee</span>
              </label>
              <label className={labelCls}>
                accent
                <input
                  className={inputCls}
                  value={plan.accent}
                  onChange={(e) => setPlan((p) => ({ ...p, accent: e.target.value }))}
                />
              </label>
              <label className={labelCls}>
                لون الخلفية (accentBg)
                <input
                  className={inputCls}
                  value={plan.accentBg}
                  onChange={(e) => setPlan((p) => ({ ...p, accentBg: e.target.value }))}
                />
              </label>
                        </div>
                      )}
                      {key === 1 && (
                        <div className="space-y-2">
                          <div className="flex justify-end">
                            <button type="button" onClick={addHighlight} className="text-xs text-primary hover:underline">
                              + سطر
                            </button>
                          </div>
                          {(plan.highlights ?? []).map((h, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                className={`${inputCls} flex-1`}
                                value={h}
                                onChange={(e) => setHighlight(i, e.target.value)}
                              />
                              <button type="button" onClick={() => removeHighlight(i)} className="text-xs text-destructive hover:underline">
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {key === 2 && (
                        <div className="space-y-4">
                          <div className="flex justify-end">
                            <button type="button" onClick={addSection} className="text-xs text-primary hover:underline">
                              + قسم
                            </button>
                          </div>
                          {(plan.sections ?? []).map((sec, si) => (
                            <div key={si} className="rounded border border-border p-3 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-muted-foreground">قسم {si + 1}</span>
                                <button type="button" onClick={() => removeSection(si)} className="text-xs text-destructive hover:underline">
                                  حذف القسم
                                </button>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-2">
                                <label className={labelCls}>
                                  عنوان القسم
                                  <input
                                    className={inputCls}
                                    value={sec.title}
                                    onChange={(e) => setSection(si, "title", e.target.value)}
                                  />
                                </label>
                                <label className={labelCls}>
                                  أيقونة
                                  <input
                                    className={inputCls}
                                    value={sec.icon}
                                    onChange={(e) => setSection(si, "icon", e.target.value)}
                                  />
                                </label>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-muted-foreground">الميزات</span>
                                  <button type="button" onClick={() => addSectionFeature(si)} className="text-xs text-primary hover:underline">
                                    + سطر
                                  </button>
                                </div>
                                <div className="space-y-1">
                                  {(sec.features ?? []).map((f, fi) => (
                                    <div key={fi} className="flex gap-2">
                                      <input
                                        className={`${inputCls} flex-1`}
                                        value={f}
                                        onChange={(e) => setSectionFeature(si, fi, e.target.value)}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeSectionFeature(si, fi)}
                                        className="text-xs text-destructive hover:underline"
                                      >
                                        حذف
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
      >
        حفظ قسم التسعير
      </button>
    </form>
  );
}
