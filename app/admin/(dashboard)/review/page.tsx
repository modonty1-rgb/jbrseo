import type { ReactElement } from "react";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getAllPlans } from "@/app/actions/pricing";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";
import { ReviewClient, type ReviewGroup } from "./ReviewClient";
import type { EditTarget } from "./EditFieldButton";
import type { EditArrayProps } from "./EditArrayButton";

// Reference + editor: every editable landing/site text in one numbered place.
// Scalar fields carry an edit target (section + JSON path) → pencil → dialog.
// Arrays carry an `arrayBlock` control row (رendered just above their items) →
// manage dialog (edit · add · remove · reorder). Media sections (آراء · فريق)
// and pricing stay read-only here and keep their dedicated forms.
export const dynamic = "force-dynamic";

type Item = { label: string; value: string; edit?: EditTarget; arrayBlock?: EditArrayProps };
type RawGroup = { title: string; admin: string; items: Item[] };

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

// control row that renders the array-management button in place, above its items
const ctrl = (block: EditArrayProps): Item => ({ label: block.label, value: "", arrayBlock: block });

export default async function ContentReviewPage(): Promise<ReactElement> {
  const [heroRaw, ctaRaw, faqRaw, finalRaw, aboutRaw, privacyRaw, termsRaw, sl, plans] =
    await Promise.all([
      getLandingSectionOverride("hero"),
      getLandingSectionOverride("ctaLabel"),
      getLandingSectionOverride("faq"),
      getLandingSectionOverride("finalCta"),
      getLandingSectionOverride("about"),
      getLandingSectionOverride("privacy"),
      getLandingSectionOverride("terms"),
      getStaticLandingWithOverrides(),
      getAllPlans("SA"),
    ]);

  // ── editable: الهيرو + الزر الموحّد ──────────────────────────────────────
  const hero = obj(heroRaw);
  const trust = arr<string>(hero.trust);
  const ctaLabel = str(obj(ctaRaw).ctaLabel) || DEFAULT_CTA_LABEL;
  const heroGroup: RawGroup = {
    title: "الهيرو + شريط العملاء",
    admin: "/admin/review",
    items: [
      { label: "العنوان — السطر الأول", value: str(hero.h1Line1), edit: { section: "hero", path: ["h1Line1"] } },
      { label: "العنوان — السطر الثاني", value: str(hero.h1Line2), edit: { section: "hero", path: ["h1Line2"] } },
      { label: "النص الفرعي", value: str(hero.sub), edit: { section: "hero", path: ["sub"] } },
      { label: "زر الدعوة (موحّد لكل الموقع)", value: ctaLabel, edit: { section: "ctaLabel", path: ["ctaLabel"] } },
      ctrl({ section: "hero", path: ["trust"], label: "عناصر الثقة", initial: trust, itemKind: "string", blank: "", itemNoun: "عنصر" }),
      ...trust.map((t, i) => ({
        label: `عنصر ثقة ${i + 1}`,
        value: str(t),
        edit: { section: "hero", path: ["trust", i] } as EditTarget,
      })),
    ],
  };

  // ── editable: الأسئلة الشائعة ────────────────────────────────────────────
  const faqs = arr<Record<string, unknown>>(obj(faqRaw).faqs);
  const faqGroup: RawGroup = {
    title: "الأسئلة الشائعة",
    admin: "/admin/review",
    items: [
      ctrl({
        section: "faq", path: ["faqs"], label: "الأسئلة الشائعة", initial: faqs, itemKind: "object",
        fields: [{ key: "q", label: "السؤال", long: true }, { key: "a", label: "الجواب", long: true }, { key: "tag", label: "الوسم" }],
        blank: { q: "", a: "", tag: "" }, itemNoun: "سؤال",
      }),
      ...faqs.flatMap((f, i) => [
        { label: `سؤال ${i + 1}`, value: str(f.q), edit: { section: "faq", path: ["faqs", i, "q"] } as EditTarget },
        { label: `جواب ${i + 1}`, value: str(f.a), edit: { section: "faq", path: ["faqs", i, "a"] } as EditTarget },
        { label: `وسم ${i + 1}`, value: str(f.tag), edit: { section: "faq", path: ["faqs", i, "tag"] } as EditTarget },
      ]),
    ],
  };

  // ── editable: الدعوة النهائية ────────────────────────────────────────────
  const fc = obj(finalRaw);
  const finalGroup: RawGroup = {
    title: "الدعوة النهائية",
    admin: "/admin/review",
    items: [
      { label: "العنوان ١", value: str(fc.title1), edit: { section: "finalCta", path: ["title1"] } },
      { label: "العنوان ٢", value: str(fc.title2), edit: { section: "finalCta", path: ["title2"] } },
      { label: "النص الفرعي", value: str(fc.subtitle), edit: { section: "finalCta", path: ["subtitle"] } },
      { label: "نص واتساب", value: str(fc.wa), edit: { section: "finalCta", path: ["wa"] } },
    ],
  };

  // ── editable: من نحن (صفحة) ──────────────────────────────────────────────
  const ab = obj(aboutRaw);
  const abHero = obj(ab.hero);
  const abMission = obj(ab.mission);
  const abLegal = obj(ab.legalInfo);
  const abCta = obj(ab.cta);
  const story = arr<Record<string, unknown>>(ab.storyBlocks);
  const values = arr<Record<string, unknown>>(ab.values);
  const fitFor = arr<string>(ab.fitFor);
  const notFitFor = arr<string>(ab.notFitFor);
  const aboutGroup: RawGroup = {
    title: "من نحن (صفحة)",
    admin: "/admin/review",
    items: [
      { label: "الهيرو — العنوان الصغير", value: str(abHero.eyebrow), edit: { section: "about", path: ["hero", "eyebrow"] } },
      { label: "الهيرو — العنوان", value: str(abHero.title), edit: { section: "about", path: ["hero", "title"] } },
      { label: "الهيرو — الوصف", value: str(abHero.subtitle), edit: { section: "about", path: ["hero", "subtitle"] } },
      { label: "الرسالة — العنوان", value: str(abMission.title), edit: { section: "about", path: ["mission", "title"] } },
      { label: "الرسالة — شعار ١", value: str(abMission.taglineOne), edit: { section: "about", path: ["mission", "taglineOne"] } },
      { label: "الرسالة — شعار ٢", value: str(abMission.taglineTwo), edit: { section: "about", path: ["mission", "taglineTwo"] } },
      { label: "الرسالة — النص", value: str(abMission.body), edit: { section: "about", path: ["mission", "body"] } },
      ctrl({
        section: "about", path: ["storyBlocks"], label: "قصص «من نحن»", initial: story, itemKind: "object",
        fields: [{ key: "label", label: "التسمية" }, { key: "title", label: "العنوان" }, { key: "body", label: "المحتوى", long: true }],
        blank: { label: "", title: "", body: "" }, itemNoun: "قصة",
      }),
      ...story.flatMap((b, i) => [
        { label: `قصة ${i + 1} — التسمية`, value: str(b.label), edit: { section: "about", path: ["storyBlocks", i, "label"] } as EditTarget },
        { label: `قصة ${i + 1} — العنوان`, value: str(b.title), edit: { section: "about", path: ["storyBlocks", i, "title"] } as EditTarget },
        { label: `قصة ${i + 1} — المحتوى`, value: str(b.body), edit: { section: "about", path: ["storyBlocks", i, "body"] } as EditTarget },
      ]),
      ctrl({
        section: "about", path: ["values"], label: "القيم", initial: values, itemKind: "object",
        fields: [{ key: "title", label: "العنوان" }, { key: "body", label: "المحتوى", long: true }],
        blank: { title: "", body: "" }, itemNoun: "قيمة",
      }),
      ...values.flatMap((v, i) => [
        { label: `قيمة ${i + 1} — العنوان`, value: str(v.title), edit: { section: "about", path: ["values", i, "title"] } as EditTarget },
        { label: `قيمة ${i + 1} — المحتوى`, value: str(v.body), edit: { section: "about", path: ["values", i, "body"] } as EditTarget },
      ]),
      ctrl({ section: "about", path: ["fitFor"], label: "مناسب لـ", initial: fitFor, itemKind: "string", blank: "", itemNoun: "عنصر" }),
      ...fitFor.map((t, i) => ({ label: `مناسب لـ ${i + 1}`, value: str(t), edit: { section: "about", path: ["fitFor", i] } as EditTarget })),
      ctrl({ section: "about", path: ["notFitFor"], label: "غير مناسب لـ", initial: notFitFor, itemKind: "string", blank: "", itemNoun: "عنصر" }),
      ...notFitFor.map((t, i) => ({ label: `غير مناسب لـ ${i + 1}`, value: str(t), edit: { section: "about", path: ["notFitFor", i] } as EditTarget })),
      { label: "البيانات — الاسم القانوني", value: str(abLegal.legalName), edit: { section: "about", path: ["legalInfo", "legalName"] } },
      { label: "البيانات — بلد التسجيل", value: str(abLegal.registrationCountry), edit: { section: "about", path: ["legalInfo", "registrationCountry"] } },
      { label: "البيانات — رقم السجل", value: str(abLegal.crNumber), edit: { section: "about", path: ["legalInfo", "crNumber"] } },
      { label: "البيانات — تأسست", value: str(abLegal.foundedAt), edit: { section: "about", path: ["legalInfo", "foundedAt"] } },
      { label: "البيانات — العنوان", value: str(abLegal.address), edit: { section: "about", path: ["legalInfo", "address"] } },
      { label: "البيانات — البريد", value: str(abLegal.email), edit: { section: "about", path: ["legalInfo", "email"] } },
      { label: "البيانات — الهاتف", value: str(abLegal.phone), edit: { section: "about", path: ["legalInfo", "phone"] } },
      { label: "البيانات — ملاحظة", value: str(abLegal.note), edit: { section: "about", path: ["legalInfo", "note"] } },
      { label: "الدعوة — العنوان", value: str(abCta.title), edit: { section: "about", path: ["cta", "title"] } },
      { label: "الدعوة — النص", value: str(abCta.body), edit: { section: "about", path: ["cta", "body"] } },
      { label: "الدعوة — زر رئيسي (نص)", value: str(abCta.primaryLabel), edit: { section: "about", path: ["cta", "primaryLabel"] } },
      { label: "الدعوة — زر ثانوي (نص)", value: str(abCta.secondaryLabel), edit: { section: "about", path: ["cta", "secondaryLabel"] } },
    ],
  };

  // ── editable: legal pages (privacy / terms share a shape) ────────────────
  const legalGroup = (raw: unknown, title: string, section: "privacy" | "terms"): RawGroup => {
    const d = obj(raw);
    const sections = arr<Record<string, unknown>>(d.sections);
    return {
      title,
      admin: "/admin/review",
      items: [
        { label: "العنوان", value: str(d.title), edit: { section, path: ["title"] } },
        { label: "آخر تحديث", value: str(d.updatedAt), edit: { section, path: ["updatedAt"] } },
        { label: "المقدمة", value: str(d.intro), edit: { section, path: ["intro"] } },
        ctrl({
          section, path: ["sections"], label: "أقسام الصفحة", initial: sections, itemKind: "object",
          fields: [{ key: "title", label: "العنوان" }, { key: "body", label: "المحتوى", long: true }],
          blank: { id: "", icon: "info", title: "", body: "" }, itemNoun: "قسم",
        }),
        ...sections.flatMap((sec, i) => [
          { label: `قسم ${i + 1} — العنوان`, value: str(sec.title), edit: { section, path: ["sections", i, "title"] } as EditTarget },
          { label: `قسم ${i + 1} — المحتوى`, value: str(sec.body), edit: { section, path: ["sections", i, "body"] } as EditTarget },
        ]),
        { label: "الملخّص (أسفل الصفحة)", value: str(d.body), edit: { section, path: ["body"] } },
      ],
    };
  };

  // ── read-only reference (media / pricing keep dedicated forms) ───────────
  const socialGroup: RawGroup = {
    title: "آراء العملاء (صور/فيديو — تُعدّل من صفحتها)",
    admin: "/admin/content/socialProof",
    items: [
      { label: "اسم القسم", value: str(sl.socialProof.eyebrow) },
      ...(sl.socialProof.testimonials ?? []).flatMap((t, i) => [
        { label: `شهادة ${i + 1} — الاسم`, value: t.name ?? "" },
        { label: `شهادة ${i + 1} — المنصب`, value: t.role ?? "" },
        { label: `شهادة ${i + 1} — الشركة`, value: t.company ?? "" },
        { label: `شهادة ${i + 1} — النتيجة`, value: t.metric ?? "" },
        { label: `شهادة ${i + 1} — الاقتباس`, value: t.quote ?? "" },
      ]),
    ],
  };

  const teamGroup: RawGroup = {
    title: "فريق العمل (صور — تُعدّل من صفحتها)",
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
  };

  const pricingGroup: RawGroup = {
    title: "الباقات (تُعدّل من صفحتها)",
    admin: "/admin/pricing",
    items: plans.flatMap((p) => [
      { label: `باقة «${p.name}» — الاسم`, value: p.name },
      { label: `باقة «${p.name}» — الوصف`, value: p.tagline ?? "" },
      { label: `باقة «${p.name}» — سعر شهري`, value: String(p.priceMonthly) },
      { label: `باقة «${p.name}» — سعر سنوي`, value: String(p.priceYearly) },
      { label: `باقة «${p.name}» — عدد المقالات`, value: p.articlesLabel ?? "" },
      ...(p.highlights ?? []).map((h, i) => ({ label: `باقة «${p.name}» — ميزة ${i + 1}`, value: h })),
    ]),
  };

  const groups: RawGroup[] = [
    heroGroup,
    faqGroup,
    finalGroup,
    aboutGroup,
    legalGroup(privacyRaw, "سياسة الخصوصية (صفحة)", "privacy"),
    legalGroup(termsRaw, "شروط الاستخدام (صفحة)", "terms"),
    socialGroup,
    teamGroup,
    pricingGroup,
  ];

  // stable global number for every VALUE item (control rows aren't numbered)
  let counter = 0;
  const numbered: ReviewGroup[] = groups.map((g) => ({
    ...g,
    items: g.items.map((it) => ({ ...it, n: it.arrayBlock ? 0 : (counter += 1) })),
  }));

  return <ReviewClient groups={numbered} total={counter} />;
}
