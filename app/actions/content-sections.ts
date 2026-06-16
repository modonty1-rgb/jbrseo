"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import { upsertLandingSection } from "@/lib/landing-sections";
import { isAdmin } from "@/app/actions/auth";

const CONTENT_KEYS = [
  "hero",
  "whyNow",
  "howItWorks",
  "socialProof",
  "faq",
  "finalCta",
  "header",
  "footer",
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

function revalidateLanding() {
  revalidateTag("landing", "default");
  revalidatePath("/");
  revalidatePath("/pricing");
}

/** Accepts `example.com` or `https://example.com`; rejects non-http(s) schemes. */
function normalizeHttpUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(t);
  const candidate = hasScheme ? t : `https://${t}`;
  try {
    const u = new URL(candidate);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

export async function updateSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const rawData = (formData.get("data") as string | null) ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/${section}`;

  if (!section || !rawData) {
    return redirect(redirectTo);
  }

  try {
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

  await upsertLandingSection(section, parsed);

  revalidateTag("landing", "default");
  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/privacy");
  revalidatePath("/terms");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateHeroSection(formData: FormData) {
  if (!(await isAdmin())) return;
  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/hero`;

  if (section !== "hero") {
    return redirect(redirectTo);
  }

  const proof = ((formData.get("proof") as string | null) ?? "").trim();
  const h1Line1 = ((formData.get("h1Line1") as string | null) ?? "").trim();
  const h1Line2 = ((formData.get("h1Line2") as string | null) ?? "").trim();
  const sub = ((formData.get("sub") as string | null) ?? "").trim();

  const trustLines = ((formData.get("trustLines") as string | null) ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const ctaLabel = ((formData.get("ctaLabel") as string | null) ?? "").trim() || "ابدأ مجاناً — بدون بطاقة";

  // Trust bar clients (merged inline with hero — single source of truth in LandingSection.hero)
  const rawClientsJson = (formData.get("trustClientsJson") as string | null) ?? "[]";
  let trustBarClients: { name: string; logoUrl: string; href?: string }[] = [];
  try {
    const parsed: unknown = JSON.parse(rawClientsJson);
    if (Array.isArray(parsed)) {
      trustBarClients = parsed
        .filter((c): c is Record<string, unknown> => typeof c === "object" && c !== null)
        .filter((c) => typeof c.name === "string" && !!(c.name as string).trim())
        .map((c) => {
          const logoUrl = typeof c.logoUrl === "string" ? normalizeHttpUrl(c.logoUrl) ?? "" : "";
          const href = typeof c.href === "string" ? normalizeHttpUrl(c.href) : null;
          return {
            name: (c.name as string).trim(),
            logoUrl,
            ...(href ? { href } : {}),
          };
        });
    }
  } catch {
    trustBarClients = [];
  }

  const hero = {
    proof,
    h1Line1,
    h1Line2,
    sub,
    trust: trustLines,
    trustBarClients,
  };

  await upsertLandingSection("hero", hero);
  await upsertLandingSection("ctaLabel", { ctaLabel });

  revalidateLanding();

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateWhyNowSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/whyNow`;

  if (section !== "whyNow") {
    return redirect(redirectTo);
  }

  const costsCount = parseInt(
    ((formData.get("costsCount") as string | null) ?? "0").trim(),
    10,
  );

  const title1 = ((formData.get("title1") as string | null) ?? "").trim();
  const subtitle = ((formData.get("subtitle") as string | null) ?? "").trim();

  const costs = [];
  const maxCosts = Number.isFinite(costsCount) ? costsCount : 0;
  for (let i = 0; i < maxCosts; i++) {
    const month = ((formData.get(`costs_${i}_month`) as string | null) ?? "").trim();
    const label = ((formData.get(`costs_${i}_label`) as string | null) ?? "").trim();
    const desc = ((formData.get(`costs_${i}_desc`) as string | null) ?? "").trim();
    const icon = ((formData.get(`costs_${i}_icon`) as string | null) ?? "").trim();
    if (!month && !label && !desc && !icon) continue;
    costs.push({ month, label, desc, icon });
  }

  const whyNow = { title1, subtitle, costs };

  await upsertLandingSection("whyNow", whyNow);

  revalidateLanding();

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateHowItWorksSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/howItWorks`;

  if (section !== "howItWorks") {
    return redirect(redirectTo);
  }

  const stepsCountRaw = ((formData.get("stepsCount") as string | null) ?? "0").trim();
  const stepsCountParsed = parseInt(stepsCountRaw || "0", 10);
  const stepsCount = Number.isFinite(stepsCountParsed) ? stepsCountParsed : 0;

  const steps = [];
  const maxSteps = stepsCount > 0 && Number.isFinite(stepsCount) ? stepsCount : 0;
  for (let i = 0; i < maxSteps; i++) {
    const stepTitle = ((formData.get(`steps_${i}_title`) as string | null) ?? "").trim();
    const line = ((formData.get(`steps_${i}_line`) as string | null) ?? "").trim();

    if (!stepTitle && !line) continue;
    steps.push({ num: `0${steps.length + 1}`, title: stepTitle, line });
  }

  const howItWorks = { steps };

  await upsertLandingSection("howItWorks", howItWorks);

  revalidateLanding();

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateSocialProofSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/socialProof`;

  if (section !== "socialProof") {
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

  const testimonials = [];
  const maxTestimonials =
    testimonialsCount > 0 && Number.isFinite(testimonialsCount)
      ? testimonialsCount
      : 0;

  for (let i = 0; i < maxTestimonials; i++) {
    const name = ((formData.get(`testimonials_${i}_name`) as string | null) ?? "").trim();
    const role = ((formData.get(`testimonials_${i}_role`) as string | null) ?? "").trim();
    const company = ((formData.get(`testimonials_${i}_company`) as string | null) ?? "").trim();
    const quote = ((formData.get(`testimonials_${i}_quote`) as string | null) ?? "").trim();
    const metric = ((formData.get(`testimonials_${i}_metric`) as string | null) ?? "").trim();
    const avatarImg = ((formData.get(`testimonials_${i}_avatarImg`) as string | null) ?? "").trim();
    const videoUrl = ((formData.get(`testimonials_${i}_videoUrl`) as string | null) ?? "").trim();
    const mediaImage = ((formData.get(`testimonials_${i}_mediaImage`) as string | null) ?? "").trim();

    if (!name && !role && !company && !quote && !metric && !avatarImg && !videoUrl && !mediaImage) {
      continue;
    }

    testimonials.push({
      name,
      role,
      company,
      quote,
      metric,
      avatarImg,
      videoUrl: videoUrl || undefined,
      mediaImage: mediaImage || undefined,
    });
  }

  const socialProof = { eyebrow, title, subtitle, testimonials };

  await upsertLandingSection("socialProof", socialProof);

  revalidateTag("landing", "default");
  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/admin/content/socialProof");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateFaqSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/faq`;

  if (section !== "faq") {
    return redirect(redirectTo);
  }

  const faqsCountRaw =
    ((formData.get("faqsCount") as string | null) ?? "0").trim();
  const faqsCountParsed = parseInt(faqsCountRaw || "0", 10);
  const faqsCount = Number.isFinite(faqsCountParsed) ? faqsCountParsed : 0;

  const title = ((formData.get("title") as string | null) ?? "").trim();
  const ctaLabel = ((formData.get("ctaLabel") as string | null) ?? "").trim();

  const faqs = [];
  const maxFaqs = faqsCount > 0 && Number.isFinite(faqsCount) ? faqsCount : 0;
  for (let i = 0; i < maxFaqs; i++) {
    const q = ((formData.get(`faqs_${i}_q`) as string | null) ?? "").trim();
    const a = ((formData.get(`faqs_${i}_a`) as string | null) ?? "").trim();
    const tag = ((formData.get(`faqs_${i}_tag`) as string | null) ?? "").trim();

    if (!q && !a && !tag) continue;
    faqs.push({ q, a, tag });
  }

  const faqSection = { title, faqs, ctaLabel };

  await upsertLandingSection("faq", faqSection);

  revalidateLanding();

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateFinalCtaSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/finalCta`;

  if (section !== "finalCta") {
    return redirect(redirectTo);
  }

  const title1 = ((formData.get("title1") as string | null) ?? "").trim();
  const title2 = ((formData.get("title2") as string | null) ?? "").trim();
  const subtitle = ((formData.get("subtitle") as string | null) ?? "").trim();
  const wa = ((formData.get("wa") as string | null) ?? "").trim();

  const finalCta = { title1, title2, subtitle, wa };

  await upsertLandingSection("finalCta", finalCta);

  revalidateLanding();

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateHeaderFooterSections(formData: FormData) {
  if (!(await isAdmin())) return;

  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/header-footer`;

  const bannerText =
    ((formData.get("bannerText") as string | null) ?? "").trim();
  const header = { bannerText };

  const tagline = ((formData.get("tagline") as string | null) ?? "").trim();
  const desc = ((formData.get("desc") as string | null) ?? "").trim();

  const footer = { tagline, desc };

  await upsertLandingSection("header", header);
  await upsertLandingSection("footer", footer);

  revalidateLanding();

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateAboutSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/about`;

  if (section !== "about") {
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

  await upsertLandingSection("about", about as Prisma.InputJsonValue);

  revalidateTag("landing", "default");
  revalidatePath("/");
  revalidatePath("/about");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

export async function updateTeamSection(formData: FormData) {
  if (!(await isAdmin())) return;

  const section = (formData.get("section") as string | null)?.trim() ?? "";
  const redirectTo =
    (formData.get("redirect") as string | null)?.trim() ??
    `/admin/content/team`;

  if (section !== "team") {
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

  await upsertLandingSection("team", team as Prisma.InputJsonValue);

  revalidateTag("landing", "default");
  revalidatePath("/");
  revalidatePath("/team");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}
