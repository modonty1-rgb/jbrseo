"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  updateSectionTextsFormData,
  updateImagesFormData,
  updateHeroSectionFormData,
  updateWhyNowFormData,
  updateHowItWorksFormData,
  updateOutcomesFormData,
  updateFaqFormData,
  updateSocialProofFormData,
  updatePricingTeaserFormData,
  updateSeoFormData,
  updateTrackingFormData,
  updateSiteSettingsFormData,
} from "@/app/actions/landing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { SupportedCountry, PricingPlan } from "@/lib/landing-content.types";
import { BM_FEATURES_FULL } from "@/lib/bm-features";

const TAB_ORDER: string[] = [
  "hero",
  "whyNow",
  "howItWorks",
  "outcomes",
  "socialProof",
  "pricingFree",
  "pricingStarter",
  "pricingProfessional",
  "pricingEnterprise",
  "pricingPage",
  "faq",
  "finalCta",
  "footer",
  "seo",
  "images",
];

const SECTION_LABELS: Record<string, string> = {
  cta: "CTA",
  hero: "Hero",
  whyNow: "Why Now",
  howItWorks: "How We Work",
  outcomes: "Outcomes",
  socialProof: "Testimonials",
  pricingFree: "Free",
  pricingStarter: "Starter",
  pricingProfessional: "Professional",
  pricingEnterprise: "Enterprise",
  faq: "FAQ",
  finalCta: "Final CTA",
  seo: "SEO",
  footer: "Footer",
  pricingPage: "Pricing Page",
  images: "Settings",
};

const IMAGE_KEY_LABELS: Record<string, string> = {
  logoWhite: "Dark mode logo",
  logoLight: "Light mode logo",
};

const SIDEBAR_GROUPS: { label: string; ids: string[] }[] = [
  { label: "Sections", ids: ["hero", "whyNow", "howItWorks", "outcomes", "socialProof", "finalCta"] },
  { label: "Pricing", ids: ["pricingFree", "pricingStarter", "pricingProfessional", "pricingEnterprise", "pricingPage"] },
  { label: "Conversion", ids: ["faq"] },
  { label: "Site", ids: ["footer", "seo", "images"] },
];

function SubmitButton({ children, loadingLabel = "Saving…" }: { children: React.ReactNode; loadingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="secondary" className="w-fit" disabled={pending}>
      {pending ? loadingLabel : children}
    </Button>
  );
}

function getSectionHeading(
  sectionId: string,
  bySection: Record<string, { key: string; value: string }[]>
): { eyebrow: string; title: string; highlightBadge?: string } {
  const entries = bySection["sectionHeadings"] ?? [];
  const eyebrow = entries.find((e) => e.key === `${sectionId}_eyebrow`)?.value ?? "";
  const title = entries.find((e) => e.key === `${sectionId}_title`)?.value ?? "";
  const highlightBadge =
    sectionId === "pricingTeaser"
      ? (entries.find((e) => e.key === `${sectionId}_highlightBadge`)?.value ?? "")
      : undefined;
  return { eyebrow, title, ...(highlightBadge && { highlightBadge }) };
}

function isJsonKey(key: string): boolean {
  return false;
}

