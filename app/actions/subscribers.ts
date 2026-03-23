"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/app/actions/auth";
import { parseSignupFormData, signupSchema } from "@/app/actions/subscriber-signup-schema";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d[\d\s-]{7,14}$/;
const ALLOWED_COUNTRIES = ["SA", "EG"] as const;

function assertCountry(value: string): asserts value is "SA" | "EG" {
  if (!ALLOWED_COUNTRIES.includes(value as "SA" | "EG")) {
    throw new Error("Invalid country");
  }
}

export type CreateSubscriberResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

export async function createSubscriber(formData: FormData): Promise<CreateSubscriberResult> {
  const raw = parseSignupFormData(formData);
  const validated = signupSchema.safeParse(raw);
  if (!validated.success) {
    return {
      success: false,
      error: "يرجى تصحيح الحقول",
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const v = validated.data;
  const contactName = v.name;
  const email = v.email;
  const phone = v.phone;
  const businessName = v.businessName ?? null;
  const businessType = v.businessType ?? null;
  const planName = v.planName;
  const planIndex = v.plan;
  const country = v.country;
  const isAnnual = v.isAnnual;

  try {
    await prisma.subscriber.create({
      data: {
        contactName,
        email,
        phone,
        businessName,
        businessType,
        planName,
        planIndex: Number.isInteger(planIndex) ? planIndex : null,
        country,
        isAnnual,
      },
    });
    return { success: true };
  } catch (e) {
    const msg = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002"
      ? "هذا البريد مسجل مسبقاً"
      : "حدث خطأ، يرجى المحاولة لاحقاً";
    return { success: false, error: msg };
  }
}

export type SubscriberListItem = {
  id: string;
  contactName: string;
  email: string;
  phone: string;
  businessName: string | null;
  businessType: string | null;
  planName: string;
  planIndex: number | null;
  country: string;
  isAnnual: boolean;
  createdAt: Date;
};

export type SubscriberStats = {
  total: number;
  byCountry: { SA: number; EG: number };
  last7Days: number;
};

export async function getSubscriberStats(): Promise<SubscriberStats | null> {
  const ok = await isAdmin();
  if (!ok) return null;
  const [total, byCountryRows, last7Days] = await Promise.all([
    prisma.subscriber.count(),
    prisma.subscriber.groupBy({ by: ["country"], _count: { id: true }, where: { country: { in: ["SA", "EG"] } } }),
    prisma.subscriber.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);
  const byCountry = { SA: 0, EG: 0 };
  for (const row of byCountryRows) {
    if (row.country === "SA" || row.country === "EG") byCountry[row.country] = row._count.id;
  }
  return { total, byCountry, last7Days };
}

export async function getSubscribers(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<SubscriberListItem[]> {
  const ok = await isAdmin();
  if (!ok) return [];

  const { search, limit = 500, offset = 0 } = options ?? {};
  const searchTrim = search?.trim();
  const where = searchTrim
    ? {
        OR: [
          { email: { contains: searchTrim, mode: "insensitive" as const } },
          { phone: { contains: searchTrim, mode: "insensitive" as const } },
          { planName: { contains: searchTrim, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const rows = await prisma.subscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
  return rows.map((r) => ({
    id: r.id,
    contactName: r.contactName,
    email: r.email,
    phone: r.phone,
    businessName: r.businessName,
    businessType: r.businessType,
    planName: r.planName,
    planIndex: r.planIndex,
    country: r.country,
    isAnnual: r.isAnnual,
    createdAt: r.createdAt,
  }));
}

export type UpdateSubscriberResult = { success: true } | { success: false; error: string };

export async function updateSubscriber(
  id: string,
  data: {
    contactName?: string;
    email?: string;
    phone?: string;
    businessName?: string | null;
    businessType?: string | null;
    planName?: string;
    planIndex?: number | null;
    country?: string;
    isAnnual?: boolean;
  }
): Promise<UpdateSubscriberResult> {
  const ok = await isAdmin();
  if (!ok) return { success: false, error: "Unauthorized" };

  const contactName = data.contactName?.trim();
  if (contactName !== undefined && !contactName) {
    return { success: false, error: "يرجى إدخال اسمك" };
  }
  const email = data.email?.trim();
  if (email !== undefined && (!email || !EMAIL_REGEX.test(email))) {
    return { success: false, error: "يرجى إدخال بريد إلكتروني صالح" };
  }
  const phone = data.phone?.trim();
  if (phone !== undefined && (!phone || !PHONE_REGEX.test(phone))) {
    return { success: false, error: "يرجى إدخال رقم جوال صالح" };
  }
  if (data.country !== undefined) assertCountry(data.country);

  try {
    await prisma.subscriber.update({
      where: { id },
      data: {
        ...(contactName !== undefined && { contactName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(data.businessName !== undefined && { businessName: data.businessName || null }),
        ...(data.businessType !== undefined && { businessType: data.businessType || null }),
        ...(data.planName !== undefined && { planName: data.planName }),
        ...(data.planIndex !== undefined && { planIndex: data.planIndex }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.isAnnual !== undefined && { isAnnual: data.isAnnual }),
      },
    });
    return { success: true };
  } catch (e) {
    const msg = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002"
      ? "هذا البريد مسجل مسبقاً"
      : "حدث خطأ، يرجى المحاولة لاحقاً";
    return { success: false, error: msg };
  }
}

export type DeleteSubscriberResult = { success: true } | { success: false; error: string };

export async function deleteSubscriber(id: string): Promise<DeleteSubscriberResult> {
  const ok = await isAdmin();
  if (!ok) return { success: false, error: "Unauthorized" };

  try {
    await prisma.subscriber.delete({ where: { id } });
    return { success: true };
  } catch {
    return { success: false, error: "حدث خطأ عند الحذف" };
  }
}
