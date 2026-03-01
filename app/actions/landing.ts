"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { PRICING_CTA_LINK } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/app/actions/auth";
import type { SupportedCountry, PricingPlan } from "@/lib/landing-content.types";

const ALLOWED_COUNTRIES: SupportedCountry[] = ["SA", "EG"];

function assertCountry(country: string): asserts country is SupportedCountry {
  if (!ALLOWED_COUNTRIES.includes(country as SupportedCountry)) {
    throw new Error("Invalid country");
  }
}

function revalidateLanding(country: string) {
  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");
}

export async function updateLandingText(
  country: string,
  section: string,
  key: string,
  value: string
) {
  assertCountry(country);
  await prisma.landingText.upsert({
    where: {
      country_section_key: { country, section, key },
    },
    create: { country, section, key, value },
    update: { value },
  });
  revalidateLanding(country);
}

export async function updateLandingImage(country: string, key: string, url: string) {
  assertCountry(country);
  await prisma.landingImage.upsert({
    where: { country_key: { country, key } },
    create: { country, key, url },
    update: { url },
  });
  revalidateLanding(country);
}

export async function getAdminLandingData(country: string) {
  assertCountry(country);
  const [texts, images, pricingPlans] = await Promise.all([
    prisma.landingText.findMany({ where: { country }, orderBy: [{ section: "asc" }, { key: "asc" }] }),
    prisma.landingImage.findMany({ where: { country }, orderBy: { key: "asc" } }),
    prisma.pricingPlan.findMany({ where: { country }, orderBy: { sortOrder: "asc" } }),
  ]);
  return { texts, images, pricingPlans };
}

export async function updateLandingTextFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  const section = formData.get("section") as string;
  const key = formData.get("key") as string;
  const value = formData.get("value") as string;
  if (!country || !section || !key || value === undefined) return;
  await updateLandingText(country, section, key, value);
  revalidatePath("/admin");
}

export async function updateLandingImageFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  const key = formData.get("key") as string;
  const url = (formData.get("url") as string) ?? "";
  if (!country || !key) return;
  await updateLandingImage(country, key, url);
  revalidatePath("/admin");
}

const SEO_FORM_KEYS = [
  "title",
  "description",
  "canonical",
  "ogLocale",
  "ogTitle",
  "ogDescription",
  "ogImage",
  "ogImageWidth",
  "ogImageHeight",
  "ogType",
  "ogSiteName",
  "twitterCard",
  "twitterTitle",
  "twitterDescription",
  "twitterImage",
] as const;

export async function updateSeoFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  for (const key of SEO_FORM_KEYS) {
    const value = (formData.get(key) as string)?.trim() ?? "";
    await updateLandingText(country, "seo", key, value);
  }
  revalidatePath("/admin");
  revalidateLanding(country);
}

export async function updateSectionTextsFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  const section = formData.get("section") as string;
  const keysJson = formData.get("keys") as string;
  if (!country || !section || !keysJson) return;
  assertCountry(country);
  let keys: string[];
  try {
    keys = JSON.parse(keysJson) as string[];
  } catch {
    return;
  }
  for (const key of keys) {
    const value = (formData.get(`v_${key}`) as string) ?? "";
    await updateLandingText(country, section, key, value);
  }
  revalidatePath("/admin");
}

export async function updateImagesFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  const keysJson = formData.get("keys") as string;
  if (!country || !keysJson) return;
  assertCountry(country);
  let keys: string[];
  try {
    keys = JSON.parse(keysJson) as string[];
  } catch {
    return;
  }
  for (const key of keys) {
    const url = (formData.get(`u_${key}`) as string) ?? "";
    await updateLandingImage(country, key, url);
  }
  revalidatePath("/admin");
}

export async function updateWhyNowFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const count = Math.max(0, Number(formData.get("linesCount")) || 0);
  const arr: string[] = [];
  for (let i = 0; i < count; i++) {
    const v = (formData.get(`line_${i}`) as string)?.trim() ?? "";
    if (v) arr.push(v);
  }
  await updateLandingText(country, "whyNow", "lines", JSON.stringify(arr));
  const shSection = (formData.get("sh_section") as string)?.trim();
  if (shSection === "whyNow") {
    await updateLandingText(country, "sectionHeadings", "whyNow_eyebrow", (formData.get("sh_eyebrow") as string)?.trim() ?? "");
    await updateLandingText(country, "sectionHeadings", "whyNow_title", (formData.get("sh_title") as string)?.trim() ?? "");
  }
  revalidatePath("/admin");
}

