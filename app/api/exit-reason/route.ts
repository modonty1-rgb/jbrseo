import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

const VALID_REASONS = [
  "السعر مرتفع عليّ",
  "لسه أفكر",
  "أبي أتكلم مع أحد أولاً",
  "مش وقتي الحين",
] as const;

const VALID_COUNTRIES = ["SA", "EG"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reason = (body.reason ?? "").trim();
    const country = (body.country ?? "").toUpperCase().trim();

    if (!VALID_REASONS.includes(reason as typeof VALID_REASONS[number])) {
      return NextResponse.json({ error: "invalid reason" }, { status: 400 });
    }
    if (!VALID_COUNTRIES.includes(country as typeof VALID_COUNTRIES[number])) {
      return NextResponse.json({ error: "invalid country" }, { status: 400 });
    }

    // Save to DB (prisma.exitReason available after prisma generate)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).exitReason.create({ data: { reason, country } });

    // Telegram notification
    const flag = country === "EG" ? "🇪🇬" : "🇸🇦";
    void sendTelegramMessage(
      `📊 <b>سبب الخروج</b>\n\n` +
      `💬 <b>السبب:</b> ${reason}\n` +
      `${flag} <b>الدولة:</b> ${country}`
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
