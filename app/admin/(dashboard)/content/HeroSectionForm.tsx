"use client";

import { useState, useTransition } from "react";
import type { StaticLanding, TrustBarClient } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateHeroSection } from "@/app/actions/content-sections";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

const HERO_FORM_ID = "hero-section-form";

type HeroSectionFormProps = {
  hero: StaticLanding["hero"];
  country: SupportedCountry;
};

export function HeroSectionForm({ hero, country }: HeroSectionFormProps) {
  const benefits = hero.benefits ?? [];
  const benefitsCount = benefits.length || 3;

  const getBenefit = (index: number) => benefits[index] ?? { objection: "", answer: "" };

  const trustText = (hero.trust ?? []).join("\n");

  const [clients, setClients] = useState<TrustBarClient[]>(
    hero.trustBarClients && hero.trustBarClients.length > 0
      ? hero.trustBarClients
      : [{ name: "", logoUrl: "", href: "" }],
  );

  const [isPending, startTransition] = useTransition();

  function addClient() {
    setClients((prev) => [...prev, { name: "", logoUrl: "", href: "" }]);
  }

  function removeClient(idx: number) {
    setClients((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateClient(idx: number, field: keyof TrustBarClient, value: string) {
    setClients((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  }

  function handleSave() {
    const form = document.getElementById(HERO_FORM_ID);
    if (!(form instanceof HTMLFormElement)) return;
    const fd = new FormData(form);
    fd.set("trustClientsJson", JSON.stringify(clients));
    startTransition(() => {
      void updateHeroSection(fd);
    });
  }

  return (
    <form id={HERO_FORM_ID} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="hero" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/hero?country=${country}`}
      />
      <input type="hidden" name="benefitsCount" value={benefitsCount} />


      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل قسم الهيرو
        </h2>
        <a
          href={`/admin/content/hero?country=${country}&useDefault=1`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          تحميل القيم الافتراضية
        </a>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        إثبات
        <Input
          name="proof"
          defaultValue={hero.proof}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان الرئيسي - السطر ١
          <Input
            name="h1Line1"
            defaultValue={hero.h1Line1}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان الرئيسي - السطر ٢
          <Input
            name="h1Line2"
            defaultValue={hero.h1Line2}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        نص فرعي
        <Textarea
          name="sub"
          defaultValue={hero.sub}
          className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: benefitsCount }).map((_, i) => {
          const b = getBenefit(i);
          return (
            <div
              key={i}
              className="rounded-md border border-border bg-muted/30 p-2 space-y-2"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                فائدة {i + 1}
              </div>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                اعتراض
                <Input
                  name={`benefits_${i}_objection`}
                  defaultValue={b.objection}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                إجابة
                <Textarea
                  name={`benefits_${i}_answer`}
                  defaultValue={b.answer}
                  className="min-h-[50px] rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
            </div>
          );
        })}
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        عناصر الثقة (سطر لكل عنصر)
        <Textarea
          name="trustLines"
          defaultValue={trustText}
          className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      {/* ── شريط العملاء ── */}
      <div className="space-y-3 rounded-md border border-border bg-muted/20 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-muted-foreground">شريط العملاء</p>
        </div>

        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          عنوان الشريط
          <Input
            name="trustBarHeadline"
            defaultValue={hero.trustBarHeadline ?? ""}
            placeholder="يثق بنا +١٢٠ نشاط تجاري..."
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>

        <div className="space-y-2">
          {clients.map((client, i) => (
            <div key={i} className="rounded-md border border-border bg-background p-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">عميل {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeClient(i)}
                  className="text-[11px] text-destructive hover:underline"
                >
                  حذف
                </button>
              </div>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                اسم العميل
                <Input
                  value={client.name}
                  onChange={(e) => updateClient(i, "name", e.target.value)}
                  placeholder="آفاق للاستشارات"
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                رابط الشعار (Cloudinary أو URL)
                <Input
                  value={client.logoUrl}
                  onChange={(e) => updateClient(i, "logoUrl", e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  dir="ltr"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                رابط الموقع (اختياري)
                <Input
                  value={client.href ?? ""}
                  onChange={(e) => updateClient(i, "href", e.target.value)}
                  placeholder="https://example.com"
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  dir="ltr"
                />
              </label>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addClient}
          className="text-xs font-semibold text-primary hover:underline"
        >
          + إضافة عميل
        </button>
      </div>

      <ConfirmSaveDialog
        onConfirm={handleSave}
        pending={isPending}
        triggerLabel="حفظ قسم الهيرو"
        description="سيتم حفظ التغييرات على قسم الهيرو للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