export async function updateHowItWorksFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const count = Math.max(0, Number(formData.get("stepCount")) || 0);
  const steps: { title: string; line: string }[] = [];
  for (let i = 0; i < count; i++) {
    const title = (formData.get(`step_${i}_title`) as string)?.trim() ?? "";
    const line = (formData.get(`step_${i}_line`) as string)?.trim() ?? "";
    if (title || line) steps.push({ title, line });
  }
  await updateLandingText(country, "howItWorks", "steps", JSON.stringify(steps));
  const shSection = (formData.get("sh_section") as string)?.trim();
  if (shSection === "howItWorks") {
    await updateLandingText(country, "sectionHeadings", "howItWorks_eyebrow", (formData.get("sh_eyebrow") as string)?.trim() ?? "");
    await updateLandingText(country, "sectionHeadings", "howItWorks_title", (formData.get("sh_title") as string)?.trim() ?? "");
  }
  revalidatePath("/admin");
}

export async function updateOutcomesFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const count = Math.max(0, Number(formData.get("itemCount")) || 0);
  const items: { title: string; line: string }[] = [];
  for (let i = 0; i < count; i++) {
    const title = (formData.get(`item_${i}_title`) as string)?.trim() ?? "";
    const line = (formData.get(`item_${i}_line`) as string)?.trim() ?? "";
    if (title || line) items.push({ title, line });
  }
  await updateLandingText(country, "outcomes", "items", JSON.stringify(items));
  const shSection = (formData.get("sh_section") as string)?.trim();
  if (shSection === "outcomes") {
    await updateLandingText(country, "sectionHeadings", "outcomes_eyebrow", (formData.get("sh_eyebrow") as string)?.trim() ?? "");
    await updateLandingText(country, "sectionHeadings", "outcomes_title", (formData.get("sh_title") as string)?.trim() ?? "");
  }
  revalidatePath("/admin");
}

export async function updateFaqFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const count = Math.max(0, Number(formData.get("faqCount")) || 0);
  const items: { question: string; answer: string }[] = [];
  for (let i = 0; i < count; i++) {
    const question = (formData.get(`faq_${i}_question`) as string)?.trim() ?? "";
    const answer = (formData.get(`faq_${i}_answer`) as string)?.trim() ?? "";
    if (question || answer) items.push({ question, answer });
  }
  await updateLandingText(country, "faq", "items", JSON.stringify(items));
  const shSection = (formData.get("sh_section") as string)?.trim();
  if (shSection === "faq") {
    await updateLandingText(country, "sectionHeadings", "faq_eyebrow", (formData.get("sh_eyebrow") as string)?.trim() ?? "");
    await updateLandingText(country, "sectionHeadings", "faq_title", (formData.get("sh_title") as string)?.trim() ?? "");
  }
  revalidatePath("/admin");
}

export async function updateSocialProofFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const testimonialCount = Math.max(0, Number(formData.get("testimonialCount")) || 0);
  const testimonials: { name: string; role: string; quote: string; metric: string; image?: string }[] = [];
  for (let i = 0; i < testimonialCount; i++) {
    const name = (formData.get(`testimonial_${i}_name`) as string)?.trim() ?? "";
    const role = (formData.get(`testimonial_${i}_role`) as string)?.trim() ?? "";
    const quote = (formData.get(`testimonial_${i}_quote`) as string)?.trim() ?? "";
    const metric = (formData.get(`testimonial_${i}_metric`) as string)?.trim() ?? "";
    const image = (formData.get(`testimonial_${i}_image`) as string)?.trim() || undefined;
    if (name || role || quote || metric || image) {
      testimonials.push({ name, role, quote, metric, ...(image && { image }) });
    }
  }
  const statsCount = Math.max(0, Number(formData.get("statsCount")) || 0);
  const stats: { value: string; label: string }[] = [];
  for (let i = 0; i < statsCount; i++) {
    const value = (formData.get(`stat_${i}_value`) as string)?.trim() ?? "";
    const label = (formData.get(`stat_${i}_label`) as string)?.trim() ?? "";
    if (value || label) stats.push({ value, label });
  }
  await updateLandingText(country, "socialProof", "testimonial", JSON.stringify(testimonials));
  await updateLandingText(country, "socialProof", "stats", JSON.stringify(stats));
  const shSection = (formData.get("sh_section") as string)?.trim();
  if (shSection === "socialProof") {
    await updateLandingText(country, "sectionHeadings", "socialProof_eyebrow", (formData.get("sh_eyebrow") as string)?.trim() ?? "");
    await updateLandingText(country, "sectionHeadings", "socialProof_title", (formData.get("sh_title") as string)?.trim() ?? "");
  }
  revalidatePath("/admin");
  revalidatePath("/testimonials");
}

