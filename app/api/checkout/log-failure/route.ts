import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const prisma = new PrismaClient();

// Client-reported checkout failures (esp. the ones that never reach the
// payment server — SDK session generation / tokenization rejects a foreign
// card, a hang caught by our timeout, a 3DS failure). The proxy already
// rate-limits this path (landing tier). We store best-effort and NEVER let a
// logging error affect the user — the response is fire-and-forget.
const Body = z.object({
  stage: z.string().trim().min(1).max(40),
  outcome: z.string().trim().max(20).optional(),
  code: z.string().trim().max(120).optional(),
  message: z.string().trim().max(400).optional(),
  state: z.string().trim().max(40).optional(),
  plan: z.string().trim().max(40).optional(),
  duration: z.string().trim().max(10).optional(),
  country: z.string().trim().max(2).optional(),
  cardScheme: z.string().trim().max(30).optional(),
  cardBin: z.string().trim().max(8).optional(),
  email: z.string().trim().max(254).optional(),
  subscriberId: z.string().trim().max(40).optional(),
  paymentRef: z.string().trim().max(80).optional(),
});

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "127.0.0.1"
  );
}

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    // Bad payload — accept silently so the client flow is never disrupted.
    return NextResponse.json({ ok: false }, { status: 202 });
  }

  try {
    await prisma.paymentAttempt.create({
      data: {
        stage: body.stage,
        outcome: body.outcome ?? "failed",
        code: body.code ?? null,
        message: body.message ?? null,
        state: body.state ?? null,
        plan: body.plan ?? null,
        duration: body.duration ?? null,
        country: body.country ?? null,
        cardScheme: body.cardScheme ?? null,
        cardBin: body.cardBin ?? null,
        email: body.email ?? null,
        ip: getIp(req),
        userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
        subscriberId: body.subscriberId ?? null,
        paymentRef: body.paymentRef ?? null,
      },
    });
  } catch {
    // Logging must never break checkout — swallow.
    return NextResponse.json({ ok: false }, { status: 202 });
  }

  return NextResponse.json({ ok: true });
}
