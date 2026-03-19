"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { upsertLandingSection } from "@/lib/landing-sections";
import { isAdmin } from "@/app/actions/auth";

const CONTENT_KEYS = [
  "hero",
  "whyNow",
  "howItWorks",
  "outcomes",
  "socialProof",
  "faq",
  "finalCta",
  "header",
  "footer",
  "pricing",
  "pricingPage",
  "privacy",
  "terms",
  "about",
  "team",
] as const;

type ContentKey = (typeof CONTENT_KEYS)[number];

function assertSection(section: string): asserts section is ContentKey {
  if (!CONTENT_KEYS.includes(section as ContentKey)) {
    throw new Error("Invalid section");
  }
}

function assertCountry(country: string): asserts country is SupportedCountry {
  if (country !== "SA" && country !== "EG") {
    throw new Error("Invalid country");
  }
}

export async function updateSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const rawData = (formData.get("data") as string | null) ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/${section}?country=${country}`;

  if (!country || !section || !rawData) {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
    assertSection(section);
  } catch {
    return redirect(redirectTo);
  }

  let parsed: Prisma.InputJsonValue;
  try {
    parsed = JSON.parse(rawData) as Prisma.InputJsonValue;
  } catch {
    // If JSON is invalid, just redirect without saving.
    return redirect(redirectTo);
  }

  await upsertLandingSection(country, section, parsed);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/privacy");
  revalidatePath("/terms");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateHeroSection(formData: FormData) {
  if (!(await isAdmin())) return;
  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/hero?country=${country}`;

  if (!country || section !== "hero") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const benefitsCount = parseInt(
    ((formData.get("benefitsCount") as string | null) ?? "0").trim(),
    10,
  );

  const proof = ((formData.get("proof") as string | null) ?? "").trim();
  const h1Line1 = ((formData.get("h1Line1") as string | null) ?? "").trim();
  const h1Line2 = ((formData.get("h1Line2") as string | null) ?? "").trim();
  const sub = ((formData.get("sub") as string | null) ?? "").trim();

  const benefits = [];
  for (let i = 0; i < (Number.isFinite(benefitsCount) ? benefitsCount : 0); i++) {
    const objection =
      ((formData.get(`benefits_${i}_objection`) as string | null) ?? "").trim();
    const answer =
      ((formData.get(`benefits_${i}_answer`) as string | null) ?? "").trim();
    if (!objection && !answer) continue;
    benefits.push({ objection, answer });
  }

  const trustLines = ((formData.get("trustLines") as string | null) ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const hero = {
    proof,
    h1Line1,
    h1Line2,
    sub,
    benefits,
    trust: trustLines,
  };

  await upsertLandingSection(country, "hero", hero);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateWhyNowSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/whyNow?country=${country}`;

  if (!country || section !== "whyNow") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const daysTargetRaw = ((formData.get("daysTarget") as string | null) ?? "").trim();
  const daysTargetParsed = parseInt(daysTargetRaw || "0", 10);
  const daysTarget = Number.isFinite(daysTargetParsed) ? daysTargetParsed : 0;

  const costsCount = parseInt(
    ((formData.get("costsCount") as string | null) ?? "0").trim(),
    10,
  );
  const reasonsCount = parseInt(
    ((formData.get("reasonsCount") as string | null) ?? "0").trim(),
    10,
  );

  const eyebrow = ((formData.get("eyebrow") as string | null) ?? "").trim();
  const title1 = ((formData.get("title1") as string | null) ?? "").trim();
  const title2 = ((formData.get("title2") as string | null) ?? "").trim();
  const subtitle = ((formData.get("subtitle") as string | null) ?? "").trim();
  const ctaText = ((formData.get("ctaText") as string | null) ?? "").trim();
  const ctaHighlight = ((formData.get("ctaHighlight") as string | null) ?? "").trim();

  const costs = [];
  const maxCosts = Number.isFinite(costsCount) ? costsCount : 0;
  for (let i = 0; i < maxCosts; i++) {
    const month =
      ((formData.get(`costs_${i}_month`) as string | null) ?? "").trim();
    const label =
      ((formData.get(`costs_${i}_label`) as string | null) ?? "").trim();
    const desc =
      ((formData.get(`costs_${i}_desc`) as string | null) ?? "").trim();
    const value =
      ((formData.get(`costs_${i}_value`) as string | null) ?? "").trim();
    const icon =
      ((formData.get(`costs_${i}_icon`) as string | null) ?? "").trim();
    const severityRaw =
      ((formData.get(`costs_${i}_severity`) as string | null) ?? "").trim();
    const severityParsed = parseInt(severityRaw || "0", 10);
    const severity = Number.isFinite(severityParsed) ? severityParsed : 0;

    if (!month && !label && !desc && !value && !icon && !severityRaw) continue;
    costs.push({ month, label, desc, value, icon, severity });
  }

  const reasons = [];
  const maxReasons = Number.isFinite(reasonsCount) ? reasonsCount : 0;
  for (let i = 0; i < maxReasons; i++) {
    const icon =
      ((formData.get(`reasons_${i}_icon`) as string | null) ?? "").trim();
    const title =
      ((formData.get(`reasons_${i}_title`) as string | null) ?? "").trim();
    const body =
      ((formData.get(`reasons_${i}_body`) as string | null) ?? "").trim();

    if (!icon && !title && !body) continue;
    reasons.push({ icon, title, body });
  }

  const whyNow = {
    eyebrow,
    title1,
    title2,
    subtitle,
    costs,
    reasons,
    ctaText,
    ctaHighlight,
    daysTarget,
  };

  await upsertLandingSection(country, "whyNow", whyNow);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateHowItWorksSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/howItWorks?country=${country}`;

  if (!country || section !== "howItWorks") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const stepsCountRaw = ((formData.get("stepsCount") as string | null) ?? "0").trim();
  const stepsCountParsed = parseInt(stepsCountRaw || "0", 10);
  const stepsCount = Number.isFinite(stepsCountParsed) ? stepsCountParsed : 0;

  const eyebrow = ((formData.get("eyebrow") as string | null) ?? "").trim();
  const title = ((formData.get("title") as string | null) ?? "").trim();
  const subtitle = ((formData.get("subtitle") as string | null) ?? "").trim();
  const guarantee = ((formData.get("guarantee") as string | null) ?? "").trim();

  const steps = [];
  const maxSteps = stepsCount > 0 && Number.isFinite(stepsCount) ? stepsCount : 0;
  for (let i = 0; i < maxSteps; i++) {
    const num = ((formData.get(`steps_${i}_num`) as string | null) ?? "").trim();
    const icon = ((formData.get(`steps_${i}_icon`) as string | null) ?? "").trim();
    const stepTitle = ((formData.get(`steps_${i}_title`) as string | null) ?? "").trim();
    const line = ((formData.get(`steps_${i}_line`) as string | null) ?? "").trim();
    const tag = ((formData.get(`steps_${i}_tag`) as string | null) ?? "").trim();

    if (!num && !icon && !stepTitle && !line && !tag) continue;
    steps.push({ num, icon, title: stepTitle, line, tag });
  }

  const howItWorks = {
    eyebrow,
    title,
    subtitle,
    guarantee,
    steps,
  };

  await upsertLandingSection(country, "howItWorks", howItWorks);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateOutcomesSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/outcomes?country=${country}`;

  if (!country || section !== "outcomes") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const outcomesCountRaw =
    ((formData.get("outcomesCount") as string | null) ?? "0").trim();
  const outcomesCountParsed = parseInt(outcomesCountRaw || "0", 10);
  const outcomesCount = Number.isFinite(outcomesCountParsed)
    ? outcomesCountParsed
    : 0;

  const eyebrow = ((formData.get("eyebrow") as string | null) ?? "").trim();
  const title = ((formData.get("title") as string | null) ?? "").trim();
  const subtitle = ((formData.get("subtitle") as string | null) ?? "").trim();
  const badgeText = ((formData.get("badgeText") as string | null) ?? "").trim();
  const message = ((formData.get("message") as string | null) ?? "").trim();
  const messageHighlight =
    ((formData.get("messageHighlight") as string | null) ?? "").trim();

  const outcomes = [];
  const maxOutcomes =
    outcomesCount > 0 && Number.isFinite(outcomesCount) ? outcomesCount : 0;
  for (let i = 0; i < maxOutcomes; i++) {
    const icon =
      ((formData.get(`outcomes_${i}_icon`) as string | null) ?? "").trim();
    const metric =
      ((formData.get(`outcomes_${i}_metric`) as string | null) ?? "").trim();
    const itemTitle =
      ((formData.get(`outcomes_${i}_title`) as string | null) ?? "").trim();
    const line =
      ((formData.get(`outcomes_${i}_line`) as string | null) ?? "").trim();
    const token =
      ((formData.get(`outcomes_${i}_token`) as string | null) ?? "").trim();

    if (!icon && !metric && !itemTitle && !line && !token) continue;
    outcomes.push({ icon, metric, title: itemTitle, line, token });
  }

  const outcomesSection = {
    eyebrow,
    title,
    subtitle,
    outcomes,
    badgeText,
    message,
    messageHighlight,
  };

  await upsertLandingSection(country, "outcomes", outcomesSection);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateSocialProofSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/socialProof?country=${country}`;

  if (!country || section !== "socialProof") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const testimonialsCountRaw =
    ((formData.get("testimonialsCount") as string | null) ?? "0").trim();
  const testimonialsCountParsed = parseInt(testimonialsCountRaw || "0", 10);
  const testimonialsCount = Number.isFinite(testimonialsCountParsed)
    ? testimonialsCountParsed
    : 0;

  const eyebrow = ((formData.get("eyebrow") as string | null) ?? "").trim();
  const title = ((formData.get("title") as string | null) ?? "").trim();
  const subtitle = ((formData.get("subtitle") as string | null) ?? "").trim();
  const founding = ((formData.get("founding") as string | null) ?? "").trim();

  const testimonials = [];
  const maxTestimonials =
    testimonialsCount > 0 && Number.isFinite(testimonialsCount)
      ? testimonialsCount
      : 0;

  for (let i = 0; i < maxTestimonials; i++) {
    const name =
      ((formData.get(`testimonials_${i}_name`) as string | null) ?? "").trim();
    const role =
      ((formData.get(`testimonials_${i}_role`) as string | null) ?? "").trim();
    const company =
      ((formData.get(`testimonials_${i}_company`) as string | null) ?? "").trim();
    const quote =
      ((formData.get(`testimonials_${i}_quote`) as string | null) ?? "").trim();
    const metric =
      ((formData.get(`testimonials_${i}_metric`) as string | null) ?? "").trim();
    const avatarImg =
      ((formData.get(`testimonials_${i}_avatarImg`) as string | null) ?? "").trim();
    const starsRaw =
      ((formData.get(`testimonials_${i}_stars`) as string | null) ?? "").trim();
    const starsParsed = parseInt(starsRaw || "0", 10);
    const stars = Number.isFinite(starsParsed) ? starsParsed : 0;
    const tag =
      ((formData.get(`testimonials_${i}_tag`) as string | null) ?? "").trim();
    const videoUrl =
      ((formData.get(`testimonials_${i}_videoUrl`) as string | null) ?? "").trim();
    const videoLabel =
      ((formData.get(`testimonials_${i}_videoLabel`) as string | null) ?? "").trim();
    const siteLink =
      ((formData.get(`testimonials_${i}_siteLink`) as string | null) ?? "").trim();

    if (
      !name &&
      !role &&
      !company &&
      !quote &&
      !metric &&
      !avatarImg &&
      !starsRaw &&
      !tag &&
      !videoUrl &&
      !videoLabel &&
      !siteLink
    ) {
      continue;
    }

    testimonials.push({
      name,
      role,
      company,
      quote,
      metric,
      avatarImg,
      stars,
      tag,
      videoUrl: videoUrl || undefined,
      videoLabel: videoLabel || undefined,
      siteLink: siteLink || undefined,
    });
  }

  const socialProof = {
    eyebrow,
    title,
    subtitle,
    testimonials,
    founding,
  };

  await upsertLandingSection(country, "socialProof", socialProof);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/admin/content/socialProof");
  revalidatePath("/sa");
  revalidatePath("/eg");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateFaqSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/faq?country=${country}`;

  if (!country || section !== "faq") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const faqsCountRaw =
    ((formData.get("faqsCount") as string | null) ?? "0").trim();
  const faqsCountParsed = parseInt(faqsCountRaw || "0", 10);
  const faqsCount = Number.isFinite(faqsCountParsed) ? faqsCountParsed : 0;

  const eyebrow = ((formData.get("eyebrow") as string | null) ?? "").trim();
  const title = ((formData.get("title") as string | null) ?? "").trim();
  const subtitle = ((formData.get("subtitle") as string | null) ?? "").trim();
  const ctaLabel = ((formData.get("ctaLabel") as string | null) ?? "").trim();

  const faqs = [];
  const maxFaqs = faqsCount > 0 && Number.isFinite(faqsCount) ? faqsCount : 0;
  for (let i = 0; i < maxFaqs; i++) {
    const q =
      ((formData.get(`faqs_${i}_q`) as string | null) ?? "").trim();
    const a =
      ((formData.get(`faqs_${i}_a`) as string | null) ?? "").trim();
    const tag =
      ((formData.get(`faqs_${i}_tag`) as string | null) ?? "").trim();

    if (!q && !a && !tag) continue;
    faqs.push({ q, a, tag });
  }

  const faqSection = {
    eyebrow,
    title,
    subtitle,
    faqs,
    ctaLabel,
  };

  await upsertLandingSection(country, "faq", faqSection);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateFinalCtaSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/finalCta?country=${country}`;

  if (!country || section !== "finalCta") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const eyebrow = ((formData.get("eyebrow") as string | null) ?? "").trim();
  const title1 = ((formData.get("title1") as string | null) ?? "").trim();
  const title2 = ((formData.get("title2") as string | null) ?? "").trim();
  const subtitle = ((formData.get("subtitle") as string | null) ?? "").trim();
  const wa = ((formData.get("wa") as string | null) ?? "").trim();

  const seatsTotalRaw =
    ((formData.get("seatsTotal") as string | null) ?? "").trim();
  const seatsTakenRaw =
    ((formData.get("seatsTaken") as string | null) ?? "").trim();
  const seatsTotalParsed = parseInt(seatsTotalRaw || "0", 10);
  const seatsTakenParsed = parseInt(seatsTakenRaw || "0", 10);
  const seats = {
    total: Number.isFinite(seatsTotalParsed) ? seatsTotalParsed : 0,
    taken: Number.isFinite(seatsTakenParsed) ? seatsTakenParsed : 0,
  };

  const benefitsLines = ((formData.get("benefitsLines") as string | null) ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const finalCta = {
    eyebrow,
    title1,
    title2,
    subtitle,
    seats,
    benefits: benefitsLines,
    wa,
  };

  await upsertLandingSection(country, "finalCta", finalCta);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateHeaderSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/header?country=${country}`;

  if (!country || section !== "header") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const seatsTotalRaw =
    ((formData.get("seatsTotal") as string | null) ?? "").trim();
  const seatsTakenRaw =
    ((formData.get("seatsTaken") as string | null) ?? "").trim();
  const seatsTotalParsed = parseInt(seatsTotalRaw || "0", 10);
  const seatsTakenParsed = parseInt(seatsTakenRaw || "0", 10);
  const seats = {
    total: Number.isFinite(seatsTotalParsed) ? seatsTotalParsed : 0,
    taken: Number.isFinite(seatsTakenParsed) ? seatsTakenParsed : 0,
  };

  const announcementPrefix = ((formData.get("announcementPrefix") as string | null) ?? "").trim();
  const announcementSuffix = ((formData.get("announcementSuffix") as string | null) ?? "").trim();

  const header = {
    seats,
    announcementPrefix,
    announcementSuffix,
  };

  await upsertLandingSection(country, "header", header);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateFooterSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/footer?country=${country}`;

  if (!country || section !== "footer") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const tagline = ((formData.get("tagline") as string | null) ?? "").trim();
  const desc = ((formData.get("desc") as string | null) ?? "").trim();

  const footer = { tagline, desc };

  await upsertLandingSection(country, "footer", footer);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateHeaderFooterSections(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/header-footer?country=${country}`;

  if (!country) {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const bannerText =
    ((formData.get("bannerText") as string | null) ?? "").trim();
  const header = { bannerText };

  const tagline = ((formData.get("tagline") as string | null) ?? "").trim();
  const desc = ((formData.get("desc") as string | null) ?? "").trim();

  const footer = { tagline, desc };

  await upsertLandingSection(country, "header", header);
  await upsertLandingSection(country, "footer", footer);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updatePricingSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const rawData = (formData.get("data") as string | null) ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/pricing?country=${country}`;

  if (!country || section !== "pricing" || !rawData) {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  let parsed: Prisma.InputJsonValue;
  try {
    parsed = JSON.parse(rawData) as Prisma.InputJsonValue;
  } catch {
    return redirect(redirectTo);
  }

  await upsertLandingSection(country, "pricing", parsed);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/pricing");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateAboutSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/about?country=${country}`;

  if (!country || section !== "about") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const heroEyebrow = ((formData.get("heroEyebrow") as string | null) ?? "").trim();
  const heroTitle = ((formData.get("heroTitle") as string | null) ?? "").trim();
  const heroSubtitle = ((formData.get("heroSubtitle") as string | null) ?? "").trim();

  const storyBlocks = [0, 1, 2].map((index) => {
    const label = ((formData.get(`story_${index}_label`) as string | null) ?? "").trim();
    const title = ((formData.get(`story_${index}_title`) as string | null) ?? "").trim();
    const body = ((formData.get(`story_${index}_body`) as string | null) ?? "").trim();
    return { label, title, body };
  });

  const values = [0, 1, 2, 3].map((index) => {
    const title = ((formData.get(`value_${index}_title`) as string | null) ?? "").trim();
    const body = ((formData.get(`value_${index}_body`) as string | null) ?? "").trim();
    return { title, body };
  });

  const fitForRaw = ((formData.get("fitFor") as string | null) ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const notFitForRaw = ((formData.get("notFitFor") as string | null) ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const legalName = ((formData.get("legalName") as string | null) ?? "").trim();
  const registrationCountry =
    ((formData.get("registrationCountry") as string | null) ?? "").trim();
  const crNumber = ((formData.get("crNumber") as string | null) ?? "").trim();
  const foundedAt = ((formData.get("foundedAt") as string | null) ?? "").trim();
  const address = ((formData.get("address") as string | null) ?? "").trim();
  const email = ((formData.get("email") as string | null) ?? "").trim();
  const phone = ((formData.get("phone") as string | null) ?? "").trim();
  const legalNote = ((formData.get("legalNote") as string | null) ?? "").trim();

  const ctaTitle = ((formData.get("ctaTitle") as string | null) ?? "").trim();
  const ctaBody = ((formData.get("ctaBody") as string | null) ?? "").trim();
  const ctaPrimaryLabel =
    ((formData.get("ctaPrimaryLabel") as string | null) ?? "").trim();
  const ctaPrimaryHref =
    ((formData.get("ctaPrimaryHref") as string | null) ?? "").trim();
  const ctaSecondaryLabel =
    ((formData.get("ctaSecondaryLabel") as string | null) ?? "").trim();
  const ctaSecondaryHref =
    ((formData.get("ctaSecondaryHref") as string | null) ?? "").trim();

  const about = {
    hero: {
      eyebrow: heroEyebrow || undefined,
      title: heroTitle,
      subtitle: heroSubtitle,
    },
    storyBlocks,
    values,
    fitFor: fitForRaw,
    notFitFor: notFitForRaw,
    legalInfo: {
      legalName,
      registrationCountry,
      crNumber,
      foundedAt,
      address,
      email,
      phone,
      note: legalNote || undefined,
    },
    cta: {
      title: ctaTitle,
      body: ctaBody,
      primaryLabel: ctaPrimaryLabel,
      primaryHref: ctaPrimaryHref || "/signup",
      secondaryLabel: ctaSecondaryLabel,
      secondaryHref: ctaSecondaryHref || "/#pricing",
    },
  };

  await upsertLandingSection(country, "about", about as Prisma.InputJsonValue);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/about");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateTeamSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/team?country=${country}`;

  if (!country || section !== "team") {
    return redirect(redirectTo);
  }

  try {
    assertCountry(country);
  } catch {
    return redirect(redirectTo);
  }

  const coreCountRaw = ((formData.get("coreCount") as string | null) ?? "0").trim();
  const coreCountParsed = parseInt(coreCountRaw || "0", 10);
  const coreCount = Number.isFinite(coreCountParsed) && coreCountParsed > 0 ? coreCountParsed : 0;

  const execCountRaw = ((formData.get("execCount") as string | null) ?? "0").trim();
  const execCountParsed = parseInt(execCountRaw || "0", 10);
  const execCount = Number.isFinite(execCountParsed) && execCountParsed > 0 ? execCountParsed : 0;

  const coreTeam = [];
  for (let i = 0; i < coreCount; i++) {
    const name = ((formData.get(`core_${i}_name`) as string | null) ?? "").trim();
    const role = ((formData.get(`core_${i}_role`) as string | null) ?? "").trim();
    const bio = ((formData.get(`core_${i}_bio`) as string | null) ?? "").trim();
    const avatarUrl = ((formData.get(`core_${i}_avatarUrl`) as string | null) ?? "").trim();
    const avatarColor =
      ((formData.get(`core_${i}_avatarColor`) as string | null) ?? "").trim() ||
      "from-primary/70 to-primary";

    if (!name && !role && !bio) continue;
    coreTeam.push({ name, role, bio, avatarColor, ...(avatarUrl ? { avatarUrl } : {}) });
  }

  const executionTeam = [];
  for (let i = 0; i < execCount; i++) {
    const name = ((formData.get(`exec_${i}_name`) as string | null) ?? "").trim();
    const role = ((formData.get(`exec_${i}_role`) as string | null) ?? "").trim();
    const bio = ((formData.get(`exec_${i}_bio`) as string | null) ?? "").trim();
    const avatarUrl = ((formData.get(`exec_${i}_avatarUrl`) as string | null) ?? "").trim();
    const avatarColor =
      ((formData.get(`exec_${i}_avatarColor`) as string | null) ?? "").trim() ||
      "from-primary/70 to-primary";

    if (!name && !role && !bio) continue;
    executionTeam.push({ name, role, bio, avatarColor, ...(avatarUrl ? { avatarUrl } : {}) });
  }

  const team = { coreTeam, executionTeam };

  await upsertLandingSection(country, "team", team as Prisma.InputJsonValue);

  revalidateTag(`landing-${country}`, "default");
  revalidatePath("/");
  revalidatePath("/team");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

