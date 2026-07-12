import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { orderLimiter } from "@/lib/rate-limit";
import {
  completeHostedSessionPayment,
  buildMerchantOrderReference,
  toMinorUnits,
} from "@/lib/ngenius/orders";
import { displayMainTotalFromMoYr } from "@/lib/pricing-plan-amounts";
import type { CreateOrderPayload } from "@/lib/ngenius/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// N-Genius is hosted in KSA; keep close to reduce checkout latency.
export const preferredRegion = ["fra1", "bom1"];

const prisma = new PrismaClient();

// Zod schema mirrors what CheckoutForm actually sends. Server never trusts
// client input — plan name/price come from the DB, not the request body.
const Body = z.object({
  sessionId: z.string().min(10).max(200),
  turnstileToken: z.string().min(10),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(6).max(20),
  plan: z.enum(["starter", "growth", "scale"]),
  billing: z.enum(["monthly", "annual"]),
  country: z.enum(["SA"]),               // EG has no payment surface (Decision #4)
});

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "127.0.0.1"
  );
}

export async function POST(req: Request) {
  // 1. Parse + validate body
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid-body" }, { status: 400 });
  }

  const ip = getIp(req);

  // 2. Turnstile — reject bots before hitting anything else
  const turn = await verifyTurnstileToken(body.turnstileToken, ip);
  if (!turn.success) {
    return NextResponse.json(
      { error: "bot-check-failed", codes: turn.errorCodes },
      { status: 403 },
    );
  }

  // 3. Rate limit — strictest tier (3 orders/minute/IP)
  const rl = await orderLimiter.limit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { error: "rate-limited", retryAfter: Math.ceil((rl.reset - Date.now()) / 1000) },
      { status: 429 },
    );
  }

  // 4. Look up plan from DB (never trust client price)
  const plan = await prisma.plan.findFirst({
    where: { country: body.country, slug: body.plan, visible: true },
  });
  if (!plan) {
    return NextResponse.json({ error: "plan-not-found" }, { status: 400 });
  }
  const annual = body.billing === "annual";
  const totalMajor = displayMainTotalFromMoYr(plan.priceMonthly, plan.priceYearly, annual);
  const totalMinor = toMinorUnits(totalMajor);
  if (totalMinor <= 0) {
    return NextResponse.json({ error: "invalid-total" }, { status: 400 });
  }

  // 5. Upsert Subscriber (Idempotency layer 1 — Decision #2)
  // @@unique([email, plan, billing]) means retries for same combo update the
  // existing row rather than creating a duplicate.
  const subscriber = await prisma.subscriber.upsert({
    where: {
      email_plan_billing: { email: body.email, plan: body.plan, billing: body.billing },
    },
    update: {
      contactName: body.name,
      phone: body.phone,
      paymentStatus: "pending",
      failReason: null,
      // paidAt / paymentRef intentionally not touched — set by webhook on success
    },
    create: {
      contactName: body.name,
      email: body.email,
      phone: body.phone,
      planName: plan.name,
      plan: body.plan,
      billing: body.billing,
      country: body.country,
      isAnnual: annual,
      paymentStatus: "pending",
    },
  });

  // 6. Build N-Genius order payload
  const merchantOrderReference = buildMerchantOrderReference(subscriber.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jbrseo.com";
  const country = body.country.toLowerCase();

  const orderPayload: CreateOrderPayload = {
    action: "PURCHASE",
    amount: { currencyCode: "SAR", value: totalMinor },
    merchantOrderReference,
    merchantDefinedData: {
      subscriberId: subscriber.id,
      plan: body.plan,
      billing: body.billing,
    },
    emailAddress: body.email,
    merchantAttributes: {
      // Populated for post-3DS return + user-cancel flow; SDK also handles
      // in-page state via handlePaymentResponse, so these are fallbacks.
      redirectUrl: `${siteUrl}/${country}/checkout/processing?order=${subscriber.id}`,
      cancelUrl: `${siteUrl}/${country}/checkout?plan=${body.plan}&billing=${body.billing}&error=cancelled_by_user&order=${subscriber.id}`,
    },
  };

  // 7. Complete the payment via N-Genius Hosted Session
  //    Response includes 3DS challenge details when required — the browser SDK
  //    will parse this and mount the challenge iframe automatically.
  let paymentResponse;
  try {
    paymentResponse = await completeHostedSessionPayment(body.sessionId, orderPayload);
  } catch (err) {
    // Mark subscriber failed so retries can be tracked; user gets a clean error.
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        paymentStatus: "failed",
        failReason: err instanceof Error ? err.message.slice(0, 200) : "unknown",
      },
    }).catch(() => { /* ignore secondary error */ });

    return NextResponse.json(
      { error: "ngenius-failed", detail: err instanceof Error ? err.message : "unknown" },
      { status: 502 },
    );
  }

  // 8. Persist N-Genius orderReference on the Subscriber so /api/checkout/status
  //    can poll findOrder directly when the webhook is late or missing (the
  //    reason lives in status/route.ts).
  const orderReference =
    (paymentResponse as { orderReference?: string })?.orderReference;
  if (orderReference) {
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { paymentRef: orderReference },
    }).catch(() => { /* non-fatal — status polling will still find pending */ });
  }

  // 9. Return SDK-shaped response + our subscriberId for the frontend redirects
  return NextResponse.json({
    ...paymentResponse,
    subscriberId: subscriber.id,
  });
}
