"use client";

import { useMemo, useState, type ReactElement } from "react";
import { updateTrackingFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { UnsavedChangesBar } from "./UnsavedChangesBar";

const TRACKING_FORM_ID = "tracking-form";

const TRACKING_FIELDS = [
  {
    name: "gtmId" as const,
    id: "tracking-gtmId",
    label: "Google Tag Manager ID",
    placeholder: "",
    hint: "رمز إدارة الوسوم من Google — يبدأ عادة بـ GTM-",
    icon: "📊",
    link: "https://tagmanager.google.com",
  },
  {
    name: "hotjarId" as const,
    id: "tracking-hotjarId",
    label: "Hotjar site ID",
    placeholder: "",
    hint: "معرّف الموقع في Hotjar لتسجيل الجلسات والخريطة الحرارية — أرقام فقط",
    icon: "🔥",
    link: "https://insights.hotjar.com",
  },
] as const;

export function TrackingForm({
  country,
  tracking,
  redirect,
}: {
  country: SupportedCountry;
  tracking: SiteSettingsJson["tracking"];
  redirect?: string;
}): ReactElement {
  const [gtmId, setGtmId] = useState(tracking.gtmId ?? "");
  const [hotjarId, setHotjarId] = useState(tracking.hotjarId ?? "");

  const activeTrackingCount = useMemo(() => {
    return [gtmId, hotjarId].filter((v) => v.trim().length > 0).length;
  }, [gtmId, hotjarId]);

  const setters: Record<(typeof TRACKING_FIELDS)[number]["name"], (v: string) => void> = {
    gtmId: setGtmId,
    hotjarId: setHotjarId,
  };

  const values: Record<(typeof TRACKING_FIELDS)[number]["name"], string> = {
    gtmId,
    hotjarId,
  };

  function handleSave(): void {
    const el = document.getElementById(TRACKING_FORM_ID);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <span className="text-base" aria-hidden>
            📡
          </span>
          <h2 className="text-sm font-semibold text-foreground">التتبع والتحليلات</h2>
          <span className="ms-auto text-xs text-muted-foreground">
            {activeTrackingCount}/2 خدمات مُفعّلة
          </span>
        </div>

        <form id={TRACKING_FORM_ID} action={updateTrackingFormData} className="flex flex-col gap-4">
          <input type="hidden" name="country" value={country} />
          {redirect && <input type="hidden" name="redirect" value={redirect} />}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {TRACKING_FIELDS.map((field) => {
              const val = values[field.name];
              const active = val.trim().length > 0;
              return (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor={field.id} className="text-xs font-medium text-muted-foreground">
                      <span className="me-1" aria-hidden>
                        {field.icon}
                      </span>
                      {field.label}
                    </Label>
                    {active ? (
                      <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">
                        ✓ مُفعّلة
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        غير مُفعّلة
                      </span>
                    )}
                  </div>
                  <Input
                    id={field.id}
                    type="text"
                    name={field.name}
                    value={val}
                    onChange={(e) => setters[field.name](e.target.value)}
                    placeholder={field.placeholder}
                    dir="ltr"
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">{field.hint}</p>
                  <a
                    href={field.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-medium text-primary hover:underline"
                  >
                    فتح لوحة الخدمة ↗
                  </a>
                </div>
              );
            })}

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">📘</span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Facebook Pixel — يُدار عبر GTM
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    جميع بيكسلات Meta/Facebook تُضاف من خلال{' '}
                    <strong className="text-foreground">Google Tag Manager (GTM-TT25M3GX)</strong>.
                    لإضافة أو تعديل بيكسل:{' '}
                    <a
                      href="https://tagmanager.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      افتح GTM ↗
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button type="button" className="w-full sm:w-auto" onClick={handleSave}>
            حفظ التتبع
          </Button>
        </form>
      </div>

      <UnsavedChangesBar
        formId={TRACKING_FORM_ID}
        message="تغييرات غير محفوظة في إعدادات التتبع"
        className="bottom-20"
      />
    </>
  );
}