function parseBenefitsArray(value: string): string[] {
  try {
    const arr = JSON.parse(value) as string[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function parseStepsArray(value: string): { title: string; line: string }[] {
  try {
    const arr = JSON.parse(value) as { title?: string; line?: string }[];
    if (!Array.isArray(arr)) return [];
    return arr.map((s) => ({ title: s?.title ?? "", line: s?.line ?? "" }));
  } catch {
    return [];
  }
}

function parseFaqArray(value: string): { question: string; answer: string }[] {
  try {
    const arr = JSON.parse(value) as { question?: string; answer?: string }[];
    if (!Array.isArray(arr)) return [];
    return arr.map((s) => ({ question: s?.question ?? "", answer: s?.answer ?? "" }));
  } catch {
    return [];
  }
}

function parseTestimonialsArray(
  value: string
): { name: string; role: string; quote: string; metric: string; image?: string }[] {
  try {
    const parsed = JSON.parse(value) as
      | { name?: string; role?: string; quote?: string; metric?: string; image?: string }
      | { name?: string; role?: string; quote?: string; metric?: string; image?: string }[];
    if (Array.isArray(parsed)) {
      return parsed.map((o) => ({
        name: o?.name ?? "",
        role: o?.role ?? "",
        quote: o?.quote ?? "",
        metric: o?.metric ?? "",
        image: (o?.image as string)?.trim() || undefined,
      }));
    }
    if (parsed && typeof parsed === "object") {
      return [
        {
          name: parsed.name ?? "",
          role: parsed.role ?? "",
          quote: parsed.quote ?? "",
          metric: parsed.metric ?? "",
          image: (parsed.image as string)?.trim() || undefined,
        },
      ];
    }
    return [];
  } catch {
    return [];
  }
}

function parseStatsArray(value: string): { value: string; label: string }[] {
  try {
    const arr = JSON.parse(value) as { value?: string; label?: string }[];
    if (!Array.isArray(arr)) return [];
    return arr.map((s) => ({ value: s?.value ?? "", label: s?.label ?? "" }));
  } catch {
    return [];
  }
}

function parsePlansArray(value: string): PricingPlan[] {
  try {
    const arr = JSON.parse(value) as PricingPlan[];
    if (!Array.isArray(arr)) return [];
    return arr.map((p) => ({
      name: p?.name ?? "",
      forWho: p?.forWho ?? "",
      cta: p?.cta ?? "",
      ctaLink: p?.ctaLink,
      price: p?.price,
      annualPrice: p?.annualPrice,
      badge: p?.badge,
      highlight: !!p?.highlight,
      features: Array.isArray(p?.features) ? p.features : [],
    }));
  } catch {
    return [];
  }
}

const inputBase =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";
const labelClass = "text-xs font-medium text-muted-foreground";

type HeroSectionFormProps = {
  country: SupportedCountry;
  heroImageUrl: string | undefined;
  benefitsInitial: string[];
  entries: { key: string; value: string }[];
};

function HeroSectionForm({ country, heroImageUrl, benefitsInitial, entries }: HeroSectionFormProps) {
  const nextBenefitId = useRef(0);
  const [benefits, setBenefits] = useState<{ _id: number; value: string }[]>(() => {
    const src = benefitsInitial.length > 0 ? benefitsInitial : [""];
    return src.map((v) => ({ _id: nextBenefitId.current++, value: v }));
  });
  return (
    <form action={updateHeroSectionFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      {heroImageUrl !== undefined && (
        <div className="flex flex-col gap-2">
          <label className={labelClass} htmlFor="hero-image">Hero image (avatar)</label>
          <input
            id="hero-image"
            type="url"
            name="heroImageUrl"
            defaultValue={heroImageUrl}
            placeholder="https://..."
            className={inputBase}
            dir="ltr"
          />
        </div>
      )}
      <Collapsible defaultOpen={false} className="rounded-md border border-border bg-muted/20">
        <div className="flex items-center justify-between gap-2 p-2">
          <CollapsibleTrigger
            className="flex flex-1 items-center gap-2 text-left font-medium hover:underline [&[data-state=open]>svg]:rotate-180"
            id="hero-benefits-heading"
          >
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" aria-hidden />
            <span>Benefits ({benefits.length})</span>
          </CollapsibleTrigger>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setBenefits((b) => [...b, { _id: nextBenefitId.current++, value: "" }])}
          >
            Add benefit
          </Button>
        </div>
        <CollapsibleContent className="px-2 pb-2 pt-0">
          <div className="space-y-2">
            {benefits.map((item, i) => (
              <div key={item._id} className="flex gap-2">
                <input
                  type="text"
                  name={`benefit_${i}`}
                  value={item.value}
                  onChange={(e) => setBenefits((b) => b.map((x) => x._id === item._id ? { ...x, value: e.target.value } : x))}
                  className={inputBase}
                  placeholder={`Benefit ${i + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setBenefits((b) => b.filter((x) => x._id !== item._id))}
                  aria-label="Remove benefit"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <input type="hidden" name="benefitsCount" value={benefits.length} />
        </CollapsibleContent>
      </Collapsible>
      <div className="grid grid-cols-2 gap-3">
      {entries.map(({ key, value }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor={`hero-${key}`}>{key}</label>
          <input
            id={`hero-${key}`}
            type="text"
            name={`v_${key}`}
            defaultValue={value}
            className={inputBase}
          />
        </div>
      ))}
      </div>
      <SubmitButton>Save section</SubmitButton>
    </form>
  );
}

type WhyNowSectionFormProps = {
  country: SupportedCountry;
  linesInitial: string[];
  heading: { eyebrow: string; title: string };
};

function WhyNowSectionForm({ country, linesInitial, heading }: WhyNowSectionFormProps) {
  const nextLineId = useRef(0);
  const [lines, setLines] = useState<{ _id: number; value: string }[]>(() => {
    const src = linesInitial.length > 0 ? linesInitial : [""];
    return src.map((v) => ({ _id: nextLineId.current++, value: v }));
  });
  return (
    <form action={updateWhyNowFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      <div id="whynow-section-heading" className="rounded-lg border border-border bg-primary/10 p-3 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Section heading</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="whynow-sh-eyebrow">Eyebrow</label>
            <input id="whynow-sh-eyebrow" type="text" name="sh_eyebrow" defaultValue={heading.eyebrow} className={inputBase} placeholder="Small label above title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="whynow-sh-title">Title</label>
            <input id="whynow-sh-title" type="text" name="sh_title" defaultValue={heading.title} className={inputBase} placeholder="Main section title" />
          </div>
        </div>
        <input type="hidden" name="sh_section" value="whyNow" />
      </div>
      <Collapsible defaultOpen={false} className="rounded-lg border border-border bg-muted/20">
        <div className="flex items-center justify-between gap-2 p-3">
          <CollapsibleTrigger className="flex flex-1 items-center gap-2 text-left font-medium hover:underline [&[data-state=open]>svg]:rotate-180">
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" aria-hidden />
            <span>Lines ({lines.length})</span>
          </CollapsibleTrigger>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLines((b) => [...b, { _id: nextLineId.current++, value: "" }])}
          >
            Add line
          </Button>
        </div>
        <CollapsibleContent className="px-3 pb-3 pt-0 space-y-3">
          {lines.map((item, i) => (
            <div key={item._id} className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor={`whynow-line-${item._id}`}>Line {i + 1}</label>
              <div className="flex gap-2">
                <input
                  id={`whynow-line-${item._id}`}
                  type="text"
                  name={`line_${i}`}
                  value={item.value}
                  onChange={(e) => setLines((b) => b.map((x) => x._id === item._id ? { ...x, value: e.target.value } : x))}
                  className={`${inputBase} flex-1 min-w-0`}
                  placeholder={`Line ${i + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setLines((b) => b.filter((x) => x._id !== item._id))}
                  aria-label="Remove line"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <input type="hidden" name="linesCount" value={lines.length} />
        </CollapsibleContent>
      </Collapsible>
      <SubmitButton>Save section</SubmitButton>
    </form>
  );
}

type HowItWorksSectionFormProps = {
  country: SupportedCountry;
  stepsInitial: { title: string; line: string }[];
  heading: { eyebrow: string; title: string };
};

function HowItWorksSectionForm({ country, stepsInitial, heading }: HowItWorksSectionFormProps) {
  const nextStepId = useRef(0);
  const [steps, setSteps] = useState<{ _id: number; title: string; line: string }[]>(() => {
    const src = stepsInitial.length > 0 ? stepsInitial : [{ title: "", line: "" }];
    return src.map((v) => ({ _id: nextStepId.current++, ...v }));
  });
  return (
    <form action={updateHowItWorksFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      <div id="howitworks-section-heading" className="rounded-lg border border-border bg-primary/10 p-3 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Section heading</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="hiw-sh-eyebrow">Eyebrow</label>
            <input id="hiw-sh-eyebrow" type="text" name="sh_eyebrow" defaultValue={heading.eyebrow} className={inputBase} placeholder="Small label above title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="hiw-sh-title">Title</label>
            <input id="hiw-sh-title" type="text" name="sh_title" defaultValue={heading.title} className={inputBase} placeholder="Main section title" />
          </div>
        </div>
        <input type="hidden" name="sh_section" value="howItWorks" />
      </div>
      <Collapsible defaultOpen={false} className="rounded-lg border border-border bg-muted/20">
        <div className="flex items-center justify-between gap-2 p-3">
          <CollapsibleTrigger className="flex flex-1 items-center gap-2 text-left font-medium hover:underline [&[data-state=open]>svg]:rotate-180">
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" aria-hidden />
            <span>Steps ({steps.length})</span>
          </CollapsibleTrigger>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSteps((s) => [...s, { _id: nextStepId.current++, title: "", line: "" }])}
          >
            Add step
          </Button>
        </div>
        <CollapsibleContent className="px-3 pb-3 pt-0 space-y-3">
          {steps.map((step, i) => (
            <div key={step._id} className="rounded-md border border-border bg-muted/20 p-2.5">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className={labelClass}>Step {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setSteps((s) => s.filter((x) => x._id !== step._id))}
                  aria-label="Remove step"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-[30%_1fr] gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor={`step-${step._id}-title`}>Title</label>
                  <input
                    id={`step-${step._id}-title`}
                    type="text"
                    name={`step_${i}_title`}
                    value={step.title}
                    onChange={(e) => setSteps((s) => s.map((x) => x._id === step._id ? { ...x, title: e.target.value } : x))}
                    className={inputBase}
                    placeholder="Title"
                  />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label className={labelClass} htmlFor={`step-${step._id}-line`}>Description</label>
                  <input
                    id={`step-${step._id}-line`}
                    type="text"
                    name={`step_${i}_line`}
                    value={step.line}
                    onChange={(e) => setSteps((s) => s.map((x) => x._id === step._id ? { ...x, line: e.target.value } : x))}
                    className={inputBase}
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>
          ))}
          <input type="hidden" name="stepCount" value={steps.length} />
        </CollapsibleContent>
      </Collapsible>
      <SubmitButton>Save section</SubmitButton>
    </form>
  );
}

type OutcomesSectionFormProps = {
  country: SupportedCountry;
  itemsInitial: { title: string; line: string }[];
  heading: { eyebrow: string; title: string };
};

function OutcomesSectionForm({ country, itemsInitial, heading }: OutcomesSectionFormProps) {
  const nextItemId = useRef(0);
  const [items, setItems] = useState<{ _id: number; title: string; line: string }[]>(() => {
    const src = itemsInitial.length > 0 ? itemsInitial : [{ title: "", line: "" }];
    return src.map((v) => ({ _id: nextItemId.current++, ...v }));
  });
  return (
    <form action={updateOutcomesFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      <div id="outcomes-section-heading" className="rounded-lg border border-border bg-primary/10 p-3 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Section heading</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="out-sh-eyebrow">Eyebrow</label>
            <input id="out-sh-eyebrow" type="text" name="sh_eyebrow" defaultValue={heading.eyebrow} className={inputBase} placeholder="Small label above title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="out-sh-title">Title</label>
            <input id="out-sh-title" type="text" name="sh_title" defaultValue={heading.title} className={inputBase} placeholder="Main section title" />
          </div>
        </div>
        <input type="hidden" name="sh_section" value="outcomes" />
      </div>
      <Collapsible defaultOpen={false} className="rounded-lg border border-border bg-muted/20">
        <div className="flex items-center justify-between gap-2 p-3">
          <CollapsibleTrigger className="flex flex-1 items-center gap-2 text-left font-medium hover:underline [&[data-state=open]>svg]:rotate-180">
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" aria-hidden />
            <span>Items ({items.length})</span>
          </CollapsibleTrigger>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setItems((s) => [...s, { _id: nextItemId.current++, title: "", line: "" }])}
          >
            Add item
          </Button>
        </div>
        <CollapsibleContent className="px-3 pb-3 pt-0 space-y-3">
          {items.map((item, i) => (
            <div key={item._id} className="rounded-md border border-border bg-muted/20 p-2.5">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className={labelClass}>Item {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setItems((s) => s.filter((x) => x._id !== item._id))}
                  aria-label="Remove item"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-[30%_1fr] gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor={`item-${item._id}-title`}>Title</label>
                  <input
                    id={`item-${item._id}-title`}
                    type="text"
                    name={`item_${i}_title`}
                    value={item.title}
                    onChange={(e) => setItems((s) => s.map((x) => x._id === item._id ? { ...x, title: e.target.value } : x))}
                    className={inputBase}
                    placeholder="Title"
                  />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label className={labelClass} htmlFor={`item-${item._id}-line`}>Description</label>
                  <input
                    id={`item-${item._id}-line`}
                    type="text"
                    name={`item_${i}_line`}
                    value={item.line}
                    onChange={(e) => setItems((s) => s.map((x) => x._id === item._id ? { ...x, line: e.target.value } : x))}
                    className={inputBase}
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>
          ))}
          <input type="hidden" name="itemCount" value={items.length} />
        </CollapsibleContent>
      </Collapsible>
      <SubmitButton>Save section</SubmitButton>
    </form>
  );
}

type FaqSectionFormProps = {
  country: SupportedCountry;
  itemsInitial: { question: string; answer: string }[];
  heading: { eyebrow: string; title: string };
};

function FaqSectionForm({ country, itemsInitial, heading }: FaqSectionFormProps) {
  const nextFaqId = useRef(0);
  const [items, setItems] = useState<{ _id: number; question: string; answer: string }[]>(() => {
    const src = itemsInitial.length > 0 ? itemsInitial : [{ question: "", answer: "" }];
    return src.map((v) => ({ _id: nextFaqId.current++, ...v }));
  });
  return (
    <form action={updateFaqFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      <div id="faq-section-heading" className="rounded-lg border border-border bg-primary/10 p-3 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Section heading</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="faq-sh-eyebrow">Eyebrow</label>
            <input id="faq-sh-eyebrow" type="text" name="sh_eyebrow" defaultValue={heading.eyebrow} className={inputBase} placeholder="Small label above title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="faq-sh-title">Title</label>
            <input id="faq-sh-title" type="text" name="sh_title" defaultValue={heading.title} className={inputBase} placeholder="Main section title" />
          </div>
        </div>
        <input type="hidden" name="sh_section" value="faq" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <label className={labelClass}>FAQ items</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setItems((s) => [...s, { _id: nextFaqId.current++, question: "", answer: "" }])}
          >
            Add FAQ
          </Button>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item._id} className="rounded-md border border-border bg-muted/20 p-2.5">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className={labelClass}>FAQ {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setItems((s) => s.filter((x) => x._id !== item._id))}
                  aria-label="Remove FAQ"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-[30%_1fr] gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor={`faq-${item._id}-question`}>Question</label>
                  <input
                    id={`faq-${item._id}-question`}
                    type="text"
                    name={`faq_${i}_question`}
                    value={item.question}
                    onChange={(e) => setItems((s) => s.map((x) => x._id === item._id ? { ...x, question: e.target.value } : x))}
                    className={inputBase}
                    placeholder="Question"
                  />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <label className={labelClass} htmlFor={`faq-${item._id}-answer`}>Answer</label>
                  <textarea
                    id={`faq-${item._id}-answer`}
                    name={`faq_${i}_answer`}
                    value={item.answer}
                    onChange={(e) => setItems((s) => s.map((x) => x._id === item._id ? { ...x, answer: e.target.value } : x))}
                    rows={3}
                    className={inputBase}
                    placeholder="Answer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <input type="hidden" name="faqCount" value={items.length} />
      </div>
      <SubmitButton>Save section</SubmitButton>
    </form>
  );
}

const SEO_FIELDS: { key: string; label: string; type?: "text" | "url"; placeholder?: string }[] = [
  { key: "title", label: "Meta title" },
  { key: "description", label: "Meta description", type: "text" },
  { key: "canonical", label: "Canonical URL", type: "url", placeholder: "https://..." },
  { key: "ogLocale", label: "OG locale", placeholder: "ar_SA" },
  { key: "ogTitle", label: "OG title" },
  { key: "ogDescription", label: "OG description", type: "text" },
  { key: "ogImage", label: "OG image URL", type: "url", placeholder: "https://..." },
  { key: "ogImageWidth", label: "OG image width", placeholder: "1200" },
  { key: "ogImageHeight", label: "OG image height", placeholder: "630" },
  { key: "ogType", label: "OG type", placeholder: "website" },
  { key: "ogSiteName", label: "OG site name", placeholder: "JBRSEO" },
  { key: "twitterCard", label: "Twitter card", placeholder: "summary_large_image" },
  { key: "twitterTitle", label: "Twitter title" },
  { key: "twitterDescription", label: "Twitter description", type: "text" },
  { key: "twitterImage", label: "Twitter image URL", type: "url", placeholder: "https://..." },
];

type SeoSectionFormProps = {
  country: SupportedCountry;
  entries: { key: string; value: string }[];
};

function SeoSectionForm({ country, entries }: SeoSectionFormProps) {
  const get = (key: string) => entries.find((e) => e.key === key)?.value ?? "";
  return (
    <form action={updateSeoFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SEO_FIELDS.map(({ key, label, type = "text", placeholder }) => (
          <div
            key={key}
            className={type === "text" && (key === "description" || key === "ogDescription" || key === "twitterDescription") ? "col-span-2 flex flex-col gap-1.5" : "flex flex-col gap-1.5"}
          >
            <label className={labelClass} htmlFor={`seo-${key}`}>
              {label}
            </label>
            {key === "description" || key === "ogDescription" || key === "twitterDescription" ? (
              <textarea
                id={`seo-${key}`}
                name={key}
                defaultValue={get(key)}
                rows={2}
                className={inputBase}
                placeholder={placeholder}
                dir="ltr"
              />
            ) : (
              <input
                id={`seo-${key}`}
                type={type}
                name={key}
                defaultValue={get(key)}
                className={inputBase}
                placeholder={placeholder}
                dir="ltr"
              />
            )}
          </div>
        ))}
      </div>
      <SubmitButton loadingLabel="Saving…">Save SEO & social cards</SubmitButton>
    </form>
  );
}

type SocialProofSectionFormProps = {
  country: SupportedCountry;
  testimonialsInitial: { name: string; role: string; quote: string; metric: string; image?: string }[];
  statsInitial: { value: string; label: string }[];
  heading: { eyebrow: string; title: string };
};

function SocialProofSectionForm({
  country,
  testimonialsInitial,
  statsInitial,
  heading,
}: SocialProofSectionFormProps) {
  const router = useRouter();
  const nextTestimonialId = useRef(0);
  const nextStatId = useRef(0);
  const [testimonials, setTestimonials] = useState<
    { _id: number; name: string; role: string; quote: string; metric: string; image?: string }[]
  >(() => {
    const src = testimonialsInitial.length > 0 ? testimonialsInitial : [{ name: "", role: "", quote: "", metric: "" }];
    return src.map((v) => ({ _id: nextTestimonialId.current++, ...v }));
  });
  const [stats, setStats] = useState<{ _id: number; value: string; label: string }[]>(() => {
    const src = statsInitial.length > 0 ? statsInitial : [{ value: "", label: "" }];
    return src.map((v) => ({ _id: nextStatId.current++, ...v }));
  });
  const [state, formAction, isPending] = useActionState(
    async (
      _prev: { done?: boolean; error?: string },
      formData: FormData
    ): Promise<{ done?: boolean; error?: string }> => {
      try {
        await updateSocialProofFormData(formData);
        return { done: true, error: undefined };
      } catch (err) {
        return {
          done: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
    { done: false, error: undefined }
  );
  useEffect(() => {
    if (state.done) router.refresh();
  }, [state.done, router]);
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      <div id="socialproof-section-heading" className="rounded-lg border border-border bg-primary/10 p-3 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Section heading</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="sp-sh-eyebrow">Eyebrow</label>
            <input id="sp-sh-eyebrow" type="text" name="sh_eyebrow" defaultValue={heading.eyebrow} className={inputBase} placeholder="Small label above title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="sp-sh-title">Title</label>
            <input id="sp-sh-title" type="text" name="sh_title" defaultValue={heading.title} className={inputBase} placeholder="Main section title" />
          </div>
        </div>
        <input type="hidden" name="sh_section" value="socialProof" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <label className={labelClass} id="social-proof-testimonials-label">
            Testimonials
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setTestimonials((list) => [...list, { _id: nextTestimonialId.current++, name: "", role: "", quote: "", metric: "" }])
            }
          >
            Add testimonial
          </Button>
        </div>
        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <Collapsible key={t._id} defaultOpen={false}>
              <div className="rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between gap-2 p-3">
                  <CollapsibleTrigger
                    className="flex flex-1 items-center gap-2 text-left font-medium hover:underline [&[data-state=open]>svg]:rotate-180"
                    id={`testimonial-${t._id}-heading`}
                  >
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
                    <span>
                      Testimonial {i + 1}
                      {t.name.trim() ? ` — ${t.name}` : ""}
                    </span>
                  </CollapsibleTrigger>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setTestimonials((list) => {
                        const next = list.filter((x) => x._id !== t._id);
                        return next.length > 0 ? next : [{ _id: nextTestimonialId.current++, name: "", role: "", quote: "", metric: "" }];
                      })
                    }
                    aria-label="Remove testimonial"
                  >
                    Remove
                  </Button>
                </div>
                <CollapsibleContent className="px-3 pb-3 pt-0 space-y-2">
                  <label htmlFor={`testimonial_${t._id}_name`} className={labelClass}>
                    Name
                  </label>
                  <input
                    id={`testimonial_${t._id}_name`}
                    type="text"
                    name={`testimonial_${i}_name`}
                    value={t.name}
                    onChange={(e) => setTestimonials((list) => list.map((x) => x._id === t._id ? { ...x, name: e.target.value } : x))}
                    className={inputBase}
                    placeholder="Name"
                  />
                  <label htmlFor={`testimonial_${t._id}_role`} className={labelClass}>
                    Role
                  </label>
                  <input
                    id={`testimonial_${t._id}_role`}
                    type="text"
                    name={`testimonial_${i}_role`}
                    value={t.role}
                    onChange={(e) => setTestimonials((list) => list.map((x) => x._id === t._id ? { ...x, role: e.target.value } : x))}
                    className={inputBase}
                    placeholder="Role"
                  />
                  <label htmlFor={`testimonial_${t._id}_quote`} className={labelClass}>
                    Quote
                  </label>
                  <textarea
                    id={`testimonial_${t._id}_quote`}
                    name={`testimonial_${i}_quote`}
                    value={t.quote}
                    onChange={(e) => setTestimonials((list) => list.map((x) => x._id === t._id ? { ...x, quote: e.target.value } : x))}
                    rows={3}
                    className={inputBase}
                    placeholder="Quote"
                  />
                  <label htmlFor={`testimonial_${t._id}_metric`} className={labelClass}>
                    Metric
                  </label>
                  <input
                    id={`testimonial_${t._id}_metric`}
                    type="text"
                    name={`testimonial_${i}_metric`}
                    value={t.metric}
                    onChange={(e) => setTestimonials((list) => list.map((x) => x._id === t._id ? { ...x, metric: e.target.value } : x))}
                    className={inputBase}
                    placeholder="Metric"
                  />
                  <label htmlFor={`testimonial_${t._id}_image`} className={labelClass}>
                    Image URL (optional)
                  </label>
                  <input
                    id={`testimonial_${t._id}_image`}
                    type="url"
                    name={`testimonial_${i}_image`}
                    value={t.image ?? ""}
                    onChange={(e) => setTestimonials((list) => list.map((x) => x._id === t._id ? { ...x, image: e.target.value || undefined } : x))}
                    className={inputBase}
                    placeholder="Image URL (optional)"
                  />
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
        <input type="hidden" name="testimonialCount" value={testimonials.length} />
      </div>
      <Collapsible defaultOpen={false}>
        <div className="rounded-lg border border-border bg-muted/20">
          <CollapsibleTrigger
            className="flex w-full items-center justify-between gap-2 p-3 text-left font-medium hover:underline [&[data-state=open]>svg]:rotate-180"
            id="social-proof-stats-label"
          >
            <span className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
              Stats
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-2 pt-0">
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStats((s) => [...s, { _id: nextStatId.current++, value: "", label: "" }])}
                >
                  Add stat
                </Button>
              </div>
              <div className="space-y-2">
                {stats.map((stat, i) => (
                  <div key={stat._id} className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-2">
                    <div className="flex-1 space-y-1">
                      <label htmlFor={`stat_${stat._id}_value`} className={labelClass}>
                        Value
                      </label>
                      <input
                        id={`stat_${stat._id}_value`}
                        type="text"
                        name={`stat_${i}_value`}
                        value={stat.value}
                        onChange={(e) => setStats((s) => s.map((x) => x._id === stat._id ? { ...x, value: e.target.value } : x))}
                        className={inputBase}
                        placeholder="Value"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label htmlFor={`stat_${stat._id}_label`} className={labelClass}>
                        Label
                      </label>
                      <input
                        id={`stat_${stat._id}_label`}
                        type="text"
                        name={`stat_${i}_label`}
                        value={stat.label}
                        onChange={(e) => setStats((s) => s.map((x) => x._id === stat._id ? { ...x, label: e.target.value } : x))}
                        className={inputBase}
                        placeholder="Label"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => setStats((s) => s.filter((x) => x._id !== stat._id))}
                      aria-label="Remove stat"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <input type="hidden" name="statsCount" value={stats.length} />
          </CollapsibleContent>
        </div>
      </Collapsible>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          className="w-fit"
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save section"}
        </Button>
        {state.done && (
          <span className="text-sm text-success" role="status">
            Saved.
          </span>
        )}
        {state.error && (
          <span className="text-sm text-destructive" role="alert">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}

type PricingPlanSingleTabFormProps = {
  country: SupportedCountry;
  plans: PricingPlan[];
  setPlans: React.Dispatch<React.SetStateAction<PricingPlan[]>>;
  planIndex: number;
  sectionCta: string;
  heading: { eyebrow: string; title: string; highlightBadge?: string };
};

function PricingPlanSingleTabForm({
  country,
  plans,
  setPlans,
  planIndex,
  sectionCta,
  heading,
}: PricingPlanSingleTabFormProps) {
  const router = useRouter();
  const normalized = plans.length >= PLAN_COUNT ? plans.slice(0, PLAN_COUNT) : [...plans, ...Array.from({ length: PLAN_COUNT - plans.length }, () => ({ name: "", forWho: "", cta: sectionCta, features: [] as string[] }))];
  const plan = normalized[planIndex] ?? { name: "", forWho: "", cta: sectionCta, features: [] };
  const [state, formAction, isPending] = useActionState(
    async (
      _prev: { done?: boolean; error?: string },
      formData: FormData
    ): Promise<{ done?: boolean; error?: string }> => {
      try {
        await updatePricingTeaserFormData(formData);
        return { done: true, error: undefined };
      } catch (err) {
        return {
          done: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
    { done: false, error: undefined }
  );
  useEffect(() => {
    if (state.done) router.refresh();
  }, [state.done, router]);

  const renderHiddenPlan = (i: number) => {
    const p = normalized[i] ?? { name: "", forWho: "", cta: sectionCta, features: [] as string[] };
    const feats = p.features ?? [];
    return (
      <div key={i} className="hidden" aria-hidden>
        <input type="hidden" name={`plan_${i}_name`} value={p.name} />
        <input type="hidden" name={`plan_${i}_forWho`} value={p.forWho} />
        <input type="hidden" name={`plan_${i}_price`} value={"price" in p ? (p.price ?? "") : ""} />
        <input type="hidden" name={`plan_${i}_annualPrice`} value={"annualPrice" in p ? (p.annualPrice ?? "") : ""} />
        <input type="hidden" name={`plan_${i}_badge`} value={"badge" in p ? (p.badge ?? "") : ""} />
        {"highlight" in p && p.highlight && <input type="hidden" name={`plan_${i}_highlight`} value="on" />}
        <input type="hidden" name={`plan_${i}_featuresCount`} value={String(feats.length)} />
        {feats.map((f, j) => (
          <input key={j} type="hidden" name={`plan_${i}_feature_${j}`} value={f} />
        ))}
      </div>
    );
  };

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="planCount" value={String(PLAN_COUNT)} />
      <Collapsible defaultOpen={false} className="rounded-lg border border-border bg-primary/10" id="pricing-section-heading">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <CollapsibleTrigger className="flex flex-1 items-center gap-2 text-left text-sm font-semibold hover:underline [&[data-state=open]>svg]:rotate-180">
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" aria-hidden />
            <span>Package information</span>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="px-3 pb-3 pt-0 space-y-3">
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1.5 min-w-[180px] flex-1">
              <label className={labelClass} htmlFor={`plan_${planIndex}_name`}>Name</label>
              <input
                id={`plan_${planIndex}_name`}
                type="text"
                name={`plan_${planIndex}_name`}
                defaultValue={plan.name}
                className={inputBase}
                placeholder="Plan name"
              />
            </div>
            <div className="space-y-1.5 min-w-[180px] flex-1">
              <label className={labelClass} htmlFor={`plan_${planIndex}_forWho`}>For who</label>
              <input
                id={`plan_${planIndex}_forWho`}
                type="text"
                name={`plan_${planIndex}_forWho`}
                defaultValue={plan.forWho}
                className={inputBase}
                placeholder="e.g. For small teams"
              />
            </div>
            <div className="space-y-1.5 min-w-[180px] flex-1">
              <label className={labelClass} htmlFor={`plan_${planIndex}_badge`}>Badge (optional)</label>
              <input
                id={`plan_${planIndex}_badge`}
                type="text"
                name={`plan_${planIndex}_badge`}
                defaultValue={"badge" in plan ? (plan.badge ?? "") : ""}
                className={inputBase}
                placeholder="e.g. Most popular"
              />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name={`plan_${planIndex}_highlight`}
              defaultChecked={"highlight" in plan ? !!plan.highlight : false}
              value="on"
              className="rounded border-input"
            />
            <span className={labelClass}>Highlight this plan</span>
          </label>
          <div className="pt-2 border-t border-border/60 space-y-2">
            <label className={labelClass} htmlFor="pricingTeaser_cta">CTA text (all plans)</label>
            <input
              id="pricingTeaser_cta"
              type="text"
              name="pricingTeaser_cta"
              defaultValue={sectionCta}
              className={inputBase}
              placeholder="e.g. ابدأ الآن"
            />
          </div>
          <div className="pt-2 border-t border-border/60 space-y-2">
            <p className={labelClass}>Section heading on page</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-1.5 min-w-[180px] flex-1">
                <label className={labelClass} htmlFor="pt-sh-eyebrow">Eyebrow</label>
                <input id="pt-sh-eyebrow" type="text" name="sh_eyebrow" defaultValue={heading.eyebrow} className={inputBase} placeholder="e.g. الخطط" />
              </div>
              <div className="flex flex-col gap-1.5 min-w-[180px] flex-1">
                <label className={labelClass} htmlFor="pt-sh-title">Title</label>
                <input id="pt-sh-title" type="text" name="sh_title" defaultValue={heading.title} className={inputBase} placeholder="e.g. اختر خطتك" />
              </div>
              <div className="flex flex-col gap-1.5 min-w-[180px] flex-1">
                <label className={labelClass} htmlFor="pt-sh-badge">Highlight badge</label>
                <input id="pt-sh-badge" type="text" name="sh_highlightBadge" defaultValue={heading.highlightBadge ?? ""} className={inputBase} placeholder="e.g. الأكثر شيوعاً" />
              </div>
            </div>
          </div>
          <input type="hidden" name="sh_section" value="pricingTeaser" />
        </CollapsibleContent>
      </Collapsible>
      {Array.from({ length: PLAN_COUNT }, (_, i) => (i === planIndex ? null : renderHiddenPlan(i)))}
      <fieldset className="space-y-2">
        <div className="rounded-md border border-border bg-muted/20 p-2.5 space-y-3">
          <p className={labelClass}>Price</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor={`plan_${planIndex}_price`}>Monthly price</label>
              <input
                id={`plan_${planIndex}_price`}
                type="text"
                name={`plan_${planIndex}_price`}
                defaultValue={"price" in plan ? (plan.price ?? "") : ""}
                className={inputBase}
                placeholder="e.g. 99 ر.س / month"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor={`plan_${planIndex}_annualPrice`}>Annual price</label>
              <input
                id={`plan_${planIndex}_annualPrice`}
                type="text"
                name={`plan_${planIndex}_annualPrice`}
                defaultValue={"annualPrice" in plan ? (plan.annualPrice ?? "") : ""}
                className={inputBase}
                placeholder="e.g. 999 ر.س / year"
              />
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-border space-y-2" role="group" aria-labelledby={`plan-${planIndex}-features-label`}>
          <div className="flex items-center justify-between gap-2">
            <span id={`plan-${planIndex}-features-label`} className={labelClass}>Features</span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const feats = normalized[planIndex]?.features ?? [];
                  setPlans((s) => {
                    const next = [...s];
                    const arr = next.length >= PLAN_COUNT ? next : [...next, ...Array(PLAN_COUNT - next.length).fill(null)].slice(0, PLAN_COUNT).map((x, i) => x ?? { name: "", forWho: "", cta: sectionCta, features: [] });
                    arr[planIndex] = { ...arr[planIndex]!, features: [...feats, ""] };
                    return arr;
                  });
                }}
              >
                Add feature
              </Button>
              {process.env.NODE_ENV === "development" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => {
                    const feats = normalized[planIndex]?.features ?? [];
                    setPlans((s) => {
                      const next = [...s];
                      const arr = next.length >= PLAN_COUNT ? next : [...next, ...Array(PLAN_COUNT - next.length).fill(null)].slice(0, PLAN_COUNT).map((x, i) => x ?? { name: "", forWho: "", cta: sectionCta, features: [] });
                      arr[planIndex] = { ...arr[planIndex]!, features: [...feats, ...BM_FEATURES_FULL] };
                      return arr;
                    });
                  }}
                >
                  Add dummy
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {(plan.features ?? []).map((feat, j) => (
              <div key={`feat-${planIndex}-${j}`} className="flex gap-2">
                <input
                  type="text"
                  name={`plan_${planIndex}_feature_${j}`}
                  value={feat}
                  onChange={(e) =>
                    setPlans((s) => {
                      const next = [...s];
                      const arr = next.length >= PLAN_COUNT ? next : [...next, ...Array(PLAN_COUNT - next.length).fill(null)].slice(0, PLAN_COUNT).map((x) => x ?? { name: "", forWho: "", cta: sectionCta, features: [] as string[] });
                      const feats = [...(arr[planIndex]?.features ?? [])];
                      feats[j] = e.target.value;
                      arr[planIndex] = { ...arr[planIndex]!, features: feats };
                      return arr;
                    })
                  }
                  className={inputBase}
                  placeholder={`Feature ${j + 1}`}
                  aria-label={`Feature ${j + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setPlans((s) => {
                      const next = [...s];
                      const arr = next.length >= PLAN_COUNT ? next : [...next, ...Array(PLAN_COUNT - next.length).fill(null)].slice(0, PLAN_COUNT).map((x) => x ?? { name: "", forWho: "", cta: sectionCta, features: [] as string[] });
                      const feats = [...(arr[planIndex]?.features ?? [])];
                      feats.splice(j, 1);
                      arr[planIndex] = { ...arr[planIndex]!, features: feats };
                      return arr;
                    })
                  }
                  aria-label={`Remove feature ${j + 1}`}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <input type="hidden" name={`plan_${planIndex}_featuresCount`} value={plan.features?.length ?? 0} />
        </div>
      </fieldset>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" variant="secondary" className="w-fit" disabled={isPending}>
          {isPending ? "Saving…" : "Save section"}
        </Button>
        {state.done && <span className="text-sm text-success" role="status">Saved.</span>}
        {state.error && <span className="text-sm text-destructive" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}

type PricingTeaserSectionFormProps = {
  country: SupportedCountry;
  plansInitial: PricingPlan[];
  sectionCta: string;
};

function PricingTeaserSectionForm({ country, plansInitial, sectionCta }: PricingTeaserSectionFormProps) {
  const router = useRouter();
  const [plans, setPlans] = useState<PricingPlan[]>(
    plansInitial.length > 0
      ? plansInitial.map((p) => ({ ...p, features: p.features ?? [] }))
      : [{ name: "", forWho: "", cta: "", features: [] }]
  );
  const [state, formAction, isPending] = useActionState(
    async (
      _prev: { done?: boolean; error?: string },
      formData: FormData
    ): Promise<{ done?: boolean; error?: string }> => {
      try {
        await updatePricingTeaserFormData(formData);
        return { done: true, error: undefined };
      } catch (err) {
        return {
          done: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
    { done: false, error: undefined }
  );
  useEffect(() => {
    if (state.done) router.refresh();
  }, [state.done, router]);
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      <div className="rounded-md border border-border bg-muted/20 p-2.5 space-y-2">
        <p className={labelClass}>Same for all plans</p>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="pricingTeaser_cta">CTA text (all plans)</label>
          <input
            id="pricingTeaser_cta"
            type="text"
            name="pricingTeaser_cta"
            defaultValue={sectionCta}
            className={inputBase}
            placeholder="e.g. ابدأ الآن"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <label className={labelClass}>Plans</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPlans((s) => [...s, { name: "", forWho: "", cta: "", features: [] }])}
          >
            Add plan
          </Button>
        </div>
        <div className="space-y-6">
          {plans.map((plan, i) => (
            <fieldset
              key={i}
              className="rounded-md border border-border bg-muted/20 p-2.5 space-y-2"
              aria-labelledby={`plan-${i}-legend`}
            >
              <legend id={`plan-${i}-legend`} className={labelClass}>
                Plan {i + 1}
              </legend>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setPlans((s) => s.filter((_, j) => j !== i))}
                  aria-label={`Remove plan ${i + 1}`}
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor={`plan_${i}_name`}>Name</label>
                  <input
                    id={`plan_${i}_name`}
                    type="text"
                    name={`plan_${i}_name`}
                    defaultValue={plan.name}
                    className={inputBase}
                    placeholder="Plan name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor={`plan_${i}_forWho`}>For who</label>
                  <input
                    id={`plan_${i}_forWho`}
                    type="text"
                    name={`plan_${i}_forWho`}
                    defaultValue={plan.forWho}
                    className={inputBase}
                    placeholder="e.g. For small teams"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor={`plan_${i}_price`}>
                    Monthly price
                  </label>
                  <input
                    id={`plan_${i}_price`}
                    type="text"
                    name={`plan_${i}_price`}
                    defaultValue={"price" in plan ? (plan.price ?? "") : ""}
                    className={inputBase}
                    placeholder="e.g. 99 ر.س / month"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor={`plan_${i}_annualPrice`}>
                    Annual price
                  </label>
                  <input
                    id={`plan_${i}_annualPrice`}
                    type="text"
                    name={`plan_${i}_annualPrice`}
                    defaultValue={"annualPrice" in plan ? (plan.annualPrice ?? "") : ""}
                    className={inputBase}
                    placeholder="e.g. 999 ر.س / year"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor={`plan_${i}_badge`}>Badge (optional)</label>
                  <input
                    id={`plan_${i}_badge`}
                    type="text"
                    name={`plan_${i}_badge`}
                    defaultValue={"badge" in plan ? (plan.badge ?? "") : ""}
                    className={inputBase}
                    placeholder="e.g. Most popular"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={`plan_${i}_highlight`}
                  defaultChecked={"highlight" in plan ? !!plan.highlight : false}
                  value="on"
                  className="rounded border-input"
                />
                <span className={labelClass}>Highlight this plan</span>
              </label>
              <div className="pt-2 border-t border-border space-y-2" role="group" aria-labelledby={`plan-${i}-features-label`}>
                <div className="flex items-center justify-between gap-2">
                  <span id={`plan-${i}-features-label`} className={labelClass}>Features</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPlans((s) => {
                          const next = [...s];
                          const feats = next[i]?.features ?? [];
                          next[i] = { ...next[i]!, features: [...feats, ""] };
                          return next;
                        })
                      }
                    >
                      Add feature
                    </Button>
                    {process.env.NODE_ENV === "development" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() =>
                          setPlans((s) => {
                            const next = [...s];
                            const feats = next[i]?.features ?? [];
                            next[i] = { ...next[i]!, features: [...feats, ...BM_FEATURES_FULL] };
                            return next;
                          })
                        }
                      >
                        Add dummy
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {(plan.features ?? []).map((feat, j) => (
                    <div key={`feat-${i}-${j}`} className="flex gap-2">
                      <input
                        type="text"
                        name={`plan_${i}_feature_${j}`}
                        value={feat}
                        onChange={(e) =>
                          setPlans((s) => {
                            const next = [...s];
                            const feats = [...(next[i]?.features ?? [])];
                            feats[j] = e.target.value;
                            next[i] = { ...next[i]!, features: feats };
                            return next;
                          })
                        }
                        className={inputBase}
                        placeholder={`Feature ${j + 1}`}
                        aria-label={`Feature ${j + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          setPlans((s) => {
                            const next = [...s];
                            const feats = [...(next[i]?.features ?? [])];
                            feats.splice(j, 1);
                            next[i] = { ...next[i]!, features: feats };
                            return next;
                          })
                        }
                        aria-label={`Remove feature ${j + 1}`}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <input type="hidden" name={`plan_${i}_featuresCount`} value={plan.features?.length ?? 0} />
              </div>
            </fieldset>
          ))}
        </div>
        <input type="hidden" name="planCount" value={plans.length} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          className="w-fit"
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save section"}
        </Button>
        {state.done && (
          <span className="text-sm text-success" role="status">Saved.</span>
        )}
        {state.error && (
          <span className="text-sm text-destructive" role="alert">{state.error}</span>
        )}
      </div>
    </form>
  );
}

type PricingPlanRow = {
  name: string;
  forWho: string;
  price: string | null;
  annualPrice: string | null;
  badge: string | null;
  highlight: boolean;
  features: string[];
};

type Props = {
  country: SupportedCountry;
  bySection: Record<string, { key: string; value: string }[]>;
  images: { key: string; url: string }[];
  imagesForImagesTab: { key: string; url: string }[];
  pricingPlans: PricingPlanRow[];
};

const PLAN_COUNT = 4;
const PRICING_PLAN_TAB_IDS = ["pricingFree", "pricingStarter", "pricingProfessional", "pricingEnterprise"] as const;

function normalizePlansToFour(
  pricingEntries: { key: string; value: string }[],
  parsePlans: (value: string) => PricingPlan[]
): PricingPlan[] {
  const p = parsePlans(pricingEntries.find((e) => e.key === "plans")?.value ?? "[]");
  const cta = pricingEntries.find((e) => e.key === "cta")?.value ?? "";
  const withFeatures = p.map((x) => ({ ...x, features: x.features ?? [] }));
  if (withFeatures.length >= PLAN_COUNT) return withFeatures.slice(0, PLAN_COUNT);
  return [
    ...withFeatures,
    ...Array.from({ length: PLAN_COUNT - withFeatures.length }, () => ({
      name: "",
      forWho: "",
      cta,
      features: [] as string[],
    })),
  ];
}

function normalizePricingModelToFour(rows: PricingPlanRow[], cta: string): PricingPlan[] {
  const mapped = rows.map((p) => ({
    name: p.name,
    forWho: p.forWho,
    cta,
    price: p.price ?? undefined,
    annualPrice: p.annualPrice ?? undefined,
    badge: p.badge ?? undefined,
    highlight: p.highlight,
    features: p.features,
  }));
  if (mapped.length >= PLAN_COUNT) return mapped.slice(0, PLAN_COUNT);
  return [
    ...mapped,
    ...Array.from({ length: PLAN_COUNT - mapped.length }, () => ({
      name: "",
      forWho: "",
      cta,
      features: [] as string[],
    })),
  ];
}

export function AdminDashboardTabs({ country, bySection, images, imagesForImagesTab, pricingPlans }: Props) {
  const sectionIds = TAB_ORDER.filter((id) => {
    if (id === "images") return imagesForImagesTab.length > 0;
    if (id === "seo") return true;
    if (PRICING_PLAN_TAB_IDS.includes(id as (typeof PRICING_PLAN_TAB_IDS)[number])) return true;
    return (bySection[id]?.length ?? 0) > 0;
  });

  const pricingEntries = bySection["pricingTeaser"] ?? [];
  const ctaFromText = pricingEntries.find((e) => e.key === "cta")?.value ?? "";

  const [plans, setPlans] = useState<PricingPlan[]>(() =>
    pricingPlans.length > 0
      ? normalizePricingModelToFour(pricingPlans, ctaFromText)
      : normalizePlansToFour(pricingEntries, parsePlansArray)
  );

  const sectionCta = ctaFromText || plans[0]?.cta || "";

  const pricingKey = JSON.stringify(pricingPlans);
  useEffect(() => {
    const cta = bySection["pricingTeaser"]?.find((e) => e.key === "cta")?.value ?? "";
    setPlans(
      pricingPlans.length > 0
        ? normalizePricingModelToFour(pricingPlans, cta)
        : normalizePlansToFour(bySection["pricingTeaser"] ?? [], parsePlansArray)
    );
  }, [country, pricingKey]);

  return (
    <Tabs defaultValue={sectionIds[0]} className="w-full" dir="ltr">
      <div className="flex gap-3">
        <div className="sticky top-4 flex w-[200px] shrink-0 flex-col gap-0.5 self-start rounded-md bg-muted/60 p-1.5">
          {SIDEBAR_GROUPS.map((group, groupIndex) => {
            const visibleIds = group.ids.filter((id) => sectionIds.includes(id));
            if (visibleIds.length === 0) return null;
            return (
              <Collapsible key={group.label} defaultOpen={false} className="flex flex-col gap-0.5">
                {groupIndex > 0 && (
                  <div className="my-1 border-t border-border/80" aria-hidden />
                )}
                <CollapsibleTrigger className="flex items-center gap-1.5 rounded-md bg-muted/80 px-2.5 py-1 text-left text-xs font-semibold tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground [&[data-state=open]>svg]:rotate-180">
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform" aria-hidden />
                  {group.label}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <TabsList className="flex h-auto w-full flex-col gap-0.5 rounded-md bg-transparent p-0 shadow-none">
                    {visibleIds.map((id) => (
                      <TabsTrigger
                        key={id}
                        value={id}
                        className="w-full justify-start rounded-md px-2.5 py-1.5 text-sm data-[state=active]:shadow-sm"
                      >
                        {SECTION_LABELS[id] ?? id}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
        <div className="min-w-0 flex-1">
      {sectionIds
        .filter((id) => id !== "images")
        .map((section) => {
          const allEntries = bySection[section] ?? [];
          const benefitsEntry = section === "hero" ? allEntries.find((e) => e.key === "benefits") : null;
          const entries = section === "hero" ? allEntries.filter((e) => e.key !== "benefits") : allEntries;
          const keys = entries.map((e) => e.key);
          return (
            <TabsContent key={section} value={section} className="mt-0">
              <div className="rounded-lg border border-border bg-card p-3 shadow-sm space-y-3">
                <h2 className="text-base font-semibold text-foreground">
                  {SECTION_LABELS[section]}
                </h2>

                {section === "hero" ? (
                  <HeroSectionForm
                    country={country}
                    heroImageUrl={images.find((i) => i.key === "contactAvatar")?.url}
                    benefitsInitial={benefitsEntry ? parseBenefitsArray(benefitsEntry.value) : []}
                    entries={entries}
                  />
                ) : section === "whyNow" ? (
                  <WhyNowSectionForm
                    country={country}
                    linesInitial={parseBenefitsArray(allEntries.find((e) => e.key === "lines")?.value ?? "[]")}
                    heading={getSectionHeading("whyNow", bySection)}
                  />
                ) : section === "howItWorks" ? (
                  <HowItWorksSectionForm
                    country={country}
                    stepsInitial={parseStepsArray(allEntries.find((e) => e.key === "steps")?.value ?? "[]")}
                    heading={getSectionHeading("howItWorks", bySection)}
                  />
                ) : section === "outcomes" ? (
                  <OutcomesSectionForm
                    country={country}
                    itemsInitial={parseStepsArray(allEntries.find((e) => e.key === "items")?.value ?? "[]")}
                    heading={getSectionHeading("outcomes", bySection)}
                  />
                ) : section === "faq" ? (
                  <FaqSectionForm
                    country={country}
                    itemsInitial={parseFaqArray(allEntries.find((e) => e.key === "items")?.value ?? "[]")}
                    heading={getSectionHeading("faq", bySection)}
                  />
                ) : section === "socialProof" ? (
                  <SocialProofSectionForm
                    key={`socialProof-${country}-${allEntries.find((e) => e.key === "testimonial")?.value ?? ""}-${allEntries.find((e) => e.key === "stats")?.value ?? ""}`}
                    country={country}
                    testimonialsInitial={parseTestimonialsArray(
                      allEntries.find((e) => e.key === "testimonial")?.value ?? "[]"
                    )}
                    statsInitial={parseStatsArray(allEntries.find((e) => e.key === "stats")?.value ?? "[]")}
                    heading={getSectionHeading("socialProof", bySection)}
                  />
                ) : section === "pricingFree" ? (
                  <PricingPlanSingleTabForm
                    country={country}
                    plans={plans}
                    setPlans={setPlans}
                    planIndex={0}
                    sectionCta={sectionCta}
                    heading={getSectionHeading("pricingTeaser", bySection)}
                  />
                ) : section === "pricingStarter" ? (
                  <PricingPlanSingleTabForm
                    country={country}
                    plans={plans}
                    setPlans={setPlans}
                    planIndex={1}
                    sectionCta={sectionCta}
                    heading={getSectionHeading("pricingTeaser", bySection)}
                  />
                ) : section === "pricingProfessional" ? (
                  <PricingPlanSingleTabForm
                    country={country}
                    plans={plans}
                    setPlans={setPlans}
                    planIndex={2}
                    sectionCta={sectionCta}
                    heading={getSectionHeading("pricingTeaser", bySection)}
                  />
                ) : section === "pricingEnterprise" ? (
                  <PricingPlanSingleTabForm
                    country={country}
                    plans={plans}
                    setPlans={setPlans}
                    planIndex={3}
                    sectionCta={sectionCta}
                    heading={getSectionHeading("pricingTeaser", bySection)}
                  />
                ) : section === "seo" ? (
                  <SeoSectionForm
                    country={country}
                    entries={bySection["seo"] ?? []}
                  />
                ) : entries.length > 0 ? (
                  <form action={updateSectionTextsFormData} className="flex flex-col gap-3">
                    <input type="hidden" name="country" value={country} />
                    <input type="hidden" name="section" value={section === "cta" ? "hero" : section} />
                    <input type="hidden" name="keys" value={JSON.stringify(keys)} />
                    <div className="grid grid-cols-2 gap-3">
                    {entries.map(({ key, value }) => (
                      <div key={key} className={isJsonKey(key) ? "col-span-2 flex flex-col gap-1.5" : "flex flex-col gap-1.5"}>
                        <label className={labelClass} htmlFor={`${section}-${key}`}>
                          {key}
                        </label>
                        {isJsonKey(key) ? (
                          <textarea
                            id={`${section}-${key}`}
                            name={`v_${key}`}
                            defaultValue={value}
                            rows={6}
                            className={`${inputBase} font-mono`}
                            dir="ltr"
                          />
                        ) : (
                          <input
                            id={`${section}-${key}`}
                            type="text"
                            name={`v_${key}`}
                            defaultValue={value}
                            className={inputBase}
                          />
                        )}
                      </div>
                    ))}
                    </div>
                    <SubmitButton>Save section</SubmitButton>
                  </form>
                ) : null}
              </div>
            </TabsContent>
          );
        })}

      <TabsContent value="images" className="mt-0">
        <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-foreground">Settings</h2>
          <form action={updateImagesFormData} className="flex flex-col gap-3">
            <input type="hidden" name="country" value={country} />
            <input type="hidden" name="keys" value={JSON.stringify(imagesForImagesTab.map((i) => i.key))} />
            <div className="grid grid-cols-2 gap-3">
            {imagesForImagesTab.map(({ key, url }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor={`img-${key}`}>
                  {IMAGE_KEY_LABELS[key] ?? key}
                </label>
                <input
                  id={`img-${key}`}
                  type="url"
                  name={`u_${key}`}
                  defaultValue={url}
                  placeholder="https://..."
                  className={inputBase}
                  dir="ltr"
                />
              </div>
            ))}
            </div>
            <SubmitButton>Save section</SubmitButton>
          </form>

          <div className="mt-4 border-t border-border/60 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Tracking codes</h3>
            <form action={updateTrackingFormData} className="flex flex-col gap-3">
              <input type="hidden" name="country" value={country} />
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: "gtmId", label: "Google Tag Manager ID", placeholder: "GTM-XXXXXX" },
                  { key: "hotjarId", label: "Hotjar site ID", placeholder: "1234567" },
                  { key: "fbPixelId", label: "Facebook Pixel ID", placeholder: "123456789012345" },
                ] as const).map(({ key, label, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className={labelClass} htmlFor={`tracking-${key}`}>{label}</label>
                    <input
                      id={`tracking-${key}`}
                      type="text"
                      name={key}
                      defaultValue={bySection["tracking"]?.find((e) => e.key === key)?.value ?? ""}
                      placeholder={placeholder}
                      className={inputBase}
                      dir="ltr"
                    />
                  </div>
                ))}
              </div>
              <SubmitButton>Save tracking</SubmitButton>
            </form>
          </div>

          <div className="mt-4 border-t border-border/60 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Section reference</h3>
            <form action={updateSiteSettingsFormData} className="flex flex-col gap-3">
              <input type="hidden" name="country" value={country} />
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  name="showSectionCounter"
                  value="true"
                  defaultChecked={bySection["settings"]?.find((e) => e.key === "showSectionCounter")?.value === "true"}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Show section counters on public site (for content reference)</span>
              </label>
              <p className="text-xs text-muted-foreground">Uncheck and save to hide the counters from the public site.</p>
              <SubmitButton>Save</SubmitButton>
            </form>
          </div>
        </div>
      </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
