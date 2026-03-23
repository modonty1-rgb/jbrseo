"use client";

import type { FormEvent, ReactElement } from "react";
import { useState, useEffect, useCallback } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type {
  PricingContent,
  Plan,
  Section as PlanSection,
  PricingBottomCta,
  PricingUI,
} from "@/app/content/landing/price-section-types";
import { updatePricingSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { cn } from "@/lib/utils";

const PLAN_IDS = ["free", "starter", "growth", "scale"] as const;

type Props = {
  section: StaticLanding["pricing"];
  country: SupportedCountry;
};

function clonePricing(s: PricingContent): PricingContent {
  return JSON.parse(JSON.stringify(s)) as PricingContent;
}

type MainTab = "general" | "plans";
type PlanBlockKey = 0 | 1 | 2;

export function PricingSectionForm({ section, country }: Props): ReactElement {
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

  const addTrustItem = (): void => {
    setData((prev) => ({
      ...clonePricing(prev),
      TRUST_ITEMS: [...prev.TRUST_ITEMS, { icon: "", label: "" }],
    }));
  };
  const setTrustItem = (i: number, field: "icon" | "label", value: string): void => {
    setData((prev) => {
      const next = clonePricing(prev);
      const arr = [...next.TRUST_ITEMS];
      arr[i] = { ...arr[i], [field]: value };
      next.TRUST_ITEMS = arr;
      return next;
    });
  };
  const removeTrustItem = (i: number): void => {
    setData((prev) => ({
      ...clonePricing(prev),
      TRUST_ITEMS: prev.TRUST_ITEMS.filter((_, j) => j !== i),
    }));
  };

  const addHighlight = (): void => setPlan((p) => ({ ...p, highlights: [...(p.highlights ?? []), ""] }));
  const setHighlight = (i: number, v: string): void => {
    setPlan((p) => {
      const h = [...(p.highlights ?? [])];
      h[i] = v;
      return { ...p, highlights: h };
    });
  };
  const removeHighlight = (i: number): void => {
    setPlan((p) => ({
      ...p,
      highlights: (p.highlights ?? []).filter((_, j) => j !== i),
    }));
  };

  const addSection = (): void =>
    setPlan((p) => ({
      ...p,
      sections: [...(p.sections ?? []), { title: "", icon: "", features: [] }],
    }));
  const setSection = (secIndex: number, field: keyof PlanSection, value: string | string[]): void => {
    setPlan((p) => {
      const secs = [...(p.sections ?? [])];
      if (!secs[secIndex]) return p;
      secs[secIndex] = { ...secs[secIndex], [field]: value };
      return { ...p, sections: secs };
    });
  };
  const setSectionFeature = (secIndex: number, featIndex: number, value: string): void => {
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
  const addSectionFeature = (secIndex: number): void => {
    setPlan((p) => {
      const secs = [...(p.sections ?? [])];
      const sec = secs[secIndex];
      if (!sec) return p;
      secs[secIndex] = { ...sec, features: [...(sec.features ?? []), ""] };
      return { ...p, sections: secs };
    });
  };
  const removeSectionFeature = (secIndex: number, featIndex: number): void => {
    setPlan((p) => {
      const secs = [...(p.sections ?? [])];
      const sec = secs[secIndex];
      if (!sec) return p;
      secs[secIndex] = { ...sec, features: (sec.features ?? []).filter((_, j) => j !== featIndex) };
      return { ...p, sections: secs };
    });
  };
  const removeSection = (secIndex: number): void => {
    setPlan((p) => ({
      ...p,
      sections: (p.sections ?? []).filter((_, j) => j !== secIndex),
    }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
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

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as MainTab)}
        className="w-full"
      >
        <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-0 border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="general"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            عام
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            البطاقات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4 outline-none">
          <div className="space-y-3 rounded-md border border-border bg-muted/20 p-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">شريط الإعلان وعناصر الثقة</h3>
            <Label className={labelCls}>
              نص الإعلان
              <Input
                className={inputCls}
                value={data.ANNOUNCEMENT}
                onChange={(e) => setGlobal("ANNOUNCEMENT", e.target.value)}
              />
            </Label>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">عناصر الثقة</span>
                <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={addTrustItem}>
                  + إضافة
                </Button>
              </div>
              <div className="space-y-2">
                {data.TRUST_ITEMS.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      className={cn(inputCls, "w-16")}
                      placeholder="أيقونة"
                      value={t.icon}
                      onChange={(e) => setTrustItem(i, "icon", e.target.value)}
                    />
                    <Input
                      className={cn(inputCls, "flex-1")}
                      placeholder="تسمية"
                      value={t.label}
                      onChange={(e) => setTrustItem(i, "label", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="h-auto shrink-0 p-0 text-xs text-destructive"
                      onClick={() => removeTrustItem(i)}
                    >
                      حذف
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-md border border-border bg-muted/20 p-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">نداء الحسم أسفل البطاقات</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["headline", "subheadline", "primaryBtn", "secondaryBtn", "footnote"] as const).map((k) => (
                <Label key={k} className={labelCls}>
                  {k === "headline"
                    ? "عنوان"
                    : k === "subheadline"
                      ? "نص فرعي"
                      : k === "primaryBtn"
                        ? "زر أساسي"
                        : k === "secondaryBtn"
                          ? "زر ثانوي"
                          : "حاشية"}
                  <Input
                    className={inputCls}
                    value={data.BOTTOM_CTA[k]}
                    onChange={(e) => setBottomCta(k, e.target.value)}
                  />
                </Label>
              ))}
            </div>
          </div>

          <Collapsible open={uiStringsOpen} onOpenChange={setUiStringsOpen}>
            <div className="overflow-hidden rounded-md border border-border bg-muted/20">
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto w-full justify-between rounded-none px-4 py-3 text-start text-xs font-bold uppercase text-muted-foreground hover:bg-muted/30"
                >
                  نصوص الواجهة (تفاصيل)
                  <span className="text-sm" aria-hidden>
                    {uiStringsOpen ? "▼" : "◀"}
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid gap-2 p-4 pt-0 sm:grid-cols-2">
                  {(
                    [
                      "freeLabel",
                      "perMonth",
                      "youGet",
                      "moreDetails",
                      "pricingFullComparisonLabel",
                      "guarantee",
                      "whatsapp",
                      "trustTitle",
                    ] as const
                  ).map((k) => (
                    <Label key={k} className={labelCls}>
                      {k}
                      <Input
                        className={inputCls}
                        value={data.UI[k]}
                        onChange={(e) => setUi(k, e.target.value)}
                      />
                    </Label>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </TabsContent>

        <TabsContent value="plans" className="mt-4 outline-none">
          <div className="flex flex-wrap gap-2">
            {PLAN_IDS.map((id, i) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={planIndex === i ? "default" : "secondary"}
                onClick={() => {
                  setPlanIndex(i);
                  setPlanBlockOpen(0);
                }}
              >
                {data.PLANS[i]?.name ?? id}
              </Button>
            ))}
          </div>

          {plan ? (
            <div className="mt-4 space-y-2">
              {(
                [
                  ["معلومات البطاقة والسعر", 0],
                  ["عناصر التمييز", 1],
                  ["تفاصيل أكثر", 2],
                ] as const
              ).map(([title, key]) => (
                <Collapsible
                  key={key}
                  open={planBlockOpen === key}
                  onOpenChange={(o) => setPlanBlockOpen(o ? key : null)}
                >
                  <div className="overflow-hidden rounded-md border border-border bg-muted/20">
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto w-full justify-between rounded-none px-4 py-3 text-start text-xs font-bold uppercase text-muted-foreground hover:bg-muted/30"
                      >
                        {title}
                        <span className="text-sm" aria-hidden>
                          {planBlockOpen === key ? "▼" : "◀"}
                        </span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t border-border p-4 pt-0">
                        {key === 0 ? (
                          <div className="grid gap-2 sm:grid-cols-2">
                            <Label className={labelCls}>
                              اسم الخطة
                              <Input
                                className={inputCls}
                                value={plan.name}
                                onChange={(e) => setPlan((p) => ({ ...p, name: e.target.value }))}
                              />
                            </Label>
                            <Label className={labelCls}>
                              persona
                              <Input
                                className={inputCls}
                                value={plan.persona}
                                onChange={(e) => setPlan((p) => ({ ...p, persona: e.target.value }))}
                              />
                            </Label>
                            <Label className={labelCls}>
                              price (شهري)
                              <Input
                                type="number"
                                className={inputCls}
                                value={plan.price.mo}
                                onChange={(e) =>
                                  setPlan((p) => ({
                                    ...p,
                                    price: { ...p.price, mo: parseInt(e.target.value, 10) || 0 },
                                  }))
                                }
                              />
                            </Label>
                            <Label className={labelCls}>
                              price (سنوي)
                              <Input
                                type="number"
                                className={inputCls}
                                value={plan.price.yr}
                                onChange={(e) =>
                                  setPlan((p) => ({
                                    ...p,
                                    price: { ...p.price, yr: parseInt(e.target.value, 10) || 0 },
                                  }))
                                }
                              />
                            </Label>
                            <Label className={labelCls}>
                              cta
                              <Input
                                className={inputCls}
                                value={plan.cta}
                                onChange={(e) => setPlan((p) => ({ ...p, cta: e.target.value }))}
                              />
                            </Label>
                            <Label className={labelCls}>
                              ctaClass
                              <Select
                                value={plan.ctaClass}
                                onValueChange={(v) => setPlan((p) => ({ ...p, ctaClass: v }))}
                              >
                                <SelectTrigger className={inputCls}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="btn-ghost">btn-ghost</SelectItem>
                                  <SelectItem value="btn-blue">btn-blue</SelectItem>
                                  <SelectItem value="btn-featured">btn-featured</SelectItem>
                                  <SelectItem value="btn-gold">btn-gold</SelectItem>
                                </SelectContent>
                              </Select>
                            </Label>
                            <Label className={labelCls}>
                              articles
                              <Input
                                className={inputCls}
                                value={plan.articles}
                                onChange={(e) => setPlan((p) => ({ ...p, articles: e.target.value }))}
                              />
                            </Label>
                            <Label className={labelCls}>
                              badge
                              <Input
                                className={inputCls}
                                value={plan.badge ?? ""}
                                onChange={(e) => setPlan((p) => ({ ...p, badge: e.target.value || null }))}
                              />
                            </Label>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`featured-${planIndex}`}
                                checked={plan.featured}
                                onCheckedChange={(v) => setPlan((p) => ({ ...p, featured: v === true }))}
                              />
                              <Label htmlFor={`featured-${planIndex}`} className="text-xs font-semibold text-muted-foreground">
                                featured
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`badgeGold-${planIndex}`}
                                checked={plan.badgeGold ?? false}
                                onCheckedChange={(v) => setPlan((p) => ({ ...p, badgeGold: v === true }))}
                              />
                              <Label htmlFor={`badgeGold-${planIndex}`} className="text-xs font-semibold text-muted-foreground">
                                badgeGold
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`guarantee-${planIndex}`}
                                checked={plan.guarantee}
                                onCheckedChange={(v) => setPlan((p) => ({ ...p, guarantee: v === true }))}
                              />
                              <Label htmlFor={`guarantee-${planIndex}`} className="text-xs font-semibold text-muted-foreground">
                                guarantee
                              </Label>
                            </div>
                            <Label className={labelCls}>
                              accent
                              <Input
                                className={inputCls}
                                value={plan.accent}
                                onChange={(e) => setPlan((p) => ({ ...p, accent: e.target.value }))}
                              />
                            </Label>
                            <Label className={labelCls}>
                              لون الخلفية (accentBg)
                              <Input
                                className={inputCls}
                                value={plan.accentBg}
                                onChange={(e) => setPlan((p) => ({ ...p, accentBg: e.target.value }))}
                              />
                            </Label>
                          </div>
                        ) : null}
                        {key === 1 ? (
                          <div className="space-y-2">
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs"
                                onClick={addHighlight}
                              >
                                + سطر
                              </Button>
                            </div>
                            {(plan.highlights ?? []).map((h, i) => (
                              <div key={i} className="flex gap-2">
                                <Input
                                  className={cn(inputCls, "flex-1")}
                                  value={h}
                                  onChange={(e) => setHighlight(i, e.target.value)}
                                />
                                <Button
                                  type="button"
                                  variant="link"
                                  size="sm"
                                  className="h-auto shrink-0 p-0 text-xs text-destructive"
                                  onClick={() => removeHighlight(i)}
                                >
                                  حذف
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {key === 2 ? (
                          <div className="space-y-4">
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs"
                                onClick={addSection}
                              >
                                + قسم
                              </Button>
                            </div>
                            {(plan.sections ?? []).map((sec, si) => (
                              <div key={si} className="space-y-2 rounded border border-border p-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-muted-foreground">قسم {si + 1}</span>
                                  <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-destructive"
                                    onClick={() => removeSection(si)}
                                  >
                                    حذف القسم
                                  </Button>
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <Label className={labelCls}>
                                    عنوان القسم
                                    <Input
                                      className={inputCls}
                                      value={sec.title}
                                      onChange={(e) => setSection(si, "title", e.target.value)}
                                    />
                                  </Label>
                                  <Label className={labelCls}>
                                    أيقونة
                                    <Input
                                      className={inputCls}
                                      value={sec.icon}
                                      onChange={(e) => setSection(si, "icon", e.target.value)}
                                    />
                                  </Label>
                                </div>
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">الميزات</span>
                                    <Button
                                      type="button"
                                      variant="link"
                                      size="sm"
                                      className="h-auto p-0 text-xs"
                                      onClick={() => addSectionFeature(si)}
                                    >
                                      + سطر
                                    </Button>
                                  </div>
                                  <div className="space-y-1">
                                    {(sec.features ?? []).map((f, fi) => (
                                      <div key={fi} className="flex gap-2">
                                        <Input
                                          className={cn(inputCls, "flex-1")}
                                          value={f}
                                          onChange={(e) => setSectionFeature(si, fi, e.target.value)}
                                        />
                                        <Button
                                          type="button"
                                          variant="link"
                                          size="sm"
                                          className="h-auto shrink-0 p-0 text-xs text-destructive"
                                          onClick={() => removeSectionFeature(si, fi)}
                                        >
                                          حذف
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          ) : null}
        </TabsContent>
      </Tabs>

      <Button type="submit" size="sm">
        حفظ قسم التسعير
      </Button>
    </form>
  );
}
