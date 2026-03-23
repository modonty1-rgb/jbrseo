"use client";

import { useMemo, useState, type ReactElement } from "react";

import { Card } from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { cn } from "@/lib/utils";

const MODONTY_MAX = 2399;

const roles = [
  { icon: "✍️", label: "كاتب محتوى SEO", default: 4500, min: 2000, max: 12000, step: 500 },
  { icon: "🎨", label: "مصمم جرافيك", default: 7000, min: 3000, max: 15000, step: 500 },
  { icon: "📈", label: "متخصص SEO", default: 6000, min: 3000, max: 15000, step: 500 },
  { icon: "📱", label: "مدير سوشال ميديا", default: 5500, min: 2000, max: 12000, step: 500 },
  { icon: "🎬", label: "مونتير / منتج فيديو", default: 6000, min: 3000, max: 12000, step: 500 },
  { icon: "💻", label: "مطور مواقع", default: 8000, min: 4000, max: 20000, step: 500 },
] as const;

function fmt(n: number): string {
  return n.toLocaleString("ar-SA");
}

type SalaryCalculatorProps = {
  /** Hides hero intro and outer padding when nested (e.g. features stepper). */
  embedded?: boolean;
};

export function SalaryCalculator({ embedded = false }: SalaryCalculatorProps): ReactElement {
  const [salaries, setSalaries] = useState<number[]>(() => roles.map((r) => r.default));
  const [activeRoles, setActiveRoles] = useState<boolean[]>(() => roles.map(() => true));
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const { teamTotal, multiplier, teamDisplay, modontyDisplay, savingPct } = useMemo(() => {
    const total = salaries.reduce((sum, val, i) => sum + (activeRoles[i] ? val : 0), 0);
    const mult = billing === "yearly" ? 12 : 1;
    const rawPct = total > 0 ? Math.round((1 - MODONTY_MAX / total) * 100) : 0;
    const saving = Math.min(100, Math.max(0, rawPct));
    return {
      teamTotal: total,
      multiplier: mult,
      teamDisplay: total * mult,
      modontyDisplay: MODONTY_MAX * mult,
      savingPct: saving,
    };
  }, [salaries, activeRoles, billing]);

  return (
    <div
      className={cn("min-h-0 text-foreground", embedded ? "py-0" : "bg-background px-5 py-12")}
      dir="rtl"
    >
      {embedded ? null : (
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="text-[11px] font-black uppercase tracking-[.12em] text-accent">احسب توفيرك الحقيقي</span>
          </div>
          <h2 className="mb-2 text-2xl leading-tight text-foreground md:text-3xl lg:text-4xl">
            ٦ موظفين أو <em className="not-italic text-accent">مدونتي؟</em>
          </h2>
          <p className="mx-auto mb-4 max-w-[480px] text-sm leading-relaxed text-muted-foreground">
            لإنتاج محتوى SEO احترافي ونشره وترويجه شهرياً — مدونتي تغني عن توظيف ٥ أشخاص بالكامل.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-bold text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            تشمل: كتابة · تصميم · SEO · سوشال ميديا · فيديو · نشر وترويج
          </div>
        </div>
      )}

      <div className={cn("mx-auto flex flex-col gap-6", embedded ? "w-full max-w-none" : "max-w-[960px]")}>
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 p-1.5">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn(
              "rounded-xl px-5 py-2 text-sm font-bold transition-colors",
              billing === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            شهري
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn(
              "rounded-xl px-5 py-2 text-sm font-bold transition-colors",
              billing === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            سنوي
          </button>
        </div>

        <Card className="rounded-3xl border border-border bg-card px-5 py-7 shadow-lg sm:px-7 sm:py-8">
          <p className="mb-5 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
            اضبط رواتب فريقك الحالي أو المتوقع
          </p>

          <ul className="space-y-5">
            {roles.map((role, i) => (
              <li key={role.label}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={activeRoles[i]}
                      onCheckedChange={(v) =>
                        setActiveRoles((prev) => {
                          const next = [...prev];
                          next[i] = v === true;
                          return next;
                        })
                      }
                      id={`role-${i}`}
                      className="h-5 w-5"
                      aria-label={activeRoles[i] ? `تعطيل ${role.label}` : `تفعيل ${role.label}`}
                    />
                    <span className="inline-flex items-center gap-2 text-[13px] font-bold text-foreground">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-muted text-[15px]">{role.icon}</span>
                      <label htmlFor={`role-${i}`} className="cursor-pointer">
                        {role.label}
                      </label>
                    </span>
                  </div>
                  <span className="min-w-[108px] rounded-lg bg-accent/10 px-3 py-1 text-center text-[13px] font-extrabold text-accent">
                    {fmt(activeRoles[i] ? salaries[i] : 0)} ر.س
                  </span>
                </div>
                <input
                  dir="ltr"
                  type="range"
                  min={role.min}
                  max={role.max}
                  step={role.step}
                  value={salaries[i]}
                  disabled={!activeRoles[i]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setSalaries((prev) => {
                      const next = [...prev];
                      next[i] = v;
                      return next;
                    });
                  }}
                  className="h-2 w-full cursor-pointer rounded-full bg-muted accent-accent disabled:cursor-not-allowed disabled:opacity-40"
                />
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              إجمالي الفريق{billing === "yearly" ? " (سنوياً)" : " (شهرياً)"}
            </p>
            <p className="text-2xl font-black text-foreground sm:text-3xl">{fmt(teamDisplay)} ر.س</p>
          </Card>
          <Card className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 text-center shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">تكلفة مدونتي (الحد الأقصى)</p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 sm:text-3xl">{fmt(modontyDisplay)} ر.س</p>
          </Card>
          <Card className="rounded-2xl border border-violet-200/80 bg-violet-50/50 p-5 text-center shadow-sm dark:border-violet-900/50 dark:bg-violet-950/30">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">نسبة التوفير</p>
            <p className="text-2xl font-black text-violet-700 dark:text-violet-400 sm:text-3xl">{savingPct}٪</p>
            {teamTotal > 0 && teamTotal < MODONTY_MAX ? (
              <p className="mt-2 text-[10px] text-muted-foreground">المقارنة مع خطة أقصى سعر ({fmt(MODONTY_MAX)} ر.س/شهر)</p>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
