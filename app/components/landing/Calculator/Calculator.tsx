"use client";

import { useState } from "react";

import type { MoneyPair } from "./calculatorTypes";
import {
  CALCULATOR_BAD_EXTRA_ITEM,
  CALCULATOR_BAD_ITEM_LABELS,
  CALCULATOR_FOOTER_BADGES,
  CALCULATOR_DEFAULT_CTA_LABEL,
  CALCULATOR_GOOD_ITEMS,
  CALCULATOR_SLIDER_LABELS,
  CALCULATOR_SET_TEAM_TEXT,
} from "./calculatorCopy";
import IntroBlock from "./IntroBlock";
import SavingsCard from "./SavingsCard";
import WithPlanCard from "./WithPlanCard";
import WithoutPlanCard from "./WithoutPlanCard";

import { Icon } from "@/app/components/Icon";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

const SUB_M = 1299;
const SUB_Y = SUB_M * 12;

function fmt(n: number): string {
  return n.toLocaleString("ar-SA");
}

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

function SliderRow({
  icon,
  label,
  iconBgClass,
  value,
  min,
  max,
  step,
  onChange,
}: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-5 shrink-0 lg:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${iconBgClass}`}
          >
            <Icon emoji={icon} className="w-5 h-5" />
          </span>
          {label}
        </span>
        <span className="min-w-[110px] rounded-lg border border-border bg-muted px-3 py-1 text-center text-sm font-black tabular-nums text-foreground">
          {fmt(value)}
        </span>
      </div>

      <Input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-[5px] w-full cursor-pointer rounded-full outline-none"
        style={{
          WebkitAppearance: "none",
          background: `linear-gradient(to left, var(--accent) ${pct}%, var(--border) ${pct}%)`,
        }}
      />
    </div>
  );
}

type WhyNowProps = {
  featuresLink?: string;
  ctaLink?: string;
  ctaLabel?: string;
};

export default function Calculator({
  featuresLink = "/features",
  ctaLink = "/signup",
  ctaLabel = CALCULATOR_DEFAULT_CTA_LABEL,
}: WhyNowProps) {
  const [writer, setWriter] = useState(4500);
  const [designer, setDesigner] = useState(7000);
  const [seo, setSeo] = useState(6000);
  const [social, setSocial] = useState(5500);
  const [video, setVideo] = useState(6000);
  const [dev, setDev] = useState(8000);

  const totalM = writer + designer + seo + social + video + dev;
  const totalY = totalM * 12;
  const saveM = totalM - SUB_M;
  const saveY = totalY - SUB_Y;
  const pct = Math.round((saveM / totalM) * 100);

  const badItems: MoneyPair[] = [
    [CALCULATOR_BAD_ITEM_LABELS[0], fmt(writer)],
    [CALCULATOR_BAD_ITEM_LABELS[1], fmt(designer)],
    [CALCULATOR_BAD_ITEM_LABELS[2], fmt(seo)],
    [CALCULATOR_BAD_ITEM_LABELS[3], fmt(social)],
    [CALCULATOR_BAD_ITEM_LABELS[4], fmt(video)],
    [CALCULATOR_BAD_ITEM_LABELS[5], fmt(dev)],
    CALCULATOR_BAD_EXTRA_ITEM,
  ];

  const goodItems = [...CALCULATOR_GOOD_ITEMS];

  return (
    <section
      id="why-now"
      dir="rtl"
      className="relative overflow-hidden border-t border-border bg-background px-5 pb-16 pt-20 sm:px-8 lg:px-10 lg:pb-20 lg:pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        <IntroBlock pct={pct} />

        <Card className="mb-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="mb-6 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/60">
            {CALCULATOR_SET_TEAM_TEXT}
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-5">
            <div className="flex min-h-0 min-w-0 flex-col gap-4 lg:h-full lg:justify-between lg:gap-0">
              <SliderRow
                icon="✍️"
                label={CALCULATOR_SLIDER_LABELS.writer}
                iconBgClass="bg-primary/5 text-primary"
                value={writer}
                min={2000}
                max={12000}
                step={500}
                onChange={setWriter}
              />
              <SliderRow
                icon="🎨"
                label={CALCULATOR_SLIDER_LABELS.designer}
                iconBgClass="bg-accent/5 text-accent"
                value={designer}
                min={2000}
                max={15000}
                step={500}
                onChange={setDesigner}
              />
              <SliderRow
                icon="📈"
                label={CALCULATOR_SLIDER_LABELS.seo}
                iconBgClass="bg-success/5 text-success"
                value={seo}
                min={2000}
                max={15000}
                step={500}
                onChange={setSeo}
              />
              <SliderRow
                icon="📱"
                label={CALCULATOR_SLIDER_LABELS.social}
                iconBgClass="bg-destructive/5 text-destructive"
                value={social}
                min={2000}
                max={12000}
                step={500}
                onChange={setSocial}
              />
              <SliderRow
                icon="🎬"
                label={CALCULATOR_SLIDER_LABELS.video}
                iconBgClass="bg-secondary/10 text-secondary-foreground"
                value={video}
                min={2000}
                max={15000}
                step={500}
                onChange={setVideo}
              />
              <SliderRow
                icon="💻"
                label={CALCULATOR_SLIDER_LABELS.dev}
                iconBgClass="bg-muted/40 text-foreground"
                value={dev}
                min={4000}
                max={20000}
                step={500}
                onChange={setDev}
              />
            </div>

            <WithoutPlanCard
              badItems={badItems}
              totalM={totalM}
              totalY={totalY}
              formatMoney={fmt}
            />
            <WithPlanCard
              goodItems={goodItems}
              subM={SUB_M}
              subY={SUB_Y}
              formatMoney={fmt}
            />
          </div>
        </Card>

        <SavingsCard
          totalM={totalM}
          totalY={totalY}
          subM={SUB_M}
          subY={SUB_Y}
          saveM={saveM}
          saveY={saveY}
          pct={pct}
          ctaLink={ctaLink}
          ctaLabel={ctaLabel}
          featuresLink={featuresLink}
          formatMoney={fmt}
        />

        <div className="flex flex-wrap justify-center gap-2">
          {CALCULATOR_FOOTER_BADGES.map((p) => (
            <Badge
              key={p}
              variant="outline"
              className="rounded-full border-border bg-card px-3.5 py-1.5 text-xs font-bold text-muted-foreground"
            >
              {p}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

