"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import { getLandingSectionOverride, upsertLandingSection } from "@/lib/landing-sections";
import { isAdmin } from "@/app/actions/auth";
import { updatePlan, type PlanPatch } from "@/app/actions/pricing";
import { updateMeta, type MetaPatch } from "@/app/actions/pricing-meta";
import { prisma } from "@/lib/prisma";

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
// The reference page edits every content section: scalar fields via a dialog,
// arrays via a manage dialog (add/remove/reorder, incl. image-URL fields). This
// action updates one field (by its path) or replaces a whole array inside the
// section JSON, read-modify-writes the whole section (no field loss), revalidates.
const INLINE_KEYS = ["hero", "faq", "finalCta", "about", "privacy", "terms", "ctaLabel", "socialProof", "team"] as const;
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

// ── Plan content + pricing-section meta live in their own tables, but are edited
// from the same reference page. Content is shared across countries, so a write
// fans out to BOTH SA and EG rows. `section` routes the write:
//   "plan:<slug>"  → Plan table (name/articles/ctaText/badge/highlights…)
//   "pricingMeta"  → PriceSectionMeta (announcement/CTA/trustItems)
const PLAN_CONTENT_FIELDS = new Set([
  "name", "tagline", "articlesLabel", "ctaText", "badge", "featuredBadge", "highlights",
]);
const META_FIELDS = new Set(["announcement", "ctaHeadline", "ctaSubheadline", "trustItems"]);

async function writePlanContent(slug: string, path: (string | number)[], value: unknown): Promise<InlineSaveResult> {
  const field = String(path[0] ?? "");
  if (!PLAN_CONTENT_FIELDS.has(field)) return { ok: false, error: "حقل غير مسموح" };
  let fieldValue: unknown = value;
  if (path.length > 1) {
    // nested (e.g. highlights[i]) — read current field, set at sub-path
    const row = await prisma.plan.findUnique({ where: { country_slug: { country: "SA", slug } } });
    const current = (row as Record<string, unknown> | null)?.[field];
    fieldValue = setAtPath(current, path.slice(1), value);
  }
  const patch = { [field]: fieldValue } as unknown as PlanPatch;
  try {
    await updatePlan("SA", slug, patch);
    await updatePlan("EG", slug, patch);
  } catch {
    return { ok: false, error: "تعذّر الحفظ" };
  }
  return { ok: true };
}

async function writePricingMeta(path: (string | number)[], value: unknown): Promise<InlineSaveResult> {
  const field = String(path[0] ?? "");
  if (!META_FIELDS.has(field)) return { ok: false, error: "حقل غير مسموح" };
  let fieldValue: unknown = value;
  if (path.length > 1) {
    // nested (e.g. trustItems[i].label) — read current field, set at sub-path
    const row = await prisma.priceSectionMeta.findUnique({ where: { country: "SA" } });
    const current = (row as Record<string, unknown> | null)?.[field];
    fieldValue = setAtPath(current, path.slice(1), value);
  }
  const patch = { [field]: fieldValue } as unknown as MetaPatch;
  try {
    await updateMeta("SA", patch);
    await updateMeta("EG", patch);
  } catch {
    return { ok: false, error: "تعذّر الحفظ" };
  }
  return { ok: true };
}

// A field edit sends a string; an array edit sends the whole new array (JSON).
export async function updateSectionField(
  section: string,
  path: (string | number)[],
  value: unknown,
): Promise<InlineSaveResult> {
  if (!(await isAdmin())) return { ok: false, error: "غير مصرّح" };

  // route non-LandingSection targets (Plan content · pricing meta)
  if (section === "pricingMeta") return writePricingMeta(path, value);
  if (section.startsWith("plan:")) return writePlanContent(section.slice(5), path, value);

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
  for (const p of ["/", "/sa", "/eg", "/about", "/privacy", "/terms", "/team", "/admin/review"]) {
    revalidatePath(p);
  }

  return { ok: true };
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