export async function updatePricingTeaserFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const sectionCta = (formData.get("pricingTeaser_cta") as string)?.trim() ?? "";
  await updateLandingText(country, "pricingTeaser", "cta", sectionCta);
  const count = Math.max(0, Number(formData.get("planCount")) || 0);
  const plans: PricingPlan[] = [];
  for (let i = 0; i < count; i++) {
    const name = (formData.get(`plan_${i}_name`) as string)?.trim() ?? "";
    const forWho = (formData.get(`plan_${i}_forWho`) as string)?.trim() ?? "";
    const price = (formData.get(`plan_${i}_price`) as string)?.trim() || undefined;
    const annualPrice = (formData.get(`plan_${i}_annualPrice`) as string)?.trim() || undefined;
    const badge = (formData.get(`plan_${i}_badge`) as string)?.trim() || undefined;
    const highlight = formData.get(`plan_${i}_highlight`) === "on";
    const featuresCount = Math.max(0, Number(formData.get(`plan_${i}_featuresCount`)) || 0);
    const features: string[] = [];
    for (let j = 0; j < featuresCount; j++) {
      const v = (formData.get(`plan_${i}_feature_${j}`) as string)?.trim() ?? "";
      if (v) features.push(v);
    }
    if (name || forWho) {
      plans.push({
        name,
        forWho,
        cta: sectionCta,
        ctaLink: PRICING_CTA_LINK,
        ...(price && { price }),
        ...(annualPrice && { annualPrice }),
        ...(badge && { badge }),
        ...(highlight && { highlight: true }),
        features,
      });
    }
  }
  await updateLandingText(country, "pricingTeaser", "plans", JSON.stringify(plans));

  await prisma.pricingPlan.deleteMany({ where: { country } });
  if (plans.length > 0) {
    await prisma.pricingPlan.createMany({
      data: plans.map((p, i) => ({
        country,
        sortOrder: i,
        name: p.name,
        forWho: p.forWho,
        price: p.price ?? null,
        annualPrice: p.annualPrice ?? null,
        badge: p.badge ?? null,
        highlight: p.highlight ?? false,
        features: p.features ?? [],
      })),
    });
  }
  const shSection = (formData.get("sh_section") as string)?.trim();
  if (shSection === "pricingTeaser") {
    await updateLandingText(country, "sectionHeadings", "pricingTeaser_eyebrow", (formData.get("sh_eyebrow") as string)?.trim() ?? "");
    await updateLandingText(country, "sectionHeadings", "pricingTeaser_title", (formData.get("sh_title") as string)?.trim() ?? "");
    await updateLandingText(country, "sectionHeadings", "pricingTeaser_highlightBadge", (formData.get("sh_highlightBadge") as string)?.trim() ?? "");
  }
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/pricing");
}

export async function updateHeroBenefitsFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const text = (formData.get("benefitsText") as string) ?? "";
  const arr = text.split("\n").map((s) => s.trim()).filter(Boolean);
  await updateLandingText(country, "hero", "benefits", JSON.stringify(arr));
  revalidatePath("/admin");
}

export async function updateHeroSectionFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const heroImageUrl = (formData.get("heroImageUrl") as string) ?? "";
  const count = Math.max(0, Number(formData.get("benefitsCount")) || 0);
  const benefitsArr: string[] = [];
  for (let i = 0; i < count; i++) {
    const v = (formData.get(`benefit_${i}`) as string)?.trim() ?? "";
    if (v) benefitsArr.push(v);
  }
  await updateLandingImage(country, "contactAvatar", heroImageUrl);
  await updateLandingText(country, "hero", "benefits", JSON.stringify(benefitsArr));
  await updateLandingText(country, "hero", "h1", (formData.get("v_h1") as string) ?? "");
  await updateLandingText(country, "hero", "subheadline", (formData.get("v_subheadline") as string) ?? "");
  await updateLandingText(country, "hero", "proof", (formData.get("v_proof") as string) ?? "");
  revalidatePath("/admin");
}

export async function updateTrackingFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  for (const key of ["gtmId", "hotjarId", "fbPixelId"] as const) {
    await updateLandingText(country, "tracking", key, (formData.get(key) as string)?.trim() ?? "");
  }
  revalidatePath("/admin");
}

export async function updateSiteSettingsFormData(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = formData.get("country") as string;
  if (!country) return;
  assertCountry(country);
  const showSectionCounter = formData.get("showSectionCounter") === "true";
  await updateLandingText(country, "settings", "showSectionCounter", showSectionCounter ? "true" : "false");
  revalidatePath("/admin");
  revalidatePath("/");
}
