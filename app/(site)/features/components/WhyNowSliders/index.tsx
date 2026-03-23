"use client";

import type { ReactNode } from "react";

import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

type SliderRowProps = {
  icon: string;
  label: string;
  iconBgClass: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
};

type CompareColProps = {
  bad?: boolean;
  head: string;
  items: { name: string; val: string }[];
  monthlyTotal: string;
  annualTotal: string;
};

function fmt(n: number): string {
  return n.toLocaleString("ar-SA");
}

function SliderRow({
  icon,
  label,
  iconBgClass,
  value,
  min,
  max,
  step,
  onChange,
}: SliderRowProps): ReactNode {
  const pct = ((value - min) / (max - min)) * 100;
  void pct;
  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[13px] font-bold text-foreground">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-[15px] ${iconBgClass}`}
          >
            {icon}
          </span>
          {label}
        </span>
        <span className="min-w-[108px] rounded-lg bg-accent/10 px-3 py-1 text-center text-[13px] font-extrabold text-accent">
          {fmt(value)} ريال
        </span>
      </div>
      <Input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted"
      />
    </div>
  );
}

function CompareCol({ bad, head, items, monthlyTotal, annualTotal }: CompareColProps): ReactNode {
  return (
    <Card
      className={`rounded-2xl border px-4 py-5 shadow-sm ${
        bad ? "border-destructive/30 bg-destructive/5" : "border-emerald-200 bg-emerald-50"
      }`}
    >
      <p
        className={`mb-3 text-[11px] font-extrabold uppercase tracking-[.08em] ${
          bad ? "text-destructive" : "text-emerald-600"
        }`}
      >
        {head}
      </p>
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex items-center justify-between py-1.5 ${i < items.length - 1 ? "border-b border-black/5" : ""}`}
        >
          <span className="text-[12px] font-medium text-muted-foreground">{item.name}</span>
          <span className={`text-[12px] font-extrabold ${bad ? "text-destructive" : "text-emerald-600"}`}>{item.val}</span>
        </div>
      ))}
      <div className="mt-3 grid grid-cols-[1fr,1px,1fr] items-center border-t border-black/10 pt-3">
        <div className="text-center">
          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[.07em] text-muted-foreground">شهرياً</p>
          <p
            className={`text-[17px] font-black leading-tight ${bad ? "text-destructive" : "text-emerald-600"}`}
          >
            {monthlyTotal}
          </p>
        </div>
        <div className="h-full w-px self-stretch bg-black/10" />
        <div className="text-center">
          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[.07em] text-muted-foreground">سنوياً</p>
          <p
            className={`text-[17px] font-black leading-tight ${bad ? "text-destructive" : "text-emerald-600"}`}
          >
            {annualTotal}
          </p>
        </div>
      </div>
    </Card>
  );
}

type WhyNowSlidersProps = {
  writer: number;
  designer: number;
  seo: number;
  social: number;
  video: number;
  dev: number;
  totalM: number;
  totalY: number;
  setWriter: (v: number) => void;
  setDesigner: (v: number) => void;
  setSeo: (v: number) => void;
  setSocial: (v: number) => void;
  setVideo: (v: number) => void;
  setDev: (v: number) => void;
};

export function WhyNowSliders({
  writer,
  designer,
  seo,
  social,
  video,
  dev,
  totalM,
  totalY,
  setWriter,
  setDesigner,
  setSeo,
  setSocial,
  setVideo,
  setDev,
}: WhyNowSlidersProps) {
  return (
    <Card className="mx-auto mb-4 max-w-[960px] rounded-3xl border border-border bg-card px-7 py-8 shadow-lg">
      <p className="mb-5 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">اضبط رواتب فريقك الحالي أو المتوقع</p>

      <SliderRow
        icon="✍️"
        label="كاتب محتوى SEO"
        iconBgClass="bg-blue-50"
        value={writer}
        min={2000}
        max={12000}
        step={500}
        onChange={setWriter}
      />
      <SliderRow
        icon="🎨"
        label="مصمم جرافيك"
        iconBgClass="bg-fuchsia-50"
        value={designer}
        min={2000}
        max={15000}
        step={500}
        onChange={setDesigner}
      />
      <SliderRow
        icon="📈"
        label="متخصص SEO"
        iconBgClass="bg-emerald-50"
        value={seo}
        min={2000}
        max={15000}
        step={500}
        onChange={setSeo}
      />
      <SliderRow
        icon="📱"
        label="مدير سوشال ميديا"
        iconBgClass="bg-amber-50"
        value={social}
        min={2000}
        max={12000}
        step={500}
        onChange={setSocial}
      />
      <SliderRow
        icon="🎬"
        label="مونتير / منتج فيديو"
        iconBgClass="bg-rose-50"
        value={video}
        min={2000}
        max={15000}
        step={500}
        onChange={setVideo}
      />
      <SliderRow
        icon="💻"
        label="مطور مواقع"
        iconBgClass="bg-sky-50"
        value={dev}
        min={4000}
        max={20000}
        step={500}
        onChange={setDev}
      />

      <hr className="my-6 border-dashed border-border" />

      <div className="grid grid-cols-[1fr,44px,1fr] items-stretch">
        <CompareCol
          bad
          head="❌ بدون مدونتي"
          items={[
            { name: "كاتب محتوى", val: `${fmt(writer)} ر.س` },
            { name: "مصمم جرافيك", val: `${fmt(designer)} ر.س` },
            { name: "متخصص SEO", val: `${fmt(seo)} ر.س` },
            { name: "مدير سوشال ميديا", val: `${fmt(social)} ر.س` },
            { name: "مونتير / منتج فيديو", val: `${fmt(video)} ر.س` },
            { name: "مطور مواقع", val: `${fmt(dev)} ر.س` },
            { name: "إدارة وتنسيق", val: "+ وقتك" },
          ]}
          monthlyTotal={`${fmt(totalM)} ر.س`}
          annualTotal={`${fmt(totalY)} ر.س`}
        />
        <div className="flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-[10px] font-extrabold text-muted-foreground">
            VS
          </div>
        </div>
        <CompareCol
          head="✓ مع مدونتي"
          items={[
            { name: "مقالات SEO احترافية", val: "✓ مشمول" },
            { name: "تصميم وصفحة خاصة", val: "✓ مشمول" },
            { name: "تهيئة محركات البحث", val: "✓ مشمول" },
            { name: "ترويج ٨ منصات اجتماعية", val: "✓ مشمول" },
            { name: "إنتاج ريلز شهرياً", val: "✓ مشمول" },
            { name: "نشر وإدارة كاملة", val: "✓ مشمول" },
            { name: "صفحة شركة (بدون مطور)", val: "✓ مشمول" },
          ]}
          monthlyTotal="1,299 ر.س"
          annualTotal="15,588 ر.س"
        />
      </div>
    </Card>
  );
}

