"use server";

import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

const VALID_REASONS = new Set([
  "السعر مرتفع عليّ",
  "لسه أفكر",
  "أبي أتكلم مع أحد أولاً",
  "مش وقتي الحين",
]);

const VALID_COUNTRIES = new Set(["SA", "EG"]);

export async function saveExitReason(reason: string, country: string): Promise<void> {
  const r = reason.trim();
  const c = country.toUpperCase().trim();
  if (!VALID_REASONS.has(r) || !VALID_COUNTRIES.has(c)) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).exitReason.create({ data: { reason: r, country: c } });
  } catch {
    // Prisma model not generated yet — run `prisma generate` once
  }

  const flag = c === "EG" ? "🇪🇬" : "🇸🇦";
  await sendTelegramMessage(
    `📊 <b>سبب الخروج</b>\n\n` +
    `💬 <b>السبب:</b> ${r}\n` +
    `${flag} <b>الدولة:</b> ${c}`
  );
}

export interface ExitReasonStats {
  total: number;
  byReason: { reason: string; count: number; pct: number }[];
  byCountry: { SA: number; EG: number };
}

export async function getExitReasonStats(): Promise<ExitReasonStats | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (prisma as any).exitReason.groupBy({
      by: ["reason"],
      _count: { reason: true },
      orderBy: { _count: { reason: "desc" } },
    }) as { reason: string; _count: { reason: number } }[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countryRows = await (prisma as any).exitReason.groupBy({
      by: ["country"],
      _count: { country: true },
    }) as { country: string; _count: { country: number } }[];

    const total = rows.reduce((s, r) => s + r._count.reason, 0);
    const byReason = rows.map((r) => ({
      reason: r.reason,
      count: r._count.reason,
      pct: total > 0 ? Math.round((r._count.reason / total) * 100) : 0,
    }));

    const byCountry = { SA: 0, EG: 0 };
    for (const row of countryRows) {
      if (row.country === "SA") byCountry.SA = row._count.country;
      if (row.country === "EG") byCountry.EG = row._count.country;
    }

    return { total, byReason, byCountry };
  } catch {
    return null;
  }
}
