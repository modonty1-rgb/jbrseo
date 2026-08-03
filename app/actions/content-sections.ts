"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import { getLandingSectionOverride, upsertLandingSection } from "@/lib/landing-sections";
import { isAdmin } from "@/app/actions/auth";

const CONTENT_KEYS = [
  "hero",
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
  revalidatePath("/privacy");
  revalidatePath("/terms");

  redirect(redirectTo + (redirectTo.includes("?") ? "&" : "?") + "saved=1");
}

// ─── Content reference editor (/admin/review) ───────────────────────────────
// Each numbered field on the reference page has an "تعديل" button → dialog →
// this action updates that ONE field (located by its path) inside the section
// JSON, read-modify-writes the whole section (no field loss), and revalidates.
// Media sections (socialProof, team) keep their dedicated forms — excluded here.
const INLINE_KEYS = ["hero", "faq", "finalCta", "about", "privacy", "terms", "ctaLabel"] as const;
type InlineKey = (typeof INLINE_KEYS)[number];

export type InlineSaveResult = { ok: boolean; error?: string };

/** Immutably set `value` (any JSON) at `path` inside a nested JSON object. */
function setAtPath(
  current: unknown,
  path: (string | number)[],
  value: unknown,
): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (typeof head === "number") {
    const arr = Array.isArray(current) ? [...current] : [];
    arr[head] = setAtPath(arr[head], rest, value);
    return arr;
  }
  const obj = current && typeof current === "object" && !Array.isArray(current)
    ? { ...(current as Record<string, unknown>) }
    : {};
  obj[head] = setAtPath(obj[head], rest, value);
  return obj;
}

// A field edit sends a string; an array edit sends the whole new array (JSON).
export async function updateSectionField(
  section: string,
  path: (string | number)[],
  value: unknown,
): Promise<InlineSaveResult> {
  if (!(await isAdmin())) return { ok: false, error: "غير مصرّح" };
  if (!INLINE_KEYS.includes(section as InlineKey)) {
    return { ok: false, error: "قسم غير صالح" };
  }
  if (!Array.isArray(path) || path.length === 0) {
    return { ok: false, error: "مسار غير صالح" };
  }

  const current = await getLandingSectionOverride(section as InlineKey);
  const next = setAtPath(current ?? {}, path, value) as Prisma.InputJsonValue;

  await upsertLandingSection(section as InlineKey, next);

  revalidateTag("landing", "default");
  revalidateTag("landing-SA", "default");
  revalidateTag("landing-EG", "default");
  for (const p of ["/", "/sa", "/eg", "/about", "/privacy", "/terms", "/admin/review"]) {
    revalidatePath(p);
  }

  return { ok: true };
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
  revalidatePath("/admin/content/socialProof");

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
