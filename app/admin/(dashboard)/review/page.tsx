import type { ReactElement } from "react";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getAllPlans } from "@/app/actions/pricing";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";
import { ReviewClient, type ReviewGroup } from "./ReviewClient";

// Read-only reference: every editable landing/site text in one numbered place.
// Numbers are stable (fixed field order) so the admin can say "edit #N".
export const dynamic = "force-dynamic";

type Item = { label: string; value: string };
type RawGroup = { title: string; admin: string; items: Item[] };

export default async function ContentReviewPage(): Promise<ReactElement> {
  const [sl, plans, ctaOverride] = await Promise.all([
    getStaticLandingWithOverrides(),
    getAllPlans("SA"),
    getLandingSectionOverride("ctaLabel"),
  ]);

  const ctaLabel =
    ctaOverride && typeof ctaOverride === "object" && "ctaLabel" in ctaOverride && typeof (ctaOverride as { ctaLabel?: string }).ctaLabel === "string"
      ? (ctaOverride as { ctaLabel: string }).ctaLabel
      : DEFAULT_CTA_LABEL;

  const legalItems = (l: { title?: string; intro?: string; body?: string; sections?: { title: string; body: string }[] }): Item[] => [
    { label: "العنوان", value: l.title ?? "" },
    ...(l.intro ? [{ label: "المقدمة", value: l.intro }] : []),
    ...(l.sections?.length
      ? l.sections.flatMap((s, i) => [
          { label: `فقرة ${i + 1} — العنوان`, value: s.title ?? "" },
          { label: `فقرة ${i + 1} — المحتوى`, value: s.body ?? "" },
        ])
      : [{ label: "المحتوى", value: l.body ?? "" }]),
  ];

  const groups: RawGroup[] = [
    {
      title: "الهيرو",
      admin: "/admin/content/hero",
      items: [
        { label: "العنوان — السطر الأول", value: sl.hero.h1Line1 ?? "" },
        { label: "العنوان — السطر الثاني", value: sl.hero.h1Line2 ?? "" },
        { label: "النص الفرعي", value: sl.hero.sub ?? "" },
        { label: "زر الدعوة (موحّد لكل الموقع)", value: ctaLabel },
        ...(sl.hero.trust ?? []).map((t, i) => ({ label: `عنصر ثقة ${i + 1}`, value: t })),
      ],
    },
    {
      title: "آراء العملاء",
      admin: "/admin/content/socialProof",
      items: [
        { label: "اسم القسم", value: sl.socialProof.eyebrow ?? "" },
        ...(sl.socialProof.testimonials ?? []).flatMap((t, i) => [
          { label: `شهادة ${i + 1} — الاسم`, value: t.name ?? "" },
          { label: `شهادة ${i + 1} — المنصب`, value: t.role ?? "" },
          { label: `شهادة ${i + 1} — الشركة`, value: t.company ?? "" },
          { label: `شهادة ${i + 1} — النتيجة`, value: t.metric ?? "" },
          { label: `شهادة ${i + 1} — الاقتباس`, value: t.quote ?? "" },
        ]),
      ],
    },
    {
      title: "الأسئلة الشائعة",
      admin: "/admin/content/faq",
      items: (sl.faq.faqs ?? []).flatMap((f, i) => [
        { label: `سؤال ${i + 1}`, value: f.q ?? "" },
        { label: `جواب ${i + 1}`, value: f.a ?? "" },
      ]),
    },
    {
      title: "الدعوة النهائية",
      admin: "/admin/content/finalCta",
      items: [
        { label: "العنوان ١", value: sl.finalCta.title1 ?? "" },
        { label: "العنوان ٢", value: sl.finalCta.title2 ?? "" },
        { label: "النص الفرعي", value: sl.finalCta.subtitle ?? "" },
        { label: "نص واتساب", value: sl.finalCta.wa ?? "" },
      ],
    },
    {
      title: "فريق العمل",
      admin: "/admin/content/team",
      items: [
        ...(sl.team?.coreTeam ?? []).flatMap((m, i) => [
          { label: `فريق أساسي ${i + 1} — الاسم`, value: m.name ?? "" },
          { label: `فريق أساسي ${i + 1} — الدور`, value: m.role ?? "" },
          { label: `فريق أساسي ${i + 1} — نبذة`, value: m.bio ?? "" },
        ]),
        ...(sl.team?.executionTeam ?? []).flatMap((m, i) => [
          { label: `فريق تنفيذ ${i + 1} — الاسم`, value: m.name ?? "" },
          { label: `فريق تنفيذ ${i + 1} — الدور`, value: m.role ?? "" },
          { label: `فريق تنفيذ ${i + 1} — نبذة`, value: m.bio ?? "" },
        ]),
      ],
    },
    {
      title: "الباقات",
      admin: "/admin/pricing",
      items: plans.flatMap((p) => [
        { label: `باقة «${p.name}» — الاسم`, value: p.name },
        { label: `باقة «${p.name}» — الوصف`, value: p.tagline ?? "" },
        { label: `باقة «${p.name}» — سعر شهري`, value: String(p.priceMonthly) },
        { label: `باقة «${p.name}» — سعر سنوي`, value: String(p.priceYearly) },
        { label: `باقة «${p.name}» — عدد المقالات`, value: p.articlesLabel ?? "" },
        ...(p.highlights ?? []).map((h, i) => ({ label: `باقة «${p.name}» — ميزة ${i + 1}`, value: h })),
      ]),
    },
    // ─── Static pages (were missing) ───────────────────────────────────────
    {
      title: "من نحن (صفحة)",
      admin: "/admin/content/about",
      items: [
        { label: "الهيرو — العنوان", value: sl.about?.hero?.title ?? "" },
        { label: "الهيرو — الوصف", value: sl.about?.hero?.subtitle ?? "" },
        ...(sl.about?.mission?.body ? [{ label: "الرسالة", value: sl.about.mission.body }] : []),
        ...(sl.about?.storyBlocks ?? []).flatMap((b, i) => [
          { label: `قصة ${i + 1} — العنوان`, value: b.title ?? "" },
          { label: `قصة ${i + 1} — المحتوى`, value: b.body ?? "" },
        ]),
        ...(sl.about?.values ?? []).flatMap((v, i) => [
          { label: `قيمة ${i + 1} — العنوان`, value: v.title ?? "" },
          { label: `قيمة ${i + 1} — المحتوى`, value: v.body ?? "" },
        ]),
        ...(sl.about?.cta ? [
          { label: "دعوة — العنوان", value: sl.about.cta.title ?? "" },
          { label: "دعوة — النص", value: sl.about.cta.body ?? "" },
        ] : []),
      ],
    },
    { title: "سياسة الخصوصية (صفحة)", admin: "/admin/content/privacy", items: legalItems(sl.privacy ?? {}) },
    { title: "شروط الاستخدام (صفحة)", admin: "/admin/content/terms", items: legalItems(sl.terms ?? {}) },
  ];

  // Assign a stable global number to every item.
  let counter = 0;
  const numbered: ReviewGroup[] = groups.map((g) => ({
    ...g,
    items: g.items.map((it) => ({ ...it, n: (counter += 1) })),
  }));

  return <ReviewClient groups={numbered} total={counter} />;
}
